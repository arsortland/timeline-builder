// Created: 2026-02-20
// Updated: 2026-03-30
// Version: v4.0
// Description: Root layout with metadata, fonts, theme provider, and portal shell
// Purpose: Wraps the application in ThemeProvider and PortalShell for shared sidebar layout
//          v4.0: Added PortalShell wrapper, updated metadata for Team Entra Norway

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/themeContext";
import PortalShell from "./components/PortalShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Entra Norway",
  description:
    "Internal portal for Team Entra Norway — tools, timelines, and resources for Entra ID and Microsoft cloud administration.",
  keywords: [
    "entra",
    "azure",
    "identity",
    "microsoft 365",
    "tools",
    "timeline",
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
        <ThemeProvider>
          <PortalShell>{children}</PortalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
