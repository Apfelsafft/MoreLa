# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # TypeScript type check (no test suite exists yet)
```

## Architecture

**Next.js 14 App Router** with TypeScript and Tailwind CSS. The app is a dashboard + AI chat assistant for an IT support organization.

### Data Flow

All data lives in flat JSON files under `data/`:
- `data/org.json` — employees and departments (TechCorp AG pseudo data)
- `data/projects.json` — IT project portfolio
- `data/finances.json` — budgets, categories, monthly spend

Server-side API routes (`src/app/api/*/route.ts`) read these files via `fs.readFileSync` and return JSON. Client pages fetch from these routes — they never import from `src/lib/data.ts` directly (that file uses Node.js `fs` and is server-only).

### Key split: `lib/data.ts` vs `lib/types.ts`

- `src/lib/types.ts` — all TypeScript interfaces + `formatCurrency` helper. **Safe to import in client components.**
- `src/lib/data.ts` — server-only data loaders (`getOrgData`, `getProjectsData`, `getFinancesData`) using `fs`. Only used in API routes and server components. Importing it in a `"use client"` file will break the build.

### AI Chat

`src/app/api/chat/route.ts` calls the Anthropic SDK (`claude-sonnet-4-6`) with all three JSON data files injected into the system prompt, then streams the response back. Requires `ANTHROPIC_API_KEY` in `.env.local`.

The chat panel (`src/components/ChatAssistant.tsx`) is mounted globally in `src/app/layout.tsx` and opens via a `CustomEvent("openChat")` dispatched from any page — no prop drilling needed.

### Adding a new data area

1. Add a JSON file to `data/`
2. Add types to `src/lib/types.ts`
3. Add a loader function to `src/lib/data.ts`
4. Add an API route under `src/app/api/<name>/route.ts`
5. Create a new page under `src/app/<name>/page.tsx` (client component, fetches from API)
6. Add the route to the nav in `src/components/Sidebar.tsx`
7. Inject the new data into the chat system prompt in `src/app/api/chat/route.ts`
