// Created: 2026-02-20
// Updated: 2026-03-30
// Version: v7.0
// Description: TypeScript interfaces and types for Team Entra Norway portal
// Purpose: Define data structures for milestones, timeline data, component props, tools, and blog posts
//          v3.0: Added SidebarProps and TopBarProps for new layout
//          v4.0: Added icon, number, title to Milestone; added TimelineStyle type
//          v5.0: Added Tool/ToolLink interfaces; simplified TopBarProps (removed sidebar toggle)
//          v6.0: Added ToolSourceType for source classification (microsoft/opensource/personal)
//          v7.0: Added BlogPost interface for the Learn page

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
  timelineStyle: TimelineStyle;
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

// Toolbox types
export type ToolSourceType = "microsoft" | "opensource" | "personal";

export interface ToolLink {
  label: string;
  url: string;
}

export interface Tool {
  id: string;
  name: string;
  sourceType: ToolSourceType;
  description: string;
  tags: string[];
  detailedDescription: string;
  quickGuide?: string;
  bestFor?: string[];
  links: ToolLink[];
}

// Blog / Learn types
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string[]; // Array of paragraphs for the full article
  image: string;
  date: string; // Display date string (e.g. "March 15, 2026")
  readTime: string; // e.g. "5 min read"
}
