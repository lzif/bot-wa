import { type Ctx, italic, MessageType } from "@mengkodingan/ckptw"
import { Sticker, StickerTypes } from "wa-sticker-formatter"
import type { Command } from "../types"

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
		const sticker = new Sticker(buffer, {
			pack: "Mambo",
			author: "El Mambo",
			type: StickerTypes.FULL,
			categories: [],
			id: "12345",
			quality: 100,
		})
		ctx.reply(await sticker.toMessage())
	},
} as Command
