// Created: 2026-02-20
// Updated: 2026-03-30
// Version: v5.0
// Description: DataTable component for milestone data entry
// Purpose: Provides an editable table interface for creating and managing timeline milestones
// v3.0: Theme-aware dark/light mode styling via CSS variables.
// v4.0: Added #, Title, and Icon columns for project-style timeline support.
// v5.0: Fixed swapped Icon/Position cells. Hide #, Title, Icon in classic mode.

"use client";

import { Plus, Trash2 } from "lucide-react";
import { DataTableProps, Milestone } from "../lib/types";
import { createEmptyMilestone } from "../lib/timelineUtils";
import IconPicker from "./IconPicker";

export default function DataTable({
  milestones,
  onChange,
  timelineStyle,
}: DataTableProps) {
  const handleAdd = () => {
    const newMilestone = createEmptyMilestone(milestones);
    onChange([...milestones, newMilestone]);
  };

  const handleDelete = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id));
  };

  const handleUpdate = (
    id: string,
    field: keyof Milestone,
    value: string | number,
  ) => {
    onChange(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" && index === milestones.length - 1) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div
      className="rounded-xl shadow-lg p-6 transition-colors"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Milestones
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors shadow-md"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--accent)")
          }
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {milestones.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg border-2 border-dashed"
          style={{
            background: "var(--surface-hover)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            No milestones yet
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Create your first milestone to get started
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors shadow-md"
            style={{ background: "var(--accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            <Plus className="w-5 h-5" />
            Create First Milestone
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{
                  background: "var(--surface-hover)",
                  borderBottom: "2px solid var(--border)",
                }}
              >
                <th
                  className="px-4 py-3 text-left text-sm font-bold w-16"
                  style={{
                    color: "var(--text-primary)",
                    display: timelineStyle === "classic" ? "none" : undefined,
                  }}
                >
                  #
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{
                    color: "var(--text-primary)",
                    display: timelineStyle === "classic" ? "none" : undefined,
                  }}
                >
                  Title
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Date
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Description
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Position
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{
                    color: "var(--text-primary)",
                    display: timelineStyle === "classic" ? "none" : undefined,
                  }}
                >
                  Icon
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Color
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone, index) => (
                <tr
                  key={milestone.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    className="px-4 py-3"
                    style={{
                      display: timelineStyle === "classic" ? "none" : undefined,
                    }}
                  >
                    <input
                      type="number"
                      value={milestone.number ?? index + 1}
                      onChange={(e) =>
                        handleUpdate(
                          milestone.id,
                          "number",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      min={1}
                      className="w-16 px-3 py-2 rounded-lg outline-none transition-all text-center"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-focus)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-border)")
                      }
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      display: timelineStyle === "classic" ? "none" : undefined,
                    }}
                  >
                    <input
                      type="text"
                      value={milestone.title ?? ""}
                      onChange={(e) =>
                        handleUpdate(milestone.id, "title", e.target.value)
                      }
                      placeholder="Milestone title"
                      className="w-full px-3 py-2 rounded-lg outline-none transition-all"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-focus)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-border)")
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={milestone.date}
                      onChange={(e) =>
                        handleUpdate(milestone.id, "date", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg outline-none transition-all"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-focus)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-border)")
                      }
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) =>
                        handleUpdate(
                          milestone.id,
                          "description",
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder="Enter milestone description"
                      className="w-full px-3 py-2 rounded-lg outline-none transition-all"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-focus)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-border)")
                      }
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={milestone.verticalPosition}
                      onChange={(e) =>
                        handleUpdate(
                          milestone.id,
                          "verticalPosition",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      step="10"
                      placeholder="0"
                      className="w-24 px-3 py-2 rounded-lg outline-none transition-all"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--input-border)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-focus)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--input-border)")
                      }
                      title="Positive = above, Negative = below"
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      display: timelineStyle === "classic" ? "none" : undefined,
                    }}
                  >
                    <IconPicker
                      value={milestone.icon}
                      onChange={(iconName) =>
                        handleUpdate(milestone.id, "icon", iconName ?? "")
                      }
                      color={milestone.color}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="color"
                      value={milestone.color || "#eab308"}
                      onChange={(e) =>
                        handleUpdate(milestone.id, "color", e.target.value)
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                      style={{ border: "1px solid var(--input-border)" }}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                      style={{ color: "var(--danger)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      title="Delete milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="mt-4 p-3 rounded-lg"
        style={{
          background: "var(--surface-hover)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <strong>Position guide:</strong> Positive numbers (10, 20, 30) place
          milestones above the timeline, negative numbers (-10, -20, -30) place
          them below. Use 0 for center.
        </p>
      </div>
    </div>
  );
}
