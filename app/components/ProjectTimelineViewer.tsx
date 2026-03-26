// Created: 2026-03-26
// Version: v2.0
// Description: Project-style timeline visualization component
// Purpose: Renders milestones in a "project presentation" style inspired by the reference
//          design — numbered milestones alternating above/below a horizontal line, each
//          with a colored icon circle on the line, connected by vertical lines to text
//          blocks showing number, title, date, and description.
//          Uses the same verticalPosition system as the classic timeline:
//          positive = above, negative = below. Magnitude controls line height.
//          Does NOT use vis-timeline — pure React/CSS rendering.

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { TimelineViewerProps } from "../lib/types";
import { sortMilestonesByDate } from "../lib/timelineUtils";
import { getIconByName } from "./IconPicker";

const CONTAINER_HEIGHT = 520;
const AXIS_Y = CONTAINER_HEIGHT * 0.5;
const NODE_SIZE = 48;
const MIN_LINE_HEIGHT = 24;
const LINE_SCALE = 2.2;
const TEXT_MAX_WIDTH = 140;

export default function ProjectTimelineViewer({
  milestones,
  onTimelineReady,
}: TimelineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Notify parent of our container ref for export support
  useEffect(() => {
    if (onTimelineReady) onTimelineReady(containerRef.current);
  }, [onTimelineReady]);

  // Track container width for responsive layout
  const measureWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    measureWidth();
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => measureWidth());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureWidth]);

  const sorted = sortMilestonesByDate(milestones);

  // Compute per-milestone layout data
  const padding = 64; // horizontal padding from edges
  const usableWidth = containerWidth - padding * 2;
  const spacing = sorted.length > 1 ? usableWidth / (sorted.length - 1) : 0;

  const nodes = sorted.map((m, i) => {
    const x = sorted.length === 1 ? containerWidth / 2 : padding + i * spacing;
    const absPos = Math.abs(m.verticalPosition) || 10;
    const lineHeight = MIN_LINE_HEIGHT + absPos * LINE_SCALE;
    const isAbove = m.verticalPosition >= 0;
    const displayNumber = m.number != null ? m.number : i + 1;
    const formattedNumber = String(displayNumber).padStart(2, "0");
    const color = m.color || "#d97706";
    const Icon = m.icon ? getIconByName(m.icon) : null;

    // Format date label
    const d = new Date(m.date);
    const year = d.getFullYear();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateLabel = `${monthNames[d.getMonth()]} ${year}`;

    return {
      id: m.id,
      x,
      isAbove,
      lineHeight,
      number: formattedNumber,
      title: m.title || m.description || "Untitled",
      dateLabel,
      description: m.description || "",
      color,
      Icon,
    };
  });

  return (
    <div
      className="rounded-xl shadow-lg p-6 transition-colors"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Timeline Preview
      </h2>

      {milestones.length === 0 ? (
        <div
          className="rounded-lg border-2 border-dashed p-12 text-center"
          style={{
            background: "var(--surface-hover)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            No milestones to display
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            Add milestones below to see them on the timeline
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          id="timeline-container"
          className="rounded-lg shadow-md"
          style={{
            background: "var(--timeline-card-bg)",
            border: "1px solid var(--timeline-card-border)",
            height: `${CONTAINER_HEIGHT}px`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Project title at top-center */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              zIndex: 20,
            }}
          >
            {sorted.length > 0 ? "Project Timeline" : ""}
          </div>

          {/* Horizontal timeline line */}
          <div
            style={{
              position: "absolute",
              left: padding - 16,
              right: padding - 16,
              top: AXIS_Y,
              height: 3,
              backgroundColor: "var(--timeline-line)",
              zIndex: 5,
            }}
          />

          {/* Line end caps (small vertical bars) */}
          <div
            style={{
              position: "absolute",
              left: padding - 16,
              top: AXIS_Y - 6,
              width: 3,
              height: 15,
              backgroundColor: "var(--timeline-line)",
              zIndex: 6,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: padding - 16,
              top: AXIS_Y - 6,
              width: 3,
              height: 15,
              backgroundColor: "var(--timeline-line)",
              zIndex: 6,
            }}
          />

          {/* Milestone nodes */}
          {nodes.map((n) => {
            const nodeTop = AXIS_Y - NODE_SIZE / 2;

            if (n.isAbove) {
              // Text above: number → title → date → description, then connecting line, then node circle
              const lineTop = AXIS_Y - NODE_SIZE / 2 - n.lineHeight;
              return (
                <div
                  key={n.id}
                  className="milestone-node"
                  style={{ pointerEvents: "none" }}
                >
                  {/* Icon circle on the axis */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x - NODE_SIZE / 2,
                      top: nodeTop,
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      borderRadius: "50%",
                      backgroundColor: `${n.color}20`,
                      border: `2.5px solid ${n.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    {n.Icon ? (
                      <n.Icon
                        style={{ width: 22, height: 22, color: n.color }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: n.color,
                        }}
                      />
                    )}
                  </div>

                  {/* Vertical connecting line going UP */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x - 1,
                      top: lineTop,
                      width: 2,
                      height: n.lineHeight,
                      backgroundColor: `${n.color}50`,
                      zIndex: 8,
                    }}
                  />

                  {/* Text block above (positioned from bottom up) */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x,
                      bottom: CONTAINER_HEIGHT - lineTop + 4,
                      transform: "translateX(-50%)",
                      textAlign: "center",
                      maxWidth: TEXT_MAX_WIDTH,
                      zIndex: 9,
                      pointerEvents: "auto",
                    }}
                  >
                    {/* Number */}
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                        marginBottom: 2,
                      }}
                    >
                      {n.number}
                    </div>
                    {/* Date */}
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      {n.dateLabel}
                    </div>
                    {/* Title */}
                    {n.title && (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          marginBottom: 2,
                          wordBreak: "break-word",
                        }}
                      >
                        {n.title}
                      </div>
                    )}
                    {/* Description */}
                    {n.description && n.title !== n.description && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                        }}
                      >
                        {n.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              // Below: node circle → connecting line → date → description → title → number
              const lineTop = AXIS_Y + NODE_SIZE / 2;
              return (
                <div
                  key={n.id}
                  className="milestone-node"
                  style={{ pointerEvents: "none" }}
                >
                  {/* Icon circle on the axis */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x - NODE_SIZE / 2,
                      top: nodeTop,
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      borderRadius: "50%",
                      backgroundColor: `${n.color}20`,
                      border: `2.5px solid ${n.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    {n.Icon ? (
                      <n.Icon
                        style={{ width: 22, height: 22, color: n.color }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: n.color,
                        }}
                      />
                    )}
                  </div>

                  {/* Vertical connecting line going DOWN */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x - 1,
                      top: lineTop,
                      width: 2,
                      height: n.lineHeight,
                      backgroundColor: `${n.color}50`,
                      zIndex: 8,
                    }}
                  />

                  {/* Text block below */}
                  <div
                    style={{
                      position: "absolute",
                      left: n.x,
                      top: lineTop + n.lineHeight + 4,
                      transform: "translateX(-50%)",
                      textAlign: "center",
                      maxWidth: TEXT_MAX_WIDTH,
                      zIndex: 9,
                      pointerEvents: "auto",
                    }}
                  >
                    {/* Date */}
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      {n.dateLabel}
                    </div>
                    {/* Description */}
                    {n.description && n.title !== n.description && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                          marginBottom: 2,
                        }}
                      >
                        {n.description}
                      </div>
                    )}
                    {/* Title */}
                    {n.title && (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          marginBottom: 2,
                          wordBreak: "break-word",
                        }}
                      >
                        {n.title}
                      </div>
                    )}
                    {/* Number */}
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      {n.number}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      <div
        className="mt-4 flex items-center justify-between text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        <p>
          <strong>Project:</strong> Milestones ordered chronologically with
          numbered markers
        </p>
        <p>
          {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
