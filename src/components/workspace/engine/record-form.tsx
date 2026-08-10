"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Dataset } from "@/lib/data/dataset-types";
import type { CellValue, Row } from "@/lib/data/collection";
import {
  FieldControl,
  coerceDraft,
  formFields,
  validateDraft,
} from "./field-control";

interface RecordFormProps {
  open: boolean;
  onClose: () => void;
  dataset: Dataset;
  initial: Row;
  mode: "create" | "edit";
  onSubmit: (row: Row) => void;
}

/**
 * One form generated from the dataset. The same component covers create and
 * edit — only the title, the seed values and the confirmation copy differ.
 * It mounts fresh each time it opens, so the draft never carries over.
 */
export function RecordForm(props: RecordFormProps) {
  if (!props.open) return null;
  return <RecordFormBody {...props} />;
}

function RecordFormBody({
  onClose,
  dataset,
  initial,
  mode,
  onSubmit,
}: RecordFormProps) {
  const fields = formFields(dataset);
  const [draft, setDraft] = useState<Row>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setValue(key: string, value: CellValue) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submit() {
    const found = validateDraft(fields, draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit(coerceDraft(fields, draft));
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={mode === "create" ? `New ${dataset.entity}` : `Edit ${dataset.entity}`}
      subtitle={
        mode === "create"
          ? `Capture a new ${dataset.entity.toLowerCase()} record`
          : String(draft.code ?? draft.id)
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            <Save size={15} />
            {mode === "create" ? `Create ${dataset.entity}` : "Save Changes"}
          </Button>
        </>
      }
    >
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={draft[field.key]}
            error={errors[field.key]}
            entity={dataset.entity}
            onChange={(value) => setValue(field.key, value)}
          />
        ))}
        {/* Lets Enter submit the form without a visible duplicate button. */}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
