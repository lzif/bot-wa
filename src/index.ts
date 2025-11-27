import "./setup-global"
import fs from "node:fs"
import path from "node:path"
import {
	Client,
	CommandHandler,
	type Ctx,
	Events,
	type IMessageInfo,
} from "@mengkodingan/ckptw"

const bot = new Client({
	prefix: ".",
	readIncommingMsg: true,
	usePairingCode: true,
	printQRInTerminal: false,
	phoneNumber: config.ENV.phone,
	autoMention: true,
	markOnlineOnConnect: true,
})

bot.ev.once(Events.ClientReady, (m) => {
	console.log(`ready at ${m.user.id}`)
})

bot.ev.on(Events.MessagesUpsert, async (m: IMessageInfo, ctx: Ctx) => {
	if (!ctx.getMentioned()) return
	if (ctx.getMentioned()[0] === "57458257047770@lid") {
		ctx.simulateTyping()
		const name = m.pushName || ""
		const msg = await tools.ai.akari(
			`${name}: ${m.content.replace("@57458257047770", "")}`,
		)
		await ctx.reply(msg)
	}
})

bot.use(async (ctx, next) => {
	console.log(ctx.msg)
	ctx.simulateTyping()
	await next()
})

const commandPath = path.resolve("dist/commands")
const cmd = new CommandHandler(bot, commandPath)

cmd.load()

let reloadTimer: NodeJS.Timeout

console.log(`[Monitor] Watching for command updates in: ${commandPath}`)

try {
	fs.watch(commandPath, { recursive: true }, (_eventType, filename) => {
		if (filename?.endsWith(".js")) {
			clearTimeout(reloadTimer)

			reloadTimer = setTimeout(() => {
				console.log(
					`[Hot Reload] File updated: ${filename}. Reloading commands...`,
				)

				cmd.load()
			}, 500)
		}
	})
} catch (_e) {
	console.error(
		'[Monitor] Failed to watch command directory. Is "dist/commands" missing?',
	)
}

module.exports = bot
