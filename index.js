// server.js
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Sesuaikan target file utama Anda di sini
const BUILD_CMD = 'npm run build';
const MAIN_FILE = 'app.js'; 
const SRC_DIR = path.join(__dirname, 'src'); // Folder yang dipantau
const ARGS = process.argv.slice(2);
const IS_DEV_MODE = ARGS.includes('--dev');

let p = null;

function build() {
  try {
    console.log('🔨 Compiling changes...');
    execSync(BUILD_CMD, { stdio: 'inherit' });
    console.log('✅ Build updated!');
    return true;
  } catch (error) {
    console.error('❌ Build failed.');
    return false;
  }
}

function start(file) {
  const childArgs = [path.join(__dirname, file), ...ARGS.filter(arg => arg !== '--dev')];
  
  // 
  console.log(`🚀 [LAUNCHER] Starting process: ${file}`);

  p = spawn(process.argv[0], childArgs, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  });

  // 
  p.on('message', data => {
    if (data === 'reset') {
      console.log('🔄 Restarting requested...');
      if (p) p.kill();
    }
  });

  // 
  p.on('exit', (code) => {
    console.error(`Process exited with code: ${code}`);
    p = null;
    
    // Auto-restart logic untuk Production agar Failover tetap jalan
    if (code !== 0 || IS_DEV_MODE) {
      console.log('🔄 Auto-restarting in 1s...');
      setTimeout(() => start(file), 1000);
    } else {
      console.log('🛑 Clean exit.');
    }
  });
}

function startWatch(file) {
  let debounceTimer;

  console.log(`👀 Watching ${SRC_DIR} | Hot-Reload active for 'command/'`);

  fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    if (!filename.endsWith('.ts') && !filename.endsWith('.js')) return;

    const normalizedPath = filename.replace(/\\/g, '/');

    const isHotReloadFile = normalizedPath.includes('command/');

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`📝 Change detected: ${filename}`);

      if (isHotReloadFile) {
        console.log('⚡ Hot Reload update (Silent Build)...');

        build();

        // Opsional: Jika bot Anda butuh trigger manual, kirim IPC message
        // if (p) p.send('reload-command');

      } else {
        console.log('♻️ Core update. Full Restart initiated...');
        isBuilding = true;

        if (p) p.kill(); // Matikan bot dulu

        const success = build(); // Build
        isBuilding = false;

        if (success) start(file); // Nyalakan lagi
      }
    }, 1000); // Delay 1 detik
  });
}

// Entry Point
if (IS_DEV_MODE) {
  console.log('🔧 MODE: DEVELOPMENT');
    if (build()) {
    start(MAIN_FILE);
    startWatch(MAIN_FILE);
  }
} else {
  console.log('⚡ MODE: PRODUCTION');
  start(MAIN_FILE);
}

