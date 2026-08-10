"use client";

import type { ErpModule, SubModule } from "@/lib/modules";
import { WorkspaceEngine } from "./engine/workspace-engine";
import { FlagshipWorkspace, hasFlagship } from "./flagship";
import { getWorkspaceSpec } from "@/lib/workspaces/catalog";
import { SpecWorkspace } from "./spec/spec-workspace";

/**
 * Entry point for every submodule route.
 *
 * Three layers, most specific first: a handful of hand-built flagship
 * surfaces, then every workspace that ships a data spec, then the workspace
 * engine, which generates a surface from the dataset the registry names.
 */
export function ModuleWorkspace({
  module,
  sub,
}: {
  module: ErpModule;
  sub: SubModule;
}) {
  if (hasFlagship(module.slug, sub.slug)) {
    return <FlagshipWorkspace module={module} sub={sub} />;
  }

  const spec = getWorkspaceSpec(module.slug, sub.slug);
  if (spec) {
    return <SpecWorkspace key={`${module.slug}/${sub.slug}`} module={module} sub={sub} spec={spec} />;
  }

  // Keying on the route resets all workspace state when the user navigates
  // between two submodules that share this component instance.
  return (
    <WorkspaceEngine
      key={`${module.slug}/${sub.slug}`}
      module={module}
      sub={sub}
    />
  );
}
