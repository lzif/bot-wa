import { type Ctx, MessageType } from "@mengkodingan/ckptw"
import { Sticker, StickerTypes } from "wa-sticker-formatter"

module.exports = {
	name: "sticker",
	aliases: ["s"],
	code: async (ctx: Ctx) => {
		if (
			ctx.getMessageType() === MessageType.imageMessage ||
			ctx.getMessageType() === MessageType.videoMessage
		) {
			const buffer = (await ctx.msg.media.toBuffer()) as Buffer<ArrayBufferLike>
			if (!buffer) return
			const sticker = new Sticker(buffer, {
				pack: "Mambo",
				author: "El Mambo",
				type: StickerTypes.FULL,
				categories: [],
				id: "12345",
				quality: 100,
			})
			ctx.reply({ sticker: await sticker.toBuffer() })
		} else {
			ctx.reply("Please reply to an image or video to create a sticker.")
		}
	},
}
