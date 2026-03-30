# Team Entra Norway Portal

Internal portal for an Identity & Access Management team working with Microsoft Entra. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This portal serves as the shared hub for Team Entra Norway, providing quick access to tools, project timelines, and reference material related to Microsoft Entra ID, Azure security, and Microsoft 365 governance.

## Features

- **Homepage** — Parallax landing page with team branding, key stats, and quick-access navigation
- **Timeline** — Interactive project timeline for tracking milestones, with PNG/JSON export and shareable links
- **Toolbox** — Curated collection of identity and security tools (Microsoft, open-source, and community), filterable by source type and tags
- **Dark / Light Theme** — Toggle between themes via the sidebar

## Tech Stack

- **Next.js 16** with App Router
- **React 19** + TypeScript 5
- **Tailwind CSS 4**
- **vis-timeline** for interactive timelines
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx              # Homepage (parallax hero, stats, quick-access cards)
├── timeline/page.tsx     # Timeline builder
├── toolbox/page.tsx      # Toolbox with filtering and detail modals
├── components/           # Sidebar, Header, PortalShell
├── lib/                  # Types, theme context, toolbox data
└── globals.css           # Theme variables, animations
public/                   # Logos and static assets
```
