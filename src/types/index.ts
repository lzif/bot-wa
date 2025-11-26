import { z } from "zod"
import { APIs } from "../tools"

export * from "./api"
export * from "./commands"
export * from "./media"
export * from "./messages"

export type FieldConfig = {
  description: string;
  type: "string" | "number" | "boolean" | "array";
  optional?: boolean;
};

export type SchemaConfig = Record<string, FieldConfig>;

export interface ApiCandidate {
  name: keyof typeof APIs;
  endpoint: string;
  params: any;
}

export function buildZodSchema(config: SchemaConfig) {
  const shape: any = {};
  for (const [key, field] of Object.entries(config)) {
    let validator;
    switch (field.type) {
      case "string": 
        validator = z.string().or(z.number().transform(String)); // Terima number, ubah ke string
        break;
      case "number": 
        validator = z.coerce.number(); // "100" -> 100
        break;
      case "boolean": 
        validator = z.boolean(); 
        break;
      case "array": 
        validator = z.array(z.any()); 
        break;
      default: validator = z.any();
    }
    shape[key] = field.optional ? validator.nullable().optional() : validator;
  }
  return z.object(shape);
}
