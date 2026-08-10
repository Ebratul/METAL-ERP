import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModule, getSubModule, MODULES } from "@/lib/modules";
import { parseSlug } from "@/lib/security/sanitize";
import { ModuleWorkspace } from "@/components/workspace/module-workspace";

/** Pre-render every submodule workspace. */
export function generateStaticParams() {
  return MODULES.flatMap((module) =>
    module.submodules.map((sub) => ({
      module: module.slug,
      submodule: sub.slug,
    })),
  );
}

export async function generateMetadata(
  props: PageProps<"/m/[module]/[submodule]">,
): Promise<Metadata> {
  const { module: moduleParam, submodule: subParam } = await props.params;
  const moduleSlug = parseSlug(moduleParam);
  const subSlug = parseSlug(subParam);

  const found =
    moduleSlug && subSlug ? getSubModule(moduleSlug, subSlug) : undefined;
  const parent = moduleSlug ? getModule(moduleSlug) : undefined;

  if (!found || !parent) return { title: "Workspace not found" };

  return {
    title: `${found.name} · ${parent.short}`,
    description: found.summary ?? parent.description,
  };
}

export default async function SubmodulePage(
  props: PageProps<"/m/[module]/[submodule]">,
) {
  const { module: moduleParam, submodule: subParam } = await props.params;

  const moduleSlug = parseSlug(moduleParam);
  const subSlug = parseSlug(subParam);

  const parent = moduleSlug ? getModule(moduleSlug) : undefined;
  const sub = parent && subSlug ? getSubModule(parent.slug, subSlug) : undefined;

  if (!parent || !sub) notFound();

  return <ModuleWorkspace module={parent} sub={sub} />;
}
