import { type Ctx, italic } from "@mengkodingan/ckptw"
import type { Command } from "../../types"

module.exports = {
	name: "sticker",
	aliases: ["s"],
	code: async (ctx: Ctx) => {
		const buffer = ((await ctx.msg.media.toBuffer()) ||
			(await ctx.quoted.media.toBuffer())) as Buffer<ArrayBufferLike>
		if (!buffer) {
			ctx.reply(italic("❌ Reply ke media atau jadikan sebagai caption."))
			return
		}
		const sticker = await tools.createSticker(buffer, "Akari Mizuno", " ")
		ctx.reply({ sticker })
	},
} as Command
