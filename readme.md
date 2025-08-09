<div><img src="./docs/astro/public/images/consept-art/top.png" /></div>

<div align="center"><h2>Odyssage</h2></div>
<div align="center">An asynchronous, gamebook-style TRPG that explores the unknown.<br/>A blank journal to chronicle your own journey.</div>

---

## 🎯 Project Overview

**Odyssage** is a web application for **asynchronous gamebook-style TRPG sessions**. Players embark on adventures at their own pace, creating unique journey records in their digital journals.

### Key Features
- **Asynchronous Play**: Progress at your own pace, no real-time coordination required
- **Gamebook Style**: Choose-your-own-adventure branching narratives  
- **TRPG Elements**: Game Master facilitated sessions and story progression
- **Digital Journal**: Personal adventure logs and character development

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Hono.js + Cloudflare Workers
- **Database**: PostgreSQL (Neon) + Neo4j (Hybrid)
- **Authentication**: Firebase Authentication
- **Testing**: Vitest + Playwright

## 🚀 Quick Links

### 🌐 Live Application
- **Production**: [Odyssage](https://odyssage.pages.dev/)
- **Development**: [Development Site](https://develop.odyssage.pages.dev/)
- **Theme Song**: [Odyssage Theme Song](https://suno.com/song/79917a5e-040d-4378-a1f3-3023fd161697)

### 📚 Documentation
- **Developer Docs**: [Technical Documentation](https://hibohiboo.github.io/odyssage/ja/introduction/)
- **Getting Started**: [Project Setup Guide](./docs/01-getting-started/README.md)
- **Architecture**: [System Design](./docs/02-architecture/README.md)
- **API Reference**: [OpenAPI Documentation](./docs/redocly/openapi/)

### 🔧 For Developers
- **Development Process**: [Process Guide](./docs/03-development/process.md)
- **Local Environment**: [Setup Instructions](./docs/04-deployment/local-environment.md)
- **Contributing**: [Development Sprints](./docs/03-development/sprints/README.md)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Docker (for local database services)
- Firebase project (for authentication)

### Local Development
```bash
# Install dependencies
bun install

# Start all services
bun run local:all

# Start development servers (in separate terminals)
bun run dev:frontend  # Frontend development server
bun run dev:backend   # Backend development server
```

### Project Structure
```
odyssage/
├── apps/
│   ├── backend/         # Backend application (Hono.js)
│   └── frontend/        # Frontend application (React)
├── packages/
│   ├── schema/          # Validation schemas
│   ├── database/        # Database layer
│   └── ui/             # UI components library
├── docs/               # Project documentation
└── infra/             # Infrastructure configurations
```

## 🌟 Project Status

### Current Development
- **Active Sprint**: Sprint 003 - Documentation Architecture
- **Recent Features**: GraphDB integration, Scene management, Optimistic updates
- **Next Milestone**: Advanced scenario flow management

### Deployment Branches
| Branch | Deployment | Description |
|--------|------------|-------------|
| `main` | [Production](https://odyssage.pages.dev/) | Stable release |
| `develop` | [Development](https://develop.odyssage.pages.dev/) | Latest features |
| `docs` | GitHub Pages only | Documentation updates |

## 📖 Documentation Hub

Explore our comprehensive documentation:

- **[📋 Documentation Index](./docs/00-index.md)** - Complete knowledge base
- **[🚀 Getting Started](./docs/01-getting-started/README.md)** - Project introduction
- **[🏗️ Architecture](./docs/02-architecture/README.md)** - System design  
- **[⚙️ Development](./docs/03-development/README.md)** - Development processes
- **[🚢 Deployment](./docs/04-deployment/README.md)** - Infrastructure & operations

---

<div align="center">

**[🌐 Live App](https://odyssage.pages.dev/)** • **[📚 Docs](https://hibohiboo.github.io/odyssage/ja/introduction/)** • **[🎵 Theme Song](https://suno.com/song/79917a5e-040d-4378-a1f3-3023fd161697)**

*Embark on your digital adventure journey*

</div>