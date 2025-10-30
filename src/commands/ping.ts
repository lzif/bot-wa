import type { Ctx } from "@mengkodingan/ckptw"

module.exports = {
	name: "ping",
	code: async (ctx: Ctx) => {
		ctx.reply("pong!")
	},
}
