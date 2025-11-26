export * from "./env"

export const SystemMessage = {
	// A. Permissions & Access
	admin: "Perintah ini hanya dapat digunakan oleh admin grup.",
	botAdmin: "Bot belum memiliki izin admin di grup ini.",
	owner: "Perintah ini hanya dapat digunakan oleh pemilik bot.",
	group: "Perintah ini hanya dapat digunakan di dalam grup.",
	private: "Perintah ini hanya dapat digunakan di obrolan pribadi.",
	premium: "Anda belum memiliki akses premium.",
	restrict: "Perintah ini sedang dibatasi di grup ini.",

	// B. Status & System
	wait: "Mohon tunggu sebentar.",
	success: "Perintah berhasil diproses.",
	done: "Tugas selesai diproses.",
	error: "Terjadi kesalahan saat memproses perintah.",
	maintenance: "Layanan sedang dalam perawatan. Silakan coba kembali nanti.",
	overload: "Server sedang sibuk. Silakan coba kembali dalam beberapa saat.",
	cooldown:
		"Anda sedang dalam masa cooldown. Silakan coba lagi setelah {timeleft}.",
	limitReached: "Anda telah mencapai batas penggunaan untuk saat ini.",
	tooMany: "Permintaan terlalu cepat. Mohon kurangi frekuensi perintah.",

	// C. Input Validation
	invalidUsage:
		"Format perintah tidak sesuai. Contoh: {prefix}{command} {args}",
	urlInvalid: "Tautan yang Anda berikan tidak valid.",
	notFound: "Data tidak ditemukan.",
	maxCharacter: "Teks melebihi batas maksimal {max_character} karakter.",

	// D. Media & File Handling
	processingMedia: "File sedang diproses. Mohon tunggu.",
	mediaTooLarge: "File terlalu besar untuk diproses.",
	unsupportedMedia: "Jenis file ini tidak didukung.",
	downloadFail: "Gagal mengunduh file.",
	uploadFail: "Gagal mengunggah file.",

	// E. Confirmation & Flow Control
	needConfirm: "Apakah Anda yakin ingin melanjutkan?",
	cancelled: "Perintah telah dibatalkan.",
	alreadyDone: "Tindakan ini sudah dilakukan sebelumnya.",
	nothingToDo: "Tidak ada tindakan yang perlu dilakukan.",

	// F. User & Chat Experience
	banned: "Anda telah diblokir dari layanan bot ini.",
	helloUser: "Halo, ada yang bisa dibantu?",
	welcome: "Bot berhasil ditambahkan ke grup ini.",
	goodbye: "Bot telah keluar dari grup.",
	farewell: "Terima kasih. Sampai jumpa kembali.",

	// G. Misc Utilities
	gamerestrict: "Fitur permainan sedang dinonaktifkan di grup ini.",
	note: "Catatan: Pastikan Anda mengikuti pedoman penggunaan bot.",
	footer: "© Sistem Bot",
	readmore: "\u200E".repeat(4001),
}
