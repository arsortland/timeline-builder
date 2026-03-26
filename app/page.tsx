// Created: 2026-02-20
// Updated: 2026-03-27
// Version: v4.0
// Description: Timeline Builder - Main application page
// Purpose: Single-page application for creating, visualizing, and sharing project timelines.
//          v3.0: Sidebar layout, dark/light theme support, mobile responsive.
//          v4.0: Added Classic/Project timeline style tabs with conditional rendering.

"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Header";
import TimelineViewer from "./components/TimelineViewer";
import ProjectTimelineViewer from "./components/ProjectTimelineViewer";
import DataTable from "./components/DataTable";
import ExportModal from "./components/ExportModal";
import { TimelineData, Milestone, TimelineStyle } from "./lib/types";
import {
  createInitialTimelineData,
  saveToLocalStorage,
  loadFromLocalStorage,
  decodeTimelineData,
  generateShareableLink,
  getLastSavedTime,
  clearLocalStorage,
} from "./lib/timelineUtils";
import {
  exportTimelineAsImage,
  downloadTimelineAsJSON,
  sanitizeFilename,
} from "./lib/exportUtils";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";
const TIMELINE_STYLE_KEY = "timeline-style";

export default function Home() {
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(),
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [timelineStyle, setTimelineStyle] = useState<TimelineStyle>("classic");
  const timelineElementRef = useRef<HTMLElement | null>(null);

  // Load sidebar and timeline style preferences
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "true") setSidebarCollapsed(true);
    const storedStyle = localStorage.getItem(TIMELINE_STYLE_KEY);
    if (storedStyle === "classic" || storedStyle === "project") {
      setTimelineStyle(storedStyle);
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

  // Update URL when data changes
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

  const handleToggleSidebar = () => {
    // On mobile: toggle overlay
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      // On desktop: collapse/expand
      setSidebarCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
        return next;
      });
    }
  };

  const handleStyleChange = (style: TimelineStyle) => {
    setTimelineStyle(style);
    localStorage.setItem(TIMELINE_STYLE_KEY, style);
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

      {/* Sidebar — hidden on mobile, shown as overlay when mobileSidebarOpen */}
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
        <TopBar
          projectName={timelineData.projectName}
          onProjectNameChange={handleProjectNameChange}
          onDownloadImage={handleDownloadImage}
          onShareLink={handleShareLink}
          onClear={handleClear}
          lastSaved={lastSaved || undefined}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-8 space-y-8">
          {/* Timeline Style Tabs */}
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
          />

          {/* Footer */}
          <footer
            className="py-6 text-center text-sm"
            style={{
              color: "var(--text-muted)",
              borderTop: "1px solid var(--border)",
            }}
          >
            Timeline Builder &copy; {new Date().getFullYear()} — Create and
            share project timelines
          </footer>
        </main>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onDownloadImage={handleDownloadImage}
        onDownloadJSON={handleDownloadJSON}
        shareableLink={shareableLink}
      />
    </div>
  );
}
