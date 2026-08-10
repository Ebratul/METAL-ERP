import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModule, MODULES } from "@/lib/modules";
import { parseSlug } from "@/lib/security/sanitize";
import { ModuleLanding } from "@/components/workspace/module-landing";

/** Pre-render every module landing. */
export function generateStaticParams() {
  return MODULES.map((module) => ({ module: module.slug }));
}

export async function generateMetadata(
  props: PageProps<"/m/[module]">,
): Promise<Metadata> {
  const { module: moduleParam } = await props.params;
  const slug = parseSlug(moduleParam);
  const found = slug ? getModule(slug) : undefined;

  if (!found) return { title: "Module not found" };

  return {
    title: found.name,
    description: found.description,
  };
}

export default async function ModulePage(props: PageProps<"/m/[module]">) {
  const { module: moduleParam } = await props.params;

  // The slug is user-controlled. It is validated against a strict pattern and
  // then looked up in the registry — an unknown or malformed value 404s rather
  // than being reflected back into the page.
  const slug = parseSlug(moduleParam);
  const found = slug ? getModule(slug) : undefined;
  if (!found) notFound();

  return <ModuleLanding module={found} />;
}
