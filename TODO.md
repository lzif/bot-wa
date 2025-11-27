# TODO List - WhatsApp Bot 🤖

## Priority 1: Core Functionality

### Command Handler & Help System
- [x] Buat command `.help` untuk menampilkan daftar semua perintah (Implemented in `menu.ts`)
- [x] Buat command `.menu` dengan kategori-kategori perintah
- [ ] Implementasi sistem command listing otomatis
- [ ] Tambahkan deskripsi lengkap dan contoh penggunaan untuk setiap command

### Middleware System
- [ ] Implementasi middleware folder (saat ini kosong)
- [ ] Buat middleware untuk ownerOnly commands
- [ ] Buat middleware untuk adminOnly commands
- [ ] Buat middleware untuk groupOnly commands
- [ ] Tambahkan rate limiting system
- [ ] Implementasi cooldown system per command
- [ ] Tambahkan logging sistem untuk aktivitas command

### Error Handling
- [ ] Tambahkan error handling konsisten di semua command
- [ ] Implementasi global error handler
- [ ] Buat message template untuk berbagai jenis error
- [ ] Tambahkan fallback response saat API gagal

## Priority 2: Feature Implementation

### 📦 MEDIA
- [x] .sticker → Membuat stiker dari gambar
- [ ] .facebookdl / .fbdl → Download video dari Facebook
- [ ] .instagramdl / .igdl → Download media dari Instagram
- [ ] .play → Cari dan putar lagu dari YouTube
- [ ] .spotifydl → Download lagu dari Spotify
- [ ] .tiktokdl / .ttdl → Download video TikTok
- [x] .ytmp3 / .ytmp4 → Konversi YouTube ke MP3/MP4
- [ ] .pinterest → Cari dan ambil gambar dari Pinterest
- [ ] .smeme → Buat meme dengan teks custom
- [ ] .upload → Upload file ke server bot

### 🧰 UTILITAS
- [ ] .fetch → Ambil data dari URL
- [ ] .get → Ambil informasi dari link
- [ ] .hd → Tingkatkan resolusi gambar
- [ ] .lyric → Cari lirik lagu
- [ ] .node → Jalankan kode Node.js sederhana
- [ ] .ocr → Ekstrak teks dari gambar
- [ ] .rmbg → Hapus background dari gambar
- [ ] .screenshot → Screenshot halaman web
- [ ] .shorturl → Buat link pendek
- [ ] .translate → Terjemahkan teks
- [ ] .whatanime → Cari judul anime dari screenshot
- [ ] .whatmusic → Identifikasi lagu dari audio

### 🔧 ADMIN
- [ ] .hidetag → Mention semua anggota tanpa terlihat
- [ ] .intro → Kirim pesan perkenalan bot
- [ ] .link → Ambil link grup
- [ ] .mute / .unmute → Nonaktifkan/aktifkan chat grup
- [ ] .warning / .unwarning → Tambah/hapus peringatan ke user
- [ ] .setwarnlimit → Atur batas peringatan
- [ ] .settext → Ubah teks default bot
- [x] .tagall → Mention semua anggota grup
- [ ] .topsider → Lihat daftar user paling pasif
- [ ] .topyapping → Lihat daftar user paling banyak chat

### ℹ️ INFO
- [ ] .about → Info tentang bot
- [ ] .help → Daftar bantuan command (Handled by .menu)
- [x] .menu → Menu utama bot
- [x] .ping → Cek respon bot
- [x] .speedtest → Tes kecepatan internet
- [x] .uptime → Lihat lama bot aktif
- [x] .server → Info server (Added from src)
- [x] .listapi → List API (Added from src)

### 🎮 GAME
- [ ] .tebakgambar → Game tebak gambar
- [ ] .ttslontong → Game teka-teki ala lontong
- [x] .truthOrDare → Truth or Dare game (Added from src)

### 🤖 AI
- [ ] .ai → Tanya AI untuk jawaban umum
- [ ] .rewrite → Rewrite teks dengan gaya berbeda
- [ ] .summarize → Ringkas teks panjang
- [ ] .idea → Generate ide kreatif

### 🏆 LEVEL
- [ ] .rank → Lihat rank user
- [ ] .leaderboard → Lihat papan skor grup
- [ ] .xpinfo → Info XP user

## Priority 3: Advanced Features

### Database Integration
- [ ] Gunakan Xata database untuk menyimpan:
  - Group settings (antilink, welcome message, dll)
  - User profiles (XP, rank, dll)
  - Blacklist users
  - Custom commands
- [ ] Implementasi caching untuk performa lebih baik

### Configuration System
- [ ] Buat sistem konfigurasi grup (toggle fitur)
- [ ] Implementasi prefix system yang bisa diubah per grup
- [ ] Tambahkan sistem custom response
- [ ] Buat owner dashboard (web interface)

## Priority 4: Quality & Maintenance

### Testing
- [ ] Tambahkan unit testing untuk command penting
- [ ] Implementasi integration testing
- [ ] Buat test untuk error handling

### Documentation
- [ ] Update README.md dengan daftar command lengkap
- [ ] Tambahkan dokumentasi untuk developer
- [ ] Buat contoh penggunaan untuk setiap command

### Performance
- [ ] Optimasi image processing (sharp)
- [ ] Tambahkan caching untuk API calls
- [ ] Monitor memory usage dan implementasi garbage collection

### Security
- [ ] Validasi input dari pengguna
- [ ] Prevent command injection
- [ ] Tambahkan permission system yang lebih detil

## Priority 5: Future Enhancements

### Education Commands (Optional)
- [ ] .quiz → Generate kuis interaktif dari materi/dokumen
- [ ] .explain → Jelaskan konsep step-by-step (Study Mode)
- [ ] .progress → Cek progres belajar (jumlah soal benar/salah)
- [ ] .material → Ambil materi dari Google Drive/OneDrive
- [ ] .studygroup → Mode belajar bareng (grup diskusi + kuis)

### Productivity Commands (Optional)
- [ ] .meeting → Buat jadwal meeting (sinkronisasi Google Calendar)
- [ ] .reminder → Kirim pengingat otomatis untuk event/tugas
- [ ] .notes → Catat hasil meeting dan simpan ke Drive
- [ ] .assign → Assign tugas ke anggota tim
- [ ] .summary → Ringkasan progres harian/weekly tim

### Multi-Character AI
- [ ] Implementasi pilihan karakter AI lain selain Akari Mizuno
- [ ] Buat sistem character switching
- [ ] Tambahkan custom character creation

### Plugin System
- [ ] Buat sistem plugin agar developer lain bisa menambah fitur
- [ ] Implementasi hot-reload untuk plugin baru
- [ ] Buat marketplace plugin

### Web Dashboard
- [ ] Dashboard untuk monitoring bot
- [ ] Web interface untuk konfigurasi grup
- [ ] Analytics dan statistik penggunaan
- [ ] Log viewer

## Additional Feature Ideas (From Legacy README)

| Category | Feature | Description |
|-----------|------------|-----------|
| Utility | File to Link | Upload file to temporary file host |
| Utility | Poll / Voting | Create polls in groups |
| Fun | “Would You Rather” | Random funny questions |
| Fun | Reaction GIF | Send funny GIFs based on keywords |
| Productivity | Note / Reminder | Save personal notes via chat |
| Productivity | Todo List | Create daily to-do lists |
| Fun | Chat XP Leveling | Active members get XP & rank |
| Media | Text to Speech (TTS) | Convert text to speech |
| Media | Voice to Text (STT) | Transcribe voice to text |
| Fun | Mini Games | Guess the image, number, word guessing |
| Misc | Auto Reply | Set custom trigger → auto reply specific text |

## Project Insights (From Legacy README)
To keep the bot "fun but useful", focus on:
1. **Media Tools** — because 90% of users send photos/videos.
2. **Downloader** — this is the most frequently used feature.
3. **Funny Commands** — to keep engagement high in groups.
4. **Light Utilities** — QR, text tools, shortlink.
5. **Group Control** — so group admins enjoy using the bot.
