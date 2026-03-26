// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v3.0
// Description: Utility functions for timeline data management
// Purpose: Handle URL encoding/decoding, localStorage, data serialization, and timeline manipulation
//          v3.0: Updated createEmptyMilestone with title, icon, number defaults

import LZString from "lz-string";
import { TimelineData, Milestone, TimelineItem } from "./types";

/**
 * Generate a unique ID for milestones
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new empty milestone with alternating position.
 * First milestone defaults to 10 (above), next to -10 (below), etc.
 * @param existingMilestones - current milestones to determine alternation
 */
export function createEmptyMilestone(
  existingMilestones: Milestone[] = [],
): Milestone {
  const today = new Date().toISOString().split("T")[0];
  // Determine default position: alternate 10 / -10 based on previous milestone
  let defaultPosition = 10; // first milestone → above
  if (existingMilestones.length > 0) {
    const lastPosition =
      existingMilestones[existingMilestones.length - 1].verticalPosition;
    defaultPosition = lastPosition > 0 ? -10 : 10;
  }
  return {
    id: generateId(),
    date: today,
    description: "",
    verticalPosition: defaultPosition,
    color: "#d97706", // Default amber color (matches timeline)
    title: "",
    number: existingMilestones.length + 1,
  };
}

/**
 * Convert timeline data to compressed URL parameter
 */
export function encodeTimelineData(data: TimelineData): string {
  try {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (error) {
    console.error("Error encoding timeline data:", error);
    return "";
  }
}

/**
 * Decode timeline data from URL parameter
 */
export function decodeTimelineData(encoded: string): TimelineData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    const data = JSON.parse(decompressed) as TimelineData;
    return data;
  } catch (error) {
    console.error("Error decoding timeline data:", error);
    return null;
  }
}

/**
 * Generate a shareable URL with encoded timeline data
 */
export function generateShareableLink(
  data: TimelineData,
  baseUrl: string,
): string {
  const encoded = encodeTimelineData(data);
  return `${baseUrl}?data=${encoded}`;
}

/**
 * Save timeline data to localStorage
 */
export function saveToLocalStorage(data: TimelineData): void {
  try {
    localStorage.setItem("timeline-builder-autosave", JSON.stringify(data));
    localStorage.setItem(
      "timeline-builder-last-saved",
      new Date().toISOString(),
    );
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Load timeline data from localStorage
 */
export function loadFromLocalStorage(): TimelineData | null {
  try {
    const saved = localStorage.getItem("timeline-builder-autosave");
    if (!saved) return null;
    return JSON.parse(saved) as TimelineData;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
}

/**
 * Get last saved timestamp from localStorage
 */
export function getLastSavedTime(): string | null {
  try {
    return localStorage.getItem("timeline-builder-last-saved");
  } catch (error) {
    return null;
  }
}

/**
 * Clear localStorage data
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem("timeline-builder-autosave");
    localStorage.removeItem("timeline-builder-last-saved");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Convert milestones to vis-timeline format
 */
export function convertToTimelineItems(
  milestones: Milestone[],
): TimelineItem[] {
  return milestones.map((milestone) => ({
    id: milestone.id,
    content: milestone.description || "Untitled",
    start: new Date(milestone.date),
    type: "point",
    className: getPositionClassName(milestone.verticalPosition),
    style: milestone.color
      ? `background-color: ${milestone.color}; border-color: ${milestone.color};`
      : undefined,
  }));
}

/**
 * Get CSS class name based on vertical position
 */
function getPositionClassName(position: number): string {
  if (position > 0) {
    return `milestone-below milestone-offset-${Math.abs(position)}`;
  } else if (position < 0) {
    return `milestone-above milestone-offset-${Math.abs(position)}`;
  }
  return "milestone-center";
}

/**
 * Sort milestones by date
 */
export function sortMilestonesByDate(milestones: Milestone[]): Milestone[] {
  return [...milestones].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

/**
 * Validate milestone data
 */
export function validateMilestone(milestone: Milestone): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!milestone.date) {
    errors.push("Date is required");
  } else if (isNaN(new Date(milestone.date).getTime())) {
    errors.push("Invalid date format");
  }

  if (!milestone.description || milestone.description.trim() === "") {
    errors.push("Description is required");
  }

  if (typeof milestone.verticalPosition !== "number") {
    errors.push("Vertical position must be a number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create initial timeline data
 */
export function createInitialTimelineData(): TimelineData {
  return {
    projectName: "Untitled Timeline",
    milestones: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
