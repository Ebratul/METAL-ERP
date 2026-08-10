/**
 * Module registry types.
 *
 * The registry is deliberately plain data — no React imports. Icons are stored
 * as string keys and resolved by `<ModuleIcon />`, so the registry can be
 * imported from both Server and Client Components without dragging component
 * references across the boundary (which React would reject).
 */

/** How a submodule workspace presents itself. Drives the generated layout. */
export type WorkspaceKind =
  | "overview" // KPI band + charts
  | "list" // filterable data table
  | "board" // kanban-style status columns
  | "analytics" // chart-heavy report surface
  | "calendar" // timeline / schedule
  | "form" // entry / configuration form
  | "settings"; // toggles and preferences

export interface SubModule {
  /** URL segment, unique within its parent module. */
  slug: string;
  name: string;
  kind: WorkspaceKind;
  /** Short line shown in the module landing grid and command palette. */
  summary?: string;
  /**
   * Dataset the workspace is built from — see `src/lib/data/datasets`. When it
   * is omitted the engine falls back to a dataset that suits the module group.
   */
  dataset?: string;
}

export type ModuleGroupId =
  | "intelligence"
  | "workforce"
  | "master-data"
  | "sales"
  | "product"
  | "planning"
  | "inventory"
  | "manufacturing"
  | "quality"
  | "logistics"
  | "finance"
  | "assets"
  | "governance";

export interface ModuleGroup {
  id: ModuleGroupId;
  label: string;
  /** Sidebar section caption. */
  caption: string;
}

export interface ErpModule {
  /** 1–75, matching the master module list. */
  id: number;
  slug: string;
  name: string;
  /** Compact label for the collapsed sidebar and breadcrumbs. */
  short: string;
  icon: string;
  group: ModuleGroupId;
  description: string;
  /** Categorical slot 1–8 used for this module's accent mark. */
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Pending-items badge shown in the sidebar. `0` renders nothing. */
  badge?: number;
  /** Flags a module as live/streaming in the sidebar. */
  live?: boolean;
  submodules: SubModule[];
}
