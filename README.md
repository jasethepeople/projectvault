# ProjectVault

> **Universal AI Project Exporter** — A cross-platform desktop application for consolidating, organizing, and exporting AI-generated conversations and projects from multiple large language model (LLM) interfaces into portable, archivable formats.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri](https://img.shields.io/badge/Built%20with-Tauri-FFC131?logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev)

---

## Table of Contents

- [Abstract](#abstract)
- [Motivation](#motivation)
- [Supported Platforms](#supported-platforms)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Export Formats](#export-formats)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Abstract

As the adoption of generative AI tools accelerates across academic, professional, and personal domains, users increasingly distribute their intellectual work across multiple proprietary platforms. Each platform maintains isolated conversation histories with incompatible export mechanisms — or, in many cases, no export mechanism at all. **ProjectVault** addresses this fragmentation by providing a unified interface for extracting, normalizing, and archiving AI-assisted projects from seven major platforms into standardized, portable formats suitable for long-term preservation, version control, and academic citation.

---

## Motivation

The contemporary AI ecosystem is characterized by:

1. **Platform Lock-in**: Conversations are trapped within vendor-specific interfaces (Kimi, Claude, Grok) with no programmatic access.
2. **Inconsistent Export**: Platforms that do offer export (ChatGPT, DeepSeek) produce incompatible formats (JSON, ZIP, HTML) with no cross-platform standard.
3. **Research Reproducibility**: Academic users require persistent, citable records of AI-assisted research workflows.
4. **Data Sovereignty**: Users lack local, offline copies of their own intellectual output.

ProjectVault resolves these issues through a **hybrid extraction architecture** that combines native APIs (where available), browser automation (where necessary), and manual import fallback, producing normalized output in Markdown, JSON, HTML, or organized ZIP archives.

---

## Supported Platforms

| Platform | Vendor | Export Method | API Availability | Status |
|----------|--------|---------------|------------------|--------|
| **Kimi** | Moonshot AI | Browser Automation | ❌ None | ⚠️ Manual / Automated |
| **Gemini** | Google | Google Takeout / Per-chat | ⚠️ Limited | ✅ Supported |
| **DeepSeek** | DeepSeek AI | Native JSON Export | ✅ Yes | ✅ Supported |
| **ChatGPT** | OpenAI | Native ZIP Export | ⚠️ Limited | ✅ Supported |
| **Claude** | Anthropic | Browser Automation | ❌ None | ⚠️ Manual / Automated |
| **Grok** | xAI | Browser Automation | ❌ None | ⚠️ Manual / Automated |
| **Perplexity** | Perplexity AI | Per-thread Export | ❌ None | ⚠️ Manual / Automated |

> **Note**: Platforms marked "Browser Automation" require either manual export via the platform's web interface or automated extraction using the embedded browser controller (Playwright integration planned for v1.1).

---

## Architecture

```
projectvault/
├── src/                          # React 18 frontend (TypeScript)
│   ├── components/               # Route-level UI components
│   │   ├── Dashboard.tsx         # Overview & statistics
│   │   ├── Platforms.tsx         # Connection management
│   │   ├── Projects.tsx          # Project browser & selection
│   │   ├── Export.tsx            # Export configuration & execution
│   │   ├── Settings.tsx          # Application preferences
│   │   └── Layout.tsx            # Shell & navigation
│   ├── store/
│   │   └── useVaultStore.ts      # Zustand state management with persistence
│   ├── utils/
│   │   ├── exportEngine.ts       # Format conversion engine (MD/JSON/HTML/ZIP)
│   │   └── platformConnectors.ts # Platform-specific auth & data retrieval
│   ├── types/
│   │   └── index.ts              # TypeScript domain models
│   └── styles/
│       └── globals.css           # Tailwind CSS + design tokens
├── src-tauri/                    # Rust backend (Tauri v1)
│   ├── src/
│   │   └── main.rs               # Native commands: file I/O, ZIP, browser auth
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri runtime configuration
├── docs/                         # Supplementary documentation
├── package.json                  # Node.js dependencies & scripts
├── vite.config.ts                # Vite build configuration
├── tailwind.config.js            # Tailwind design system
└── tsconfig.json                 # TypeScript compiler options
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + TypeScript | Component-based UI, type safety |
| **Styling** | Tailwind CSS | Utility-first, rapid iteration |
| **State** | Zustand + Persist | Lightweight, localStorage sync |
| **Backend** | Rust + Tauri | Memory-safe, native performance, small bundle |
| **Build** | Vite | Fast HMR, optimized output |
| **Export** | JSZip + file-saver | Client-side archive generation |

---

## Installation

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 (or **bun** ≥ 1.0)
- **Rust** ≥ 1.70.0 (install via [rustup](https://rustup.rs/))
- **OS**: macOS 11+, Windows 10+, or Linux (Ubuntu 20.04+)

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/projectvault.git
cd projectvault

# 2. Install Node.js dependencies
npm install

# 3. Install Tauri CLI (if not globally available)
npm install -g @tauri-apps/cli

# 4. Run in development mode (desktop app)
npm run tauri-dev

# 5. Or run in browser mode (frontend only)
npm run dev
```

### Building for Production

```bash
# Build native installers for current platform
npm run tauri-build

# Output locations:
#   macOS:   src-tauri/target/release/bundle/macos/
#   Windows: src-tauri/target/release/bundle/msi/
#   Linux:   src-tauri/target/release/bundle/deb/
```

---

## Usage

### 1. Connect Platforms

Navigate to **Platforms** in the sidebar. Each platform card displays its connection status and export method:

- **API platforms** (DeepSeek, Gemini, ChatGPT): Click **Connect** to authenticate and import automatically.
- **Browser platforms** (Kimi, Claude, Grok, Perplexity): Click **Connect** to launch the embedded browser or follow the provided export instructions.

### 2. Browse Projects

The **Projects** view displays all imported conversations with:
- Full-text search across titles and tags
- Platform filtering
- Multi-select for bulk export
- Metadata preview (model, timestamps, token usage)

### 3. Configure Export

In the **Export** view, select:
- **Format**: Markdown, JSON, HTML, or ZIP
- **Metadata**: Include model info, timestamps, token counts
- **Attachments**: Include referenced images/files
- **Organization**: Group by platform, date, or flat structure

### 4. Execute Export

Click **Export** to generate the archive. The file is saved to your local filesystem via the native save dialog.

---

## Export Formats

### Markdown (`.md`)
- Human-readable, version-control friendly
- Compatible with GitHub, Notion, Obsidian, Zotero
- Preserves conversation threading via headers

### JSON (`.json`)
- Structured data with full metadata schema
- Suitable for programmatic analysis, NLP pipelines
- Schema: `{ exportedAt, totalProjects, projects[] }`

### HTML (`.html`)
- Self-contained, styled web pages
- No external dependencies
- Printable and archivable

### ZIP Archive (`.zip`)
- Organized folder structure with `_INDEX.md`
- Subfolders by platform or date
- Includes per-project metadata JSON

---

## Development

### Project Structure Conventions

- **Components**: PascalCase, co-located styles via Tailwind
- **Utils**: camelCase, pure functions, no side effects
- **Store**: Zustand slices, persisted state in `localStorage`
- **Types**: Centralized in `src/types/`, strict null checks enabled

### Adding a New Platform

1. Add platform entry to `src/types/index.ts` (`Platform` union)
2. Add configuration to `useVaultStore.ts` (`defaultPlatforms`)
3. Implement connector in `src/utils/platformConnectors.ts`
4. Add icon mapping in `src/components/Platforms.tsx`
5. Add color token to `tailwind.config.js`

### Running Tests

```bash
# Frontend unit tests (Vitest)
npm run test

# Rust backend tests
cd src-tauri && cargo test
```

---

## Contributing

We welcome contributions from researchers, developers, and AI practitioners. Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Reporting bugs and requesting features
- Submitting pull requests
- Code style and review process
- Platform integration proposals

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- **Tauri** for the secure, lightweight desktop runtime
- **React** and **Tailwind CSS** communities for frontend tooling
- The maintainers of **JSZip** and **date-fns** for essential utilities
- Researchers and practitioners who identified the need for AI conversation portability

---

## Citation

If you use ProjectVault in academic work, please cite:

```bibtex
@software{projectvault2024,
  title = {ProjectVault: Universal AI Project Exporter},
  author = {ProjectVault Contributors},
  year = {2024},
  url = {https://github.com/yourusername/projectvault},
  note = {Version 1.0.0}
}
```
