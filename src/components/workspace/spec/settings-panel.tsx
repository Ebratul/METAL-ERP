"use client";

import { useState } from "react";
import { RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch, TextField, SelectField } from "@/components/ui/form-controls";
import { seeded } from "@/lib/data/rng";
import { plural } from "@/lib/workspaces/derive";
import type { ResolvedSpec } from "@/lib/workspaces/types";

const BASE_TOGGLES: Array<[string, string]> = [
  ["Automatic numbering", "Generate the document reference from the numbering series."],
  ["Dual approval above threshold", "A second approver signs off past the value limit."],
  ["Notify owner on status change", "Push and email the record owner on every move."],
  ["Lock after final stage", "Prevent edits once the record reaches its last status."],
  ["Mandatory attachment", "A supporting document is required before release."],
  ["Auto-escalate on SLA breach", "Route to the next approver when the SLA elapses."],
  ["Allow bulk import", "Permit spreadsheet upload into this workspace."],
  ["Full field audit trail", "Write a before/after entry to the audit log."],
];

export function SettingsPanel({
  spec,
  seedKey,
  onSaved,
}: {
  spec: ResolvedSpec;
  seedKey: string;
  onSaved: (message: string) => void;
}) {
  const extras = (spec.settings ?? []).map(
    (label) => [label, `Applies to every ${spec.entity.toLowerCase()} in this workspace.`] as const,
  );
  const shapes = [...extras, ...BASE_TOGGLES];

  const [toggles, setToggles] = useState<boolean[]>(() => {
    const rng = seeded(`settings:${seedKey}`);
    return shapes.map(() => rng() > 0.35);
  });

  const [series, setSeries] = useState(`${spec.ref}-{YY}-{0000}`);
  const [sla, setSla] = useState("48");
  const [approval, setApproval] = useState("25000");
  const [visibility, setVisibility] = useState("Department");
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    setDirty(true);
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-7">
        <CardHeader
          title={`${spec.entity} Behaviour`}
          subtitle="Rules applied to every document created in this workspace"
          icon={<SlidersHorizontal size={16} />}
          action={<Badge tone={dirty ? "warning" : "good"} withIcon>{dirty ? "Unsaved" : "Saved"}</Badge>}
        />
        <ul className="flex flex-col">
          {shapes.map(([label, description], index) => (
            <li
              key={label}
              className="border-line flex items-start justify-between gap-4 border-t px-4 py-3.5 sm:px-5"
            >
              <div className="min-w-0">
                <p className="text-ink text-sm font-medium">{label}</p>
                <p className="text-ink-3 mt-0.5 text-xs">{description}</p>
              </div>
              <Switch
                checked={toggles[index]}
                label={label}
                onChange={(next) => {
                  setToggles((current) =>
                    current.map((value, position) => (position === index ? next : value)),
                  );
                  markDirty();
                }}
              />
            </li>
          ))}
        </ul>
        <CardFooter className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setDirty(false);
              onSaved("Workspace configuration saved");
            }}
          >
            <Save size={14} />
            Save configuration
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const rng = seeded(`settings:${seedKey}`);
              setToggles(shapes.map(() => rng() > 0.35));
              setDirty(false);
              onSaved("Configuration reset to defaults");
            }}
          >
            <RotateCcw size={14} />
            Reset
          </Button>
          <p className="text-ink-3 ml-auto text-[0.6875rem]">
            {toggles.filter(Boolean).length} of {toggles.length} rules active
          </p>
        </CardFooter>
      </Card>

      <Card className="xl:col-span-5">
        <CardHeader
          title="Document Policy"
          subtitle={`Numbering, service levels and visibility for ${plural(spec.entity).toLowerCase()}`}
        />
        <div className="flex flex-col gap-3 px-4 pb-4 sm:px-5">
          <TextField
            label="Numbering series"
            value={series}
            onChange={(value) => {
              setSeries(value);
              markDirty();
            }}
            hint="Tokens: {YY} year, {0000} running number"
          />
          <TextField
            label="Response SLA"
            type="number"
            value={sla}
            onChange={(value) => {
              setSla(value);
              markDirty();
            }}
            suffix="hrs"
          />
          <TextField
            label="Approval threshold"
            type="number"
            value={approval}
            onChange={(value) => {
              setApproval(value);
              markDirty();
            }}
            suffix="USD"
            hint="Records above this value need a second approver"
          />
          <SelectField
            label="Default visibility"
            value={visibility}
            options={["Private", "Department", "Plant", "Company-wide"]}
            onChange={(value) => {
              setVisibility(value);
              markDirty();
            }}
          />
          <div className="border-line mt-1 border-t pt-3">
            <p className="text-ink-3 text-[0.6875rem] leading-relaxed">
              Preview:{" "}
              <span className="text-ink-2 font-medium">
                {series.replace("{YY}", "26").replace("{0000}", "0142")}
              </span>{" "}
              · escalates after {sla || "0"}h · dual approval above $
              {Number(approval || 0).toLocaleString("en-US")}.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
