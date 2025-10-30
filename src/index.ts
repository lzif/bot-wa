import path from "node:path"
import { Client, CommandHandler, Events } from "@mengkodingan/ckptw"

const bot = new Client({
	prefix: ".",
	readIncommingMsg: true,
	usePairingCode: true,
	printQRInTerminal: false,
	phoneNumber: "6283892540720",
	autoMention: true,
	markOnlineOnConnect: false,
})

bot.ev.once(Events.ClientReady, (m) => {
	console.log(`ready at ${m.user.id}`)
})

const cmd = new CommandHandler(bot, `${path.resolve("app")}/commands`)
cmd.load()

bot.launch()
