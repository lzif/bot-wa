// src/tools/media/index.ts
import { MessageType } from "@mengkodingan/ckptw"
import filetype from "file-type"
import { Log } from "./logger"

export type messageTypeFromBufferResponse = "image" | "video" | "audio" | null

export type MediaType =
	| "audio"
	| "document"
	| "gif"
	| "image"
	| "sticker"
	| "text"
	| "video"

export interface MessageTypeMap {
	audio: string
	document: string[]
	gif: string
	image: string
	sticker: string
	text: string[]
	video: string
}

export async function messageTypeFromBuffer(
	buffer: any,
): Promise<messageTypeFromBufferResponse> {
	try {
		const bufferType = await filetype.fileTypeFromBuffer(buffer as any)
		if (!bufferType) return null

		if (/image/.test(bufferType.mime)) return "image"
		if (/video/.test(bufferType.mime)) return "video"
		if (/audio/.test(bufferType.mime)) return "audio"

		return null
	} catch (error) {
		Log.error("MediaService", error)
		return null
	}
}

/**
 * Cek apakah `type` cocok dengan media yang diperlukan.
 */
export function checkMedia(
	type: string | undefined | null,
	required: MediaType | MediaType[],
): MediaType | false {
	if (!type || !required) return false

	const mediaMap: MessageTypeMap = {
		audio: MessageType.audioMessage,
		document: [
			MessageType.documentMessage,
			MessageType.documentWithCaptionMessage,
		],
		gif: MessageType.videoMessage,
		image: MessageType.imageMessage,
		sticker: MessageType.stickerMessage,
		text: [MessageType.conversation, MessageType.extendedTextMessage],
		video: MessageType.videoMessage,
	}

	const requiredList = Array.isArray(required) ? required : [required]

	for (const media of requiredList) {
		const mapped = mediaMap[media]
		if (!mapped) continue

		if (Array.isArray(mapped)) {
			if (mapped.includes(type)) return media
		} else {
			if (type === mapped) return media
		}
	}

	return false
}
