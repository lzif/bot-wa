# WhatsApp Bot Project

A multifunctional WhatsApp bot built with **Node.js**, **TypeScript**, and **Baileys**. Designed to be fast, modular, and functional for both group chats and private conversations.

## 🚀 Features

### 🖼️ Media Tools
- **Convert Image to Sticker** – Send image → convert to sticker.
- **Sticker to Image** – Convert sticker back to image file.
- **Web Screenshot** – Send URL → bot sends screenshot of the page.
- **QR Generator** – Send text/link → generate QR code.
- **Media Compressor** – Compress photo or video (without severe quality loss).

### 🎥 Downloader
- **YouTube Downloader (audio/video)** – Auto-format based on duration & size.
- **Instagram Reels Downloader** – Just send the Reels link.
- **TikTok Downloader (no watermark)** – Auto-detect TikTok links from chat.
- **Twitter/X Downloader** – Send link → get video/image from post.

### 📜 Utility
- **Text to Image** – Convert text to aesthetic images.
- **Text Tools** – Upper/lowercase, reverse, random case, text emoji generator.
- **Weather** – Check weather for a specific city.
- **Shortlink** – Convert long links to short ones.
- **Time / Date Info** – Realtime time & date.

### 😂 Fun & Random
- **Meme Generator** – Send top & bottom text with image → create meme.
- **Random Quotes / Pickup Lines** – To keep the chat lively.
- **Rate Command** – Example: `!rate <name>` → bot gives random rating (1–100%).
- **Coin Flip / Dice Roll** – Virtual coin flip or dice roll.
- **Roast Generator** – Send name → bot automatically roasts.
- **Truth or Dare** – Play with friends in groups.

### 👥 Group Management
- **Welcome / Goodbye Message**
- **Anti Link (optional toggle)**
- **Tag All** – Mention all members.
- **Promote / Demote / Kick** – Admin tools.
- **Group Info / Stats**

### ⚙️ Developer & Owner Commands
- **Eval / Run JS** – Execute JavaScript code directly from chat.
- **Restart Bot**
- **Broadcast Message**
- **System Info** – Uptime, RAM, CPU usage, etc.

---

## 🛠️ Architecture & Tech Stack

The project follows a modular architecture with clearly defined components:

- **Runtime**: Node.js
- **Language**: TypeScript
- **WhatsApp API**: [Baileys](https://github.com/adiwajshing/Baileys) via `@whiskeysockets/baileys`
- **Framework**: `@mengkodingan/ckptw` (custom WhatsApp bot framework)
- **Database**: Xata (PostgreSQL-based cloud database)
- **AI Integration**: Google Gemini API for AI responses
- **Image Processing**: Sharp library
- **Audio/Video Processing**: FFmpeg
- **Code Quality**: Biome linter/formatter

### Project Structure
```
src/
├── commands/              # Command handlers organized by category
│   ├── converter/         # Media conversion commands (sticker, etc.)
│   ├── tool/              # Utility commands
│   ├── group/             # Group management commands
│   ├── info/              # Information commands
│   └── ...                # Other command categories
├── handlers/              # Event handlers for messages, groups, etc.
├── tools/                 # Utility functions and AI integration
│   ├── ai/                # AI message generation
│   ├── media/             # Media processing utilities
│   ├── api/               # API integrations
│   └── ...                # Other tool categories
├── types/                 # TypeScript type definitions
├── config/                # Configuration and environment variables
├── lib/                   # Core library functions
├── xata.ts                # Generated Xata database client
├── globals.d.ts           # Global type declarations
├── setup-global.ts        # Global variable setup
└── index.ts               # Main application entry point
```

---

## 📦 Getting Started

### Prerequisites
- **Node.js** (version compatible with `package.json`)
- **PNPM** package manager (recommended) or NPM
- **Google Gemini API Key** (for AI features)
- **Xata Database URL** (for session and data storage)
- **WhatsApp Account** (Phone number for authentication)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root directory.
2.  Add the required environment variables:
    ```env
    PHONE=628xxxxxxxxxx      # Phone number for the bot
    DB_URL=https://...       # Xata database URL
    GEMINI_API_KEY=AIza...   # Google Gemini API key
    ```

### Usage

1.  **Build the project:**
    ```bash
    pnpm run build
    ```

2.  **Start the application:**
    ```bash
    pnpm run start
    ```

3.  **Development Mode (Hot Reload):**
    ```bash
    pnpm run dev
    ```

### Code Quality Tools
- **Format code:** `pnpm run format`
- **Run checks:** `pnpm run check`

---

## 📚 Documentation

For developers looking to extend or modify the bot, detailed documentation is available in the `docs/` directory:

-   **[Advice for New Developers](docs/advice.md)** – Best practices and tips.
-   **[Adding New Commands](docs/commands.md)** – Guide on creating and registering commands.
-   **[Global Variables](docs/globals.md)** – Understanding `config` and `tools`.
-   **[Tools & Utilities](docs/tools.md)** – Reference for helper functions (AI, media, etc.).
-   **[Type Definitions](docs/types.md)** – TypeScript interfaces and types.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature`.
3.  Commit your changes: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature`.
5.  Submit a pull request.

**Note:** This project uses Biome for linting and formatting. Please ensure your code passes checks before submitting.

---

## 📄 License

MIT © 2025 lukixv
