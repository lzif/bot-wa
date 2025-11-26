import type { Command } from "../../types"

module.exports = {
	name: "listapis",
	aliases: ["listapi"],
	category: "information",
	code: async (ctx) => {
		try {
			const APIs = tools.APIs
			let resultText = ""

			for (const [_name, api] of Object.entries(APIs))
				resultText += `➛ ${api.baseURL}\n`

			await ctx.reply(resultText.trim())
		} catch (_error) {
			await ctx.reply(tools.generateMessage("error"))
		}
	},
} as Command
