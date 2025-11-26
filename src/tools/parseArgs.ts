/* =========================================================================
	 BAGIAN 1: TYPE DEFINITIONS (MAGIC TYPES)
	 Mengubah String Schema menjadi TypeScript Interface secara otomatis
	 =========================================================================
*/

// Helper: Mengubah string type ke primitive type
type MapType<T extends string> = T extends "number"
	? number
	: T extends "boolean"
		? boolean
		: string // Default (url, youtube, enum, text) dianggap string

// Recursive Type Parser
export type InferArgs<S extends string> =
	// --- MODE 1: SPLIT MODE (Ada karakter '|') ---
	// Case: <nama?:type> | ... (Optional + Type)
	S extends `<${infer Name}?:${infer Type}> | ${infer Rest}`
		? { [K in Name]?: MapType<Type> | null } & InferArgs<Rest>
		: // Case: <nama?> | ... (Optional String)
			S extends `<${infer Name}?> | ${infer Rest}`
			? { [K in Name]?: string | null } & InferArgs<Rest>
			: // Case: <nama:type> | ... (Required + Type)
				S extends `<${infer Name}:${infer Type}> | ${infer Rest}`
				? { [K in Name]: MapType<Type> } & InferArgs<Rest>
				: // Case: <nama> | ... (Required String)
					S extends `<${infer Name}> | ${infer Rest}`
					? { [K in Name]: string } & InferArgs<Rest>
					: // --- MODE 2: SPACE MODE (Normal CLI) ---
						// Case: Lanjut ke argumen berikutnya
						S extends `<${infer Name}?:${infer Type}> ${infer Rest}`
						? { [K in Name]?: MapType<Type> | null } & InferArgs<Rest>
						: S extends `<${infer Name}:${infer Type}> ${infer Rest}`
							? { [K in Name]: MapType<Type> } & InferArgs<Rest>
							: S extends `<${infer Name}?> ${infer Rest}`
								? { [K in Name]?: string | null } & InferArgs<Rest>
								: S extends `<${infer Name}> ${infer Rest}`
									? { [K in Name]: string } & InferArgs<Rest>
									: // Case: Argumen Terakhir (End of String)
										S extends `<${infer Name}?:${infer Type}>`
										? { [K in Name]?: MapType<Type> | null }
										: S extends `<${infer Name}:${infer Type}>`
											? { [K in Name]: MapType<Type> }
											: S extends `<${infer Name}?>`
												? { [K in Name]?: string | null }
												: S extends `<${infer Name}>`
													? { [K in Name]: string }
													: {} // Base case

/* =========================================================================
	 BAGIAN 2: VALIDATORS
	 Kamus pengecekan tipe data
	 =========================================================================
*/

type ValidatorFn = (text: string) => boolean

export const defaultValidators: Record<string, ValidatorFn> = {
	// Dasar
	string: () => true,
	number: (text) => !Number.isNaN(Number(text)),
	boolean: (text) =>
		["true", "false", "1", "0", "on", "off"].includes(text.toLowerCase()),

	// Media & Web
	url: (text) => {
		try {
			new URL(text)
			return true
		} catch {
			return false
		}
	},
	youtube: (text) =>
		/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(text),
	tiktok: (text) =>
		/^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/.+$/.test(text),
	instagram: (text) => /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/.test(text),

	// WhatsApp Specific
	jid: (text) =>
		/^\d{5,15}@s\.whatsapp\.net$/.test(text) ||
		/^\d{5,15}-\d{10}@g\.us$/.test(text),
	phone: (text) => /^\d{10,15}$/.test(text.replace(/[^0-9]/g, "")),
}

/* =========================================================================
	 BAGIAN 3: CORE LOGIC (PARSER)
	 Mendukung Split Mode, Optional Skipping, Strict Count, & Lookahead
	 =========================================================================
*/

function validateSingle(value: string, rule: any, validators: any): boolean {
	if (!value) return false
	const val = value.trim()
	// Cek Enum (misal: 360|720)
	if (rule.type.includes("|")) {
		const choices = rule.type.split("|").map((s: string) => s.trim())
		return choices.includes(val)
	}
	// Cek Validator terdaftar
	if (validators[rule.type]) {
		return validators[rule.type](val)
	}
	return true // Default string
}

export function parseArgs<Schema extends string>(
	rawArgs: string[],
	schemaString: Schema,
	customValidators: Record<string, ValidatorFn> = {},
): InferArgs<Schema> {
	const validators = { ...defaultValidators, ...customValidators }
	const result: Record<string, any> = {}

	// Parse Schema String menjadi Object Rule
	const rules = (schemaString.match(/<[^>]+>/g) || []).map((str) => {
		const content = str.slice(1, -1) // Hapus < >
		const [ident, typeDef] = content.split(":").map((s) => s.trim())
		const isOptional = ident.endsWith("?")
		const name = isOptional ? ident.slice(0, -1) : ident
		return { name, isOptional, type: typeDef || "string", raw: str }
	})

	// --- LOGIC A: DELIMITER MODE (Split by |) ---
	// Deteksi jika ada pipa di luar kurung siku. Contoh: <top> | <bottom>
	const separatorMatch = schemaString.match(/>\s*(\|)\s*</)

	if (separatorMatch) {
		const separator = separatorMatch[1]
		const fullText = rawArgs.join(" ") // Gabung dulu karena bot memecah by space
		const parts = fullText.split(separator)

		rules.forEach((rule, index) => {
			const rawValue = parts[index]
			// Jika string kosong/spasi doang, anggap null
			const value =
				rawValue && rawValue.trim().length > 0 ? rawValue.trim() : null

			if (!value) {
				if (rule.isOptional) {
					result[rule.name] = null
				} else {
					throw new Error(
						`Argumen kurang: Bagian [${rule.name}] wajib diisi (Pemisah '${separator}' tidak ditemukan atau kosong).`,
					)
				}
			} else {
				if (!validateSingle(value, rule, validators)) {
					throw new Error(
						`Argumen salah: '${value}' tidak valid untuk [${rule.name}]. Harusnya: ${rule.type}`,
					)
				}
				result[rule.name] = value
			}
		})
		return result as any
	}

	// --- LOGIC B: SPACE MODE (Normal CLI) ---
	let argIndex = 0
	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i]
		const currentArg = rawArgs[argIndex]

		const isValid = validateSingle(currentArg, rule, validators)

		if (isValid) {
			result[rule.name] = currentArg
			argIndex++
		} else {
			// Jika tidak valid, cek apakah boleh skip (Optional)
			if (rule.isOptional) {
				const inputsLeft = rawArgs.length - argIndex
				const slotsLeft = rules.length - i

				// 1. STRICT COUNT CHECK
				// Jika jumlah input == jumlah slot tersisa, JANGAN skip.
				// Asumsikan user typo di argumen ini.
				if (inputsLeft >= slotsLeft) {
					throw new Error(
						`Argumen salah: '${currentArg}' tidak valid untuk [${rule.name}]. Harusnya: ${rule.type}`,
					)
				}

				// 2. LOOKAHEAD CHECK
				// Cek apakah input ini cocok untuk rule BERIKUTNYA?
				const nextRule = rules[i + 1]
				const isMatchNext =
					nextRule && validateSingle(currentArg, nextRule, validators)

				if (isMatchNext) {
					// Cocok untuk tetangga -> Berarti rule ini di-skip user
					result[rule.name] = null
					continue // Lanjut loop ke rule berikutnya, argIndex diam
				}
			}

			// Handling Error / Null Assignment
			if (!currentArg && rule.isOptional) {
				result[rule.name] = null
			} else {
				const msg = !currentArg
					? `Argumen kurang: ${rule.name} (${rule.type}) diperlukan.`
					: `Argumen salah: '${currentArg}' tidak valid untuk [${rule.name}]. Harusnya: ${rule.type}`
				throw new Error(msg)
			}
		}
	}

	return result as any
}

/* =========================================================================
	 BAGIAN 4: TEST SUITE
	 Jalankan file ini untuk verifikasi logika
	 =========================================================================
*/

type TestCase = {
	name: string
	args: string[]
	schema: string
	expected: Record<string, any> | "ERROR"
}

const scenarios: TestCase[] = [
	// --- TEST GROUP: SMART ARGUMENTS (Space) ---
	{
		name: "1. Normal (Full)",
		schema: "<res?: 360|720> <url: youtube>",
		args: ["360", "https://youtu.be/abc"],
		expected: { res: "360", url: "https://youtu.be/abc" },
	},
	{
		name: "2. Skip Optional (Smart Shift)",
		schema: "<res?: 360|720> <url: youtube>",
		args: ["https://youtu.be/abc"],
		expected: { res: null, url: "https://youtu.be/abc" },
	},
	{
		name: "3. Strict Mode (Typo '999' tidak boleh di-skip)",
		schema: "<res?: 360|720> <url: youtube>",
		args: ["999", "https://youtu.be/abc"],
		expected: "ERROR", // Karena jumlah argumen pas (2 lawan 2), jadi dilarang skip
	},

	// --- TEST GROUP: SPLIT MODE (Pipa) ---
	{
		name: "4. Split Mode (Lengkap)",
		schema: "<top> | <bottom>",
		args: ["halo", "gan", "|", "kabar", "baik"], // Simulasi input bot
		expected: { top: "halo gan", bottom: "kabar baik" },
	},
	{
		name: "5. Split Mode (Optional Kiri Kosong)",
		schema: "<top?> | <bottom>",
		args: ["|", "kabar", "baik"],
		expected: { top: null, bottom: "kabar baik" },
	},
	{
		name: "6. Split Mode (Optional Kanan Kosong)",
		schema: "<top> | <bottom?>",
		args: ["halo", "gan", "|"],
		expected: { top: "halo gan", bottom: null },
	},
	{
		name: "7. Split Mode (Tanpa Pipa = Isi Kiri Saja)",
		schema: "<top> | <bottom?>",
		args: ["halo", "gan"],
		expected: { top: "halo gan", bottom: null },
	},
]

function runTests() {
	console.log("🚀 RUNNING PARSER TESTS...\n")
	let passed = 0

	scenarios.forEach((test, idx) => {
		try {
			const result = parseArgs(test.args, test.schema)

			if (test.expected === "ERROR") {
				console.log(
					`❌ [${idx + 1}] ${test.name} -> FAILED (Expected Error, got Success)`,
				)
				console.log("   Result:", result)
			} else {
				const match = JSON.stringify(result) === JSON.stringify(test.expected)
				if (match) {
					console.log(`✅ [${idx + 1}] ${test.name}`)
					passed++
				} else {
					console.log(`❌ [${idx + 1}] ${test.name} -> FAILED (Value Mismatch)`)
					console.log("   Exp:", test.expected)
					console.log("   Got:", result)
				}
			}
		} catch (e: any) {
			if (test.expected === "ERROR") {
				console.log(`✅ [${idx + 1}] ${test.name} (Error Caught: ${e.message})`)
				passed++
			} else {
				console.log(`❌ [${idx + 1}] ${test.name} -> FAILED (Unexpected Error)`)
				console.log("   Error:", e.message)
			}
		}
	})
	console.log(`\n✨ RESULT: ${passed}/${scenarios.length} Passed.`)
}

// Jalanin Test
runTests()
