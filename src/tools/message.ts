import { inlineCode, italic } from "@mengkodingan/ckptw"
import { SystemMessage } from "./systemMessage"

export type UsedCommand = {
	prefix: string | string[]
	command: string
}

type GenerateMessageOptions = {
	timeleft?: number
	max_character?: number
}

export const generateMessage = (
	key: keyof typeof SystemMessage,
	opts?: GenerateMessageOptions,
): string => {
	let msg = SystemMessage[key]

	if (opts?.timeleft !== undefined) {
		msg = msg.replace("{timeleft}", convertMsToDuration(opts.timeleft))
	}

	if (opts?.max_character !== undefined) {
		msg = msg.replace("{max_character}", String(opts.max_character))
	}

	return italic(msg)
}

export const convertMsToDuration = (ms: number): string => {
	if (!Number.isFinite(ms) || ms <= 0) return "0 detik"

	const units: Array<{ label: string; ms: number }> = [
		{ label: "tahun", ms: 365 * 24 * 60 * 60 * 1000 },
		{ label: "bulan", ms: 30 * 24 * 60 * 60 * 1000 },
		{ label: "minggu", ms: 7 * 24 * 60 * 60 * 1000 },
		{ label: "hari", ms: 24 * 60 * 60 * 1000 },
		{ label: "jam", ms: 60 * 60 * 1000 },
		{ label: "menit", ms: 60 * 1000 },
		{ label: "detik", ms: 1000 },
	]

	let remaining = Math.max(0, Math.floor(ms))
	const parts: string[] = units
		.map((u) => {
			const value = Math.floor(remaining / u.ms)
			if (value <= 0) return null
			remaining = remaining - value * u.ms
			return `${value} ${u.label}`
		})
		.filter((p): p is string => p !== null)

	if (parts.length === 0) {
		// jika kurang dari 1 detik, tampilkan milidetik
		return `${remaining} milidetik`
	}

	return parts.join(" ")
}

export const formatSize = (
	byteCount: number,
	withPerSecond = false,
): string => {
	if (!Number.isFinite(byteCount) || byteCount === 0)
		return `0 Bytes${withPerSecond ? "/s" : ""}`

	const units = [
		"Bytes",
		"KiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB",
	]
	let size = Math.abs(byteCount)
	let index = 0

	while (size >= 1024 && index < units.length - 1) {
		size = size / 1024
		index++
	}

	// preserve sign for negative values (if any)
	const sign = byteCount < 0 ? "-" : ""

	// two decimals are usually enough for human-readable sizes
	return `${sign}${size.toFixed(2)} ${units[index]}${withPerSecond ? "/s" : ""}`
}

export const generateCmdExample = (
	used: UsedCommand | undefined,
	args: string | undefined,
): string => {
	if (!used || !args) {
		return `${inlineCode("used")} atau ${inlineCode("args")} harus diberikan!`
	}

	const full = `${used.prefix}${used.command} ${args}`.trim()
	return `Contoh: ${inlineCode(full)}`
}

export const generateInstruction = (
	actions: Array<"send" | "reply"> | undefined,
	mediaTypes: string | string[] | undefined,
): string => {
	if (!actions || actions.length === 0) {
		return `${inlineCode("actions")} yang diperlukan harus ditentukan!`
	}

	const mediaArray =
		typeof mediaTypes === "string"
			? [mediaTypes]
			: Array.isArray(mediaTypes)
				? mediaTypes
				: null

	if (!mediaArray || mediaArray.length === 0) {
		return `${inlineCode("mediaTypes")} harus berupa string atau array string!`
	}

	const mediaTypeTranslations: Record<string, string> = {
		audio: "audio",
		document: "dokumen",
		gif: "GIF",
		image: "gambar",
		sticker: "stiker",
		text: "teks",
		video: "video",
		viewOnce: "sekali lihat",
	}

	const translated = mediaArray
		.map((t) => mediaTypeTranslations[t] ?? t)
		.filter(Boolean)

	const mediaList =
		translated.length > 1
			? `${translated.slice(0, -1).join(", ")}, atau ${translated.at(-1)}`
			: translated[0]

	const actionText =
		actions.length > 1
			? actions.map((a) => (a === "send" ? "Kirim" : "Balas")).join(" atau ")
			: actions[0] === "send"
				? "Kirim"
				: "Balas"

	return `ⓘ ${italic(`${actionText} ${mediaList}!`)}`
}

export const generateFlagInfo = (
	flags: Record<string, string> | undefined,
): string => {
	if (!flags || typeof flags !== "object") {
		return `${inlineCode("flags")} harus berupa objek!`
	}

	const entries = Object.entries(flags)
	if (entries.length === 0) return "Flag: (tidak ada)"

	const lines = entries.map(([flag, desc]) => `- ${inlineCode(flag)}: ${desc}`)
	return ["Flag:", ...lines].join("\n")
}

export const generateNotes = (notes: string[] | undefined): string => {
	if (!Array.isArray(notes)) return `notes harus berupa array!`
	if (notes.length === 0) return "Catatan: (kosong)"
	const lines = notes.map((n) => `- ${n}`)
	return ["Catatan:", ...lines].join("\n")
}

export const ucwords = (text: string | null | undefined): string | null => {
	if (!text) return null
	return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const icons = {
	info: "ℹ",
	error: "✗",
	success: "✓",
	list: "•",
	star: "✦",
}

export function wrapMessage(icon: string, text: string) {
	return `${icon} ${italic(text)}`
}

export const info = (text: string) => wrapMessage(icons.info, text)
export const error = (text: string) => wrapMessage(icons.error, text)
export const success = (text: string) => wrapMessage(icons.success, text)

// List maker
export function list(title: string, items: string[]) {
	return (
		`${icons.star} ${italic(title)}\n` +
		items.map((i) => `${icons.list} ${i}`).join("\n")
	)
}
