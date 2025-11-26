import { z } from "zod";
import _ from "lodash";
import crypto from "crypto";
import { performance } from "perf_hooks";
import { ApiCandidate, buildZodSchema, SchemaConfig } from "../types";
import { generateAiText } from "./ai";

/**
 * Scrapper - cache-first race scraper with AI judging fallback.
 *
 * Behavior:
 * 1. Compute schema hash.
 * 2. If a champion exists in cache:
 *    - Try to call only the champion API (with a timeout).
 *    - Extract using cached mapping and validate with Zod.
 *    - If success -> return result.
 *    - If failure -> invalidate cache and continue to full race.
 * 3. If no valid champion -> run parallel race over all candidates.
 *    - Collect valid responses.
 *    - Send summarized prompt to AI judge (validated by Zod).
 *    - Save champion to cache.
 *    - Extract + validate result and return.
 *
 * Notes:
 * - Cache entries include createdAt and optional ttl for future eviction.
 * - AI output is validated with Zod before being accepted.
 * - On any unexpected error in champion fast-path, fallback to full race.
 */

// --- Cache Definitions ---
type ChampionData = {
	winnerName: string;
	mapping: Record<string, string | null>;
	reason?: string | null;
	createdAt: number;
	ttl?: number; // milliseconds
};

// Key: Hash(SchemaConfig) -> Value: ChampionData
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour
const CHAMPION_CACHE = new Map<string, ChampionData>();

// --- AI Judge schema (to validate AI output) ---
const AiJudgeSchema = z.object({
	winnerName: z.string(),
	reason: z.string().optional().nullable(),
	mapping: z.record(z.string(), z.string().nullable()),
});

// --- Helper: Promise timeout ---
function withTimeout<T>(p: Promise<T>, ms: number, errMsg?: string): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const t = setTimeout(() => reject(new Error(errMsg || `Timed out after ${ms}ms`)), ms);
		p.then((v) => {
			clearTimeout(t);
			resolve(v);
		}, (e) => {
			clearTimeout(t);
			reject(e);
		});
	});
}

// --- Main Function ---
export async function scrapper<T>(
	candidates: ApiCandidate[],
	schemaConfig: SchemaConfig,
	opts?: {
		championTimeoutMs?: number; // timeout when calling cached champion
		raceTimeoutMs?: number; // optional global race deadline (not enforced on individual requests)
		cacheTtlMs?: number; // override default ttl for cached champions
	}
): Promise<T> {
	const championTimeoutMs = opts?.championTimeoutMs ?? 2000; // 2s for champion quick-check
	const cacheTtlMs = opts?.cacheTtlMs ?? DEFAULT_TTL;

	// 1. Generate Schema Hash (Untuk Key Cache)
	const schemaHash = crypto.createHash("md5")
		.update(JSON.stringify(schemaConfig))
		.digest("hex");

	// Helper: find candidate by name
	const findCandidate = (name: string) => candidates.find(c => c.name === name);

	// Helper: validate and parse extracted data using Zod
	const validateExtracted = (extractedData: any) => {
		const Validator = buildZodSchema(schemaConfig);
		return Validator.parse(extractedData) as T;
	};

	// 2. Cache-first fast path
	const cached = CHAMPION_CACHE.get(schemaHash);
	if (cached) {
		// Check TTL
		const age = Date.now() - cached.createdAt;
		if (cached.ttl && age > cached.ttl) {
			// expired
			CHAMPION_CACHE.delete(schemaHash);
		} else {
			console.log(`🔁 Cache hit: champion=${cached.winnerName}, age=${Math.round(age)}ms`);
			// try call champion only
			try {
				const championCandidate = findCandidate(cached.winnerName);
				if (!championCandidate) throw new Error("Champion candidate not found among current candidates");

				// call champion with timeout
				// note: api[championName].get returns a Promise; wrap with withTimeout
				// @ts-ignore
				const client = api[cached.winnerName];
				if (!client || typeof client.get !== "function") throw new Error("Champion client unavailable");

				const winnerData = await withTimeout(
					client.get(championCandidate.endpoint, championCandidate.params),
					championTimeoutMs,
					`Champion ${cached.winnerName} timed out`
				);

				if (!winnerData || typeof winnerData !== 'object' || Object.keys(winnerData).length === 0) {
					throw new Error("Champion returned invalid data");
				}

				// Extract from winnerData using cached mapping
				const extractedData: any = {};
				for (const key in schemaConfig) {
					const path = cached.mapping[key];
					extractedData[key] = path ? _.get(winnerData, path, null) : null;
				}

				// Validate extracted data
				const parsed = validateExtracted(extractedData);
				console.log(`⚡ Cache-fast path succeeded using champion=${cached.winnerName}`);
				return parsed;

			} catch (err) {
				console.warn("⚠️ Cache-fast path failed:", (err as Error).message || err);
				// invalidate and fallthrough to full race
				CHAMPION_CACHE.delete(schemaHash);
			}
		}
	}

	// 3. Full race path (parallel requests)
	console.log(`🏎️  Memulai Race dengan ${candidates.length} API...`);

	const raceStart = performance.now();

	const racePromises = candidates.map(async (c) => {
		const start = performance.now();
		try {
			// @ts-ignore
			const client = api[c.name];
			if (!client || typeof client.get !== "function") throw new Error(`Client ${c.name} not found`);

			const data = await client.get(c.endpoint, c.params);
			const duration = performance.now() - start;

			// Basic validation: Data harus object dan tidak kosong
			if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
				return null;
			}
			return { name: c.name, data, duration };
		} catch (e) {
			return null;
		}
	});

	const results = await Promise.all(racePromises);
	const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);

	if (validResults.length === 0) {
		throw new Error("💀 Semua API gagal/mati/timeout!");
	}

	// 4. Ask AI to choose champion
	console.log("⚖️  Meminta AI menjadi Juri untuk memilih API terbaik...");

	const candidatesForAi = validResults.map(r => ({
		name: r.name,
		duration: Math.round(r.duration) + "ms",
		// Potong sample data biar token hemat
		sampleData: JSON.stringify(r.data).slice(0, 1500)
	}));

	const schemaDesc = Object.entries(schemaConfig)
		.map(([k, v]) => `- "${k}" (${v.type}): ${v.description}`)
		.join("\n");

	const prompt = `
TASK: Analyze API responses. Pick the BEST one matching the Target Schema.

CRITERIA:
1. Completeness (Matches Target Schema fields).
2. Content Quality (Valid URLs, no empty fields).
3. Speed (Secondary).

TARGET SCHEMA:
${schemaDesc}

CANDIDATES:
${JSON.stringify(candidatesForAi, null, 2)}

OUTPUT (JSON ONLY):
{
  "winnerName": "name_of_api",
  "reason": "short reason",
  "mapping": { 
    "schema_key": "dot.notation.path",
    "another_key": "data.items[0].value"
  }
}
Use "null" for missing fields.
`;

	let champion: ChampionData | undefined;
	try {
		const aiRaw = await generateAiText(prompt);
		const jsonStr = aiRaw.replace(/```json|```/g, "").trim();

		const parsed = AiJudgeSchema.parse(JSON.parse(jsonStr));

		champion = {
			winnerName: parsed.winnerName,
			mapping: Object.fromEntries(
				Object.entries(parsed.mapping).map(([k, v]) => [k, v === null ? null : String(v)])
			),
			reason: parsed.reason ?? null,
			createdAt: Date.now(),
			ttl: cacheTtlMs
		};

		// Ensure the chosen winner is actually present in validResults
		const winnerAvailable = validResults.some(r => r.name === champion!.winnerName);
		if (!winnerAvailable) {
			// If AI picks someone not in validResults, fallback to best heuristic (first valid)
			console.warn("AI chose a winner not present in race results. Falling back to first valid result.");
			champion = {
				winnerName: validResults[0].name,
				mapping: {},
				reason: "ai_invalid_choice_fallback",
				createdAt: Date.now(),
				ttl: cacheTtlMs
			};
		}

		// Save to cache
		CHAMPION_CACHE.set(schemaHash, champion);
		console.log(`🏆 Juara Baru: ${champion.winnerName} (${champion.reason ?? "no reason"})`);
	} catch (e) {
		console.error("AI Error / parse failed:", (e as Error).message || e);
		// Fallback: pick fastest valid result or first valid result
		const fallback = validResults.sort((a, b) => a.duration - b.duration)[0];
		champion = {
			winnerName: fallback.name,
			mapping: {},
			reason: "fallback_fastest",
			createdAt: Date.now(),
			ttl: cacheTtlMs
		};
		CHAMPION_CACHE.set(schemaHash, champion);
		console.log(`🏆 Juara Fallback: ${champion.winnerName} (${champion.reason})`);
	}

	// 5. Extract Data using champion mapping from the winner's data
	const winnerResult = validResults.find(r => r.name === champion!.winnerName);
	if (!winnerResult) {
		// This should not happen because we guarded earlier, but just in case:
		throw new Error("Logic Error: Pemenang hilang dari hasil race");
	}

	const extractedData: any = {};
	for (const key in schemaConfig) {
		const path = champion!.mapping[key];
		extractedData[key] = path ? _.get(winnerResult.data, path, null) : null;
	}

	// 6. Zod validation (may throw)
	try {
		const parsed = validateExtracted(extractedData);
		const totalTime = Math.round(performance.now() - raceStart);
		console.log(`✅ Final result validated. Total race time: ${totalTime}ms`);
		return parsed;
	} catch (e) {
		// If validation fails, remove champion (mapping invalid) and surface error
		console.error("Zod validation failed on extracted data:", (e as Error).message || e);
		CHAMPION_CACHE.delete(schemaHash);
		throw e;
	}
}
