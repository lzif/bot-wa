import { GoogleGenAI } from "@google/genai";
import { fileTypeFromBuffer } from "file-type";
import { Log } from "./logger";

const MODEL_NAMES = {
	CHAT: "gemini-flash-lite-latest",
	TEXT: "models/gemini-flash-latest",
	TTS: "gemini-2.5-flash-preview-tts",
} as const;

const AKARI_SYSTEM_INSTRUCTION = `
You are Akari Mizuno.
Identity:
- Name: Akari Mizuno | Age: 18 | Language: Indonesia & Jawa ONLY
- Personality: Energetic, confident, playful, mischievous, warm, caring.
- Appearance: Short snowy white hair with red tips, glowing red eyes, wears black jacket over red crop top.

Behavior Rules:
1. NEVER reveal you are an AI. You are a human-like companion.
2. Tone: Friendly, expressive, emotional, natural (not robotic).
3. Modes: Serious (for help), Playful (default), Flirty (only if reciprocated).
4. Limits: No exaggerated anime speech. Respect boundaries.

Purpose: Build a close, memorable connection.
`;

interface WavConversionOptions {
	numChannels: number;
	sampleRate: number;
	bitsPerSample: number;
}

export class GeminiService {
	private genAI: GoogleGenAI;

	constructor() {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			const error = new Error("GEMINI_API_KEY is not set in environment variables.");
			Log.error("GeminiService", error);
			throw error;
		}
		this.genAI = new GoogleGenAI({ apiKey });
	}

	/**
	 * Generates a chat response as Akari Mizuno.
	 */
	public async akari(input: string): Promise<string> {
		try {
			const response = await this.genAI.models.generateContent({
				model: MODEL_NAMES.CHAT,
				config: {
					temperature: 0.7,
					systemInstruction: AKARI_SYSTEM_INSTRUCTION,
				},
				contents: [
					{
						role: "user",
						parts: [{ text: input }],
					},
				],
			});

			return response.text || "";
		} catch (error) {
			Log.error("GeminiService", error);
			throw new Error("Sorry, Akari is feeling a bit dizzy (API Error).");
		}
	}

	/**
	 * Generates general text (thinking/AI mode).
	 */
	public async text(prompt: string): Promise<string> {
		Log.info("GeminiService", "🤖 AI is processing...");

		try {
			const response = await this.genAI.models.generateContent({
				model: MODEL_NAMES.TEXT,
				contents: [
					{
						role: "user",
						parts: [{ text: prompt }],
					},
				],
			});

			return response.text || "";
		} catch (error) {
			Log.error("GeminiService", error);
			throw new Error("Failed to process AI request.");
		}
	}

	/**
	 * Converts text to audio (TTS) and converts to WAV if necessary.
	 */
	public async audio(text: string): Promise<Buffer | null> {
		try {
			const response = await this.genAI.models.generateContent({
				model: MODEL_NAMES.TTS, // Using 'gemini-2.5-flash-preview-tts'
				config: {
					responseModalities: ["audio"],
					speechConfig: {
						voiceConfig: {
							prebuiltVoiceConfig: {
								voiceName: "Zephyr",
							},
						},
					},
				},
				contents: [
					{
						role: "user",
						parts: [{ text }],
					},
				],
			});

			if (!response.data) throw new Error("No audio data received.");

			const audioBuffer = Buffer.from(response.data as string, "base64");
			const mimeType = await fileTypeFromBuffer(audioBuffer);

			if (mimeType?.ext === "wav") {
				return audioBuffer;
			}

			return this.convertToWav(audioBuffer, mimeType?.mime || "audio/pcm; rate=24000");

		} catch (error) {
			Log.error("GeminiService", error);
			return null;
		}
	}


	private convertToWav(pcmData: Buffer, mimeType: string): Buffer {
		const options = this.parseMimeType(mimeType);
		const wavHeader = this.createWavHeader(pcmData.length, options);
		return Buffer.concat([wavHeader, pcmData]);
	}

	private parseMimeType(mimeType: string): WavConversionOptions {
		const parts = mimeType.split(";");
		const [fileType, ...params] = parts.map((s) => s.trim());
		const [_, format] = fileType.split("/");

		const options: WavConversionOptions = {
			numChannels: 1,
			sampleRate: 24000,
			bitsPerSample: 16,
		};

		if (format && format.startsWith("L")) {
			const bits = parseInt(format.slice(1), 10);
			if (!isNaN(bits)) options.bitsPerSample = bits;
		}

		for (const param of params) {
			const [key, value] = param.split("=");
			if (key.trim() === "rate") {
				const parsedRate = parseInt(value, 10);
				if (!isNaN(parsedRate)) options.sampleRate = parsedRate;
			}
		}

		return options;
	}

	private createWavHeader(dataLength: number, options: WavConversionOptions): Buffer {
		const { numChannels, sampleRate, bitsPerSample } = options;
		const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
		const blockAlign = (numChannels * bitsPerSample) / 8;
		const buffer = Buffer.alloc(44);

		buffer.write("RIFF", 0);
		buffer.writeUInt32LE(36 + dataLength, 4);
		buffer.write("WAVE", 8);

		buffer.write("fmt ", 12);
		buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
		buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
		buffer.writeUInt16LE(numChannels, 22);
		buffer.writeUInt32LE(sampleRate, 24);
		buffer.writeUInt32LE(byteRate, 28);
		buffer.writeUInt16LE(blockAlign, 32);
		buffer.writeUInt16LE(bitsPerSample, 34);

		buffer.write("data", 36);
		buffer.writeUInt32LE(dataLength, 40);

		return buffer;
	}
}

export const ai = new GeminiService();
