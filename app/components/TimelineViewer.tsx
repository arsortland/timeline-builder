// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v6.0
// Description: Timeline visualization component with custom milestone rendering
// Purpose: Uses vis-timeline for the time axis only, renders milestones as custom
// React elements with dots on the axis, connecting vertical lines, and text labels.
// Positive verticalPosition → above the line, negative → below the line.
// The axis is centered in the container to allow room in both directions.
// v5.1: Added formatted date labels on the timeline next to each milestone dot.
// v5.2: Text labels now wrap to multiple lines (max 120px wide) for long descriptions,
//       with edge-aware positioning so labels near container edges don't get clipped.
// v6.0: Theme-aware dark/light mode styling via CSS variables.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { TimelineViewerProps } from "../lib/types";

interface MilestoneRenderData {
  id: string;
  x: number;
  text: string;
  dateLabel: string; // formatted date shown on the axis
  lineHeight: number;
  isAbove: boolean; // true = above the line (positive), false = below (negative)
  color: string;
  containerWidth: number; // container width for edge-aware positioning
}

// Fixed layout constants
const CONTAINER_HEIGHT = 500;
const AXIS_CENTER_Y = CONTAINER_HEIGHT * 0.5; // axis at exact vertical center
const DOT_SIZE = 14;

export default function TimelineViewer({
  milestones,
  onTimelineReady,
}: TimelineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [renderData, setRenderData] = useState<MilestoneRenderData[]>([]);
  const [dateRangeLabel, setDateRangeLabel] = useState<string>("");
  const [tickPositions, setTickPositions] = useState<number[]>([]);

  // Store reference to MutationObserver so we can pause it during label hiding
  const mutObserverRef = useRef<MutationObserver | null>(null);

  // Map milestone dates to pixel x-coordinates
  const updateLayout = useCallback(() => {
    if (
      !timelineRef.current ||
      !containerRef.current ||
      !axisRef.current ||
      milestones.length === 0
    ) {
      setRenderData([]);
      return;
    }

    try {
      const windowRange = timelineRef.current.getWindow();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Find the center panel (the content area where dates map to pixels)
      const centerPanel = axisRef.current.querySelector(
        ".vis-panel.vis-center",
      );
      if (!centerPanel) return;
      const panelRect = centerPanel.getBoundingClientRect();
      const panelLeft = panelRect.left - containerRect.left;
      const panelWidth = panelRect.width;

      const totalMs = windowRange.end.getTime() - windowRange.start.getTime();
      if (totalMs <= 0) return;

      const cw = containerRect.width;

      const data = milestones.map((m) => {
        const milestoneDate = new Date(m.date);
        const dateMs = milestoneDate.getTime() - windowRange.start.getTime();
        const x = panelLeft + (dateMs / totalMs) * panelWidth;
        const absPos = Math.abs(m.verticalPosition);
        // Format date as "D MMM" (e.g. "15 Mar") or "D MMM YYYY" for multi-year spans
        const day = milestoneDate.getDate();
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
        const mon = monthNames[milestoneDate.getMonth()];
        const yr = milestoneDate.getFullYear();
        const spanYears = totalMs > 365 * 24 * 60 * 60 * 1000;
        const dateLabel = spanYears ? `${day} ${mon} ${yr}` : `${day} ${mon}`;
        return {
          id: m.id,
          x,
          text: m.description || "Untitled",
          dateLabel,
          lineHeight: 20 + absPos * 2,
          isAbove: m.verticalPosition > 0, // positive = above
          color: m.color || "#d97706",
          containerWidth: cw,
        };
      });

      setRenderData(data);

      // Hide vis-timeline axis labels that overlap with milestone positions
      const hideOverlappingLabels = () => {
        if (!axisRef.current || !containerRef.current) return;
        // Pause MutationObserver to prevent infinite loop
        if (mutObserverRef.current) mutObserverRef.current.disconnect();

        const cRect = containerRef.current.getBoundingClientRect();
        const milestoneXPositions = data.map((d) => d.x);
        // Select all axis label elements (minor + major, in all panels) but skip measure elements
        const axisLabels = axisRef.current.querySelectorAll(
          ".vis-text:not(.vis-measure)",
        );

        // First pass: reset all labels to visible so getBoundingClientRect works correctly
        axisLabels.forEach((label) => {
          (label as HTMLElement).style.visibility = "visible";
        });

        // Second pass: hide labels that overlap with milestones
        axisLabels.forEach((label) => {
          const el = label as HTMLElement;
          const labelRect = el.getBoundingClientRect();
          if (labelRect.width === 0) return;
          const labelCenterX =
            labelRect.left + labelRect.width / 2 - cRect.left;
          const tooClose = milestoneXPositions.some(
            (mx) => Math.abs(mx - labelCenterX) < 35,
          );
          if (tooClose) el.style.visibility = "hidden";
        });

        // Also hide grid lines near milestones
        const gridLines = axisRef.current.querySelectorAll(".vis-grid");
        gridLines.forEach((line) => {
          const el = line as HTMLElement;
          const lineRect = el.getBoundingClientRect();
          if (lineRect.width === 0 && lineRect.height === 0) return;
          const lineX = lineRect.left - cRect.left;
          const tooClose = milestoneXPositions.some(
            (mx) => Math.abs(mx - lineX) < 20,
          );
          el.style.visibility = tooClose ? "hidden" : "visible";
        });

        // Collect tick positions from ALL labels (before filtering by visibility)
        const ticks: number[] = [];
        axisLabels.forEach((label) => {
          const el = label as HTMLElement;
          const labelRect = el.getBoundingClientRect();
          if (labelRect.width > 0) {
            ticks.push(labelRect.left + labelRect.width / 2 - cRect.left);
          }
        });
        setTickPositions(ticks);

        // Re-attach MutationObserver after hiding
        if (mutObserverRef.current && axisRef.current) {
          mutObserverRef.current.observe(axisRef.current, {
            childList: true,
            subtree: true,
          });
        }
      };

      // Run immediately and after vis-timeline finishes its internal redraws
      hideOverlappingLabels();
      requestAnimationFrame(hideOverlappingLabels);
      setTimeout(hideOverlappingLabels, 100);
      setTimeout(hideOverlappingLabels, 300);
    } catch (e) {
      console.error("Error calculating milestone positions:", e);
    }
  }, [milestones]);

  // Create / update vis-timeline (axis only, no items)
  useEffect(() => {
    if (!axisRef.current) return;

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    if (milestones.length > 0) {
      const dates = milestones.map((m) => new Date(m.date));
      minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      // Set the date range label for top-center display
      const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const startStr = fmt(minDate);
      const endStr = fmt(maxDate);
      setDateRangeLabel(
        startStr === endStr ? startStr : `${startStr} - ${endStr}`,
      );
      const range = maxDate.getTime() - minDate.getTime();
      const padding = range * 0.1 || 1000 * 60 * 60 * 24 * 7;
      minDate = new Date(minDate.getTime() - padding);
      maxDate = new Date(maxDate.getTime() + padding);
    }

    if (!timelineRef.current) {
      const items = new DataSet<any>([]);

      const options: any = {
        width: "100%",
        height: "20px",
        margin: { item: 0, axis: 5 },
        orientation: { axis: "top", item: "top" },
        zoomable: false,
        moveable: false,
        showCurrentTime: false,
        showMajorLabels: false,
        showMinorLabels: true,
        format: {
          minorLabels: { day: "D", month: "MMM", year: "YYYY" },
          majorLabels: { day: "MMMM", month: "MMMM YYYY", year: "YYYY" },
        },
        stack: false,
      };

      if (minDate && maxDate) {
        options.min = minDate;
        options.max = maxDate;
        options.start = minDate;
        options.end = maxDate;
      }

      timelineRef.current = new Timeline(axisRef.current, items, options);

      if (onTimelineReady) {
        onTimelineReady(containerRef.current);
      }

      setTimeout(updateLayout, 200);
    } else {
      if (minDate && maxDate) {
        timelineRef.current.setWindow(minDate, maxDate, { animation: false });
        timelineRef.current.setOptions({ min: minDate, max: maxDate });
      }
      setTimeout(updateLayout, 200);
    }
  }, [milestones, onTimelineReady, updateLayout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, []);

  // Re-compute pixel positions when the container resizes
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => setTimeout(updateLayout, 50));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateLayout]);

  // Watch for vis-timeline DOM mutations and re-hide overlapping axis labels
  useEffect(() => {
    if (!axisRef.current) return;
    const mutObserver = new MutationObserver(() => {
      setTimeout(updateLayout, 20);
    });
    mutObserverRef.current = mutObserver;
    mutObserver.observe(axisRef.current, { childList: true, subtree: true });
    return () => {
      mutObserver.disconnect();
      mutObserverRef.current = null;
    };
  }, [updateLayout]);

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
          className="timeline-wrapper rounded-lg shadow-md"
          style={{
            background: "var(--timeline-card-bg)",
            border: "1px solid var(--timeline-card-border)",
            height: `${CONTAINER_HEIGHT}px`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Date range label at top-center */}
          {dateRangeLabel && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--timeline-date)",
                zIndex: 20,
                whiteSpace: "nowrap",
              }}
            >
              {dateRangeLabel}
            </div>
          )}
          {/* vis-timeline axis — date labels positioned just above the horizontal line */}
          <div
            ref={axisRef}
            className="timeline-axis"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: AXIS_CENTER_Y - 20, // position axis dates just above the timeline line (20px axis height)
            }}
          />

          {/* Horizontal timeline line at our fixed center Y */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: AXIS_CENTER_Y,
              height: 3,
              backgroundColor: "var(--timeline-line)",
              zIndex: 5,
            }}
          />

          {/* Custom tick marks directly below the date labels */}
          {tickPositions.map((tx, i) => (
            <div
              key={`tick-${i}`}
              style={{
                position: "absolute",
                left: tx,
                top: AXIS_CENTER_Y - 3,
                width: 1,
                height: 9,
                backgroundColor: "var(--timeline-line)",
                zIndex: 6,
              }}
            />
          ))}

          {/* === Custom milestone rendering === */}
          {renderData.map((m) => {
            // Edge-aware text positioning: shift labels near edges so they stay visible
            const TEXT_MAX_WIDTH = 120;
            const edgeMargin = 10;
            let textTransform = "translateX(-50%)";
            let textAlign: "center" | "left" | "right" = "center";
            if (m.x < TEXT_MAX_WIDTH / 2 + edgeMargin) {
              // Near left edge: anchor text from left
              textTransform = "translateX(0)";
              textAlign = "left";
            } else if (
              m.x >
              m.containerWidth - TEXT_MAX_WIDTH / 2 - edgeMargin
            ) {
              // Near right edge: anchor text from right
              textTransform = "translateX(-100%)";
              textAlign = "right";
            }

            if (m.isAbove) {
              // ABOVE the timeline (positive verticalPosition)
              return (
                <div
                  key={m.id}
                  className="milestone-group"
                  style={{ pointerEvents: "none" }}
                >
                  {/* Dot on the axis */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x - DOT_SIZE / 2,
                      top: AXIS_CENTER_Y - DOT_SIZE / 2 + 1,
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      borderRadius: "50%",
                      backgroundColor: m.color,
                      border: `2px solid ${m.color}`,
                      zIndex: 10,
                    }}
                  />
                  {/* Date label on the line, just below the dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x,
                      top: AXIS_CENTER_Y + DOT_SIZE / 2 + 4,
                      transform: "translateX(-50%)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--timeline-date)",
                      whiteSpace: "nowrap",
                      zIndex: 12,
                    }}
                  >
                    {m.dateLabel}
                  </div>
                  {/* Vertical connecting line going UP */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x - 1,
                      top: AXIS_CENTER_Y - DOT_SIZE / 2 - m.lineHeight + 1,
                      width: 2,
                      height: m.lineHeight,
                      backgroundColor: m.color,
                      zIndex: 8,
                    }}
                  />
                  {/* Text label above the line */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x,
                      bottom:
                        CONTAINER_HEIGHT -
                        (AXIS_CENTER_Y - DOT_SIZE / 2 - m.lineHeight) +
                        2,
                      transform: textTransform,
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      textAlign,
                      maxWidth: TEXT_MAX_WIDTH,
                      lineHeight: "1.2",
                      fontSize: 13,
                      zIndex: 8,
                      pointerEvents: "auto",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            } else {
              // BELOW the timeline (negative verticalPosition or 0)
              return (
                <div
                  key={m.id}
                  className="milestone-group"
                  style={{ pointerEvents: "none" }}
                >
                  {/* Dot on the axis */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x - DOT_SIZE / 2,
                      top: AXIS_CENTER_Y - DOT_SIZE / 2 + 1,
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      borderRadius: "50%",
                      backgroundColor: m.color,
                      border: `2px solid ${m.color}`,
                      zIndex: 10,
                    }}
                  />
                  {/* Date label on the line, just above the dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x,
                      top: AXIS_CENTER_Y - DOT_SIZE / 2 - 14,
                      transform: "translateX(-50%)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--timeline-date)",
                      whiteSpace: "nowrap",
                      zIndex: 12,
                    }}
                  >
                    {m.dateLabel}
                  </div>
                  {/* Vertical connecting line going DOWN */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x - 1,
                      top: AXIS_CENTER_Y + DOT_SIZE / 2 + 1,
                      width: 2,
                      height: m.lineHeight,
                      backgroundColor: m.color,
                      zIndex: 8,
                    }}
                  />
                  {/* Text label below the line */}
                  <div
                    style={{
                      position: "absolute",
                      left: m.x,
                      top: AXIS_CENTER_Y + DOT_SIZE / 2 + m.lineHeight + 6,
                      transform: textTransform,
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      textAlign,
                      maxWidth: TEXT_MAX_WIDTH,
                      lineHeight: "1.2",
                      fontSize: 13,
                      zIndex: 8,
                      pointerEvents: "auto",
                    }}
                  >
                    {m.text}
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
          <strong>Timeline:</strong> Automatically fits from first to last
          milestone
        </p>
        <p>
          {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
