"use client";

import { OrderBookWorkspace } from "./order-book";
import { ShopFloorWorkspace } from "./shop-floor";
import { StockSummaryWorkspace } from "./stock-summary";
import { QualityDashboardWorkspace } from "./quality-dashboard";
import { FinancialOverviewWorkspace } from "./financial-overview";
import { PiStudioWorkspace } from "./pi-studio";
import type { FlagshipProps } from "./types";

/**
 * Workspaces that get a purpose-built surface instead of the generated one.
 * Everything not listed here falls through to the generic workspace engine.
 */
export const FLAGSHIP_ROUTES = [
  "sales-order/order-book",
  "mes/shop-floor",
  "inventory-store/stock-summary",
  "qms/quality-dashboard",
  "finance-accounts/financial-overview",
  "proforma-invoice/print-preview-export",
] as const;

export type FlagshipRoute = (typeof FLAGSHIP_ROUTES)[number];

const ROUTE_SET = new Set<string>(FLAGSHIP_ROUTES);

export function hasFlagship(moduleSlug: string, subSlug: string): boolean {
  return ROUTE_SET.has(`${moduleSlug}/${subSlug}`);
}

/**
 * Dispatch is a switch returning JSX rather than a lookup that *returns* a
 * component type. Both work, but selecting a component reference during render
 * reads as constructing one — and would reset its state if the reference ever
 * changed identity between renders.
 */
export function FlagshipWorkspace({ module, sub }: FlagshipProps) {
  switch (`${module.slug}/${sub.slug}`) {
    case "sales-order/order-book":
      return <OrderBookWorkspace module={module} sub={sub} />;
    case "mes/shop-floor":
      return <ShopFloorWorkspace module={module} sub={sub} />;
    case "inventory-store/stock-summary":
      return <StockSummaryWorkspace module={module} sub={sub} />;
    case "qms/quality-dashboard":
      return <QualityDashboardWorkspace module={module} sub={sub} />;
    case "finance-accounts/financial-overview":
      return <FinancialOverviewWorkspace module={module} sub={sub} />;
    case "proforma-invoice/print-preview-export":
      return <PiStudioWorkspace module={module} sub={sub} />;
    default:
      return null;
  }
}

export type { FlagshipProps } from "./types";
