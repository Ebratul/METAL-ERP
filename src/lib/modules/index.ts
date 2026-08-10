import { MODULES } from "./registry";
import { MODULE_GROUPS } from "./groups";
import type { ErpModule, ModuleGroupId, SubModule } from "./types";

export { MODULES } from "./registry";
export { MODULE_GROUPS, GROUP_BY_ID } from "./groups";
export type {
  ErpModule,
  ModuleGroup,
  ModuleGroupId,
  SubModule,
  WorkspaceKind,
} from "./types";

const MODULE_BY_SLUG = new Map<string, ErpModule>(
  MODULES.map((module) => [module.slug, module]),
);

/** Look up a module by URL segment. Returns `undefined` for unknown slugs so
 *  callers can render a 404 rather than trusting user-supplied input. */
export function getModule(slug: string): ErpModule | undefined {
  return MODULE_BY_SLUG.get(slug);
}

export function getSubModule(
  moduleSlug: string,
  subSlug: string,
): SubModule | undefined {
  return getModule(moduleSlug)?.submodules.find((sub) => sub.slug === subSlug);
}

/** Modules of one sidebar group, in master order. */
export function modulesInGroup(groupId: ModuleGroupId): ErpModule[] {
  return MODULES.filter((module) => module.group === groupId);
}

/** Sidebar shape: groups with their modules, empty groups dropped. */
export function groupedModules() {
  return MODULE_GROUPS.map((group) => ({
    group,
    modules: modulesInGroup(group.id),
  })).filter((entry) => entry.modules.length > 0);
}

export const TOTAL_MODULES = MODULES.length;

export const TOTAL_SUBMODULES = MODULES.reduce(
  (sum, module) => sum + module.submodules.length,
  0,
);

/** Every module + submodule flattened — powers the command palette and the
 *  route generator. */
export interface SearchEntry {
  id: string;
  label: string;
  moduleName: string;
  moduleSlug: string;
  subSlug?: string;
  href: string;
  icon: string;
  group: ModuleGroupId;
  summary?: string;
  kind: string;
}

export const SEARCH_INDEX: SearchEntry[] = MODULES.flatMap((module) => {
  const moduleEntry: SearchEntry = {
    id: module.slug,
    label: module.name,
    moduleName: module.name,
    moduleSlug: module.slug,
    href: `/m/${module.slug}`,
    icon: module.icon,
    group: module.group,
    summary: module.description,
    kind: "module",
  };

  const subEntries: SearchEntry[] = module.submodules.map((sub) => ({
    id: `${module.slug}/${sub.slug}`,
    label: sub.name,
    moduleName: module.short,
    moduleSlug: module.slug,
    subSlug: sub.slug,
    href: `/m/${module.slug}/${sub.slug}`,
    icon: module.icon,
    group: module.group,
    summary: sub.summary,
    kind: sub.kind,
  }));

  return [moduleEntry, ...subEntries];
});

/**
 * Rank search matches: exact prefix beats word-start beats substring. Kept
 * simple and synchronous — the index is only ~700 entries.
 */
export function searchModules(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: Array<{ entry: SearchEntry; score: number }> = [];

  for (const entry of SEARCH_INDEX) {
    const label = entry.label.toLowerCase();
    const context = `${entry.moduleName} ${entry.summary ?? ""}`.toLowerCase();

    let score = 0;
    if (label === q) score = 100;
    else if (label.startsWith(q)) score = 80;
    else if (label.includes(` ${q}`)) score = 60;
    else if (label.includes(q)) score = 40;
    else if (context.includes(q)) score = 20;

    if (score > 0) {
      // Prefer top-level modules when scores tie.
      if (entry.kind === "module") score += 5;
      scored.push({ entry, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.label.length - b.entry.label.length)
    .slice(0, limit)
    .map((item) => item.entry);
}
