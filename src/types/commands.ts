import type { Ctx } from "@mengkodingan/ckptw"

export interface CommandDetail {
	/** Nama utama command: "sticker" */
	name: string

	/** Alias command: ["s", "stiker"] */
	aliases?: string[]

	/** Untuk keperluan .menu atau .help */
	description?: string

	/** Untuk pengelompokan */
	category?:
		| "MEDIA"
		| "UTIL"
		| "ADMIN"
		| "INFO"
		| "GAME"
		| "AI"
		| "LEVEL"
		| string

	/** Middleware bisa baca */
	cooldown?: number

	/** Dokumentasi input opsional */
	args?: string[]

	// Flags untuk middleware
	ownerOnly?: boolean
	adminOnly?: boolean
	groupOnly?: boolean
	privateOnly?: boolean
}

export interface Command extends CommandDetail {
	code: (ctx: Ctx) => Promise<void>
}
