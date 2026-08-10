"use client";

import { useCallback, useState } from "react";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/form-controls";
import { PEOPLE, emptyRow } from "@/lib/workspaces/dsl";
import type { FieldSpec, RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/** Fields the form insists on before a record can be saved. */
function isRequired(spec: ResolvedSpec, field: FieldSpec): boolean {
  if (field.kind === "code" || field.kind === "status" || field.kind === "date") {
    return true;
  }
  if (spec.measure && field.key === spec.measure.key) return true;
  return field.key === spec.primaryTextField?.key;
}

function optionsFor(spec: ResolvedSpec, field: FieldSpec): string[] {
  if (field.kind === "status") return spec.statuses;
  if (field.kind === "person") return PEOPLE;
  return field.options ?? [];
}

export interface DraftState {
  values: Record<string, string>;
  errors: Record<string, string>;
  setValue: (key: string, value: string) => void;
  validate: () => boolean;
  toRow: (id: string) => RecordRow;
  reset: (row?: RecordRow) => void;
  note: string;
  setNote: (value: string) => void;
}

/** Draft state for the create / edit form. Values are held as strings. */
export function useRecordDraft(spec: ResolvedSpec, seed?: RecordRow): DraftState {
  const toValues = useCallback(
    (row: RecordRow) =>
      Object.fromEntries(
        spec.fields.map((field) => [field.key, String(row[field.key] ?? "")]),
      ),
    [spec.fields],
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    toValues(seed ?? emptyRow(spec, 1)),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");

  const setValue = useCallback((key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const found: Record<string, string> = {};

    for (const field of spec.fields) {
      const raw = (values[field.key] ?? "").trim();

      if (isRequired(spec, field) && !raw) {
        found[field.key] = `${field.label} is required`;
        continue;
      }
      if (!raw) continue;

      if (
        field.kind === "int" ||
        field.kind === "money" ||
        field.kind === "float" ||
        field.kind === "pct"
      ) {
        const numeric = Number(raw);
        if (!Number.isFinite(numeric)) {
          found[field.key] = "Enter a number";
        } else if (numeric < 0) {
          found[field.key] = "Cannot be negative";
        } else if (field.kind === "pct" && numeric > 100) {
          found[field.key] = "Cannot exceed 100%";
        }
      }
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  }, [spec, values]);

  const toRow = useCallback(
    (id: string): RecordRow => {
      const row: RecordRow = { id };
      for (const field of spec.fields) {
        const raw = (values[field.key] ?? "").trim();
        if (
          field.kind === "int" ||
          field.kind === "money" ||
          field.kind === "float" ||
          field.kind === "pct"
        ) {
          row[field.key] = raw === "" ? 0 : Number(raw);
        } else {
          row[field.key] = raw;
        }
      }
      return row;
    },
    [spec.fields, values],
  );

  const reset = useCallback(
    (row?: RecordRow) => {
      setValues(toValues(row ?? emptyRow(spec, 1)));
      setErrors({});
      setNote("");
    },
    [spec, toValues],
  );

  return { values, errors, setValue, validate, toRow, reset, note, setNote };
}

/** The generated input grid — one control per spec field. */
export function RecordFields({
  spec,
  draft,
  showNote = true,
}: {
  spec: ResolvedSpec;
  draft: DraftState;
  showNote?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      {spec.fields.map((field) => {
        const value = draft.values[field.key] ?? "";
        const error = draft.errors[field.key];
        const required = isRequired(spec, field);

        if (
          field.kind === "enum" ||
          field.kind === "text" ||
          field.kind === "person" ||
          field.kind === "status" ||
          field.kind === "bool"
        ) {
          return (
            <SelectField
              key={field.key}
              label={field.label}
              value={value}
              options={optionsFor(spec, field)}
              onChange={(next) => draft.setValue(field.key, next)}
              required={required}
              error={error}
            />
          );
        }

        if (field.kind === "date") {
          return (
            <TextField
              key={field.key}
              label={field.label}
              type="date"
              value={value}
              onChange={(next) => draft.setValue(field.key, next)}
              required={required}
              error={error}
            />
          );
        }

        const numeric =
          field.kind === "int" ||
          field.kind === "money" ||
          field.kind === "float" ||
          field.kind === "pct";

        return (
          <TextField
            key={field.key}
            label={field.label}
            type={numeric ? "number" : "text"}
            value={value}
            onChange={(next) => draft.setValue(field.key, next)}
            required={required}
            error={error}
            suffix={
              field.kind === "money"
                ? "USD"
                : field.kind === "pct"
                  ? "%"
                  : (field.unit ?? undefined)
            }
            placeholder={
              field.kind === "code"
                ? "Auto-generated"
                : numeric
                  ? String(field.min ?? 0)
                  : undefined
            }
            hint={
              field.kind === "code" ? "Follows the module numbering series" : undefined
            }
          />
        );
      })}

      {showNote ? (
        <TextAreaField
          className="sm:col-span-2"
          label="Remarks"
          value={draft.note}
          onChange={draft.setNote}
          placeholder="Internal note attached to this record…"
        />
      ) : null}
    </div>
  );
}
