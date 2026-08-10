import type { Metadata } from "next";
import { CeoDashboard } from "@/components/dashboard/ceo-dashboard";

export const metadata: Metadata = {
  title: "CEO Command Center",
  description:
    "Real-time overview of revenue, production, quality, inventory, logistics and cash across the entire business.",
};

export default function DashboardPage() {
  return <CeoDashboard />;
}
