/**
 * Dataset registry.
 *
 * `getDataset` is the single entry point: a workspace asks for the dataset its
 * registry entry names and, when a submodule has not been bound to one yet,
 * falls back to a dataset that suits the module's business group so the
 * workspace still reads like the domain it lives in.
 */

import type { Dataset } from "../dataset-types";
import { CORE_DATASETS } from "./core";
import { SALES_DATASETS } from "./sales";
import { OPS_DATASETS } from "./ops";

export const DATASETS: Dataset[] = [
  ...CORE_DATASETS,
  ...SALES_DATASETS,
  ...OPS_DATASETS,
];

const BY_ID = new Map<string, Dataset>(DATASETS.map((set) => [set.id, set]));

/** Fallback dataset per sidebar group, used by workspaces without a binding. */
const GROUP_FALLBACK: Record<string, string> = {
  intelligence: "kpi-metrics",
  workforce: "employees",
  "master-data": "items",
  sales: "sales-orders",
  product: "dev-projects",
  planning: "production-plans",
  inventory: "stock-items",
  manufacturing: "work-orders",
  quality: "inspections",
  logistics: "shipments",
  finance: "invoices",
  assets: "assets",
  governance: "policies",
};

/** Some workspace kinds read better against a specific shape of data. */
const KIND_FALLBACK: Record<string, string> = {
  settings: "policies",
  calendar: "tasks",
  form: "approvals",
};

export function getDataset(id?: string): Dataset | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function resolveDataset(options: {
  datasetId?: string;
  group: string;
  kind: string;
}): Dataset {
  const explicit = getDataset(options.datasetId);
  if (explicit) return explicit;

  const byKind = getDataset(KIND_FALLBACK[options.kind]);
  if (byKind && !GROUP_FALLBACK[options.group]) return byKind;

  return (
    getDataset(GROUP_FALLBACK[options.group]) ??
    getDataset("tasks") ??
    DATASETS[0]
  );
}

export const DATASET_IDS = DATASETS.map((set) => set.id);

export type { Dataset } from "../dataset-types";
