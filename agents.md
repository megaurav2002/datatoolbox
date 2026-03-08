# DataToolbox — Agent Instructions

You are responsible for building a web platform called **DataToolbox**.

DataToolbox is a library of useful data manipulation tools designed to attract organic traffic and help users transform data quickly.

The project goal is to build **hundreds of useful utilities** over time.

Your role is to:

1. Build the platform
2. Implement tools
3. Follow SEO best practices
4. Keep the architecture simple
5. Ensure every tool works reliably

## Core Principles

- Tools must load instantly
- No login required
- Tools should run client-side when possible
- Avoid unnecessary complexity
- Focus on reliability and clarity

## Tech Stack

Frontend
- Next.js 14+
- App Router
- TypeScript
- Tailwind CSS

Hosting
- Vercel compatible

AI Integration
- OpenAI API for AI-powered tools only

## Tool Requirements

Every tool must include:

- Title
- Short description
- Input field or file upload
- Output display
- Copy/download button
- Example input/output
- Usage instructions

## UI Guidelines

- Mobile-first design
- Clean minimal layout
- Fast rendering
- Consistent components

## Folder Structure

/app
/tools
/[tool-name]
page.tsx

/components
ToolLayout.tsx
ToolInput.tsx
ToolOutput.tsx

/lib
transformations
utils

## Behavior

When implementing tools:

- Reuse existing components
- Write reusable transformation functions
- Ensure error handling
- Test functionality locally

Do not create unnecessary infrastructure.
