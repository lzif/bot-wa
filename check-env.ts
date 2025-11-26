import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import sharp from "sharp";

console.log("🔍 Checking Environment Capabilities...\n");

// 1. CEK SHARP (Untuk Gambar Statis)
console.log("--- SHARP (Static Images) ---");
try {
    const format = sharp.format;
    if (format.webp && format.webp.output.file) {
        console.log("✅ Sharp supports WebP output.");
    } else {
        console.error("❌ Sharp DOES NOT support WebP output. Reinstall sharp.");
    }
} catch (e) {
    console.error("❌ Sharp check failed:", e);
}

// 2. CEK FFMPEG-STATIC (Untuk Video/GIF)
console.log("\n--- FFMPEG (Video/Animation) ---");
if (!ffmpegPath) {
    console.error("❌ ffmpeg-static binary not found!");
} else {
    console.log(`Binary Path: ${ffmpegPath}`);
    
    // Jalankan ffmpeg -encoders dan cari 'libwebp'
    const ffmpeg = spawn(ffmpegPath, ["-encoders"]);
    let output = "";

    ffmpeg.stdout.on("data", (data) => { output += data.toString(); });
    ffmpeg.stderr.on("data", (data) => { output += data.toString(); }); // ffmpeg sering output info di stderr

    ffmpeg.on("close", (code) => {
        const supportsWebP = output.includes("libwebp");
       console.log(output) 
        if (supportsWebP) {
            console.log("✅ FFMPEG supports 'libwebp' (WebP Encoder).");
        } else {
            console.error("❌ FFMPEG binary found, but 'libwebp' encoder is MISSING.");
            console.log("Suggestion: Try installing system ffmpeg or check ffmpeg-static version.");
        }

        // Cek encoder lain jika penasaran (opsional)
        // console.log("Support x264?", output.includes("libx264"));
    });
}

