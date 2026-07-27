# AI Context Studio - Documentation

## Overview

AI Context Studio is a local-first, offline-first prompt engineering studio for AI coding assistants. Build, customize, manage, and export AI instruction assets for multiple AI coding assistants including Cursor, Claude Code, Windsurf, VS Code, and more.

## Architecture

### Repository Structure

```
ai-context-studio/
├── shared/           # Shared TypeScript/Rust code (components, hooks, types, utils)
├── desktop/          # Tauri + Next.js desktop application
├── web/              # Next.js static export for landing page, docs, marketplace
├── marketplace/      # Rust crate for marketplace/catalog logic
├── registry/         # Rust crate for asset registry and indexing
├── assets/           # Asset storage directories
│   ├── official/     # Official/published assets
│   ├── community/    # Community-contributed assets
│   ├── user/         # User-created assets
│   └── cache/        # Downloaded/cached assets
├── docs/             # Documentation
└── security/         # Security policies and audits
```

### Desktop App (desktop/)

- **Framework**: Tauri 2 + Next.js 16 (React 18)
- **Language**: TypeScript + Rust
- **Output**: Native desktop app (Windows NSIS, macOS DMG, Linux AppImage)
- **Build**: `output: 'export'` for Tauri static export

### Web App (web/)

- **Framework**: Next.js 16 with static export
- **Language**: TypeScript
- **Output**: Static HTML/CSS/JS for GitHub Pages / Vercel / Netlify
- **Features**: Landing page, documentation, marketplace browser

### Shared Code (shared/)

- React components (UI primitives, layout, common)
- Custom hooks
- TypeScript types
- Utility functions
- Providers (React Query, Toaster, Tooltip)
- Services (providers, storage, crypto)
- Constants and styles

### Marketplace Crate (marketplace/)

- Asset catalog and search
- Installation protocol (ai-context-studio://)
- Seed data for official assets

### Registry Crate (registry/)

- Asset indexing and metadata
- Search and filtering
- Category management

## Development

### Prerequisites

- Node.js 20+
- Rust 1.77+
- pnpm (recommended) or npm

### Setup

```bash
# Install desktop dependencies
cd desktop && npm install

# Install web dependencies
cd ../web && npm install

# Build Rust workspace
cargo build --workspace
```

### Desktop Development

```bash
cd desktop
npm run dev          # Start Next.js dev server
npm run tauri dev    # Start Tauri dev window
```

### Web Development

```bash
cd web
npm run dev          # Start Next.js dev server
```

### Build

```bash
# Desktop (from desktop/)
npm run build        # Next.js static export
cargo tauri build    # Tauri native build

# Web (from web/)
npm run build        # Next.js static export to out/
```

## Asset Format (.acs)

Assets are packaged as `.acs` files (zip-based format):

```
asset.acs/
├── manifest.json       # Asset metadata
├── content/            # Asset content files
│   ├── prompts/
│   ├── instructions/
│   ├── memories/
│   └── workflows/
├── preview.png         # Optional preview image
└── README.md           # Optional documentation
```

### Manifest Schema

```json
{
  "id": "unique-asset-id",
  "name": "Asset Name",
  "version": "1.0.0",
  "author": "Author Name",
  "type": "skill|persona|workflow|promptPack|memory|instructionFile|systemPrompt|moduleConfig",
  "description": "Human-readable description",
  "tags": ["tag1", "tag2"],
  "minAppVersion": "1.0.0",
  "checksum": "sha256:...",
  "license": "MIT"
}
```

## Security

See [SECURITY.md](security/SECURITY.md) for security policy and reporting.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../LICENSE) for details.