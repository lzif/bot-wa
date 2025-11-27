# Tools

This document provides an overview of the exported functions from the files in the `src/tools` directory.

## `ai.ts`

This module provides an interface to the Google Gemini AI model.

### `ai`

An instance of the `GeminiService` class.

#### Methods

-   **`akari(input: string): Promise<string>`**
    -   Generates a chat response in the persona of Akari Mizuno.
    -   **Parameters:**
        -   `input` (string): The user's message.
    -   **Returns:** A `Promise` that resolves to the generated response.

-   **`text(prompt: string): Promise<string>`**
    -   Generates a general text response.
    -   **Parameters:**
        -   `prompt` (string): The input prompt.
    -   **Returns:** A `Promise` that resolves to the generated text.

-   **`audio(text: string): Promise<Buffer | null>`**
    -   Converts text to speech and returns the audio as a Buffer.
    -   **Parameters:**
        -   `text` (string): The text to convert.
    -   **Returns:** A `Promise` that resolves to a `Buffer` containing the audio data, or `null` if an error occurs.

## `api.ts`

This module provides a unified interface for making API requests.

### `APIs`

An object containing the base URLs and optional API keys for various services.

### `request(method: Method, url: string, body?: any, headers?: any): Promise<any>`

-   **Description:** A wrapper around the `fetch` API to handle different response types.
-   **Parameters:**
    -   `method` (string): The HTTP method ('GET', 'POST', etc.).
    -   `url` (string): The request URL.
    -   `body` (any, optional): The request body.
    -   `headers` (any, optional): Additional request headers.
-   **Returns:** A `Promise` that resolves to the response data, which can be JSON, a Buffer, or text.

### `api`

An object that provides a convenient way to make requests to the services defined in `APIs`. Each key in the `api` object corresponds to a key in `APIs` and provides methods for `get`, `post`, `put`, `patch`, and `delete`.

## `cache.ts`

This module provides a persistent cache implementation.

### `PersistentCache<T>`

A class that implements a simple key-value cache that persists to a file.

#### `constructor(filename: string)`

-   **Parameters:**
    -   `filename` (string): The name of the file to use for persistence.

#### Methods

-   **`get(key: string): T | undefined`**
    -   Retrieves a value from the cache.
    -   **Parameters:**
        -   `key` (string): The cache key.
    -   **Returns:** The cached value, or `undefined` if the key is not found.

-   **`set(key: string, value: T): void`**
    -   Sets a value in the cache.
    -   **Parameters:**
        -   `key` (string): The cache key.
        -   `value` (T): The value to cache.

-   **`delete(key: string): void`**
    -   Deletes a value from the cache.
    -   **Parameters:**
        -   `key` (string): The cache key.

-   **`clear(): void`**
    -   Clears the entire cache.

## `command.ts`

This module provides utility functions for working with commands.

### `generateUID(id: string, botName?: string, withBotName = true): string | null`

-   **Description:** Generates a unique ID from a string.
-   **Parameters:**
    -   `id` (string): The string to hash.
    -   `botName` (string, optional): The name of the bot.
    -   `withBotName` (boolean, optional): Whether to include the bot's name in the UID.
-   **Returns:** The generated UID, or `null` if the input `id` is falsy.

### `getRandomElement<T>(array: T[]): T | null`

-   **Description:** Selects a random element from an array.
-   **Parameters:**
    -   `array` (T[]): The input array.
-   **Returns:** A random element from the array, or `null` if the array is empty.

### `isCmd(content: string | null | undefined, ctxBot: { prefix: string; cmd: Map<string, any> }): object | false`

-   **Description:** Checks if a string is a valid command.
-   **Parameters:**
    -   `content` (string): The string to check.
    -   `ctxBot` (object): An object containing the bot's prefix and command map.
-   **Returns:** An object with command details if it's a valid command, otherwise `false`.

### `isUrl(url: string | null | undefined): boolean`

-   **Description:** A simple URL detector.
-   **Parameters:**
    -   `url` (string): The string to check.
-   **Returns:** `true` if the string is a URL, otherwise `false`.

### `parseFlag(argsString: string | null | undefined, customRules?: object): object`

-   **Description:** Parses command-line style flags from a string.
-   **Parameters:**
    -   `argsString` (string): The string of arguments.
    -   `customRules` (object, optional): An object defining custom parsing rules.
-   **Returns:** An object containing the parsed flags and the remaining input.

### `findClosest(word: string, list: string[]): string | null`

-   **Description:** Finds the closest match for a word in a list of strings.
-   **Parameters:**
    -   `word` (string): The word to match.
    -   `list` (string[]): The list of strings to search in.
-   **Returns:** The closest matching string, or `null` if no close match is found.

## `media.ts`

This module provides utility functions for working with media.

### `messageTypeFromBuffer(buffer: any): Promise<"image" | "video" | "audio" | null>`

-   **Description:** Determines the message type from a buffer.
-   **Parameters:**
    -   `buffer` (any): The input buffer.
-   **Returns:** A `Promise` that resolves to the message type ('image', 'video', 'audio'), or `null` if the type cannot be determined.

### `checkMedia(type: string | undefined | null, required: MediaType | MediaType[]): MediaType | false`

-   **Description:** Checks if the given message type matches the required media type(s).
-   **Parameters:**
    -   `type` (string): The message type to check.
    -   `required` (MediaType | MediaType[]): The required media type or an array of required types.
-   **Returns:** The matched media type if it's valid, otherwise `false`.

## `message.ts`

This module provides utility functions for generating and formatting messages.

### `generateMessage(key: keyof typeof SystemMessage, opts?: GenerateMessageOptions): string`

-   **Description:** Generates a system message from a predefined key.
-   **Parameters:**
    -   `key` (string): The key of the system message.
    -   `opts` (object, optional): Options to replace placeholders in the message.
-   **Returns:** The generated message string.

### `convertMsToDuration(ms: number): string`

-   **Description:** Converts milliseconds to a human-readable duration string.
-   **Parameters:**
    -   `ms` (number): The duration in milliseconds.
-   **Returns:** The formatted duration string.

### `formatSize(byteCount: number, withPerSecond = false): string`

-   **Description:** Formats a byte count into a human-readable string.
-   **Parameters:**
    -   `byteCount` (number): The number of bytes.
    -   `withPerSecond` (boolean, optional): Whether to append "/s" to the output.
-   **Returns:** The formatted size string.

### `generateCmdExample(used: UsedCommand | undefined, args: string | undefined): string`

-   **Description:** Generates a command example string.
-   **Parameters:**
    -   `used` (object): An object containing the used prefix and command.
    -   `args` (string): The arguments for the command.
-   **Returns:** The formatted example string.

### `generateInstruction(actions: Array<"send" | "reply"> | undefined, mediaTypes: string | string[] | undefined): string`

-   **Description:** Generates an instruction message for the user.
-   **Parameters:**
    -   `actions` (string[]): The required actions ('send' or 'reply').
    -   `mediaTypes` (string | string[]): The required media types.
-   **Returns:** The formatted instruction string.

### `generateFlagInfo(flags: Record<string, string> | undefined): string`

-   **Description:** Generates a formatted string of flag information.
-   **Parameters:**
    -   `flags` (object): An object where keys are flags and values are descriptions.
-   **Returns:** The formatted flag information.

### `generateNotes(notes: string[] | undefined): string`

-   **Description:** Generates a formatted string of notes.
-   **Parameters:**
    -   `notes` (string[]): An array of notes.
-   **Returns:** The formatted notes.

### `ucwords(text: string | null | undefined): string | null`

-   **Description:** Converts the first character of each word in a string to uppercase.
-   **Parameters:**
    -   `text` (string): The input string.
-   **Returns:** The capitalized string, or `null` if the input is falsy.

### `info(text: string): string`

-   **Description:** Wraps a message with an info icon.
-   **Parameters:**
    -   `text` (string): The message text.
-   **Returns:** The formatted message.

### `error(text: string): string`

-   **Description:** Wraps a message with an error icon.
-   **Parameters:**
    -   `text` (string): The message text.
-   **Returns:** The formatted message.

### `success(text: string): string`

-   **Description:** Wraps a message with a success icon.
-   **Parameters:**
    -   `text` (string): The message text.
-   **Returns:** The formatted message.

### `list(title: string, items: string[]): string`

-   **Description:** Creates a formatted list with a title.
-   **Parameters:**
    -   `title` (string): The title of the list.
    -   `items` (string[]): An array of list items.
-   **Returns:** The formatted list.

## `parseArgs.ts`

This module provides an advanced argument parser that can infer TypeScript types from a schema string.

### `InferArgs<S extends string>`

A generic type that infers the shape of the parsed arguments object based on a schema string.

### `defaultValidators: Record<string, ValidatorFn>`

An object containing default validation functions for common types like `string`, `number`, `boolean`, `url`, etc.

### `parseArgs<Schema extends string>(rawArgs: string[], schemaString: Schema, customValidators?: Record<string, ValidatorFn>): InferArgs<Schema>`

-   **Description:** Parses an array of raw arguments based on a schema string.
-   **Parameters:**
    -   `rawArgs` (string[]): The array of arguments to parse.
    -   `schemaString` (string): A string that defines the expected arguments, their types, and whether they are optional.
    -   `customValidators` (object, optional): An object containing custom validation functions.
-   **Returns:** An object with the parsed arguments, typed according to the schema.

## `sticker.ts`

This module provides a function for creating stickers from various inputs.

### `createSticker(input: string | Buffer, author?: string, pack?: string): Promise<Buffer>`

-   **Description:** Creates a sticker from an image, video, SVG, or URL.
-   **Parameters:**
    -   `input` (string | Buffer): The input data. This can be a Buffer, a URL, a file path, or an SVG string.
    -   `author` (string, optional): The author of the sticker pack.
    -   `pack` (string, optional): The name of the sticker pack.
-   **Returns:** A `Promise` that resolves to a `Buffer` containing the sticker data in WebP format.

## `systemMessage.ts`

This module provides a collection of predefined system messages.

### `SystemMessage`

An object containing a key-value mapping of system message identifiers to their corresponding text.

## `unify.ts`

This module provides a function for fetching data from multiple API candidates and unifying the results.

### `unify<T>(candidates: ApiCandidate[], schemaConfig: SchemaConfig): Promise<T>`

-   **Description:** Fetches data from a list of API candidates, determines the best one, and returns the data in a unified format.
-   **Parameters:**
    -   `candidates` (ApiCandidate[]): An array of API candidates to race.
    -   `schemaConfig` (SchemaConfig): The schema to validate and structure the final data.
-   **Returns:** A `Promise` that resolves to the unified data, typed according to the schema.
