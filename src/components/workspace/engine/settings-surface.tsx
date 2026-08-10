"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Save, ShieldCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectField, SliderField, Switch } from "@/components/ui/form-controls";
import { useToast } from "@/components/ui/toast";
import { seeded } from "@/lib/data/rng";
import type { Dataset } from "@/lib/data/dataset-types";

interface ToggleDef {
  key: string;
  group: string;
  label: string;
  description: string;
}

const TOGGLES: ToggleDef[] = [
  {
    key: "auto-numbering",
    group: "Document Control",
    label: "Automatic numbering",
    description: "Generate references without manual entry.",
  },
  {
    key: "dual-approval",
    group: "Document Control",
    label: "Require dual approval",
    description: "A second approver signs off above the threshold.",
  },
  {
    key: "lock-posted",
    group: "Document Control",
    label: "Lock records after posting",
    description: "Prevent edits once a document is financially posted.",
  },
  {
    key: "mandatory-attachment",
    group: "Document Control",
    label: "Mandatory attachments",
    description: "A supporting document is required before release.",
  },
  {
    key: "notify-status",
    group: "Notifications",
    label: "Notify on status change",
    description: "Push the owner whenever the state moves.",
  },
  {
    key: "sla-escalation",
    group: "Notifications",
    label: "Auto-escalate on SLA breach",
    description: "Route to the next approver when the SLA elapses.",
  },
  {
    key: "daily-digest",
    group: "Notifications",
    label: "Daily digest email",
    description: "One summary of open items each morning.",
  },
  {
    key: "audit-trail",
    group: "Data & Access",
    label: "Audit every field change",
    description: "Write a full before/after trail to the audit log.",
  },
  {
    key: "bulk-import",
    group: "Data & Access",
    label: "Allow bulk import",
    description: "Permit spreadsheet upload into this workspace.",
  },
  {
    key: "export-restricted",
    group: "Data & Access",
    label: "Restrict export to owners",
    description: "Only record owners and admins can download data.",
  },
];

const GROUPS = ["Document Control", "Notifications", "Data & Access"] as const;

interface Prefs {
  toggles: Record<string, boolean>;
  threshold: number;
  slaDays: number;
  retention: number;
  defaultStatus: string;
  approvalRoute: string;
}

const APPROVAL_ROUTES = [
  "Department Head → Finance",
  "Department Head → Commercial → MD",
  "Direct to Managing Director",
  "No approval required",
];

/**
 * The configuration workspace. Preferences are real state: toggling marks the
 * page dirty, Save commits the change and Reset restores the last saved values.
 */
export function SettingsSurface({
  dataset,
  seedKey,
  title,
}: {
  dataset: Dataset;
  seedKey: string;
  title: string;
}) {
  const toast = useToast();

  const initial = useMemo<Prefs>(() => {
    const rng = seeded(`settings:${seedKey}`);
    return {
      toggles: Object.fromEntries(
        TOGGLES.map((toggle) => [toggle.key, rng() > 0.38]),
      ),
      threshold: Math.round(rng() * 90 + 10) * 1_000,
      slaDays: Math.round(rng() * 9) + 2,
      retention: Math.round(rng() * 5) + 3,
      defaultStatus: Object.keys(dataset.statusTones)[0],
      approvalRoute: APPROVAL_ROUTES[Math.floor(rng() * APPROVAL_ROUTES.length)],
    };
  }, [seedKey, dataset]);

  const [saved, setSaved] = useState<Prefs>(initial);
  const [prefs, setPrefs] = useState<Prefs>(initial);

  const dirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  function setToggle(key: string, value: boolean) {
    setPrefs((current) => ({
      ...current,
      toggles: { ...current.toggles, [key]: value },
    }));
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="flex flex-col gap-4 xl:col-span-7">
        {GROUPS.map((group) => (
          <Card key={group}>
            <CardHeader
              title={group}
              subtitle={`Applies to every ${dataset.entity.toLowerCase()} in this workspace`}
              icon={group === "Data & Access" ? <ShieldCheck size={16} /> : undefined}
            />
            <ul className="flex flex-col">
              {TOGGLES.filter((toggle) => toggle.group === group).map((toggle) => (
                <li
                  key={toggle.key}
                  className="border-line flex items-start justify-between gap-4 border-t px-4 py-3.5 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-medium">{toggle.label}</p>
                    <p className="text-ink-3 mt-0.5 text-xs">{toggle.description}</p>
                  </div>
                  <Switch
                    label={toggle.label}
                    checked={prefs.toggles[toggle.key] ?? false}
                    onChange={(next) => setToggle(toggle.key, next)}
                    className="mt-0.5"
                  />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 xl:col-span-5">
        <Card>
          <CardHeader
            title="Thresholds & Limits"
            subtitle="Numeric rules the workflow enforces"
          />
          <div className="flex flex-col gap-5 px-4 pb-5 sm:px-5">
            <SliderField
              label="Second-approval threshold"
              value={prefs.threshold}
              min={0}
              max={100_000}
              step={5_000}
              suffix="USD"
              onChange={(value) => setPrefs((current) => ({ ...current, threshold: value }))}
            />
            <SliderField
              label="SLA before escalation"
              value={prefs.slaDays}
              min={1}
              max={21}
              suffix="days"
              onChange={(value) => setPrefs((current) => ({ ...current, slaDays: value }))}
            />
            <SliderField
              label="Record retention"
              value={prefs.retention}
              min={1}
              max={10}
              suffix="years"
              onChange={(value) =>
                setPrefs((current) => ({ ...current, retention: value }))
              }
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Defaults" subtitle="What new records start with" />
          <div className="flex flex-col gap-4 px-4 pb-5 sm:px-5">
            <SelectField
              label={`Default ${dataset.entity.toLowerCase()} status`}
              value={prefs.defaultStatus}
              options={Object.keys(dataset.statusTones)}
              onChange={(value) =>
                setPrefs((current) => ({ ...current, defaultStatus: value }))
              }
            />
            <SelectField
              label="Approval route"
              value={prefs.approvalRoute}
              options={APPROVAL_ROUTES}
              onChange={(value) =>
                setPrefs((current) => ({ ...current, approvalRoute: value }))
              }
            />
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center gap-2 px-4 py-4 sm:px-5">
            {dirty ? (
              <Badge tone="warning" withIcon>
                Unsaved changes
              </Badge>
            ) : (
              <Badge tone="good" withIcon>
                All changes saved
              </Badge>
            )}
            <span className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                disabled={!dirty}
                onClick={() => {
                  setPrefs(saved);
                  toast.push("Changes discarded", { tone: "info" });
                }}
              >
                <RotateCcw size={15} />
                Discard
              </Button>
              <Button
                variant="primary"
                disabled={!dirty}
                onClick={() => {
                  setSaved(prefs);
                  toast.push(`${title} saved`, {
                    detail: "Applied to this workspace",
                  });
                }}
              >
                <Save size={15} />
                Save Settings
              </Button>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
