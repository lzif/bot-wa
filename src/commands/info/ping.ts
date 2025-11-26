import { italic } from "@mengkodingan/ckptw"
import type { Command } from "../../types"

module.exports = {
	name: "ping",
	aliases: ["p"],
	category: "information",
	code: async (ctx) => {
		try {
			const startTime = performance.now()
			const pongMsg = await ctx.reply(`ⓘ ${italic("Pong!")}`)
			const responseTime = performance.now() - startTime
			await ctx.editMessage(
				pongMsg.key,
				`ⓘ ${italic(`Pong! Merespon dalam ${tools.convertMsToDuration(responseTime)}.`)}`,
			)
		} catch (_error) {
			tools.generateMessage("error")
		}
	},
} as Command
