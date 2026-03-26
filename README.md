# Timeline Builder

A modern, interactive web application for creating and sharing project timelines. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **Interactive Timeline Visualization**: Create beautiful horizontal timelines with customizable milestones
- **Flexible Positioning**: Place milestones above, below, or centered on the timeline using vertical position controls
- **Export Options**:
  - Download timelines as high-quality PNG images for Word/PowerPoint documents
  - Export data as JSON for backup and sharing
  - Generate shareable links with embedded timeline data
- **Auto-Save**: Automatic local storage saves your work
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean Tailwind CSS styling with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd timeline-builder
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage Guide

### Creating a Timeline

1. **Set Project Name**: Click on "Untitled Timeline" at the top to rename your project
2. **Add Milestones**: Click "Add Milestone" or "Create First Milestone" button
3. **Fill in Details**:
   - **Date**: Select the milestone date
   - **Description**: Enter a brief description
   - **Position**: Set vertical position (see positioning guide below)
   - **Color**: Choose a custom color (optional)
4. **View Timeline**: Your timeline updates in real-time as you add/edit milestones

### Vertical Positioning Guide

The position field controls where milestones appear relative to the timeline:

- **Positive numbers** (10, 20, 30...): Milestones appear **above** the timeline
- **Negative numbers** (-10, -20, -30...): Milestones appear **below** the timeline
- **Zero (0)**: Milestone centered on the timeline

**Tip**: Use different positions to avoid overlapping milestones and create a layered effect!

### Sharing Your Timeline

#### Option 1: Download as PNG (Recommended for documents)

1. Click **"Download PNG"** button in the header
2. Timeline is captured as a high-quality image
3. Insert the image into Word, PowerPoint, emails, etc.

#### Option 2: Shareable Link (For interactive viewing)

1. Click **"Share Link"** button
2. Click **"Copy"** to copy the URL to your clipboard
3. Share the link with colleagues/customers
4. Recipients can view the interactive timeline in their browser

#### Option 3: Export JSON (For backup/advanced use)

1. Click **"Share Link"** button
2. Select **"Download as JSON"**
3. Save the file and share it or import it later

## 🛠️ Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **vis-timeline**: Interactive timeline library
- **html2canvas**: Canvas-based screenshot
- **lz-string**: String compression for URLs
- **Lucide React**: Modern icon library

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Vercel automatically detects Next.js and deploys
4. Share your production URL: `https://your-app.vercel.app`

---

**Created**: February 20, 2026
**Version**: 2.0
