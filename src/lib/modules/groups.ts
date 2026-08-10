import type { ModuleGroup, ModuleGroupId } from "./types";

/** Sidebar sections, in display order. */
export const MODULE_GROUPS: ModuleGroup[] = [
  {
    id: "intelligence",
    label: "Command & Intelligence",
    caption: "OVERVIEW",
  },
  {
    id: "workforce",
    label: "People & HR",
    caption: "PEOPLE & HR",
  },
  {
    id: "master-data",
    label: "Setup & Master Data",
    caption: "SETUP & MASTER DATA",
  },
  {
    id: "sales",
    label: "Sales & Customer",
    caption: "SALES & MERCHANDISING",
  },
  {
    id: "product",
    label: "Product & Engineering",
    caption: "PRODUCT & ENGINEERING",
  },
  {
    id: "planning",
    label: "Planning & Procurement",
    caption: "PLANNING & PROCUREMENT",
  },
  {
    id: "inventory",
    label: "Inventory & Warehouse",
    caption: "INVENTORY & WAREHOUSE",
  },
  {
    id: "manufacturing",
    label: "Production",
    caption: "PRODUCTION",
  },
  {
    id: "quality",
    label: "Quality & Compliance",
    caption: "QUALITY & COMPLIANCE",
  },
  {
    id: "logistics",
    label: "Logistics & Export",
    caption: "LOGISTICS & EXPORT",
  },
  {
    id: "finance",
    label: "Finance & Accounts",
    caption: "FINANCE & ACCOUNTS",
  },
  {
    id: "assets",
    label: "Assets & Maintenance",
    caption: "ASSETS & MAINTENANCE",
  },
  {
    id: "governance",
    label: "Governance & Platform",
    caption: "GOVERNANCE & PLATFORM",
  },
];

export const GROUP_BY_ID: Record<ModuleGroupId, ModuleGroup> =
  MODULE_GROUPS.reduce(
    (acc, group) => {
      acc[group.id] = group;
      return acc;
    },
    {} as Record<ModuleGroupId, ModuleGroup>,
  );
