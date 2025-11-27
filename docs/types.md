# Types and Interfaces

This document provides an overview of the custom types and interfaces used throughout the project, primarily located in the `src/types` directory.

## `commands.ts`

This module defines the structure of command objects.

### `CommandDetail`

An interface that defines the metadata for a command.

-   **`name`** (string): The primary name of the command (e.g., "sticker").
-   **`aliases`** (string[], optional): An array of alternative names for the command (e.g., `["s", "stiker"]`).
-   **`description`** (string, optional): A brief description of the command, used for help menus.
-   **`category`** (string, optional): The category the command belongs to (e.g., "MEDIA", "UTIL").
-   **`cooldown`** (number, optional): The cooldown period for the command in seconds.
-   **`args`** (string[], optional): An array of strings describing the command's arguments.
-   **`ownerOnly`** (boolean, optional): If `true`, the command can only be used by the bot's owner.
-   **`adminOnly`** (boolean, optional): If `true`, the command can only be used by group admins.
-   **`groupOnly`** (boolean, optional): If `true`, the command can only be used in a group chat.
-   **`privateOnly`** (boolean, optional): If `true`, the command can only be used in a private chat.

### `Command`

An interface that extends `CommandDetail` and includes the command's execution logic.

-   **`code`** ((ctx: Ctx) => Promise<void>): An asynchronous function that contains the command's logic. It receives a `ctx` object, which provides the context of the command's execution.

## `index.ts`

This module exports several types and a utility function for schema validation.

### `FieldConfig`

A type that defines the configuration for a single field in a schema.

-   **`description`** (string): A description of the field.
-   **`type`** ("string" | "number" | "boolean" | "array"): The data type of the field.
-   **`optional`** (boolean, optional): If `true`, the field is optional.

### `SchemaConfig`

A type that represents a schema configuration, which is a record of field names to `FieldConfig` objects.

### `ApiCandidate`

An interface that defines the structure of an API candidate for the `unify` function.

-   **`name`** (keyof typeof APIs): The name of the API client.
-   **`endpoint`** (string): The API endpoint to call.
-   **`params`** (any): The parameters to send with the API request.

### `buildZodSchema(config: SchemaConfig)`

A function that builds a Zod schema from a `SchemaConfig` object.

-   **Parameters:**
    -   `config` (SchemaConfig): The schema configuration.
-   **Returns:** A Zod schema object.
