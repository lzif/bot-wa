import path from "node:path"
import {
	Client,
	CommandHandler,
	type Ctx,
	Events,
	type IMessageInfo,
} from "@mengkodingan/ckptw"
import useBaileysAuthState from "baileysauth"
import { ENV } from "./env"
import { generateAIMessage } from "./lib/ai"

const bot = new Client({
	prefix: ".",
	readIncommingMsg: true,
	usePairingCode: true,
	printQRInTerminal: false,
	phoneNumber: ENV.phone,
	autoMention: true,
	markOnlineOnConnect: false,
	authAdapter: useBaileysAuthState(ENV.dbUrl),
})

bot.ev.once(Events.ClientReady, (m) => {
	console.log(`ready at ${m.user.id}`)
})

bot.ev.on(Events.MessagesUpsert, async (m: IMessageInfo, ctx: Ctx) => {
	if (!ctx.getMentioned()) return
	if (ctx.getMentioned()[0] === "57458257047770@lid") {
		ctx.simulateTyping()
		const name = m.pushName || ""
		const msg = await generateAIMessage(
			`${name}: ${m.content.replace("@57458257047770", "")}`,
		)
		await ctx.reply(msg)
	}
})

bot.use(async (ctx, next) => {
	console.log(ctx.msg.content)
	ctx.simulateTyping()
	await next()
})

const cmd = new CommandHandler(bot, `${path.resolve()}/dist/commands`)
cmd.load()

bot.launch()
