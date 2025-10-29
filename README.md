# Bot WhatsApp Modular

Bot WhatsApp ini menggunakan [Zaileys](https://github.com/zeative/zaileys) dan dirancang dengan arsitektur modular, sehingga Anda dapat dengan mudah menambah atau menghapus perintah.

## Fitur

- **Struktur Modular**: Setiap perintah berada di filenya sendiri dalam direktori `src/commands`.
- **Command Loader Dinamis**: Bot secara otomatis memuat semua perintah yang ada di direktori `src/commands` saat dijalankan.
- **Konfigurasi Terpusat**: Pengaturan utama bot (seperti nomor telepon dan metode autentikasi) berada di `src/core/client.ts`.
- **Tipe Perintah**: Struktur perintah yang konsisten dijamin oleh interface `Command` di `src/types.ts`.
- **Fitur Bawaan Zaileys**: Dilengkapi dengan fitur anti-spam, auto-online, auto-read, dan auto-reject-call.

## Cara Menambah Perintah Baru

Untuk menambahkan perintah baru, ikuti langkah-langkah berikut:

1.  **Buat File Baru**: Buat file baru di dalam direktori `src/commands`. Nama filenya bisa apa saja, misalnya `mycommand.ts`.

2.  **Isi File Perintah**: Salin dan tempel struktur di bawah ini ke dalam file baru Anda dan sesuaikan.

    ```typescript
    import { Command } from "../types";
    import { wa } from "../core/client";

    const command: Command = {
      // Nama perintah yang akan dipanggil (contoh: !mycommand)
      name: "mycommand",
      
      // Deskripsi singkat tentang apa yang dilakukan perintah ini
      description: "Deskripsi perintah Anda.",

      // Fungsi yang akan dieksekusi ketika perintah dipanggil
      execute: (ctx, args) => {
        // Tulis logika perintah Anda di sini
        wa.reply("Perintah baru berhasil dijalankan!");
      },
    };

    export default command;
    ```

3.  **Selesai!**: Tidak perlu melakukan apa-apa lagi. Bot akan secara otomatis memuat perintah baru Anda saat dijalankan kembali.

## Menjalankan Bot

Pastikan Anda sudah menginstal dependensi dengan `pnpm install`. Untuk menjalankan bot, gunakan perintah:

```bash
npm start
```
