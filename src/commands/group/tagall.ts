import type { Command } from "../../types"

module.exports = {
	name: "tagall",
	description: "🤔",
	aliases: ["htg", "hidetag"],
	code: async (ctx) => {
		const members = await ctx.group().members()

		const isSenderAdmin = members.filter(
			(x) =>
				x.id === ctx.sender.decodedJid &&
				(x.admin === "admin" || x.admin === "superadmin"),
		)
		if (!isSenderAdmin.length || !ctx.id) {
			ctx.reply("Hanya admin yang bisa pake commnd ini")
		} else {
			ctx.sendMessage(ctx.id, {
				text: ctx.args.join(" ") || String.fromCharCode(8206).repeat(4001),
				mentions: members.map((m) => m.id),
			})
		}
	},
} as Command
