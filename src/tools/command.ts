import { createHash } from "node:crypto"

export function generateUID(id: string, botName?: string, withBotName = true) {
	if (!id) return null

	const hash = createHash("sha1").update(id).digest("hex").slice(0, 12)
	const uid =
		withBotName && botName
			? `${hash}_${botName.toLowerCase().replace(/[aiueo0-9\W_]/g, "")}-wabot`
			: hash

	return uid
}

/**
 * Pilih elemen random
 */
export function getRandomElement<T>(array: T[]): T | null {
	if (!array || array.length === 0) return null
	const idx = Math.floor(Math.random() * array.length)
	return array[idx]
}

/**
 * Cek apakah content adalah command valid
 */
export function isCmd(
	content: string | null | undefined,
	ctxBot: {
		prefix: string
		cmd: Map<string, any>
	},
):
	| {
			msg: string
			prefix: string
			name?: string
			didyoumean?: string
			input: string
	  }
	| false {
	if (!content) return false

	const prefix = content.charAt(0)
	if (!new RegExp(ctxBot.prefix, "i").test(content)) return false

	const [cmdName, ...rest] = content.slice(1).trim().toLowerCase().split(/\s+/)
	const input = rest.join(" ")

	const cmds = Array.from(ctxBot.cmd.values())
	const found = cmds.find(
		(c) => c.name === cmdName || c?.aliases?.includes(cmdName),
	)

	if (found) {
		return {
			msg: content,
			prefix,
			name: cmdName,
			input,
		}
	}

	// Did you mean? (simple)
	const allNames = cmds.flatMap((c) => [c.name, ...(c.aliases || [])])
	const suggestion = findClosest(cmdName, allNames)

	return suggestion
		? {
				msg: content,
				prefix,
				didyoumean: suggestion,
				input,
			}
		: false
}

/**
 * Basic URL detector
 */
export function isUrl(url: string | null | undefined): boolean {
	if (!url) return false
	return /(https?:\/\/[^\s]+)/i.test(url)
}

/**
 * Parser flag CLI-style.
 */
export function parseFlag(
	argsString: string | null | undefined,
	customRules: Record<
		string,
		{
			type: "value" | "boolean"
			key: string
			validator?: (val: string) => boolean
			parser?: (val: string) => any
			default?: any
		}
	> = {},
): Record<string, any> {
	if (!argsString) return { input: null }

	const options: Record<string, any> = {}
	const input: string[] = []
	const args = argsString.trim().split(/\s+/)

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]

		if (customRules[arg]) {
			const rule = customRules[arg]

			if (rule.type === "value") {
				const value = args[i + 1]
				if (value && rule.validator?.(value)) {
					options[rule.key] = rule.parser ? rule.parser(value) : value
					i++
				} else {
					options[rule.key] = rule.default ?? null
				}
			} else if (rule.type === "boolean") {
				options[rule.key] = true
			}
		} else {
			input.push(arg)
		}
	}

	options.input = input.join(" ")
	return options
}

/**
 * Small similarity function → sebagai ganti Gktw.didYouMean
 */
export function findClosest(word: string, list: string[]): string | null {
	let best: { score: number; word: string } | null = null

	for (const candidate of list) {
		const score = levenshtein(word, candidate)
		if (!best || score < best.score) {
			best = { score, word: candidate }
		}
	}

	return best && best.score <= 3 ? best.word : null
}

/**
 * Levenshtein (untuk did-you-mean)
 */
function levenshtein(a: string, b: string): number {
	const dp = Array.from({ length: a.length + 1 }, () =>
		Array(b.length + 1).fill(0),
	)

	for (let i = 0; i <= a.length; i++) dp[i][0] = i
	for (let j = 0; j <= b.length; j++) dp[0][j] = j

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + cost,
			)
		}
	}

	return dp[a.length][b.length]
}
