# ProjectVault — Universal AI Project Exporter

A cross-platform (Tauri) desktop app for consolidating AI-generated conversations and projects from multiple LLM platforms and exporting them into portable archive formats.

## Features

- **7 platform connectors** (`src/utils/platformConnectors.ts`): ChatGPT, Claude, Gemini, DeepSeek, Grok, Kimi, Perplexity
- **Export engine** (`src/utils/exportEngine.ts`): Markdown, JSON, HTML, and ZIP archive output, built client-side with JSZip
- **Dashboard / Platforms / Projects / Export / Settings** pages with project selection and search
- **Persistent local state**: Zustand store with localStorage persistence for platforms, projects, and export jobs
- **Tauri backend** (Rust): export request/response types and a browser-session state holder (cookies/auth per platform) for automated extraction flows

## Tech stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, react-router-dom, Zustand, JSZip, date-fns, lucide-react
- Backend: Rust via Tauri (tauri.conf.json present)
- License: MIT

## Getting started

```bash
npm install
npm run dev        # Vite web dev
npm run tauri-dev  # Tauri desktop dev
npm run tauri-build # production desktop bundle
```

## Project structure

```
├── src/
│   ├── App.tsx               # routes: /, /platforms, /projects, /export, /settings
│   ├── components/           # Dashboard, Platforms, Projects, Export, Settings, Layout
│   ├── store/useVaultStore.ts # persisted Zustand store
│   ├── utils/
│   │   ├── platformConnectors.ts  # 7 platform connector definitions
│   │   └── exportEngine.ts        # md/json/html/zip export logic
│   └── types/
└── src-tauri/
    ├── src/main.rs            # export types + browser session state
    └── tauri.conf.json
```

## Status

**Real, implemented frontend** with a scaffolded backend. The UI, connectors, export formats, and state management are all present and consistent with the repo's existing (detailed, academic-style) README. Caveats: the automated browser-extraction path the README describes is not fully wired — `main.rs` holds only session-state types, and no Playwright/browser automation code is present. The Tauri shell has not been verified to build from this repo.
