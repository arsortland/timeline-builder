// Created: 2026-03-26
// Version: v2.0
// Description: Sidebar navigation component with theme toggle
// Purpose: Collapsible sidebar with branding, navigation items (Timeline active,
//          placeholders greyed out), and a dark/light mode toggle at the bottom.

"use client";

import {
  LayoutDashboard,
  Calendar,
  Clock,
  Settings,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SidebarProps } from "../lib/types";
import { useTheme } from "../lib/themeContext";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    active: false,
    disabled: true,
  },
  {
    label: "Calendar",
    icon: <Calendar className="w-5 h-5" />,
    active: false,
    disabled: true,
  },
  {
    label: "Timeline",
    icon: <Clock className="w-5 h-5" />,
    active: true,
    disabled: false,
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    active: false,
    disabled: true,
  },
];

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

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
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: "var(--accent)" }}
            >
              TE
            </div>
            <div className="truncate">
              <p
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Team Entra
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Timeline Builder
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto"
            style={{ background: "var(--accent)" }}
          >
            TE
          </div>
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
        {navItems.map((item) => (
          <button
            key={item.label}
            disabled={item.disabled}
            className="w-full flex items-center gap-3 rounded-lg transition-colors"
            style={{
              padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              background: item.active ? "var(--sidebar-active)" : "transparent",
              color: item.active
                ? "var(--sidebar-active-text)"
                : item.disabled
                  ? "var(--text-muted)"
                  : "var(--text-secondary)",
              cursor: item.disabled ? "default" : "pointer",
              opacity: item.disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!item.disabled && !item.active)
                e.currentTarget.style.background = "var(--sidebar-hover)";
            }}
            onMouseLeave={(e) => {
              if (!item.active)
                e.currentTarget.style.background = "transparent";
            }}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </button>
        ))}
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
