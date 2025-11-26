import fs from "fs";
import path from "path";

export class PersistentCache<T> {
  private memory: Map<string, T>;
  private filePath: string;

  constructor(filename: string = "mapping-cache.json") {
    this.filePath = path.resolve(process.cwd(), filename);
    this.memory = new Map<string, T>();
    
    this.load();
  }

  get(key: string): T | undefined {
    return this.memory.get(key);
  }

  set(key: string, value: T): void {
    this.memory.set(key, value);
    this.save();
  }

  delete(key: string): void {
    const existed = this.memory.delete(key);
    if (existed) this.save();
  }

  clear(): void {
    this.memory.clear();
    this.save();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, "utf-8");
        const entries = JSON.parse(rawData);
        this.memory = new Map(entries);
        console.log(`💾 Cache loaded from disk: ${this.memory.size} items.`);
      }
    } catch (e) {
      console.error("⚠️ Gagal load cache (mungkin file corrupt), memulai dengan cache kosong.");
      this.memory = new Map();
    }
  }

  private save() {
    try {
      const entries = Array.from(this.memory.entries());
      fs.writeFileSync(this.filePath, JSON.stringify(entries, null, 2));
    } catch (e) {
      console.error("❌ Gagal menyimpan cache ke disk:", e);
    }
  }
}
