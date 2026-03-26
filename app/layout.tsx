// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v3.0
// Description: Root layout with metadata, fonts, and theme provider
// Purpose: Wraps the application in ThemeProvider for dark/light mode support

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/themeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timeline Builder - Create & Share Project Timelines",
  description:
    "Create beautiful interactive timelines for your projects. Add milestones, customize positions, and share with colleagues or export as images for documents.",
  keywords: [
    "timeline",
    "project planning",
    "milestones",
    "gantt",
    "project management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme-preference");document.documentElement.setAttribute("data-theme",t||"dark")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
