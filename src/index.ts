import path from "node:path"
import { Client, CommandHandler, Events } from "@mengkodingan/ckptw"
import useBaileysAuthState from "baileysauth"
import { ENV } from "./env"

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

const cmd = new CommandHandler(bot, `${path.resolve()}/dist/commands`)
cmd.load()

bot.launch()
