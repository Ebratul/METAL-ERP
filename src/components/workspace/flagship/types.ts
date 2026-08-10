import type { ErpModule, SubModule } from "@/lib/modules";

/** Every flagship workspace takes the same registry-derived props. */
export interface FlagshipProps {
  module: ErpModule;
  sub: SubModule;
}
