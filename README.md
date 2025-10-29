# WhatsApp Bot 🤖

Bot WhatsApp multifungsi berbasis Node.js + TypeScript dengan integrasi **Baileys**.  
Fokus utama: cepat, modular, dan bisa dipakai di grup atau chat pribadi.

---

## 🚀 Fitur Utama

### 🖼️ Media Tools
- **Convert Image to Sticker** – kirim gambar → otomatis jadi stiker.
- **Sticker to Image** – ubah stiker jadi file gambar.
- **Web Screenshot** – kirim URL → bot kirim screenshot halaman.
- **QR Generator** – kirim teks/link → jadi QR code.
- **Media Compressor** – kompres foto atau video (tanpa kehilangan kualitas parah).

---

### 🎥 Downloader
- **YouTube Downloader (audio/video)**  
  Format otomatis sesuai durasi & ukuran.
- **Instagram Reels Downloader**  
  Cukup kirim link Reels.
- **TikTok Downloader (no watermark)**  
  Auto detect link TikTok dari chat.
- **Twitter/X Downloader**  
  Kirim link → dapet video/gambar dari post.

---

### 📜 Utility
- **Text to Image** – ubah teks jadi gambar aesthetic.
- **Text Tools**  
  - upper/lowercase converter  
  - reverse text  
  - random case  
  - text emoji generator
- **Weather / Cuaca** – cek cuaca kota tertentu.
- **Shortlink** – convert link panjang jadi pendek.
- **Time / Date Info** – waktu & tanggal realtime.

---

### 😂 Fun & Random
- **Meme Generator** – kirim teks atas & bawah ke gambar → jadi meme.
- **Random Quotes / Pickup Lines** – biar chat gak garing.
- **Rate Command** – contoh: `!rate <nama>` → bot kasih rating acak (1–100%).
- **Coin Flip / Dice Roll** – lempar koin atau dadu virtual.
- **Roast Generator** – kirim nama → bot auto nyindir.
- **Truth or Dare** – main bareng teman di grup.

---

### 👥 Grup Management
- **Welcome / Goodbye Message**
- **Anti Link (optional toggle)**
- **Tag All** – mention semua member.
- **Promote / Demote / Kick** – admin tools.
- **Group Info / Stats**

---

### ⚙️ Developer & Owner Commands
- **Eval / Run JS** – eksekusi kode JavaScript langsung dari chat.
- **Restart Bot**
- **Broadcast Message**
- **System Info** – uptime, RAM, CPU usage, dsb.

---

## 💡 Ide Fitur Tambahan (WIP / Opsional)
> Buat pengembangan ke depan

| Kategori | Ide Fitur | Deskripsi |
|-----------|------------|-----------|
| Utility | File to Link | Upload file ke temporary file host |
| Utility | Poll / Voting | Bikin polling di grup |
| Fun | “Would You Rather” | Random pertanyaan lucu |
| Fun | Reaction GIF | Kirim GIF lucu sesuai keyword |
| Productivity | Note / Reminder | Simpan catatan pribadi via chat |
| Productivity | Todo List | Buat daftar tugas harian |
| Fun | Chat XP Leveling | Member aktif dapet XP & rank |
| Media | Text to Speech (TTS) | Ubah teks jadi suara |
| Media | Voice to Text (STT) | Transkrip suara ke teks |
| Fun | Mini Games | Tebak gambar, angka, tebak kata |
| Misc | Auto Reply | Set custom trigger → auto balas teks tertentu |

---

## 🧩 Teknologi
- **[Baileys](https://github.com/adiwajshing/Baileys)** – WhatsApp Web API
- **TypeScript** – untuk type safety dan maintainability
- **Node.js** – runtime utama
- **Sharp** – untuk image processing
- **Ytdl-core / Tiktok-scraper / Instagram-scraper** – downloader tools
- **Moment.js / Day.js** – waktu & tanggal

---

## 📦 Struktur Modular
```

src/
├── commands/
│   ├── sticker.ts
│   ├── download.ts
│   ├── fun.ts
│   ├── group.ts
│   └── utils.ts
├── handlers/
│   ├── message.ts
│   ├── group.ts
│   └── events.ts
├── lib/
│   ├── baileys.ts
│   └── helper.ts
└── index.ts

```

---

## 🪄 Rencana Ke Depan
- Integrasi fitur AI untuk variasi respon chat (misal auto reply human-like)
- Sistem plugin agar developer lain bisa nambah fitur tanpa ubah core
- Dashboard web untuk monitoring & konfigurasi bot
- Mode multi-device (owner bisa login beberapa akun sekaligus)

---

## 🧠 Insight
Kalau kamu mau bot-nya tetap “fun tapi useful”, fokus ke:
1. **Media Tools** — karena 90% user kirim foto/video.
2. **Downloader** — ini fitur paling sering dipakai.
3. **Funny Commands** — biar engagement tinggi di grup.
4. **Utility ringan** — QR, text tools, shortlink.
5. **Group control** — biar admin grup senang pakai bot.

---

## 📄 Lisensi
MIT © 2025 lukixv
