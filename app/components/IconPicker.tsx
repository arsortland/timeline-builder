// Created: 2026-03-26
// Version: v2.0
// Description: Icon picker dropdown component for selecting Lucide icons
// Purpose: Provides a curated grid of ~30 popular Lucide icons as a popover
//          dropdown. Used in the DataTable for assigning icons to milestones
//          displayed in the Project timeline style.

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Home,
  Star,
  Heart,
  Zap,
  Target,
  Lightbulb,
  Rocket,
  Globe,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Coffee,
  Compass,
  Flag,
  Gift,
  Key,
  Mail,
  MessageCircle,
  Music,
  Palette,
  Phone,
  Shield,
  ShoppingCart,
  TrendingUp,
  Video,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";

interface IconPickerProps {
  value: string | undefined;
  onChange: (iconName: string | undefined) => void;
  color?: string;
}

interface IconEntry {
  name: string;
  component: LucideIcon;
}

const ICON_LIST: IconEntry[] = [
  { name: "Search", component: Search },
  { name: "Home", component: Home },
  { name: "Star", component: Star },
  { name: "Heart", component: Heart },
  { name: "Zap", component: Zap },
  { name: "Target", component: Target },
  { name: "Lightbulb", component: Lightbulb },
  { name: "Rocket", component: Rocket },
  { name: "Globe", component: Globe },
  { name: "Users", component: Users },
  { name: "Award", component: Award },
  { name: "BookOpen", component: BookOpen },
  { name: "Briefcase", component: Briefcase },
  { name: "Camera", component: Camera },
  { name: "Code", component: Code },
  { name: "Coffee", component: Coffee },
  { name: "Compass", component: Compass },
  { name: "Flag", component: Flag },
  { name: "Gift", component: Gift },
  { name: "Key", component: Key },
  { name: "Mail", component: Mail },
  { name: "MessageCircle", component: MessageCircle },
  { name: "Music", component: Music },
  { name: "Palette", component: Palette },
  { name: "Phone", component: Phone },
  { name: "Shield", component: Shield },
  { name: "ShoppingCart", component: ShoppingCart },
  { name: "TrendingUp", component: TrendingUp },
  { name: "Video", component: Video },
  { name: "Check", component: Check },
];

/** Look up a LucideIcon component by name. Returns undefined if not found. */
export function getIconByName(name: string): LucideIcon | undefined {
  return ICON_LIST.find((i) => i.name === name)?.component;
}

export default function IconPicker({
  value,
  onChange,
  color,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const SelectedIcon = value ? getIconByName(value) : null;
  const iconColor = color || "var(--accent)";

  return (
    <div ref={pickerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
        style={{
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)",
          color: iconColor,
        }}
        title={value || "Select icon"}
      >
        {SelectedIcon ? (
          <SelectedIcon className="w-5 h-5" />
        ) : (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            —
          </span>
        )}
      </button>

      {/* Popover grid */}
      {open && (
        <div
          className="absolute z-50 mt-1 p-2 rounded-lg shadow-xl grid grid-cols-6 gap-1"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            width: 240,
            right: 0,
          }}
        >
          {/* Clear option */}
          <button
            type="button"
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors"
            style={{
              background:
                value === undefined ? "var(--accent-subtle)" : "transparent",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                value === undefined ? "var(--accent-subtle)" : "transparent")
            }
            title="No icon"
          >
            <X className="w-4 h-4" />
          </button>

          {ICON_LIST.map((entry) => {
            const Icon = entry.component;
            const isSelected = value === entry.name;
            return (
              <button
                key={entry.name}
                type="button"
                onClick={() => {
                  onChange(entry.name);
                  setOpen(false);
                }}
                className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                style={{
                  background: isSelected
                    ? "var(--accent-subtle)"
                    : "transparent",
                  color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = isSelected
                    ? "var(--accent-subtle)"
                    : "transparent")
                }
                title={entry.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
