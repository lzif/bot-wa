import _ from "lodash";
import crypto from "crypto";
import { performance } from "perf_hooks";
import { ApiCandidate, buildZodSchema, SchemaConfig } from "../types";
import { PersistentCache } from "./cache";

// --- TYPES ---

type ChampionData = {
  winnerName: string;
  mapping: Record<string, string>;
  lastUpdated: number;
};

type RaceResult = {
  name: string;
  data: any;
  duration: number;
};

const CHAMPION_CACHE = new PersistentCache<ChampionData>("api-champion-cache.json");

// --- HELPER FUNCTIONS ---

async function fetchCandidate(c: ApiCandidate): Promise<RaceResult> {
  const start = performance.now();
  // @ts-ignore: Access dynamic api client
  const client = tools.api[c.name];
  
  if (!client) throw new Error(`Client '${c.name}' not found in tools.api`);

  // Timeout wrapper (15s)
  const response = await Promise.race([
      client.get(c.endpoint, c.params),
      new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 15000))
  ]);

  const duration = performance.now() - start;
  
  // Basic sanity check
  if (!response || _.isEmpty(response)) throw new Error("Empty response");

  return { name: c.name, data: response, duration };
}

function extractAndValidate<T>(
  data: any, 
  mapping: Record<string, string>, 
  schema: SchemaConfig
): T {
  const result: any = {};
  for (const key in schema) {
    const path = mapping[key];
    result[key] = path ? _.get(data, path, null) : null;
  }
  const Validator = buildZodSchema(schema);
  return Validator.parse(result) as T;
}

// --- MAIN FUNCTION: UNIFY ---

export async function unify<T>(
  candidates: ApiCandidate[],
  schemaConfig: SchemaConfig
): Promise<T> {
  const schemaHash = crypto.createHash("md5").update(JSON.stringify(schemaConfig)).digest("hex");
  const champion = CHAMPION_CACHE.get(schemaHash);

  // --- PHASE 1: OPTIMISTIC CACHE ---
  if (champion) {
    const candidate = candidates.find(c => c.name === champion.winnerName);
    if (candidate) {
      try {
        console.log(`⚡ [Unify] Fast-track via champion: ${champion.winnerName}`);
        const result = await fetchCandidate(candidate);
        return extractAndValidate<T>(result.data, champion.mapping, schemaConfig);
      } catch (e) {
        console.warn(`⚠️ [Unify] Champion ${champion.winnerName} failed/changed. Fallback to Race.`);
        // Jangan return error, biarkan lanjut ke Phase 2 (Race)
      }
    }
  }

  // --- PHASE 2: RACE ALL CANDIDATES ---
  console.log(`🏎️  [Unify] Racing ${candidates.length} APIs...`);
  
  const results = await Promise.allSettled(candidates.map(fetchCandidate));
  const validResults = results
    .filter((r): r is PromiseFulfilledResult<RaceResult> => r.status === "fulfilled")
    .map(r => r.value);

  if (validResults.length === 0) throw new Error("💀 [Unify] All APIs failed!");

  // --- PHASE 3: AI JUDGE (Pick Best Content) ---
  console.log("⚖️  [Unify] AI Judging best response...");
  
  const promptData = validResults.map(r => ({
    name: r.name,
    duration: Math.round(r.duration) + "ms",
    sample: JSON.stringify(r.data).slice(0, 1000) // Truncate to save tokens
  }));

  const schemaDesc = Object.entries(schemaConfig)
    .map(([k, v]) => `- ${k} (${v.type}): ${v.description}`)
    .join("\n");

  const prompt = `
    Analyze these API responses against the Target Schema.
    TARGET SCHEMA:
    ${schemaDesc}

    CANDIDATES:
    ${JSON.stringify(promptData, null, 2)}

    TASK:
    1. Select the API with the most COMPLETE and VALID data (ignore speed).
    2. Map the JSON paths to the Schema Keys.

    OUTPUT JSON ONLY:
    {
      "winnerName": "api_name",
      "mapping": { "schema_key": "path.to.value" }
    }
  `;

  let newChampion: ChampionData;

  try {
    const aiResponse = await tools.ai.text(prompt);
    const parsed = JSON.parse(aiResponse.replace(/```json|```/g, "").trim());
    
    newChampion = {
      winnerName: parsed.winnerName,
      mapping: parsed.mapping,
      lastUpdated: Date.now()
    };
    
    CHAMPION_CACHE.set(schemaHash, newChampion);
    console.log(`🏆 [Unify] New Champion: ${newChampion.winnerName}`);
  } catch (e) {
    console.error("❌ [Unify] AI Judge Failed, using first valid candidate.");
    // Fallback darurat jika AI error (misal token habis)
    newChampion = { winnerName: validResults[0].name, mapping: {}, lastUpdated: Date.now() };
  }

  // --- PHASE 4: RETURN DATA ---
  const winner = validResults.find(r => r.name === newChampion.winnerName) || validResults[0];
  
  // Jika mapping kosong (fallback), ini mungkin throw error di Zod (yang diharapkan agar dev tau ada masalah)
  return extractAndValidate<T>(winner.data, newChampion.mapping, schemaConfig);
}
