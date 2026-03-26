// Created: 2026-02-20
// Updated: 2026-03-26
// Version: v4.0
// Description: TypeScript interfaces and types for Timeline Builder application
// Purpose: Define data structures for milestones, timeline data, and component props
//          v3.0: Added SidebarProps and TopBarProps for new layout
//          v4.0: Added icon, number, title to Milestone; added TimelineStyle type

export type TimelineStyle = "classic" | "project";

export interface Milestone {
  id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  description: string;
  verticalPosition: number; // Positive = above timeline, Negative = below timeline
  color?: string; // Optional custom color (hex format)
  icon?: string; // Lucide icon name (e.g. "Search", "Heart") — used in project style
  number?: number; // Display number (auto-assigned by date order, user-editable)
  title?: string; // Milestone heading — used in project style
}

export interface TimelineData {
  projectName: string;
  milestones: Milestone[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface TimelineViewerProps {
  milestones: Milestone[];
  onTimelineReady?: (element: HTMLElement | null) => void;
}

export interface DataTableProps {
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
}

export interface HeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onDownloadImage: () => void;
  onShareLink: () => void;
  onClear: () => void;
  lastSaved?: string;
}

export interface TopBarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onDownloadImage: () => void;
  onShareLink: () => void;
  onClear: () => void;
  lastSaved?: string;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadImage: () => void;
  onDownloadJSON: () => void;
  shareableLink: string;
}

// Helper type for vis-timeline items
export interface TimelineItem {
  id: string;
  content: string;
  start: Date;
  type?: string;
  className?: string;
  style?: string;
}

// Export options
export interface ExportOptions {
  format: "png" | "jpg";
  quality: number;
  backgroundColor: string;
}
