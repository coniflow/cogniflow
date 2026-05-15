# 🧠 CogniFlow

**Your AI Second Brain — A beautiful, privacy-first desktop application for capturing, connecting, and amplifying your thoughts.**

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-purple" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-cyan" alt="Platforms" />
  <img src="https://img.shields.io/badge/AI-Ollama-important" alt="Ollama" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Quick Capture** | Global hotkey (`Ctrl+Shift+C`) for instant capture — text, voice, or screenshot |
| 🤖 **AI Processing** | Local AI (Ollama) for summarization, auto-tagging, entity extraction, and idea connections |
| 🕸️ **Knowledge Graph** | Interactive visualization of notes and their AI-discovered connections |
| 🔍 **Semantic Search** | AI-powered search across all your notes |
| 📊 **Dashboard** | Daily insights, activity stats, and AI-suggested connections |
| 🎯 **Focus Mode** | Pomodoro timer + ambient sounds + website blocker |
| 🎤 **Voice Notes** | Record and auto-transcribe voice memos |
| 📸 **Screenshot OCR** | Capture screenshots and extract text |
| 🔒 **Privacy First** | 100% local processing. No cloud, no tracking, no data leaks |
| 📦 **Export** | Full Markdown and JSON export with no lock-in |

## 🖥️ Desktop App

### Prerequisites

- **Node.js** 18+ and **npm**
- **Rust** toolchain (for Tauri) — [Install Rust](https://rustup.rs/)
- **Ollama** for local AI — [Install Ollama](https://ollama.com/)

### Setup Ollama

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Or download from https://ollama.com/download for Windows

# Pull the default model
ollama pull llama3.2

# Verify Ollama is running
ollama serve
```

### Run the Desktop App

```bash
cd app

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Build & Package

```bash
cd app

# Build the desktop app for your platform
npm run tauri build
```

The packaged app will be in `app/src-tauri/target/release/bundle/`.

### Architecture

```
app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── layout/        # Sidebar, CaptureWindow, Settings
│   │   ├── dashboard/     # Daily insights dashboard
│   │   ├── notes/         # Notes list and editor
│   │   ├── graph/         # Knowledge graph visualization
│   │   ├── focus/         # Pomodoro focus mode
│   │   └── search/        # Semantic search
│   ├── stores/            # Zustand state management
│   ├── types/             # TypeScript type definitions
│   └── lib/               # Utility functions
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Tauri commands, Ollama integration, DB migrations
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🌐 Landing Website

### Run Locally

```bash
cd website

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
cd website

# Build static site
npm run build

# The output is in the `out/` directory, ready for Vercel or GitHub Pages
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

1. Push the repository to GitHub
2. Go to Settings > Pages
3. Set source to GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy website
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: website/out
```

## 📁 Project Structure

```
cogniflow/
├── app/                  # Tauri 2.0 Desktop Application
│   ├── src/              # React/TypeScript frontend
│   └── src-tauri/        # Rust backend
├── website/              # Next.js 15 Landing Website
├── screenshots/          # App screenshots for the website
├── README.md
├── LICENSE
└── .gitignore
```

## 🎨 Design

- **Theme**: Dark-first with glassmorphism
- **Colors**: Purple/Cyan neon accents
- **Typography**: Inter font family
- **Animations**: Framer Motion for smooth transitions
- **UI**: shadcn/ui component library
- **Style**: Premium, minimal, Apple-level polish

## 🔧 Tech Stack

### Desktop App
- **Framework**: Tauri 2.0
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Graph**: React Flow
- **Backend**: Rust (Tokio, Serde, Reqwest)
- **Database**: SQLite (via tauri-plugin-sql)
- **AI**: Ollama (local LLM)

### Website
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md).

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) for the amazing desktop framework
- [Ollama](https://ollama.com/) for local AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [React Flow](https://reactflow.dev/) for the graph visualization
- All our contributors and users

---

<p align="center">
  Made with ❤️ for thinkers everywhere.<br />
  <strong>Privacy first. Ideas forever.</strong>
</p>
