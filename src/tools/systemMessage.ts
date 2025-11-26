export const SystemMessage = {
	// A. Permissions
	admin: "Perintah ini hanya dapat digunakan oleh admin grup.",
	botAdmin: "Bot belum memiliki izin admin di grup ini.",
	owner: "Perintah ini hanya dapat digunakan oleh pemilik bot.",
	group: "Perintah ini hanya dapat digunakan di dalam grup.",
	private: "Perintah ini hanya dapat digunakan di obrolan pribadi.",
	premium: "Anda belum memiliki akses premium.",
	restrict: "Perintah ini sedang dibatasi di grup ini.",

	// B. Status
	wait: "Mohon tunggu sebentar.",
	success: "Perintah berhasil diproses.",
	done: "Tugas selesai diproses.",
	error: "Terjadi kesalahan saat memproses perintah.",
	maintenance: "Layanan sedang dalam perawatan.",
	overload: "Server sedang sibuk, coba kembali nanti.",
	cooldown: "Anda sedang dalam masa cooldown. Coba lagi setelah {timeleft}.",
	limitReached: "Anda telah mencapai batas penggunaan.",
	tooMany: "Permintaan terlalu cepat, kurangi frekuensi perintah.",

	// C. Input Validation
	invalidUsage: "Format perintah tidak sesuai.",
	urlInvalid: "Tautan yang Anda berikan tidak valid.",
	notFound: "Data tidak ditemukan.",
	maxCharacter: "Teks melebihi batas maksimal {max_character} karakter.",

	// D. Media
	processingMedia: "File sedang diproses.",
	mediaTooLarge: "File terlalu besar.",
	unsupportedMedia: "Jenis file tidak didukung.",
	downloadFail: "Gagal mengunduh file.",
	uploadFail: "Gagal mengunggah file.",

	// E. Flow Control
	needConfirm: "Apakah Anda yakin ingin melanjutkan?",
	cancelled: "Perintah telah dibatalkan.",
	alreadyDone: "Tindakan ini sudah dilakukan sebelumnya.",
	nothingToDo: "Tidak ada tindakan yang perlu dilakukan.",

	// F. User & Chat
	banned: "Anda telah diblokir dari layanan bot ini.",
	helloUser: "Halo, ada yang bisa dibantu?",
	welcome: "Bot berhasil ditambahkan ke grup.",
	goodbye: "Bot telah keluar dari grup.",
	farewell: "Terima kasih, sampai jumpa kembali.",

	// G. Misc
	gamerestrict: "Fitur permainan dinonaktifkan di grup ini.",
	note: "Pastikan Anda mengikuti pedoman penggunaan bot.",
	footer: "© Sistem Bot",
	readmore: "\u200E".repeat(4001),
}
