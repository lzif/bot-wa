"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ckptw_1 = require("@mengkodingan/ckptw");
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
exports.default = {
    name: "sticker",
    aliases: ["s"],
    code: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (ctx.getMessageType() === ckptw_1.MessageType.imageMessage ||
            ctx.getMessageType() === ckptw_1.MessageType.videoMessage) {
            const image = (yield ctx.msg.media.toBuffer());
            if (!image)
                return;
            const sticker = new wa_sticker_formatter_1.Sticker(image, {
                pack: "Mambo",
                author: "El Mambo",
                type: wa_sticker_formatter_1.StickerTypes.FULL,
                categories: [],
                id: "12345",
                quality: 100,
            });
            ctx.reply({ sticker: yield sticker.toBuffer() });
        }
        else if (ctx.quoted &&
            (ctx.quoted.getMessageType() === ckptw_1.MessageType.imageMessage ||
                ctx.quoted.getMessageType() === ckptw_1.MessageType.videoMessage)) {
            const image = (yield ctx.quoted.media.toBuffer());
            if (!image)
                return;
            const sticker = new wa_sticker_formatter_1.Sticker(image, {
                pack: "Mambo",
                author: "El Mambo",
                type: wa_sticker_formatter_1.StickerTypes.FULL,
                categories: [],
                id: "12345",
                quality: 100,
            });
            ctx.reply({ sticker: yield sticker.toBuffer() });
        }
        else {
            ctx.reply("Please reply to an image or video to create a sticker.");
        }
    }),
};
