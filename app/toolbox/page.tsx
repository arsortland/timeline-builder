// Created: 2026-03-30
// Version: v1.1 - Enlarged modal, added Quick Guide and Best Suited For sections
// Description: Toolbox page with searchable tool cards and detail modal
// Purpose: Displays a grid of Azure/Entra tools the team uses.
//          Search supports plain text and regex. Cards open a detail modal
//          with full description and external links.

"use client";

import { useState, useMemo } from "react";
import { Search, X, ExternalLink, Tag, BookOpen, Target } from "lucide-react";
import { tools } from "../lib/toolboxData";
import { Tool } from "../lib/types";

export default function ToolboxPage() {
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;

    try {
      const re = new RegExp(query, "i");
      return tools.filter(
        (t) =>
          re.test(t.name) ||
          re.test(t.description) ||
          t.tags.some((tag) => re.test(tag)),
      );
    } catch {
      // Invalid regex — fall back to plain includes
      const lower = query.toLowerCase();
      return tools.filter(
        (t) =>
          t.name.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lower)),
      );
    }
  }, [query]);

  return (
    <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl lg:text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Toolbox
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          A curated collection of tools we use for Entra ID, Azure, and
          Microsoft 365 security and administration.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools (supports regex)…"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
        />
      </div>

      {/* Tool cards grid */}
      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No tools match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className="text-left rounded-xl p-5 transition-all group"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {tool.name}
              </h3>
              <p
                className="text-sm line-clamp-3 mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {tool.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--accent-subtle)",
                      color: "var(--accent)",
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "var(--modal-overlay)" }}
          onClick={() => setSelectedTool(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedTool.name}
              </h2>
              <button
                onClick={() => setSelectedTool(null)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedTool.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--accent-subtle)",
                    color: "var(--accent)",
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {selectedTool.detailedDescription}
            </p>

            {/* Quick Guide */}
            {selectedTool.quickGuide && (
              <div className="space-y-2">
                <h3
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <BookOpen
                    className="w-4 h-4"
                    style={{ color: "var(--accent)" }}
                  />
                  Quick Guide
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {selectedTool.quickGuide}
                </p>
              </div>
            )}

            {/* Best Suited For */}
            {selectedTool.bestFor && selectedTool.bestFor.length > 0 && (
              <div className="space-y-2">
                <h3
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Target
                    className="w-4 h-4"
                    style={{ color: "var(--accent)" }}
                  />
                  Best Suited For
                </h3>
                <ul className="space-y-1 ml-6 list-disc">
                  {selectedTool.bestFor.map((item) => (
                    <li
                      key={item}
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            {selectedTool.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedTool.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{
                      color: "var(--accent)",
                      background: "var(--accent-subtle)",
                      border: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--surface-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "var(--accent-subtle)")
                    }
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="py-6 text-center text-sm"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
        }}
      >
        Team Entra Norway &copy; {new Date().getFullYear()} — Toolbox
      </footer>
    </main>
  );
}
