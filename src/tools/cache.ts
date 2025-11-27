import fs from "fs";
import path from "path";

export class PersistentCache<T> {
	private memory: Map<string, T> = new Map();
	private filePath: string;
	private saveTimer: NodeJS.Timeout | null = null;

	constructor(filename: string) {
		this.filePath = path.resolve(process.cwd(), filename);
		this.loadSync();
	}

	get(key: string): T | undefined {
		return this.memory.get(key);
	}

	set(key: string, value: T): void {
		this.memory.set(key, value);
		this.scheduleSave();
	}

	delete(key: string): void {
		const existed = this.memory.delete(key);
		if (existed) this.saveAsync();
	}

	clear(): void {
		this.memory.clear();
		this.saveAsync();
	}

	private loadSync() {
		try {
			if (fs.existsSync(this.filePath)) {
				this.memory = new Map(JSON.parse(fs.readFileSync(this.filePath, "utf-8")));
			}
		} catch (e) {
			this.memory = new Map();
		}
	}

	private scheduleSave() {
		if (this.saveTimer) clearTimeout(this.saveTimer);
		this.saveTimer = setTimeout(() => this.saveAsync(), 1000); // Debounce 1s
	}

	private async saveAsync() {
		try {
			const data = JSON.stringify(Array.from(this.memory.entries()), null, 2);
			await fs.promises.writeFile(this.filePath, data);
		} catch (e) {
			console.error("❌ Cache Save Failed:", e);
		}
	}
}
