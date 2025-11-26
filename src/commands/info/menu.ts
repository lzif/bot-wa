import { Command } from "../../types"

type AnyCommand = Command;

function normalizeCommands(src: unknown): AnyCommand[] {
	if (!src) return [];
	try {
		// Map-like
		if (typeof (src as any).values === "function") {
			return Array.from((src as any).values()) as AnyCommand[];
		}
		// Array-like
		if (Array.isArray(src)) return src as AnyCommand[];
		// Iterable fallback
		return Array.from(src as any) as AnyCommand[];
	} catch {
		return [];
	}
}

function buildBoxListMultiline(items: string[]) {
	if (!items.length) return "";
	const lines: string[] = [];
	for (let i = 0; i < items.length; i++) {
		const left = (i === 0) ? "┌" : (i === items.length - 1 ? "└" : "│");
		lines.push(`${left}  ◦  ${items[i]}`);
	}
	return lines.join("\n");
}

function friendlyCategoryName(cat?: string): string {
	if (!cat) return "Tidak Ada Category";
	const raw = String(cat).trim();
	if (!raw) return "Tidak Ada Category";
	return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function commandsByCategory(cmds: AnyCommand[], query: string): AnyCommand[] {
	const q = query.trim().toLowerCase();
	return cmds.filter((c) => {
		const cat = c.category ? String(c.category).toLowerCase() : "";
		return cat === q || cat.includes(q);
	});
}

function buildCategoryShortcuts(grouped: Record<string, AnyCommand[]>, order?: string[]) {
  const cats = order && order.length ? order : Object.keys(grouped);
  const lines: string[] = [];
  for (const c of cats) {
    const label = c;
    lines.push(`.menu ${label.toLowerCase()}`);
  }
  return buildBoxListMultiline(lines);
}

function formatCommandForCategory(cmd: AnyCommand): string {
	const args = cmd.args && Array.isArray(cmd.args) && cmd.args.length ? ` *${cmd.args.join(" ")}*` : "";
	return `.${cmd.name}${args}`;
}

module.exports = {
	name: "menu",
	aliases: ["help"],
	description: "Menampilkan daftar menu dan detail per kategori seperti contoh chat",
	code: async (ctx) => {
		try {
			const allCommands = normalizeCommands(ctx?._self?.cmd);
			const grouped: Record<string, AnyCommand[]> = {};
			for (const c of allCommands) {
				const cat = friendlyCategoryName(c?.category);
				if (!grouped[cat]) grouped[cat] = [];
				grouped[cat].push(c);
			}

			const args: string[] = Array.isArray(ctx?.args) ? ctx.args : [];
			if (args.length > 0) {
				const query = String(args[0] || "").trim();
				if (!query) {
					await ctx.reply("Silakan masukkan nama kategori. Contoh: .menu converter");
					return;
				}

				const matchedCommands = commandsByCategory(allCommands, query);

				if (!matchedCommands.length) {
					const keys = Object.keys(grouped).filter(k => k.toLowerCase() === query.toLowerCase() || k.toLowerCase().includes(query.toLowerCase()));
					if (keys.length) {
						let flat: AnyCommand[] = [];
						for (const k of keys) flat = flat.concat(grouped[k]);
						const items = flat.map(formatCommandForCategory);
						const box = buildBoxListMultiline(items);
						const text = box || "Tidak ada perintah di kategori ini.";
						await ctx.reply(text);
						return;
					}

					await ctx.reply("Kategori tidak ditemukan atau belum ada command di kategori tersebut.");
					return;
				}

				const items = matchedCommands.map(formatCommandForCategory);
				const box = buildBoxListMultiline(items);
				await ctx.reply(box);
				return;
			}

			const headerLines = [
				`Hi @${ctx?.sender?.pushName ?? "User"} 🪸`,
				`I am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.`,
				``,
				`If you find an error or want to upgrade premium plan contact the owner.`,
				``
			];

			const preferredOrder = [
				"Admin", "Converter", "Downloader", "Example", "Group", "Miscs", "Owner", "User info", "Utilities", "Voice changer"
			];
			const discovered = Object.keys(grouped);
			const ordered = [
				...preferredOrder.filter(p => discovered.includes(p)),
				...discovered.filter(d => !preferredOrder.includes(d))
			];

			const shortcutBox = buildCategoryShortcuts(grouped, ordered);

			const signature = `ʟɪɢʜᴛᴡᴇɪɢʜᴛ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ${ctx?.sender?.pushName ?? "Unknown"} ッ`;

			const fullText = [
				...headerLines,
				shortcutBox,
				``,
				signature
			].join("\n");

			await ctx.reply(fullText);
		} catch (err) {
			await ctx.reply("Terjadi kesalahan saat menampilkan menu.");
			console.log("[MENU ERR]", err);
		}
	}
} as Command;
