# WhatsApp Bot Project Context

## Project Overview

This is a multifunctional WhatsApp bot built with Node.js and TypeScript, utilizing the Baileys library for WhatsApp Web API integration. The bot focuses on providing a wide range of features including media tools, downloaders, utilities, fun commands, group management, and AI-powered interactions. It's designed to be fast, modular, and functional in both group chats and private conversations.

### Key Technologies
- **Runtime**: Node.js
- **Language**: TypeScript
- **WhatsApp API**: [Baileys](https://github.com/adiwajshing/Baileys) via `@whiskeysockets/baileys`
- **Framework**: `@mengkodingan/ckptw` (custom WhatsApp bot framework)
- **Database**: Xata (PostgreSQL-based cloud database)
- **AI Integration**: Google Gemini API for AI responses
- **Image Processing**: Sharp library
- **Audio/Video Processing**: FFmpeg
- **Code Quality**: Biome linter/formatter

## Architecture & Structure

The project follows a modular architecture with clearly defined components:

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
├── index.ts               # Main application entry point
└── ...
```

## Building and Running

### Prerequisites
- Node.js (version compatible with package.json)
- PNPM package manager (as specified in package.json)
- Google Gemini API key
- Xata database URL
- Phone number for WhatsApp authentication

### Setup Commands
```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run in development mode (with TypeScript watching)
pnpm run dev

# Start the built application
pnpm run start

# Format code with Biome
pnpm run format

# Run code checks with Biome
pnpm run check
```

### Environment Variables
The bot requires the following environment variables in a `.env` file:
- `PHONE`: Phone number for the bot
- `DB_URL`: Xata database URL for session storage
- `GEMINI_API_KEY`: Google Gemini API key for AI features

## Development Conventions

### Code Style
- Uses Biome for formatting and linting (see `biome.json`)
- TypeScript with strict typing where possible
- ES2022 target with CommonJS modules
- Semicolons are generally omitted (as per biome config)

### Command Structure
Commands follow the pattern:
```typescript
module.exports = {
  name: "command_name",
  code: async (ctx: Ctx) => {
    // Command implementation
    ctx.reply("response");
  },
}
```

### Global Variables
The project uses global variables for configuration and tools:
- `config` - Contains environment variables and system messages
- `tools` - Contains various utility functions including AI, media processing, etc.

### AI Personality
The bot incorporates an AI personality named "Akari Mizuno" with specific characteristics:
- Age: 18, speaks Indonesian & Javanese
- Personality: Energetic, confident, playful, and slightly mischievous
- Appearance: White hair with red streaks, red eyes, distinctive style
- Behavior: Maintains human-like conversation, adjusts tone based on context

## Key Features

### Media Tools
- Image to Sticker conversion and vice versa
- Web Screenshot capture
- QR Code generation
- Media compression

### Downloaders
- YouTube audio/video downloader
- Instagram Reels downloader
- TikTok downloader (no watermark)
- Twitter/X media downloader

### Utility Functions
- Text to Image generation
- Text transformations (uppercase/lowercase, reverse, random case)
- Weather information
- URL shortening
- Time/date information

### Fun & Interactive
- Meme generator
- Random quotes and pickup lines
- Rating system
- Coin flip and dice roll
- Roast generator
- Truth or Dare

### Group Management
- Welcome/goodbye messages
- Anti-link protection
- Tag all members feature
- Admin tools (promote/demote/kick)
- Group information and statistics

### Developer Commands
- JavaScript code execution
- Bot restart functionality
- Broadcast messages
- System information (uptime, resource usage)

## Database Integration

The project uses Xata as a cloud database with PostgreSQL backend:
- Session management for WhatsApp authentication
- Group information storage
- Automatically generated database client in `xata.ts`

## AI Integration

The bot leverages Google's Gemini AI with a detailed personality prompt:
- Uses `gemini-flash-lite-latest` model
- Temperature setting of 0.7 for creative responses
- Custom system instruction defining the "Akari Mizuno" personality
- Image processing capabilities with 1K image size

## File Processing

The bot handles various media types with:
- Sharp library for image processing
- FFmpeg for audio/video processing
- Support for WebP, PNG, JPG formats
- File size validation and compression