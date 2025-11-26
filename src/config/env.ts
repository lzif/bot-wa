import dotenv from "dotenv"

dotenv.config()

function getEnv(key: string): string {
	const value = process.env[key]
	if (!value) throw new Error(`Missing env: ${key}`)
	return value
}

export const ENV = {
	phone: getEnv("PHONE"),
	geminiApiKey: getEnv("GEMINI_API_KEY"),
}
