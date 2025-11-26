// app.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bot = require('./bot');

const app = express();
app.use(express.json());

const ROLE = process.env.ROLE || 'PRIMARY'; // PRIMARY atau BACKUP
const PORT = process.env.PORT || 3000;
const TIMEOUT_MS = 3000; // Timeout request

// ==========================================
// LOGIKA SERVER 1 (PRIMARY)
// ==========================================
if (ROLE === 'PRIMARY') {
  const BACKUP_URL = process.env.BACKUP_URL || 'http://localhost:3001';

  // 1. Endpoint Health Check
  app.get('/status', (req, res) => {
    res.status(200).json({ status: 'UP', role: 'PRIMARY' });
  });

  // 2. Recovery Mechanism (Saat S1 Booting)
  const performRecovery = async () => {
    console.log('🔄 [S1] Recovery Mode: Mencoba mengambil alih kontrol...');
    try {
      // Kirim perintah matikan bot ke S2
      const response = await axios.post(`${BACKUP_URL}/disable-bot`, {}, { timeout: TIMEOUT_MS });
      
      if (response.data.botStopped) {
        console.log('✅ [S1] Konfirmasi S2: Bot dimatikan.');
      }
    } catch (error) {
      console.log('⚠️ [S1] Gagal menghubungi S2 (mungkin S2 mati). Melanjutkan start bot.');
    }

    // Start Bot Utama
    bot.start();
    console.log('📢 [S1] Notifikasi: Server 1 Online Kembali.');
  };

  // Jalankan recovery saat server nyala
  performRecovery();
}

// ==========================================
// LOGIKA SERVER 2 (BACKUP)
// ==========================================
else if (ROLE === 'BACKUP') {
  const PRIMARY_URL = process.env.PRIMARY_URL || 'http://localhost:3000';
  const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 5000;
  let isPrimaryDown = false;

  // 1. Endpoint untuk menerima perintah matikan bot dari S1
  app.post('/disable-bot', (req, res) => {
    console.log('📩 [S2] Menerima perintah recovery dari S1.');
    bot.stop();
    isPrimaryDown = false; // Reset status karena S1 sudah kembali
    res.json({ botStopped: true });
  });

  // 2. Health Checker Loop
  setInterval(async () => {
    try {
      // Ping S1
      await axios.get(`${PRIMARY_URL}/status`, { timeout: TIMEOUT_MS });
      
      // Jika S1 Responsif:
      if (isPrimaryDown) {
        console.log('✅ [S2] S1 terdeteksi UP kembali (Menunggu perintah recovery manual dari S1).');
        isPrimaryDown = false; 
        // Jangan matikan bot di sini, tunggu request /disable-bot dari S1 agar session aman
      } else {
        // Normal state: pastikan bot mati
        if (bot.getStatus()) {
            console.log('⚠️ [S2] Anomaly: S1 Hidup tapi Bot S2 jalan. Mematikan Bot S2...');
            bot.stop();
        }
      }

    } catch (error) {
      // Jika S1 Down (Timeout/Error)
      if (!isPrimaryDown) {
        console.log(`❌ [S2] FAILOVER TRIGGERED! S1 Down (${error.message})`);
        isPrimaryDown = true;
        
        // Aktifkan Failover
        bot.start();
        console.log('📢 [S2] Mengirim notifikasi: "Server 1 Down. Server 2 mengambil alih"');
      }
    }
  }, CHECK_INTERVAL);
}

// Start Server API
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan sebagai [${ROLE}] di port ${PORT}`);
});

