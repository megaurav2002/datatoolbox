# DataToolbox

DataToolbox is a Next.js platform of free online data utilities for CSV, JSON, text, spreadsheet, and developer workflows.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Jest + React Testing Library

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

- http://localhost:3000

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

## Lint

```bash
npm run lint
```

## Tool Search Index

The tool search index is auto-generated into `public/tools-index.json`.

You can run it manually with:

```bash
npm run generate:tools-index
```

It also runs automatically before:

- `npm run dev`
- `npm run build`
- `npm test`

## Environment Variables

Create a local env file if needed:

```bash
cp .env.example .env.local
```

AI tools are currently hidden from the UI. If re-enabled later, you will need:

- `OPENAI_API_KEY`

`.env*` files are gitignored.

## Project Structure

- `app/` — routes and pages
- `components/` — reusable UI
- `lib/` — tool metadata, categories, transformations, SEO helpers
- `scripts/` — build-time utilities (tool index generation)
- `__tests__/` — Jest tests
