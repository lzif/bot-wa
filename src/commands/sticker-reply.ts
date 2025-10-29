
import { MessageType } from "@mengkodingan/ckptw";

export default {
    name: MessageType.stickerMessage,
    type: "hears",
    code: async (ctx) => {
        ctx.reply("wow, cool sticker");
    },
};
