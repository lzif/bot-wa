const bot = require("./dist/index.js")

let isRunning = false;

module.exports = {
  start: () => {
    if (isRunning) {
      console.log('⚠️ [BOT] Bot sudah berjalan.');
      return;
    }
    console.log('🟢 [BOT] WhatsApp Bot STARTED...');
		bot.launch()
    isRunning = true;
  },
  
  stop: () => {
    if (!isRunning) return;
    console.log('🔴 [BOT] WhatsApp Bot STOPPED.');
    isRunning = false;
  },

  getStatus: () => isRunning
};

