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
		// 1. Parsing Flag
		const flag = tools.parseFlag(ctx.args.join(" ") || null, {
			"-d": {
				type: "boolean",
				key: "document",
			},
		})
		const url = flag.input || null

		// 2. Handle jika tidak ada input URL
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

		// 3. Validasi URL (Format & Domain)
		const isUrl = tools.isUrl(url)

		if (!isUrl) {
			await ctx.reply(
				`ⓘ ${italic("URL tidak valid. Harap masukkan link YouTube yang benar.")}`,
			)
			return
		}

		// 4. Feedback Loading (UX)
		await ctx.reply(`⏳ ${italic("Sedang memproses data audio...")}`)

		try {
			// 5. Request Metadata ke API
			const result = await tools.scrapper<YTMP3Result>([
				{ name: "deline", endpoint: "/downloader/ytmp3", params: { url } },
				{ name: "nekolabs", endpoint: "/downloader/youtube/v1", params: { url, format: "mp3" } },
				{ name: "yp", endpoint: "/download/youtube2", params: { url, format: "mp3" } }
			], YTMP3Schema)


			// Validasi jika API mengembalikan hasil kosong atau gagal
			if (!result || !result.url) {
				throw new Error("Media tidak ditemukan atau API gagal merespons.")
			}

			/*/ 6. Download Buffer (Dengan Error Handling terpisah)
			let buffer: Buffer
			try {
				buffer = await tools.request("GET", result.url)
			} catch (_downloadErr) {
				throw new Error(
					"Gagal mengunduh file audio. Kemungkinan file terlalu besar atau link kadaluarsa.",
				)
			}
*/
			const document = flag?.document || false
			const fileName = `${result.title || "audio"}.mp3`
			const mimeType = "audio/mpeg" // Default safe mime

			// 7. Mengirim File
			if (document) {
				await ctx.reply({
					document: { url: result.url }, // Mengirim buffer langsung
					fileName: fileName,
					mimetype: mimeType,
					caption: `➛ ${bold("Title")}: ${result.title}\n➛ ${bold("URL")}: ${url}`,
				})
			} else {
				await ctx.reply({
					audio: { url: result.url }, // Mengirim buffer langsung
					mimetype: mimeType,
				})
			}
		} catch (error) {
			console.error("[ytmp3 error]:", error)

			// 8. Pesan Error User-Friendly
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
