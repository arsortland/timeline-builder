// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v3.0
// Description: TopBar component for the main content area
// Purpose: Displays project name input, action buttons, last-saved indicator,
//          and a mobile hamburger toggle for the sidebar. Theme-aware styling.

"use client";

import { Download, Share2, Trash2, Save, Menu } from "lucide-react";
import { TopBarProps } from "../lib/types";
import { formatRelativeTime } from "../lib/timelineUtils";

export default function TopBar({
  projectName,
  onProjectNameChange,
  onDownloadImage,
  onShareLink,
  onClear,
  lastSaved,
  onToggleSidebar,
  sidebarCollapsed,
}: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 px-6 py-4 backdrop-blur-md"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: hamburger (mobile) + project name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="text-xl lg:text-2xl font-bold w-full rounded-lg px-3 py-2 outline-none transition-all"
              style={{
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--input-focus)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--input-border)")
              }
              placeholder="Untitled Timeline"
            />
            {lastSaved && (
              <p
                className="text-xs mt-1 px-3 flex items-center gap-1"
                style={{ color: "var(--text-muted)" }}
              >
                <Save className="w-3 h-3" />
                Saved {formatRelativeTime(lastSaved)}
              </p>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onDownloadImage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{
              color: "var(--accent)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent-subtle)")
            }
            title="Download timeline as PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PNG</span>
          </button>

          <button
            onClick={onShareLink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{
              color: "var(--accent)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent-subtle)")
            }
            title="Share timeline link"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{
              color: "var(--danger)",
              background: "transparent",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Clear all data"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
}
