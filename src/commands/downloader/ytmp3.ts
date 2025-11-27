import { bold, italic } from "@mengkodingan/ckptw"
import type { Command, SchemaConfig } from "../../types"

const YTMP3Schema: SchemaConfig = {
	url: {
		description: "Link download video/lagu tanpa watermark (direct url)",
		type: "string"
	},
	title: {
		description: "Judul lagu/video",
		type: "string",
		optional: true
	},
	author: {
		description: "Nama creator / username",
		type: "string",
		optional: true
	},
};

type YTMP3Result = {
	url: string;
	title?: string | null;
	author?: string | null;
};

module.exports = {
	name: "ytmp3",
	aliases: ["yta", "ytaudio", "youtubeaudio"],
	category: "downloader",

	code: async (ctx) => {
		const flag = tools.parseFlag(ctx.args.join(" ") || null, {
			"-d": {
				type: "boolean",
				key: "document",
			},
		})
		const url = flag.input || null

		if (!url && ctx.used.prefix && ctx.used.command) {
			await ctx.reply(
				`${tools.generateInstruction(["send"], ["text"])}\n` +
				`${tools.generateCmdExample({ prefix: ctx.used.prefix, command: ctx.used.command }, "https://www.youtube.com/watch?v=0Uhh62MUEic -d")}\n` +
				tools.generateFlagInfo({
					"-d": "Kirim sebagai dokumen",
				}),
			)
			return
		}

		const isUrl = tools.isUrl(url)

		if (!isUrl) {
			await ctx.reply(
				`ⓘ ${italic("URL tidak valid. Harap masukkan link YouTube yang benar.")}`,
			)
			return
		}

		try {
			const result = await tools.unify<YTMP3Result>([
				{ name: "deline", endpoint: "/downloader/ytmp3", params: { url } },
				{ name: "nekolabs", endpoint: "/downloader/youtube/v1", params: { url, format: "mp3" } },
				{ name: "yp", endpoint: "/download/youtube2", params: { url, format: "mp3" } }
			], YTMP3Schema)


			if (!result || !result.url) {
				throw new Error("Media tidak ditemukan atau API gagal merespons.")
			}

			const document = flag?.document || false
			const fileName = `${result.title || "audio"}.mp3`
			const mimeType = "audio/mpeg" 

			if (document) {
				await ctx.reply({
					document: { url: result.url },
					fileName: fileName,
					mimetype: mimeType,
					caption: `➛ ${bold("Title")}: ${result.title}\n➛ ${bold("URL")}: ${url}`,
				})
			} else {
				await ctx.reply({
					audio: { url: result.url }, 
					mimetype: mimeType,
				})
			}
		} catch (error) {
			console.error("[ytmp3 error]:", error)

			let errorMessage = "Terjadi kesalahan internal sistem."

			if (error.message.includes("API")) {
				errorMessage = "Gagal menghubungi server pengunduh. Coba lagi nanti."
			} else if (error.message.includes("mengunduh")) {
				errorMessage =
					"Gagal mengunduh audio. File mungkin terlalu besar untuk WhatsApp."
			}

			await ctx.reply(`❌ ${bold("Gagal:")} ${errorMessage}`)
		}
	},
} as Command
