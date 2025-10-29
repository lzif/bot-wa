
import { MessageType } from "@mengkodingan/ckptw";
import { Sticker, StickerTypes } from "wa-sticker-formatter";

export default {
	name: "sticker",
	aliases: ["s"],
	code: async (ctx) => {
		if (ctx.getMessageType() === MessageType.imageMessage || ctx.getMessageType() === MessageType.videoMessage) {
			const image = await ctx.msg.media.toBuffer() as Buffer<ArrayBufferLike>;
			if (!image) return
			const sticker = new Sticker(image, {
				pack: 'Mambo',
				author: 'El Mambo',
				type: StickerTypes.FULL,
				categories: [],
				id: '12345',
				quality: 100,
			})
			ctx.reply({ sticker: await sticker.toBuffer() });
		} else if (ctx.quoted && (ctx.quoted.getMessageType() === MessageType.imageMessage || ctx.quoted.getMessageType() === MessageType.videoMessage)) {
            const image = await ctx.quoted.media.toBuffer() as Buffer<ArrayBufferLike>;
			if (!image) return
			const sticker = new Sticker(image, {
				pack: 'Mambo',
				author: 'El Mambo',
				type: StickerTypes.FULL,
				categories: [],
				id: '12345',
				quality: 100,
			})
			ctx.reply({ sticker: await sticker.toBuffer() });
        } else {
            ctx.reply('Please reply to an image or video to create a sticker.');
        }
	}
}
