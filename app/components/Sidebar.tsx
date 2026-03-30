// Created: 2026-03-26
// Updated: 2026-03-30
// Version: v4.0
// Description: Sidebar navigation component with theme toggle
// Purpose: Collapsible sidebar with branding, route-based navigation (Home, Timeline, Toolbox),
//          and a dark/light mode toggle at the bottom.
//          v3.0: Replaced hardcoded navItems with Next.js Link + usePathname for active state.
//          v4.0: Replaced TE text branding with custom team logo (teamentralogoNOBG.png).

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  Wrench,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SidebarProps } from "../lib/types";
import { useTheme } from "../lib/themeContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Timeline", href: "/timeline", icon: <Clock className="w-5 h-5" /> },
  { label: "Toolbox", href: "/toolbox", icon: <Wrench className="w-5 h-5" /> },
];

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 64 : 240,
        minWidth: collapsed ? 64 : 240,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Branding + Collapse toggle */}
      <div
        className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Image
              src="/teamentralogoNOBG.png"
              alt="Team Entra Norway logo"
              width={32}
              height={32}
              className="shrink-0 rounded-lg"
              unoptimized
            />
            <div className="truncate">
              <p
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Team Entra
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Norway
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <Image
            src="/teamentralogoNOBG.png"
            alt="Team Entra Norway logo"
            width={32}
            height={32}
            className="rounded-lg mx-auto"
            unoptimized
          />
        )}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md transition-colors shrink-0"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--sidebar-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="w-full flex items-center gap-3 rounded-lg transition-colors"
              style={{
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive
                  ? "var(--sidebar-active-text)"
                  : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: theme toggle + expand button */}
      <div
        className="px-2 py-4 space-y-2"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 rounded-lg transition-colors"
          style={{
            padding: collapsed ? "10px 0" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--sidebar-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!collapsed && (
            <span className="text-sm font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* Expand button (only when collapsed) */}
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center rounded-lg transition-colors py-2"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--sidebar-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Expand sidebar"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
