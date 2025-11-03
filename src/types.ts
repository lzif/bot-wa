import type { Ctx } from "@mengkodingan/ckptw"

export interface CommandDetail {
	name: string
	aliases?: string[]
	description?: string
	cooldown?: number
	category?: string
	args?: string[]

	// metadata for middleware
	ownerOnly?: boolean
	adminOnly?: boolean
	groupOnly?: boolean
}

export interface Command extends CommandDetail {
	code: (ctx: Ctx) => Promise<void>
}
