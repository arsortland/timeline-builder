// Created: 2026-03-30
// Version: v1.0
// Description: Shared portal layout shell wrapping all pages
// Purpose: Provides the sidebar + mobile overlay navigation for every route.
//          Extracts sidebar/mobile-nav logic from old page.tsx into a reusable wrapper.

"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "true") setSidebarCollapsed(true);
  }, []);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
        return next;
      });
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "var(--modal-overlay)" }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-50 md:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile nav bar */}
        <div
          className="md:hidden flex items-center px-4 py-3"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            className="ml-3 text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Team Entra Norway
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
