import type { SubModule } from "@/lib/modules/types";
import type { ModuleSpecs, SubmoduleSpec } from "./types";

import { PROFORMA_INVOICE } from "./specs/proforma-invoice";
import { IMPORT_COMMERCIAL } from "./specs/import-commercial";
import { PRODUCTION_MANAGEMENT } from "./specs/production-management";
import { PRODUCT_MANUFACTURING } from "./specs/product-manufacturing";
import { PRODUCTION_TRACKING } from "./specs/production-tracking";
import { CHEMICAL_MANAGEMENT } from "./specs/chemical-management";
import { PLATING_FINISHING } from "./specs/plating-finishing";
import { LABORATORY_TESTING } from "./specs/laboratory-testing";
import { QMS } from "./specs/qms";
import { REWORK_REJECTION } from "./specs/rework-rejection";
import { SCRAP_WASTE } from "./specs/scrap-waste";
import { FG_WAREHOUSE } from "./specs/fg-warehouse";
import { PACKAGING } from "./specs/packaging";
import { DISPATCH_LOGISTICS } from "./specs/dispatch-logistics";
import { EXPORT_COMMERCIAL } from "./specs/export-commercial";
import { BUYER_PORTAL } from "./specs/buyer-portal";
import { FINANCE_ACCOUNTS } from "./specs/finance-accounts";
import { COST_BUDGET } from "./specs/cost-budget";
import { TREASURY_CASH } from "./specs/treasury-cash";
import { LC_BANKING } from "./specs/lc-banking";
import { TAX_VAT } from "./specs/tax-vat";
import { ASSET_MANAGEMENT } from "./specs/asset-management";
import { MAINTENANCE } from "./specs/maintenance";
import { IOT_MONITORING } from "./specs/iot-monitoring";
import { ENERGY } from "./specs/energy";
import { COMPLIANCE } from "./specs/compliance";
import { SECURITY_GATEPASS } from "./specs/security-gatepass";
import { DMS } from "./specs/dms";
import { WORKFLOW_APPROVAL } from "./specs/workflow-approval";
import { BI_ANALYTICS } from "./specs/bi-analytics";
import { MOBILE_APP } from "./specs/mobile-app";
import { API_INTEGRATION } from "./specs/api-integration";
import { SUSTAINABILITY_RISK_AUDIT } from "./specs/sustainability-risk-audit";
import { FACTORY_PLANT } from "./specs/factory-plant";
import { BRANCH_LOCATION } from "./specs/branch-location";
import { BUYER_MASTER } from "./specs/buyer-master";
import { SALES_BUSINESS_DEVELOPMENT } from "./specs/sales-business-development";
import { CUSTOMER_SERVICE } from "./specs/customer-service";
import { FLEET_TRANSPORT } from "./specs/fleet-transport";
import { CONTRACT_MANAGEMENT } from "./specs/contract-management";
import { IAM } from "./specs/iam";
import { NOTIFICATION_CENTER } from "./specs/notification-center";
import { KNOWLEDGE_SOP } from "./specs/knowledge-sop";
import { CAPACITY_SCHEDULING } from "./specs/capacity-scheduling";
import { MULTI_CURRENCY_FOREX } from "./specs/multi-currency-forex";
import { DEMAND_FORECASTING } from "./specs/demand-forecasting";
import { RMA_CLAIMS } from "./specs/rma-claims";

/**
 * Spec-driven workspaces, keyed by module slug — the Proforma Invoice module
 * with its fifty-one submodules, Import Commercial Management and Export Commercial
 * Management with their enterprise sets, then modules 31 to 75 with twenty each.
 *
 * A module listed here declares its submodules once, in its spec file: the
 * registry derives navigation from `submodulesOf()` and the workspace engine
 * reads the same object, so the menu and the screen can never disagree.
 */
export const WORKSPACE_SPECS: Record<string, ModuleSpecs> = {
  "proforma-invoice": PROFORMA_INVOICE, // 10
  "import-commercial": IMPORT_COMMERCIAL, // 27
  "production-management": PRODUCTION_MANAGEMENT, // 31
  "product-manufacturing": PRODUCT_MANUFACTURING, // 32
  "production-tracking": PRODUCTION_TRACKING, // 33
  "chemical-management": CHEMICAL_MANAGEMENT, // 34
  "plating-finishing": PLATING_FINISHING, // 35
  "laboratory-testing": LABORATORY_TESTING, // 36
  qms: QMS, // 37
  "rework-rejection": REWORK_REJECTION, // 38
  "scrap-waste": SCRAP_WASTE, // 39
  "fg-warehouse": FG_WAREHOUSE, // 40
  packaging: PACKAGING, // 41
  "dispatch-logistics": DISPATCH_LOGISTICS, // 42
  "export-commercial": EXPORT_COMMERCIAL, // 43
  "buyer-portal": BUYER_PORTAL, // 44
  "finance-accounts": FINANCE_ACCOUNTS, // 45
  "cost-budget": COST_BUDGET, // 46
  "treasury-cash": TREASURY_CASH, // 47
  "lc-banking": LC_BANKING, // 48
  "tax-vat": TAX_VAT, // 49
  "asset-management": ASSET_MANAGEMENT, // 50
  maintenance: MAINTENANCE, // 51
  "iot-monitoring": IOT_MONITORING, // 52
  energy: ENERGY, // 53
  compliance: COMPLIANCE, // 54
  "security-gatepass": SECURITY_GATEPASS, // 55
  dms: DMS, // 56
  "workflow-approval": WORKFLOW_APPROVAL, // 57
  "bi-analytics": BI_ANALYTICS, // 58
  "mobile-app": MOBILE_APP, // 59
  "api-integration": API_INTEGRATION, // 60
  "sustainability-risk-audit": SUSTAINABILITY_RISK_AUDIT, // 61
  "factory-plant": FACTORY_PLANT, // 62
  "branch-location": BRANCH_LOCATION, // 63
  "buyer-master": BUYER_MASTER, // 64
  "sales-business-development": SALES_BUSINESS_DEVELOPMENT, // 65
  "customer-service": CUSTOMER_SERVICE, // 66
  "fleet-transport": FLEET_TRANSPORT, // 67
  "contract-management": CONTRACT_MANAGEMENT, // 68
  iam: IAM, // 69
  "notification-center": NOTIFICATION_CENTER, // 70
  "knowledge-sop": KNOWLEDGE_SOP, // 71
  "capacity-scheduling": CAPACITY_SCHEDULING, // 72
  "multi-currency-forex": MULTI_CURRENCY_FOREX, // 73
  "demand-forecasting": DEMAND_FORECASTING, // 74
  "rma-claims": RMA_CLAIMS, // 75
};

/** Registry submodule entries derived from a module's specs, in authored order. */
export function submodulesOf(specs: ModuleSpecs): SubModule[] {
  return Object.entries(specs).map(([slug, spec]) => ({
    slug,
    name: spec.name,
    kind: spec.kind,
    summary: spec.summary,
  }));
}

export function getWorkspaceSpec(
  moduleSlug: string,
  subSlug: string,
): SubmoduleSpec | undefined {
  return WORKSPACE_SPECS[moduleSlug]?.[subSlug];
}

export function hasSpecWorkspace(moduleSlug: string, subSlug: string): boolean {
  return getWorkspaceSpec(moduleSlug, subSlug) !== undefined;
}

/** Total submodules served by the spec engine. */
export const SPEC_SUBMODULE_COUNT = Object.values(WORKSPACE_SPECS).reduce(
  (sum, specs) => sum + Object.keys(specs).length,
  0,
);
