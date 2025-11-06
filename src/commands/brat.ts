import Sticker, { StickerTypes } from "wa-sticker-formatter"
import type { Command } from "../types"

module.exports = {
	name: "brat",
	code: async (ctx) => {
		const sticker = new Sticker(
			`https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(ctx.args.join(" "))}`,
			{
				pack: "",
				author: "Akari Mizuno",
				type: StickerTypes.FULL,
				categories: [],
				id: ctx.id!,
				quality: 100,
			},
		)
		ctx.reply(await sticker.toMessage())
	},
} as Command
