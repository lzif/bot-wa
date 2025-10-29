import { Client, Events, MessageType } from "@mengkodingan/ckptw";
import { Sticker, StickerTypes } from "wa-sticker-formatter";

const bot = new Client({
	prefix: ".",
	readIncommingMsg: true,
	usePairingCode: true,
	printQRInTerminal: false,
	phoneNumber: "6283892540720",
	autoMention: true,
	markOnlineOnConnect: true
});

bot.ev.once(Events.ClientReady, (m) => {
	console.log(`ready at ${m.user.id}`);
});

bot.command('ping', async (ctx) => ctx.reply({ text: 'pong!' }));
bot.command('hi', async (ctx) => ctx.reply('hello! you can use string as a first parameter in reply function too!'));

bot.hears('test', async (ctx) => ctx.reply('test 1 2 3 beep boop...'));
bot.hears(MessageType.stickerMessage, async (ctx) => ctx.reply('wow, cool sticker'));
bot.hears(['help', 'menu'], async (ctx) => ctx.reply('hears can be use with array too!'));

bot.command({
	name: "sticker",
	aliases: ["s"],
	code: async (ctx) => {
		if (ctx.getMessageType() === MessageType.imageMessage) {
			const image = await ctx.msg.media.toBuffer() as Buffer<ArrayBufferLike>;
			if (!image) return
			const sticker = new Sticker(image, {
				pack: 'Mambo',
				author: 'El Mambo',
				type: StickerTypes.FULL,
				categories: ['🎉'],
				id: '12345',
				quality: 100,
			})
			ctx.reply({ sticker: await sticker.toBuffer() });
		}
	}
})

bot.launch();

