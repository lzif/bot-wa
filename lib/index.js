"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const ckptw_1 = require("@mengkodingan/ckptw");
const bot = new ckptw_1.Client({
    prefix: ".",
    readIncommingMsg: true,
    usePairingCode: true,
    printQRInTerminal: false,
    phoneNumber: "6283892540720",
    autoMention: true,
    markOnlineOnConnect: true,
});
bot.ev.once(ckptw_1.Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});
const cmd = new ckptw_1.CommandHandler(bot, node_path_1.default.join(__dirname, "commands"));
cmd.load();
bot.launch();
