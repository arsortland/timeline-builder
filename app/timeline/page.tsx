// Created: 2026-03-30
// Version: v1.0
// Description: Timeline Builder page (moved from root page.tsx)
// Purpose: Full timeline creation, visualization (Classic/Project styles), data table,
//          export modal, auto-save, and share-link generation.

"use client";

import { useState, useEffect, useRef } from "react";
import TopBar from "../components/Header";
import TimelineViewer from "../components/TimelineViewer";
import ProjectTimelineViewer from "../components/ProjectTimelineViewer";
import DataTable from "../components/DataTable";
import ExportModal from "../components/ExportModal";
import { TimelineData, Milestone, TimelineStyle } from "../lib/types";
import {
  createInitialTimelineData,
  saveToLocalStorage,
  loadFromLocalStorage,
  decodeTimelineData,
  generateShareableLink,
  getLastSavedTime,
  clearLocalStorage,
} from "../lib/timelineUtils";
import {
  exportTimelineAsImage,
  downloadTimelineAsJSON,
  sanitizeFilename,
} from "../lib/exportUtils";

const TIMELINE_STYLE_KEY = "timeline-style";
const TIMELINE_COLOR_KEY = "timeline-line-color";

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(),
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [timelineStyle, setTimelineStyle] = useState<TimelineStyle>("classic");
  const [timelineColor, setTimelineColor] = useState<string>("");
  const timelineElementRef = useRef<HTMLElement | null>(null);

  // Load timeline style preference
  useEffect(() => {
    const storedStyle = localStorage.getItem(TIMELINE_STYLE_KEY);
    if (storedStyle === "classic" || storedStyle === "project") {
      setTimelineStyle(storedStyle);
    }
    const storedColor = localStorage.getItem(TIMELINE_COLOR_KEY);
    if (storedColor) {
      setTimelineColor(storedColor);
    }
  }, []);

  // Load from URL or localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const timelineParam = urlParams.get("timeline");

    if (timelineParam) {
      try {
        const decodedData = decodeTimelineData(timelineParam);
        if (decodedData) {
          setTimelineData(decodedData);
        }
        return;
      } catch (error) {
        console.error("Failed to load timeline from URL:", error);
      }
    }

    const savedData = loadFromLocalStorage();
    if (savedData) {
      setTimelineData(savedData);
      setLastSaved(getLastSavedTime() || "");
    }
  }, []);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (
      timelineData.milestones.length > 0 ||
      timelineData.projectName !== "Untitled Timeline"
    ) {
      const updatedData = {
        ...timelineData,
        updatedAt: new Date().toISOString(),
      };
      saveToLocalStorage(updatedData);
      setLastSaved(new Date().toISOString());
    }
  }, [timelineData]);

  // Update shareable link when data changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (timelineData.milestones.length === 0) return;

    const link = generateShareableLink(
      timelineData,
      window.location.origin + window.location.pathname,
    );
    setShareableLink(link);
  }, [timelineData]);

  const handleProjectNameChange = (name: string) => {
    setTimelineData((prev) => ({ ...prev, projectName: name }));
  };

  const handleMilestonesChange = (milestones: Milestone[]) => {
    setTimelineData((prev) => ({ ...prev, milestones }));
  };

  const handleDownloadImage = async () => {
    if (!timelineElementRef.current) {
      alert("Timeline not ready. Please try again.");
      return;
    }

    try {
      const filename = sanitizeFilename(timelineData.projectName);
      await exportTimelineAsImage(timelineElementRef.current, filename);
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    }
  };

  const handleDownloadJSON = () => {
    try {
      const filename = sanitizeFilename(timelineData.projectName);
      downloadTimelineAsJSON(timelineData, filename);
    } catch (error) {
      console.error("Error downloading JSON:", error);
      alert("Failed to download JSON. Please try again.");
    }
  };

  const handleShareLink = () => {
    setShowExportModal(true);
  };

  const handleClear = () => {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      clearLocalStorage();
      setTimelineData(createInitialTimelineData());
      setLastSaved("");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  };

  const handleTimelineReady = (element: HTMLElement | null) => {
    if (element) {
      timelineElementRef.current = element;
    }
  };

  const handleStyleChange = (style: TimelineStyle) => {
    setTimelineStyle(style);
    localStorage.setItem(TIMELINE_STYLE_KEY, style);
  };

  const handleTimelineColorChange = (color: string) => {
    setTimelineColor(color);
    localStorage.setItem(TIMELINE_COLOR_KEY, color);
  };

  return (
    <>
      <TopBar
        projectName={timelineData.projectName}
        onProjectNameChange={handleProjectNameChange}
        onDownloadImage={handleDownloadImage}
        onShareLink={handleShareLink}
        onClear={handleClear}
        lastSaved={lastSaved || undefined}
      />

      <main
        className="flex-1 overflow-y-auto px-6 lg:px-8 py-8 space-y-8"
        style={
          timelineColor
            ? ({ "--timeline-line": timelineColor } as React.CSSProperties)
            : undefined
        }
      >
        {/* Timeline Style Tabs + Line Color */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleStyleChange("classic")}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background:
                  timelineStyle === "classic"
                    ? "var(--accent)"
                    : "var(--surface)",
                color:
                  timelineStyle === "classic"
                    ? "#fff"
                    : "var(--text-secondary)",
                border: `1px solid ${timelineStyle === "classic" ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              Classic
            </button>
            <button
              onClick={() => handleStyleChange("project")}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background:
                  timelineStyle === "project"
                    ? "var(--accent)"
                    : "var(--surface)",
                color:
                  timelineStyle === "project"
                    ? "#fff"
                    : "var(--text-secondary)",
                border: `1px solid ${timelineStyle === "project" ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              Project
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Line color
            </label>
            <input
              type="color"
              value={timelineColor || "#eab308"}
              onChange={(e) => handleTimelineColorChange(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer"
              style={{ border: "1px solid var(--border)" }}
            />
            {timelineColor && (
              <button
                onClick={() => handleTimelineColorChange("")}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--surface-hover)",
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {timelineStyle === "classic" ? (
          <TimelineViewer
            milestones={timelineData.milestones}
            onTimelineReady={handleTimelineReady}
          />
        ) : (
          <ProjectTimelineViewer
            milestones={timelineData.milestones}
            onTimelineReady={handleTimelineReady}
          />
        )}

        <DataTable
          milestones={timelineData.milestones}
          onChange={handleMilestonesChange}
          timelineStyle={timelineStyle}
        />

        {/* Footer */}
        <footer
          className="py-6 text-center text-sm"
          style={{
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border)",
          }}
        >
          Team Entra Norway &copy; {new Date().getFullYear()} — Timeline Builder
        </footer>
      </main>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onDownloadImage={handleDownloadImage}
        onDownloadJSON={handleDownloadJSON}
        shareableLink={shareableLink}
      />
    </>
  );
}
