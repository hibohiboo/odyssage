# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Odyssage is an asynchronous, gamebook-style TRPG (tabletop RPG) platform built as a Bun monorepo. The project enables users to create scenarios, manage game sessions, and engage in role-playing experiences through a web interface.

## Development Commands

### Setup
```bash
npm run init          # Configure git hooks and setup
bun install          # Install dependencies
```

### Local Infrastructure
```bash
npm run local:all     # Start all services (PostgreSQL, Neo4j, Firebase)
npm run local:rdb     # PostgreSQL database only
npm run local:graphdb # Neo4j graph database only
npm run local:firebase # Firebase emulator only
```

### Development
```bash
npm run dev           # Run all apps concurrently
npm run dev:backend   # Backend only (Cloudflare Workers)
npm run dev:frontend  # Frontend only (React + Vite)
npm run dev:ui        # UI package only (Storybook)
```

### Build & Test
```bash
npm run build         # Build all packages via Turbo
npm run test          # Run all tests via Vitest workspace
npm run ncu           # Update dependencies across workspace
```

### Package-Specific Commands
```bash
# Backend testing
cd apps/backend && bun run test:integration

# Frontend testing
cd apps/frontend && bun run test

# UI components
cd packages/ui && bun run storybook
```

## Architecture Overview

### Monorepo Structure
- **apps/backend**: Cloudflare Workers API using Hono.js
- **apps/frontend**: React SPA with Vite and Tailwind CSS v4
- **packages/**: Shared libraries for database, UI, schema, and utilities

### Database Architecture
**Dual Database Setup:**
- **PostgreSQL (Primary)**: User management, scenarios, sessions via Drizzle ORM
- **Neo4j (Graph)**: Complex relationships and scenario flows

### Key Technologies
- **Frontend**: React 19, TypeScript, Redux Toolkit, SWR, React Router v7
- **Backend**: Cloudflare Workers, Hono.js, Firebase Auth, JWT
- **Databases**: PostgreSQL (Neon), Neo4j, Drizzle ORM
- **Testing**: Vitest, Playwright, Cucumber BDD, MSW
- **Build**: Turbo, Bun, Vite with SWC

## Development Guidelines

### Code Context Requirements
This project uses GitHub Copilot with specific context annotations. When working on files, include the appropriate context comment at the top:

```typescript
// @copilot-context frontend    # For React components, hooks, UI
// @copilot-context backend     # For API routes, database access
// @copilot-context testing     # For test files (REQUIRED)
// @copilot-context naming      # For schema/model definitions
```

### Frontend (Feature-Sliced Design)
- **Structure**: `src/entities/`, `src/features/`, `src/shared/`, `src/pages/`
- **State Management**: Redux Toolkit for global state, SWR for server state
- **Styling**: Tailwind CSS v4 with component-scoped styles
- **Components**: Shared UI library in `packages/ui` with Storybook

### Backend (API-First)
- **OpenAPI**: All API changes must update `docs/redocly/openapi/api.yaml`
- **Validation**: Use Valibot schemas in `packages/schema`
- **Authentication**: Firebase Auth with JWT token verification
- **Database**: Drizzle schema in `packages/database`

### Testing Strategy
- **Unit Tests**: Vitest across all packages
- **Integration Tests**: Backend with Testcontainers for database testing
- **E2E Tests**: Playwright + Cucumber for user workflows
- **Component Tests**: Storybook + Testing Library for UI components

## Key Patterns

### Database Access
```typescript
// PostgreSQL queries via Drizzle
const scenarios = await db.select().from(scenarioTable).where(eq(scenarioTable.userId, userId));

// Neo4j queries for relationships
const relationships = await session.run('MATCH (s:Scenario)-[r:CONNECTS]->(n:Node) RETURN s, r, n');
```

### API Development
- Routes in `apps/backend/src/route/`
- Middleware for auth in `apps/backend/src/middleware/`
- OpenAPI specification drives development
- CORS configured for multiple environments

### Frontend Data Flow
- SWR for API data fetching with caching
- Redux Toolkit for application state
- Custom hooks for component logic separation
- MSW for testing API interactions

## Environment Configuration

### Backend Environment Variables
- `JWT_PUBLIC_KEY`: Firebase project public key
- `CORS_ORIGINS`: Allowed frontend origins
- Database connection strings for PostgreSQL and Neo4j

### Local Development
Requires Docker for database services. Firebase emulator provides local authentication.

## Documentation

- **API Documentation**: Generated from OpenAPI spec via Redoc
- **Component Library**: Storybook at `packages/ui`
- **Database Schema**: SchemaSpy documentation
- **Developer Docs**: Astro-based site with Japanese language support

## Important Notes

- **Language**: Project supports Japanese (primary) and English
- **Package Manager**: Use Bun exclusively (not npm/yarn)
- **Git Hooks**: Configured via `.githooks/` directory
- **Deployment**: Cloudflare Workers (backend) and Cloudflare Pages (frontend)
- **Testing**: Use Testcontainers for integration tests requiring real databases