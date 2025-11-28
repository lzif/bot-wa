// src/tools/api/index.ts
import util from "node:util"
import { Log } from "./logger"

export interface ApiConfig {
	baseURL: string
	APIKey?: string
}

export const APIs = {
	deline: { baseURL: "https://api.deline.web.id" },
	nekolabs: { baseURL: "https://api.nekolabs.web.id" },
	yp: { baseURL: "https://api.yupra.my.id" },
	zell: { baseURL: "https://zellapi.autos" },
} as const satisfies Record<string, ApiConfig>

type Params = Record<string, any>
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

function buildUrl(
	api: ApiConfig,
	endpoint: string,
	params?: Params,
	keyName?: string,
) {
	try {
		const query = new URLSearchParams(params || {})

		if (keyName && api.APIKey) query.set(keyName, api.APIKey)

		const url = new URL(endpoint, api.baseURL)
		url.search = query.toString()
		return url.toString()
	} catch (err) {
		Log.error("API", err)
		return null
	}
}

export async function request(
	method: Method,
	url: string,
	body?: any,
	headers?: any,
) {
	try {
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json", ...(headers || {}) },
			body: method !== "GET" ? JSON.stringify(body || {}) : undefined,
		})

		const contentType = res.headers.get("content-type") || ""

		// JSON
		if (contentType.includes("application/json")) {
			return res.json()
		}

		// Binary (image, video, audio, pdf, zip, dll)
		if (
			contentType.startsWith("image/") ||
			contentType.startsWith("video/") ||
			contentType.startsWith("audio/") ||
			contentType.includes("pdf") ||
			contentType.includes("octet-stream") ||
			contentType.includes("zip") ||
			contentType.includes("gzip")
		) {
			const buffer = Buffer.from(await res.arrayBuffer())
			return {
				buffer,
				contentType,
				size: buffer.length,
				ext: contentType.split("/")[1],
			}
		}

		// Text fallback
		return res.text()
	} catch (err) {
		Log.error("API", err)
		throw new Error("Failed to process API request.")
	}
}

function createClient(api: ApiConfig) {
	return {
		url: (endpoint: string, params?: Params, keyName?: string) =>
			buildUrl(api, endpoint, params, keyName),

		get: (endpoint: string, params?: Params) => {
			const url = buildUrl(api, endpoint, params)
			if (!url) throw new Error("Invalid URL")
			return request("GET", url)
		},

		post: (endpoint: string, body?: any, params?: Params) => {
			const url = buildUrl(api, endpoint, params)
			if (!url) throw new Error("Invalid URL")
			return request("POST", url, body)
		},

		put: (endpoint: string, body?: any, params?: Params) => {
			const url = buildUrl(api, endpoint, params)
			if (!url) throw new Error("Invalid URL")
			return request("PUT", url, body)
		},

		patch: (endpoint: string, body?: any, params?: Params) => {
			const url = buildUrl(api, endpoint, params)
			if (!url) throw new Error("Invalid URL")
			return request("PATCH", url, body)
		},

		delete: (endpoint: string, params?: Params) => {
			const url = buildUrl(api, endpoint, params)
			if (!url) throw new Error("Invalid URL")
			return request("DELETE", url)
		},
	}
}

export const api = Object.fromEntries(
	Object.entries(APIs).map(([name, cfg]) => [name, createClient(cfg)]),
) as {
	[K in keyof typeof APIs]: ReturnType<typeof createClient>
}
