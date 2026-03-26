// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v3.0
// Description: Export modal component for sharing and downloading timelines
// Purpose: Provides UI for downloading PNG/JSON and copying shareable links
// v3.0: Theme-aware dark/light mode styling via CSS variables.

"use client";

import { useState } from "react";
import { X, Download, Share2, FileJson, Check, Copy } from "lucide-react";
import { ExportModalProps } from "../lib/types";

export default function ExportModal({
  isOpen,
  onClose,
  onDownloadImage,
  onDownloadJSON,
  shareableLink,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "var(--modal-overlay)" }}
    >
      <div
        className="rounded-xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Export & Share
        </h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Download your timeline or share it with others
        </p>

        {/* Export Options */}
        <div className="space-y-4">
          {/* Download PNG */}
          <button
            onClick={() => {
              onDownloadImage();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left group"
            style={{ border: "2px solid var(--border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "var(--accent-subtle)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "var(--accent-subtle)" }}
            >
              <Download
                className="w-6 h-6"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="flex-1">
              <h3
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Download as PNG
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Save timeline as an image for Word, PowerPoint, etc.
              </p>
            </div>
          </button>

          {/* Download JSON */}
          <button
            onClick={() => {
              onDownloadJSON();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left group"
            style={{ border: "2px solid var(--border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "var(--accent-subtle)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "var(--accent-subtle)" }}
            >
              <FileJson
                className="w-6 h-6"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="flex-1">
              <h3
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Download as JSON
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Save timeline data to import later
              </p>
            </div>
          </button>

          {/* Share Link */}
          <div
            className="rounded-lg p-4"
            style={{ border: "2px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent-subtle)" }}
              >
                <Share2
                  className="w-6 h-6"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <div className="flex-1">
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Shareable Link
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Share this link with others to view the timeline
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--text-secondary)",
                }}
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg font-medium transition-all text-white"
                style={{
                  background: copied ? "#16a34a" : "var(--accent)",
                }}
              >
                {copied ? (
                  <Check className="w-4 h-4 inline" />
                ) : (
                  <Copy className="w-4 h-4 inline" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-6 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
            style={{
              background: "var(--surface-hover)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--border)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
