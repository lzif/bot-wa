import https from "node:https"
import { performance } from "node:perf_hooks"
import { bold } from "@mengkodingan/ckptw"
import type { Command } from "../../types"

const average = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length
const median = (v: number[]) => {
	const s = [...v].sort((a, b) => a - b)
	const m = Math.floor(s.length / 2)
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
const jitter = (v: number[]) => {
	const j = []
	for (let i = 0; i < v.length - 1; i++) {
		j.push(Math.abs(v[i] - v[i + 1]))
	}
	return j.length === 0 ? 0 : average(j)
}

function httpGet(hostname: string, path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const req = https.request({ hostname, path, method: "GET" }, (res) => {
			const chunks: Buffer[] = []
			res.on("data", (c) => chunks.push(c))
			res.on("end", () => resolve(Buffer.concat(chunks).toString()))
		})
		req.on("error", reject)
		req.end()
	})
}

async function fetchLocations(): Promise<Record<string, string>> {
	const raw = JSON.parse(await httpGet("speed.cloudflare.com", "/locations"))
	return raw.reduce((acc: any, { iata, city }: any) => {
		acc[iata] = city
		return acc
	}, {})
}

async function fetchTrace(): Promise<Record<string, string>> {
	const txt = await httpGet("speed.cloudflare.com", "/cdn-cgi/trace")
	return txt
		.split("\n")
		.map((l) => l.split("="))
		.reduce((o: any, [k, v]) => (v ? ((o[k] = v), o) : o), {})
}

function requestPerf(options: https.RequestOptions, body = ""): Promise<any> {
	const agent = new https.Agent({
		keepAlive: true,
		maxSockets: 16,
	})

	options.agent = agent

	let started = 0
	let dns = 0
	let tcp = 0
	let ssl = 0
	let ttfb = 0
	let ended = 0

	return new Promise((resolve, reject) => {
		started = performance.now()

		const req = https.request(options, (res) => {
			res.once("readable", () => (ttfb = performance.now()))
			res.on("data", () => {})
			res.on("end", () => {
				ended = performance.now()
				resolve({
					started,
					dns,
					tcp,
					ssl,
					ttfb,
					ended,
					serverTiming: parseFloat(
						(Array.isArray(res.headers["server-timing"])
							? res.headers["server-timing"][0]
							: (res.headers["server-timing"] ?? "0")
						).slice(22),
					),
				})
			})
		})

		req.on("socket", (socket) => {
			socket.on("lookup", () => (dns = performance.now()))
			socket.on("connect", () => (tcp = performance.now()))
			socket.on("secureConnect", () => (ssl = performance.now()))
		})

		req.on("error", reject)

		req.write(body)
		req.end()
	})
}

const download = (bytes: number) =>
	requestPerf({
		hostname: "speed.cloudflare.com",
		path: `/__down?bytes=${bytes}`,
		method: "GET",
	})

const upload = (bytes: number) => {
	const data = "0".repeat(bytes)
	return requestPerf(
		{
			hostname: "speed.cloudflare.com",
			path: "/__up",
			method: "POST",
			headers: { "Content-Length": Buffer.byteLength(data) },
		},
		data,
	)
}

const speed = (bytes: number, ms: number) => (bytes * 8) / (ms / 1000) / 1e6

/* ===========================================================
	 =============  SINGLE PUBLIC FUNCTION  =====================
	 =========================================================== */

export async function runSpeedTest(): Promise<string> {
	const [locations, trace] = await Promise.all([fetchLocations(), fetchTrace()])

	// -------- Latency --------
	const pings: number[] = []
	for (let i = 0; i < 20; i++) {
		const r = await download(1000)
		pings.push(r.ttfb - r.started - r.serverTiming)
	}

	const latencyMin = Math.min(...pings)
	const latencyMax = Math.max(...pings)
	const latencyAvg = average(pings)
	const latencyMed = median(pings)
	const latencyJit = jitter(pings)

	// -------- Download Tests --------
	const d1 = await Promise.all([...Array(10)].map(() => download(101000)))
	const d2 = await Promise.all([...Array(8)].map(() => download(1001000)))
	const d3 = await Promise.all([...Array(6)].map(() => download(10001000)))
	const d4 = await Promise.all([...Array(4)].map(() => download(25001000)))
	const d5 = await Promise.all([...Array(1)].map(() => download(100001000)))

	const allDown = [...d1, ...d2, ...d3, ...d4, ...d5].map((r) =>
		speed(101000, r.ended - r.ttfb),
	)
	const down90 = [...allDown].sort((a, b) => a - b)[
		Math.floor(allDown.length * 0.9)
	]

	// -------- Upload Tests --------
	const u1 = await Promise.all([...Array(10)].map(() => upload(11000)))
	const u2 = await Promise.all([...Array(10)].map(() => upload(101000)))
	const u3 = await Promise.all([...Array(8)].map(() => upload(1001000)))
	const allUp = [...u1, ...u2, ...u3].map((r) => speed(11000, r.serverTiming))
	const up90 = [...allUp].sort((a, b) => a - b)[Math.floor(allUp.length * 0.9)]

	// -------- Build Output --------
	const loc = locations[trace.colo]

	return [
		bold("🌐 Cloudflare Speed Test Result"),
		"",
		bold("Server:"),
		`${loc} (${trace.colo})`,
		bold("IP:"),
		`${trace.ip} (${trace.loc})`,
		"",
		bold("Latency"),
		`• Min: ${latencyMin.toFixed(2)} ms`,
		`• Max: ${latencyMax.toFixed(2)} ms`,
		`• Avg: ${latencyAvg.toFixed(2)} ms`,
		`• Median: ${latencyMed.toFixed(2)} ms`,
		`• Jitter: ${latencyJit.toFixed(2)} ms`,
		"",
		bold("Download Speed (P90):"),
		`${down90.toFixed(2)} Mbps`,
		"",
		bold("Upload Speed (P90):"),
		`${up90.toFixed(2)} Mbps`,
	].join("\n")
}

module.exports = {
	name: "speedtest",
	aliases: ["speed"],
	category: "information",
	code: async (ctx) => {
		try {
			const res = await runSpeedTest()
			ctx.reply(res)
		} catch (_err) {
			ctx.reply(tools.generateMessage("error"))
		}
	},
} as Command
