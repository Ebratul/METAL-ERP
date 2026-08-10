/**
 * Workspace specification types.
 *
 * A submodule workspace is described as plain data — what one row *is*, which
 * fields it carries, which statuses it can hold. The engine in
 * `src/components/workspace/spec` turns that description into a working ERP
 * surface: seeded records, filters, CRUD, board, schedule and analytics.
 *
 * Specs stay import-free of React so they can be read from Server Components
 * (metadata, static params) as well as the client engine.
 */

import type { WorkspaceKind } from "@/lib/modules/types";

/** The value shapes a field can take. Drives generation, rendering and input. */
export type FieldKind =
  | "code" // document reference, e.g. WO-26-0104
  | "text" // free text drawn from a vocabulary pool
  | "enum" // one of a fixed option list
  | "person" // a named colleague (renders with an avatar)
  | "int" // whole number, optionally with a unit
  | "money" // USD amount
  | "pct" // 0–100 percentage (renders as a meter)
  | "float" // decimal measure with a unit
  | "date" // ISO date
  | "bool" // Yes / No
  | "status"; // one of the spec's statuses

export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  /** enum / text option pool. */
  options?: string[];
  min?: number;
  max?: number;
  /** Unit suffix for int/float, e.g. "pcs", "kg", "µm". */
  unit?: string;
  digits?: number;
  /** Reference prefix for `code` fields. Defaults to the spec's `ref`. */
  prefix?: string;
}

/**
 * Compact authoring form: `key|Label|kind|arg;arg;arg`.
 *
 *   "qty|Planned Qty|int|8000;140000;pcs"
 *   "line|Work Center|enum|Press-01;Press-02;Plating-A"
 *   "due|Due Date|date|-20;60"
 */
export type FieldSource = string | FieldSpec;

export interface WorkspaceSpec {
  /** What a single row represents, e.g. "Work Order". */
  entity: string;
  /** Document prefix used for generated references, e.g. "WO". */
  ref: string;
  fields: FieldSource[];
  /** Most common first — generation weights follow this order. */
  statuses: string[];
  /** Row count for the demo dataset. Defaults to 42. */
  rows?: number;
  /** Field key charted as the headline measure. Defaults to the first money/int field. */
  measure?: string;
  /** One-line note surfaced above the workspace. */
  insight?: string;
  /** Extra toggles for the configuration panel. */
  settings?: string[];
}

/**
 * A spec that also carries its registry metadata. Modules built on the spec
 * engine declare their submodules here once — `submodulesOf()` derives the
 * registry entries from the same object, so a workspace can never exist
 * without navigation, or navigation without a workspace.
 */
export interface SubmoduleSpec extends WorkspaceSpec {
  name: string;
  kind: WorkspaceKind;
  summary: string;
}

/** All submodule specs of one module, keyed by URL slug (order = menu order). */
export type ModuleSpecs = Record<string, SubmoduleSpec>;

/** A generated demo row. Values are primitives so search, sort and CSV are trivial. */
export type RecordRow = {
  id: string;
  [key: string]: string | number;
};

/** A spec with its field list already parsed and normalised. */
export interface ResolvedSpec {
  entity: string;
  ref: string;
  fields: FieldSpec[];
  statuses: string[];
  rows: number;
  measure?: FieldSpec;
  insight?: string;
  settings?: string[];
  /** Convenience lookups used all over the engine. */
  statusField: FieldSpec;
  codeField: FieldSpec;
  dateField?: FieldSpec;
  primaryTextField?: FieldSpec;
  enumFields: FieldSpec[];
  numericFields: FieldSpec[];
}
