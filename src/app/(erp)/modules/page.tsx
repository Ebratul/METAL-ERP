import type { Metadata } from "next";
import { ModuleDirectory } from "@/components/workspace/module-directory";
import { TOTAL_MODULES } from "@/lib/modules";

export const metadata: Metadata = {
  title: "All Modules",
  description: `Browse all ${TOTAL_MODULES} core modules of Smart Metal ERP — from executive dashboards to sustainability, risk and audit.`,
};

export default function ModulesPage() {
  return <ModuleDirectory />;
}
