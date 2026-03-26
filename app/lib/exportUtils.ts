// Created: 2026-02-20
// Version: v2.0
// Description: Export utilities for timeline visualization
// Purpose: Handle image export (PNG/JPG) and JSON download functionality

import html2canvas from "html2canvas";
import { TimelineData, ExportOptions } from "./types";

/**
 * Export timeline element as an image file
 */
export async function exportTimelineAsImage(
  element: HTMLElement,
  filename: string = "timeline",
  options: Partial<ExportOptions> = {},
): Promise<void> {
  const defaultOptions: ExportOptions = {
    format: "png",
    quality: 1.0,
    backgroundColor: "#ffffff",
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // Create canvas from DOM element
    const canvas = await html2canvas(element, {
      backgroundColor: finalOptions.backgroundColor,
      scale: 2, // Higher DPI for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.${finalOptions.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      `image/${finalOptions.format}`,
      finalOptions.quality,
    );
  } catch (error) {
    console.error("Error exporting timeline as image:", error);
    throw new Error("Failed to export timeline as image");
  }
}

/**
 * Download timeline data as JSON file
 */
export function downloadTimelineAsJSON(
  data: TimelineData,
  filename: string = "timeline",
): void {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading JSON:", error);
    throw new Error("Failed to download timeline data");
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

/**
 * Load timeline data from JSON file upload
 */
export function loadTimelineFromFile(file: File): Promise<TimelineData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json) as TimelineData;
        resolve(data);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Sanitize filename for download
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_]/gi, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
}
