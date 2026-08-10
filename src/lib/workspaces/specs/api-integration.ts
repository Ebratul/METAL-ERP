import type { ModuleSpecs } from "../types";

/** Module 60 — API & Third Party Integration. */

const SYSTEM = "system|External System|enum|Buyer EDI portal;Shipping line API;Bank host-to-host;Courier tracking;Tax portal;Payroll system;IoT platform;Marketplace connector";
const ENDPOINT = "endpoint|Endpoint|enum|/orders;/shipments;/invoices;/stock;/payments;/telemetry;/webhooks;/masterdata";
const METHOD = "method|Method|enum|GET;POST;PUT;PATCH;DELETE";
const OWNER = "owner|Integration Owner|person";
const ENVIRONMENT = "environment|Environment|enum|Production;Staging;Sandbox;Development";

export const API_INTEGRATION: ModuleSpecs = {
  "integration-hub": {
    name: "Integration Hub", kind: "overview", summary: "Every connection and its health",
    entity: "Integration", ref: "INT",
    fields: [SYSTEM, "direction|Direction|enum|Inbound;Outbound;Bi-directional", "callsPerDay|Calls / day|int|10;98000", "successRate|Success Rate|pct|60;100", "latencyMs|Average Latency|int|40;3800;ms", ENVIRONMENT, OWNER, "date|Last Sync|date|-10;0"],
    statuses: ["Healthy", "Degraded", "Failing", "Paused", "Retired"],
    measure: "callsPerDay", rows: 44,
    insight: "The shipping-line API accounts for 70% of all failed calls this month, almost all of them timeouts during their nightly maintenance window.",
  },

  "api-keys": {
    name: "API Keys", kind: "list", summary: "Credentials issued to partners",
    entity: "API Key", ref: "KEY",
    fields: ["keyName|Key Name|enum|Buyer portal key;Shipping partner key;Bank integration key;Courier key;Analytics key", SYSTEM, ENVIRONMENT, "scopes|Scopes|enum|Read only;Read write;Orders only;Shipments only;Full access", "callsThisMonth|Calls This Month|int|0;480000", "expiryDays|Expires In|int|-30;400;days", "date|Issued On|date|-600;0"],
    statuses: ["Active", "Expiring", "Expired", "Revoked", "Compromised"],
    measure: "callsThisMonth",
  },

  webhooks: {
    name: "Webhooks", kind: "list", summary: "Events pushed out to partners",
    entity: "Webhook", ref: "WHK",
    fields: ["event|Event|enum|Order confirmed;Shipment dispatched;Invoice raised;Stock updated;QC passed;Payment received", SYSTEM, "targetUrl|Target|enum|https://partner.example/hook;https://buyer.example/events;https://logistics.example/api", "deliveries|Deliveries (24h)|int|0;9800", "successRate|Success Rate|pct|40;100", "retries|Retries|int|0;480", "date|Last Delivery|date|-30;0"],
    statuses: ["Active", "Retrying", "Failing", "Paused", "Disabled"],
    measure: "deliveries",
  },

  connectors: {
    name: "Connectors", kind: "list", summary: "Pre-built integrations installed",
    entity: "Connector", ref: "CON",
    fields: [SYSTEM, "connectorType|Type|enum|REST;SOAP;SFTP;EDI;Database;Message queue", "version|Version|enum|v1.2;v2.0;v2.4;v3.1", ENVIRONMENT, "syncFrequency|Sync|enum|Real time;Every 15 minutes;Hourly;Nightly;Manual", "recordsPerRun|Records / run|int|10;98000", "date|Installed On|date|-700;0"],
    statuses: ["Connected", "Degraded", "Disconnected", "Deprecated"],
    measure: "recordsPerRun",
  },

  "sync-logs": {
    name: "Sync Logs", kind: "list", summary: "Every exchange recorded",
    entity: "Sync Run", ref: "SYN",
    fields: [SYSTEM, ENDPOINT, METHOD, "records|Records|int|0;48000", "durationSec|Duration|float|0.1;900;sec;2", "errors|Errors|int|0;480", ENVIRONMENT, "date|Run At|date|-60;0"],
    statuses: ["Success", "Partial Success", "Failed", "Timed Out", "Skipped"],
    measure: "records",
  },

  "error-queue": {
    name: "Error Queue", kind: "board", summary: "Failed calls waiting for retry",
    entity: "Failed Call", ref: "ERR",
    fields: [SYSTEM, ENDPOINT, "errorCode|Error|enum|400 Bad request;401 Unauthorised;404 Not found;429 Rate limited;500 Server error;504 Timeout", "attempts|Attempts|int|1;12", "payloadKb|Payload Size|float|0.2;480;KB;1", "ageHrs|Age|int|1;220;hrs", OWNER],
    statuses: ["New", "Retrying", "Escalated", "Resolved", "Discarded"],
    measure: "attempts",
  },

  "rate-limits": {
    name: "Rate Limits", kind: "settings", summary: "Throttling policy per consumer",
    entity: "Rate Limit", ref: "RLM",
    fields: [SYSTEM, ENDPOINT, "limitPerMin|Limit / minute|int|10;6000", "peakUsage|Peak Usage|int|1;6400", "utilisation|Utilisation|pct|1;140", "burstAllowance|Burst Allowance|int|0;2000", "date|Effective From|date|-400;0"],
    statuses: ["Active", "Near Limit", "Throttling", "Draft"],
    measure: "limitPerMin",
    settings: ["Throttle rather than reject when a consumer exceeds its limit", "Alert the integration owner at 80% of the rate ceiling"],
  },

  "api-docs": {
    name: "API Documentation", kind: "list", summary: "Endpoint reference for partners",
    entity: "API Endpoint", ref: "DOC",
    fields: [ENDPOINT, METHOD, "version|API Version|enum|v1;v2;v3;v3-beta", "authType|Auth|enum|API key;OAuth 2.0;Basic;Mutual TLS", "consumers|Consumers|int|1;24", "views|Doc Views (30d)|int|0;900", "date|Last Updated|date|-400;0"],
    statuses: ["Published", "Beta", "Deprecated", "Draft", "Sunset"],
    measure: "views",
  },

  uptime: {
    name: "Integration Uptime", kind: "analytics", summary: "Availability per connector",
    entity: "Uptime Record", ref: "UPT",
    fields: [SYSTEM, ENVIRONMENT, "uptime|Uptime|pct|82;100", "incidents|Incidents|int|0;18", "downtimeMin|Downtime|int|0;2400;min", "mttrMin|MTTR|float|2;480;min;1", "date|Period End|date|-300;0"],
    statuses: ["Meeting SLA", "Marginal", "Breached SLA", "Under Review"],
    measure: "uptime",
  },

  endpoints: {
    name: "Endpoint Registry", kind: "list", summary: "Everything we expose or call",
    entity: "Endpoint", ref: "EPT",
    fields: [ENDPOINT, METHOD, "direction|Direction|enum|Exposed;Consumed", SYSTEM, "callsPerDay|Calls / day|int|1;98000", "avgLatencyMs|Average Latency|int|20;3800;ms", ENVIRONMENT, "date|Registered On|date|-700;0"],
    statuses: ["Active", "Deprecated", "Blocked", "Planned"],
    measure: "callsPerDay",
  },

  partners: {
    name: "Integration Partners", kind: "list", summary: "Who we exchange data with",
    entity: "Partner", ref: "PRT",
    fields: ["partner|Partner|enum|@buyers", "integrationType|Integration|enum|EDI orders;Shipment tracking;Invoice exchange;Inventory feed;Quality reports", "goLive|Go-Live|date|-700;90", "volumePerMonth|Monthly Volume|int|10;98000", "slaUptime|SLA Uptime|pct|90;99.9", OWNER],
    statuses: ["Live", "In Onboarding", "Testing", "Paused", "Terminated"],
    measure: "volumePerMonth",
  },

  "data-mapping": {
    name: "Data Mapping", kind: "list", summary: "How their fields become ours",
    entity: "Field Mapping", ref: "MAP",
    fields: [SYSTEM, "sourceField|Source Field|enum|po_number;item_code;qty_ordered;ship_date;unit_price;currency_code", "targetField|Target Field|enum|Order reference;Item code;Order quantity;Delivery date;Unit price;Currency", "transform|Transform|enum|Direct;Lookup;Date format;Unit conversion;Concatenate;Default value", "mandatory|Mandatory|bool|Yes;No", "failures|Mapping Failures|int|0;480", "date|Updated On|date|-400;0"],
    statuses: ["Verified", "Draft", "Failing", "Deprecated"],
    measure: "failures",
  },

  "retry-policy": {
    name: "Retry Policies", kind: "list", summary: "How failures are re-attempted",
    entity: "Retry Policy", ref: "RTP",
    fields: [SYSTEM, ENDPOINT, "strategy|Strategy|enum|Immediate;Fixed interval;Exponential backoff;Manual only", "maxAttempts|Max Attempts|int|1;12", "backoffSec|Initial Backoff|int|1;900;sec", "successAfterRetry|Recovered by Retry|pct|10;98", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    measure: "maxAttempts",
  },

  sandbox: {
    name: "Sandbox & Testing", kind: "list", summary: "Test runs before going live",
    entity: "Test Run", ref: "SBX",
    fields: [SYSTEM, ENDPOINT, "testCase|Test Case|enum|Happy path;Missing field;Invalid auth;Large payload;Duplicate submission;Rate limit", "records|Records|int|1;9800", "passed|Passed|bool|Yes;No", "tester|Tested By|person", "date|Run On|date|-200;0"],
    statuses: ["Queued", "Running", "Passed", "Failed", "Blocked"],
    measure: "records",
  },

  "api-usage": {
    name: "API Usage", kind: "analytics", summary: "Consumption by partner and endpoint",
    entity: "Usage Record", ref: "USG",
    fields: [SYSTEM, ENDPOINT, "calls|Calls|int|10;480000", "dataMb|Data Transferred|float|0.1;4800;MB;1", "errorRate|Error Rate|pct|0;22", "peakHour|Peak Hour|enum|00–06;06–12;12–18;18–24", "date|Period End|date|-300;0"],
    statuses: ["Normal", "High Volume", "Above Quota", "Declining"],
    measure: "calls",
  },

  latency: {
    name: "Latency Analysis", kind: "analytics", summary: "Where the time is spent",
    entity: "Latency Record", ref: "LAT",
    fields: [SYSTEM, ENDPOINT, "p50|P50|int|20;900;ms", "p95|P95|int|60;4800;ms", "p99|P99|int|100;9800;ms", "timeouts|Timeouts|int|0;480", "target|Target P95|int|200;2000;ms", "date|Period End|date|-300;0"],
    statuses: ["Within Target", "Marginal", "Above Target", "Degraded"],
    measure: "p95",
  },

  "auth-tokens": {
    name: "Auth Tokens", kind: "list", summary: "OAuth tokens and their lifetime",
    entity: "Token", ref: "TOK",
    fields: [SYSTEM, "tokenType|Token Type|enum|Access token;Refresh token;Service account;Client credential;Certificate", "scopes|Scopes|enum|Read only;Read write;Orders;Shipments;Full", "expiryHrs|Expires In|int|-24;720;hrs", "lastUsedHrs|Last Used|int|0;720;hrs", OWNER, "date|Issued On|date|-400;0"],
    statuses: ["Valid", "Expiring", "Expired", "Revoked", "Unused"],
  },

  "integration-schedule": {
    name: "Integration Schedule", kind: "calendar", summary: "Batch windows and maintenance",
    entity: "Scheduled Run", ref: "SCH",
    fields: [SYSTEM, "job|Job|enum|Nightly order import;Hourly stock push;Daily invoice export;Weekly master data sync;Partner maintenance window", "windowMin|Window|int|5;480;min", "records|Expected Records|int|10;98000", ENVIRONMENT, "date|Scheduled For|date|-20;40"],
    statuses: ["Scheduled", "Running", "Completed", "Missed", "Cancelled"],
    measure: "records",
  },

  "test-console": {
    name: "Test Console", kind: "form", summary: "Fire a call and inspect the response",
    entity: "Test Call", ref: "TST",
    fields: [SYSTEM, ENDPOINT, METHOD, ENVIRONMENT, "payloadKb|Payload Size|float|0.1;480;KB;2", "responseCode|Response Code|enum|200 OK;201 Created;400 Bad request;401 Unauthorised;500 Server error", "latencyMs|Latency|int|20;4800;ms", "tester|Run By|person", "date|Run On|date|-60;0"],
    statuses: ["Draft", "Sent", "Success", "Failed", "Timed Out"],
    measure: "latencyMs",
  },

  "api-settings": {
    name: "Integration Controls", kind: "settings", summary: "Security, logging and alerting",
    entity: "Control Rule", ref: "ISET",
    fields: ["rule|Rule|enum|Rotate keys every 90 days;Log full payloads;Alert on failure rate;Require IP allow-list;Block deprecated versions", "threshold|Threshold|pct|1;60", "retentionDays|Log Retention|int|7;400;days", OWNER, "date|Effective From|date|-500;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Rotate every API key on a 90-day cycle", "Alert the integration owner when the failure rate passes 5%"],
  },
};
