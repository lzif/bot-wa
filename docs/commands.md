# How to Add a New Command

This guide provides a high-level overview of the command structure and explains how to add new commands to the bot.

## Command Structure

Each command is a TypeScript file located in a subdirectory of `src/commands`. The command file must export an object that conforms to the `Command` interface, using `module.exports`.

### The `Command` Interface

The `Command` interface is defined in `src/types/commands.ts` and has the following properties:

-   **`name`** (string): The primary name of the command.
-   **`aliases`** (string[], optional): An array of alternative names for the command.
-   **`category`** (string): The category of the command. This should match the name of the directory the command is in.
-   **`description`** (string, optional): A brief description of the command, used for help menus.
-   **`cooldown`** (number, optional): The cooldown period for the command in seconds.
-   **`args`** (string[], optional): An array of strings describing the command's arguments.
-   **`ownerOnly`** (boolean, optional): If `true`, the command can only be used by the bot's owner.
-   **`adminOnly`** (boolean, optional): If `true`, the command can only be used by group admins.
-   **`groupOnly`** (boolean, optional): If `true`, the command can only be used in a group chat.
-   **`privateOnly`** (boolean, optional): If `true`, the command can only be used in a private chat.
-   **`code`** (async function): An asynchronous function that contains the command's logic. It receives a `ctx` object as its parameter, which provides the context of the command's execution.

For more details on these types, see the `docs/types.md` file.

### Example: `src/commands/downloader/ytmp3.ts`

```typescript
import { bold, italic } from "@mengkodingan/ckptw"
import type { Command, SchemaConfig } from "../../types"

const YTMP3Schema: SchemaConfig = {
	url: {
		description: "Link download video/lagu tanpa watermark (direct url)",
		type: "string"
	},
	title: {
		description: "Judul lagu/video",
		type: "string",
		optional: true
	},
	author: {
		description: "Nama creator / username",
		type: "string",
		optional: true
	},
};

type YTMP3Result = {
	url: string;
	title?: string | null;
	author?: string | null;
};

module.exports = {
	name: "ytmp3",
	aliases: ["yta", "ytaudio", "youtubeaudio"],
	category: "downloader",

	code: async (ctx) => {
		// ... command logic ...
	},
} as Command
```

### `module.exports`

It is crucial to use `module.exports` to export the command object, rather than ES6 `export default`. The bot's command handler is designed to dynamically import and register commands using `require()`, which relies on the CommonJS module system. Using `module.exports` ensures that your command is correctly loaded and made available to the bot.
