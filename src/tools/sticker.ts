import { randomBytes } from "node:crypto"
import { existsSync, unlinkSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { TextEncoder } from "node:util"
import ffmpegPath from "ffmpeg-static"
import { fileTypeFromBuffer } from "file-type"
import ffmpeg from "fluent-ffmpeg"
import { Image } from "node-webpmux"
import sharp, { type Color, fit } from "sharp"
import { Log } from "./logger"

ffmpeg.setFfmpegPath(ffmpegPath)
interface IStickerConfig {
	pack?: string
	author?: string
	id: string
}

interface IStickerOptions extends IStickerConfig {
	type?: string
	quality?: sharp.WebpOptions["quality"]
	background?: Color
}

interface IRawMetadata {
	emojis: string[]
	"sticker-pack-id": string
	"sticker-pack-name": string
	"sticker-pack-publisher": string
}

type Metadata = IStickerConfig | IStickerOptions

const defaultBg = "#ffffff"
class RawMetadata implements IRawMetadata {
	emojis: string[]
	"sticker-pack-id": string
	"sticker-pack-name": string
	"sticker-pack-publisher": string
	constructor(options: Metadata) {
		this["sticker-pack-id"] = options.id
		this["sticker-pack-name"] = options.pack || ""
		this["sticker-pack-publisher"] = options.author || ""
		this.emojis = []
	}
}
const videoToGif = async (data: Buffer): Promise<Buffer> => {
	try {
		const filename = `${tmpdir()}/${Math.random().toString(36)}`
		const [video, gif] = ["video", "gif"].map((ext) => `${filename}.${ext}`)
		await writeFile(video, data)
		await new Promise((resolve, reject) => {
			ffmpeg(video)
				.save(gif)
				.on("end", resolve)
				.on("error", reject)
		})
		const buffer = await readFile(gif)
		;[video, gif].forEach((file) => unlinkSync(file))
		return buffer
	} catch (error) {
		Log.error("StickerService", error)
		throw new Error("Failed to process video sticker.")
	}
}
const convert = async (
	data: Buffer,
	mime: string,
	{ quality = 100, background = defaultBg }: IStickerOptions,
): Promise<Buffer> => {
	try {
		const isVideo = mime.startsWith("video")
		const image = isVideo ? await videoToGif(data) : data
		const isAnimated = isVideo || mime.includes("gif") || mime.includes("webp")

		const img = sharp(image, { animated: isAnimated }).toFormat("webp")
		img.resize(512, 512, {
			fit: fit.contain,
			background,
		})
		return await img
			.webp({
				quality,
				lossless: false,
			})
			.toBuffer()
	} catch (error) {
		Log.error("StickerService", error)
		throw new Error("Failed to process sticker image.")
	}
}

class Exif {
	private data: RawMetadata
	private exif: Buffer | null = null
	constructor(options: Metadata) {
		this.data = new RawMetadata(options)
	}

	build = (): Buffer => {
		const data = JSON.stringify(this.data)
		const exif = Buffer.concat([
			Buffer.from([
				0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
				0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
			]),
			Buffer.from(data, "utf-8"),
		])
		exif.writeUIntLE(new TextEncoder().encode(data).length, 14, 4)
		return exif
	}

	add = async (image: string | Buffer | Image): Promise<Buffer> => {
		try {
			const exif = this.exif || this.build()
			image =
				image instanceof Image
					? image
					: await (async () => {
							const img = new Image()
							await img.load(image)
							return img
						})()
			image.exif = exif
			return await image.save(null)
		} catch (error) {
			Log.error("StickerService", error)
			throw new Error("Failed to add sticker metadata.")
		}
	}
}

export async function createSticker(
	input: string | Buffer,
	author: string = "",
	pack: string = "",
): Promise<Buffer> {
	try {
		const metadata: IStickerOptions = {
			author: author,
			pack: pack,
			id: randomBytes(32).toString("hex"),
			quality: 100,
			type: "default",
			background: defaultBg,
		}

		// ======= Parse Input =======
		let data: Buffer
		if (Buffer.isBuffer(input)) {
			data = input
		} else if (input.trim().startsWith("<svg")) {
			data = Buffer.from(input)
		} else if (existsSync(input)) {
			data = await readFile(input)
		} else {
			// fetch URL
			const res = await fetch(input)
			if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`)
			const arrayBuffer = await res.arrayBuffer()
			data = Buffer.from(arrayBuffer)
		}

		// ======= Detect MIME =======
		const mime: string = input.toString().trim().startsWith("<svg")
			? "image/svg+xml"
			: ((await fileTypeFromBuffer(data))?.mime ?? "image/svg+xml")

		// ======= Build Sticker =======
		return new Exif(metadata as IStickerConfig).add(
			await convert(data, mime, metadata),
		)
	} catch (error) {
		Log.error("StickerService", error)
		throw new Error("Failed to create sticker.")
	}
}
