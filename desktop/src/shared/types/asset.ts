/**
 * Discriminated union of all supported AI asset kinds.
 * Each kind maps to a distinct feature module.
 */
export type AssetKind =
  | "instruction-file"
  | "prompt-template"
  | "persona"
  | "skill"
  | "workflow"
  | "memory"
  | "mcp-config";

/**
 * Asset visibility scope. Per spec we are local-first / single user,
 * but scope is retained for future sharing.
 */
export type AssetScope = "personal" | "shared";

/**
 * Mutable metadata shared by every persisted asset regardless of kind.
 * The `body` field is discriminated by `kind` (see asset schemas in
 * `types/assets.ts`).
 */
export interface AssetMetadata {
  id: string;
  kind: AssetKind;
  scope: AssetScope;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  tags: string[];
  favorite: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic asset envelope. Concrete body types live in `types/assets.ts`
 * and are referenced via Zod schemas (schema-first single source of truth).
 */
export type Asset<TBody = unknown> = AssetMetadata & {
  body: TBody;
};
