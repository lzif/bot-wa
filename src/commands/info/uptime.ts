import { italic } from "@mengkodingan/ckptw"
import type { Command } from "../../types"

module.exports = {
	name: "uptime",
	aliases: ["runtime"],
	category: "information",
	code: async (ctx) => {
		await ctx.reply(
			`ⓘ ${italic(`Bot telah aktif selama ${tools.convertMsToDuration(Date.now() - ctx.me.readyAt)}.`)}`,
		)
	},
} as Command
