import { execSync } from "node:child_process"
import * as fs from "node:fs"
import * as os from "node:os"
import { bold } from "@mengkodingan/ckptw"
import type { Command } from "../../types"

// Helper untuk membaca limit memori cgroup (container)
function getContainerMemoryLimit(): number {
	const v2Path = "/sys/fs/cgroup/memory.max"
	const v1Path = "/sys/fs/cgroup/memory/memory.limit_in_bytes"

	try {
		// Coba cgroup v2 (umum)
		if (fs.existsSync(v2Path)) {
			const v2Limit = fs.readFileSync(v2Path, "utf8")
			if (v2Limit && v2Limit.trim() !== "max") {
				return parseInt(v2Limit.trim(), 10)
			}
		}
	} catch (_e) {
		// Abaikan error, coba v1
	}

	try {
		// Coba cgroup v1
		if (fs.existsSync(v1Path)) {
			const v1Limit = fs.readFileSync(v1Path, "utf8")
			if (v1Limit) {
				const limit = parseInt(v1Limit.trim(), 10)
				// v1 bisa melaporkan nilai yang sangat besar jika tidak ada limit
				// Gunakan totalmem host sebagai fallback jika limit v1 > totalmem host
				if (limit < os.totalmem()) {
					return limit
				}
			}
		}
	} catch (_e) {
		// Gagal membaca cgroup
	}

	// Jika gagal (bukan di container atau tidak ada izin), kembali ke memori host
	return os.totalmem()
}

// Helper untuk mendapatkan info storage (disk)
function getStorageInfo(tools: any): { used: string; total: string } {
	try {
		// Menjalankan 'df' pada root (/) dan mengambil baris kedua
		// -B1 = ukuran blok 1-byte
		const dfOutput = execSync("df -B1 /", { encoding: "utf8", stdio: "pipe" })
		const lines = dfOutput.trim().split("\n")

		if (lines.length < 2) {
			return { used: "N/A", total: "N/A" }
		}

		// [Filesystem, 1B-blocks, Used, Available, Use%, Mounted on]
		const parts = lines[1].split(/\s+/)
		if (parts.length < 4) {
			return { used: "N/A", total: "N/A" }
		}

		const total = parseInt(parts[1], 10) // Total blok 1-byte
		const used = parseInt(parts[2], 10) // Used blok 1-byte

		return {
			used: tools.formatSize(used),
			total: tools.formatSize(total),
		}
	} catch (e) {
		console.error("Error getting storage info:", e)
		return { used: "N/A", total: "N/A" }
	}
}

module.exports = {
	name: "server",
	category: "information",
	code: async (ctx) => {
		try {
			const cpus = os.cpus()
			const storage = getStorageInfo(tools)

			// Metrik Memori
			const usedMemProcess = process.memoryUsage().rss // Memori RSS (Resident Set Size) proses ini
			const totalMemContainer = getContainerMemoryLimit() // Limit memori container

			// Metrik Memori Host (jika masih ingin ditampilkan)
			// const totalMemHost = os.totalmem();
			// const freeMemHost = os.freemem();
			// const usedMemHost = totalMemHost - freeMemHost;

			await ctx.reply(
				`➛ ${bold("OS")}: ${os.type()} (${os.platform()})\n` +
					`➛ ${bold("Arch")}: ${os.arch()}\n` +
					`➛ ${bold("Release")}: ${os.release()}\n` +
					`➛ ${bold("Host")}: ${os.hostname()}\n` +
					"\n" +
					`➛ ${bold("Memori (Proses)")}: ${tools.formatSize(usedMemProcess)}\n` +
					`➛ ${bold("Memori (Limit)")}: ${tools.formatSize(totalMemContainer)}\n` +
					"\n" +
					`➛ ${bold("Storage (Used)")}: ${storage.used}\n` +
					`➛ ${bold("Storage (Total)")}: ${storage.total}\n` +
					"\n" +
					`➛ ${bold("Model CPU")}: ${cpus[0].model}\n` +
					`➛ ${bold("Kecepatan CPU")}: ${cpus[0].speed} MHz\n` +
					`➛ ${bold("Cores CPU (Host)")}: ${cpus.length}\n` +
					`➛ ${bold("Muat Rata-Rata (Host)")}: ${os
						.loadavg()
						.map((avg) => avg.toFixed(2))
						.join(", ")}\n` +
					"\n" +
					`➛ ${bold("Versi NodeJS")}: ${process.version}\n` +
					`➛ ${bold("PID")}: ${process.pid}\n` +
					"\n" +
					`➛ ${bold("Uptime Bot")}: ${tools.convertMsToDuration(Date.now() - ctx.me.readyAt)}\n` +
					`➛ ${bold("Uptime Server")}: ${tools.convertMsToDuration(os.uptime() * 1000)}\n` +
					`➛ ${bold("Library")}: @itsreimau/gktw (Fork of @mengkodingan/ckptw)`,
			)
		} catch (error) {
			console.error("Error in 'server' command:", error)
			// Asumsi 'tools.generateMessage' ada
			await ctx.reply(tools.generateMessage("error"))
		}
	},
} as Command
