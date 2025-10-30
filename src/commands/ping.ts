import { type Ctx, italic } from "@mengkodingan/ckptw"

export default {
	name: "ping",
	code: async (ctx: Ctx) => {
		ctx.reply(italic("pong!"))
	},
}
