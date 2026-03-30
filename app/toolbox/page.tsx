// Created: 2026-03-30
// Updated: 2026-03-30
// Version: v1.2 - Added source type dots and filter dropdown for tags + source type
// Description: Toolbox page with searchable tool cards, filter dropdown, and detail modal
// Purpose: Displays a grid of Azure/Entra tools the team uses.
//          Search supports plain text and regex. Cards open a detail modal
//          with full description and external links.
//          v1.1: Enlarged modal, added Quick Guide and Best Suited For sections
//          v1.2: Source type colored dots on cards/modal, filter by source type and tags

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  X,
  ExternalLink,
  Tag,
  BookOpen,
  Target,
  SlidersHorizontal,
} from "lucide-react";
import { tools } from "../lib/toolboxData";
import { Tool, ToolSourceType } from "../lib/types";

const SOURCE_CONFIG: Record<ToolSourceType, { color: string; label: string }> =
  {
    microsoft: { color: "#22c55e", label: "Microsoft" },
    opensource: { color: "#3b82f6", label: "Open Source" },
    personal: { color: "#f97316", label: "Personal" },
  };

export default function ToolboxPage() {
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Set<ToolSourceType>>(
    new Set(),
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(
    () => [...new Set(tools.flatMap((t) => t.tags))].sort(),
    [],
  );

  const activeFilterCount = selectedSources.size + selectedTags.size;

  // Close filter dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const toggleSource = (s: ToolSourceType) =>
    setSelectedSources((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });

  const clearFilters = () => {
    setSelectedSources(new Set());
    setSelectedTags(new Set());
  };

  const filtered = useMemo(() => {
    let result = tools;

    // Source type filter (OR within sources)
    if (selectedSources.size > 0) {
      result = result.filter((t) => selectedSources.has(t.sourceType));
    }

    // Tag filter (OR within tags)
    if (selectedTags.size > 0) {
      result = result.filter((t) =>
        t.tags.some((tag) => selectedTags.has(tag)),
      );
    }

    // Search filter
    if (!query.trim()) return result;

    try {
      const re = new RegExp(query, "i");
      return result.filter(
        (t) =>
          re.test(t.name) ||
          re.test(t.description) ||
          t.tags.some((tag) => re.test(tag)),
      );
    } catch {
      const lower = query.toLowerCase();
      return result.filter(
        (t) =>
          t.name.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lower)),
      );
    }
  }, [query, selectedSources, selectedTags]);

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

      {/* Search bar + Filter button */}
      <div className="flex items-start gap-3 max-w-xl">
        <div className="relative flex-1 max-w-md">
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

        {/* Filter button + dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              color:
                activeFilterCount > 0
                  ? "var(--accent)"
                  : "var(--text-secondary)",
              background:
                activeFilterCount > 0
                  ? "var(--accent-subtle)"
                  : "var(--input-bg)",
              border: `1px solid ${activeFilterCount > 0 ? "var(--accent)" : "var(--input-border)"}`,
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                style={{
                  background: "var(--accent)",
                  color: "var(--surface)",
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter dropdown panel */}
          {filterOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-80 rounded-xl p-4 space-y-4 shadow-xl z-50"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Source type section */}
              <div className="space-y-2">
                <h4
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Source Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SOURCE_CONFIG) as ToolSourceType[]).map(
                    (src) => {
                      const active = selectedSources.has(src);
                      const { color, label } = SOURCE_CONFIG[src];
                      return (
                        <button
                          key={src}
                          onClick={() => toggleSource(src)}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all"
                          style={{
                            background: active
                              ? `${color}20`
                              : "var(--input-bg)",
                            color: active ? color : "var(--text-secondary)",
                            border: `1px solid ${active ? color : "var(--input-border)"}`,
                          }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                            style={{ background: color }}
                          />
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Tags section */}
              <div className="space-y-2">
                <h4
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {allTags.map((tag) => {
                    const active = selectedTags.has(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all"
                        style={{
                          background: active
                            ? "var(--accent-subtle)"
                            : "var(--input-bg)",
                          color: active
                            ? "var(--accent)"
                            : "var(--text-secondary)",
                          border: `1px solid ${active ? "var(--accent)" : "transparent"}`,
                        }}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full text-xs font-medium py-1.5 rounded-lg transition-colors"
                  style={{
                    color: "var(--text-muted)",
                    background: "var(--input-bg)",
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
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
                className="text-base font-semibold mb-1 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  title={SOURCE_CONFIG[tool.sourceType].label}
                  style={{ background: SOURCE_CONFIG[tool.sourceType].color }}
                />
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
              <div className="space-y-1">
                <h2
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                    style={{
                      background: SOURCE_CONFIG[selectedTool.sourceType].color,
                    }}
                  />
                  {selectedTool.name}
                </h2>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: SOURCE_CONFIG[selectedTool.sourceType].color,
                  }}
                >
                  {SOURCE_CONFIG[selectedTool.sourceType].label}
                </span>
              </div>
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
