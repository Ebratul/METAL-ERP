"use client";

import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/form-controls";
import type { Dataset, FieldDef } from "@/lib/data/dataset-types";
import type { CellValue, Row } from "@/lib/data/collection";

const NUMERIC: FieldDef["type"][] = ["number", "currency", "percent", "progress"];

/** Everything the user is allowed to type into. */
export function formFields(dataset: Dataset): FieldDef[] {
  return dataset.fields.filter((field) => field.inForm !== false);
}

function isBlank(value: CellValue | undefined): boolean {
  return value === undefined || value === null || String(value).trim() === "";
}

/** Field-level validation shared by the modal form and the entry workspace. */
export function validateDraft(
  fields: FieldDef[],
  draft: Row,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = draft[field.key];

    if (field.required && isBlank(value)) {
      errors[field.key] = `${field.label} is required`;
      continue;
    }
    if (isBlank(value)) continue;

    if (NUMERIC.includes(field.type)) {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) errors[field.key] = "Enter a number";
      else if (numeric < 0 && (field.min ?? 0) >= 0)
        errors[field.key] = "Cannot be negative";
      else if (field.type === "percent" && numeric > 100)
        errors[field.key] = "Cannot exceed 100%";
      else if (field.type === "progress" && numeric > 100)
        errors[field.key] = "Progress caps at 100%";
    }
  }

  return errors;
}

/** Coerce the strings the inputs hand back into the row's real types. */
export function coerceDraft(fields: FieldDef[], draft: Row): Row {
  const out: Row = { ...draft };
  for (const field of fields) {
    if (NUMERIC.includes(field.type)) out[field.key] = Number(draft[field.key] ?? 0);
  }
  return out;
}

/** One dataset field rendered as the right control for its type. */
export function FieldControl({
  field,
  value,
  error,
  entity,
  onChange,
}: {
  field: FieldDef;
  value: CellValue | undefined;
  error?: string;
  entity: string;
  onChange: (value: CellValue) => void;
}) {
  const className = field.span === 2 ? "sm:col-span-2" : undefined;

  if (field.type === "select" || field.type === "status") {
    return (
      <SelectField
        label={field.label}
        value={String(value ?? "")}
        options={field.options ?? []}
        required={field.required}
        error={error}
        className={className}
        onChange={onChange}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <TextAreaField
        label={field.label}
        value={String(value ?? "")}
        className="sm:col-span-2"
        placeholder={`Add context for this ${entity.toLowerCase()}…`}
        onChange={onChange}
      />
    );
  }

  const type =
    field.type === "date" ? "date" : NUMERIC.includes(field.type) ? "number" : "text";

  return (
    <TextField
      label={field.label}
      type={type}
      value={String(value ?? "")}
      required={field.required}
      error={error}
      className={className}
      step={field.decimals ? `0.${"0".repeat(field.decimals - 1)}1` : undefined}
      hint={
        field.type === "progress"
          ? "0–100"
          : field.suffix
            ? `In ${field.suffix}`
            : undefined
      }
      placeholder={field.type === "text" ? field.pool?.[0] : undefined}
      onChange={onChange}
    />
  );
}
