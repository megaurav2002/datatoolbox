# DataToolbox

DataToolbox is a Next.js platform of free online data utilities for CSV, JSON, text, spreadsheet, and developer workflows.

## Live Demo

You can use the tools here:

https://datatoolbox.tools

DataToolbox is a collection of lightweight online utilities for working with data formats like JSON, CSV, text, and encodings.

## About

DataToolbox is a growing collection of developer utilities including:

- JSON → CSV converters
- JSON formatters and validators
- CSV cleanup tools
- Encoding / decoding utilities
- Text processing tools

The goal is to provide fast, simple, privacy-friendly tools that run directly in the browser.

## Example Tools

- JSON to CSV Converter
- JSON Formatter
- CSV Cleaner
- Regex Tester
- Base64 Encoder / Decoder

See the full list of tools here: https://datatoolbox.tools

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

---

If you find this project useful, check out the full toolbox:

https://datatoolbox.tools
