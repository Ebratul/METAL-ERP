import type { ModuleSpecs } from "../types";

/** Module 42 — Dispatch & Logistics Management. */

const BUYER = "buyer|Buyer|enum|@buyers";
const ORDER = "order|Sales Order|enum|SO-26-2041;SO-26-2058;SO-26-2073;SO-26-2090;SO-26-2114;SO-26-2138";
const TRANSPORTER = "transporter|Transporter|enum|Rapid Freight Ltd.;Green Line Cargo;Chattogram Movers;Delta Logistics;SkyLink Express";
const VEHICLE = "vehicle|Vehicle|enum|DH-11-4471;DH-11-6620;CH-14-2288;DH-12-9931;Container 20ft;Container 40ft";
const MODE = "mode|Mode|enum|Road;Sea;Air;Courier;Multimodal";
const OWNER = "owner|Dispatch Officer|person";

export const DISPATCH_LOGISTICS: ModuleSpecs = {
  "dispatch-plan": {
    name: "Dispatch Plan", kind: "calendar", summary: "Shipments planned for the week",
    entity: "Planned Dispatch", ref: "DPP",
    fields: [ORDER, BUYER, MODE, "cartons|Cartons|int|10;900", "weight|Gross Weight|float|40;12000;kg;0", "destination|Destination|enum|Hamburg;Rotterdam;Barcelona;New York;Dubai;Singapore;Colombo", OWNER, "date|Dispatch Date|date|-10;30"],
    statuses: ["Planned", "Confirmed", "Loading", "Dispatched", "Deferred"],
    measure: "cartons", rows: 46,
    insight: "Three sea shipments share the same cut-off date and destination — consolidating them would save roughly a full container of freight.",
  },

  "delivery-challan": {
    name: "Delivery Challan", kind: "list", summary: "Outbound movement documents",
    entity: "Challan", ref: "DCH",
    fields: [ORDER, BUYER, VEHICLE, "cartons|Cartons|int|4;700", "qty|Quantity|int|2000;380000;pcs", "value|Consignment Value|money|1200;180000", OWNER, "date|Challan Date|date|-90;5"],
    statuses: ["Draft", "Approved", "Gate Out", "Delivered", "Cancelled"],
    measure: "value",
  },

  "vehicle-planning": {
    name: "Vehicle Planning", kind: "board", summary: "Truck and container allocation",
    entity: "Vehicle Assignment", ref: "VHP",
    fields: [VEHICLE, TRANSPORTER, "capacityKg|Capacity|float|1000;28000;kg;0", "loadKg|Planned Load|float|200;27000;kg;0", "fill|Fill Rate|pct|20;99", "route|Route|enum|Dhaka → Chattogram Port;Dhaka → Airport;Gazipur → Dhaka ICD;Local delivery;Chattogram → Buyer DC", "date|Assignment Date|date|-8;20"],
    statuses: ["Requested", "Assigned", "At Factory", "Loaded", "Departed"],
    measure: "loadKg",
  },

  transporters: {
    name: "Transporter Management", kind: "list", summary: "Carrier panel and performance",
    entity: "Transporter", ref: "TRP",
    fields: [TRANSPORTER, MODE, "trips|Trips (YTD)|int|4;420", "onTime|On-Time|pct|48;100", "damageRate|Damage Rate|pct|0;6", "annualSpend|Annual Spend|money|4000;320000", "rating|Rating|pct|50;99", "date|Reviewed On|date|-240;0"],
    statuses: ["Preferred", "Approved", "On Watch", "Suspended", "Blacklisted"],
    measure: "annualSpend",
  },

  "freight-cost": {
    name: "Freight Cost", kind: "analytics", summary: "Cost per shipment and per kilo",
    entity: "Freight Record", ref: "FRC",
    fields: [MODE, "lane|Lane|enum|Dhaka → Hamburg;Dhaka → New York;Chattogram → Rotterdam;Dhaka → Dubai;Dhaka → Singapore", "weight|Chargeable Weight|float|40;18000;kg;0", "cost|Freight Cost|money|200;42000", "ratePerKg|Rate per kg|float|0.2;9;USD;2", "surcharge|Surcharges|money|0;6000", "date|Shipped On|date|-240;0"],
    statuses: ["Within Budget", "Above Budget", "Under Negotiation", "Approved"],
    measure: "cost",
  },

  "in-transit": {
    name: "In-Transit Tracking", kind: "analytics", summary: "Live consignment position",
    entity: "Consignment", ref: "TRN",
    fields: [ORDER, BUYER, MODE, "milestone|Current Milestone|enum|Gate out;At port;On board;In transit;Arrived;Customs cleared;Out for delivery", "progress|Journey Progress|pct|5;99", "etaDays|ETA|int|0;42;days", TRANSPORTER, "date|ETA Date|date|-10;45"],
    statuses: ["On Schedule", "Minor Delay", "Delayed", "Delivered", "Exception"],
    measure: "progress",
  },

  pod: {
    name: "Proof of Delivery", kind: "list", summary: "Receipt confirmations from consignees",
    entity: "POD", ref: "POD",
    fields: [ORDER, BUYER, VEHICLE, "cartons|Cartons Delivered|int|4;700", "shortage|Shortage|int|0;40;cartons", "receivedBy|Received By|enum|Warehouse Manager;Store Keeper;Security;Buyer QC;Agent", "date|Delivered On|date|-120;0"],
    statuses: ["Awaiting", "Received", "Received with Shortage", "Disputed", "Closed"],
    measure: "cartons",
  },

  "delivery-performance": {
    name: "Delivery Performance", kind: "analytics", summary: "On-time and in-full delivery",
    entity: "Performance Record", ref: "DPF",
    fields: [BUYER, TRANSPORTER, "shipments|Shipments|int|1;90", "onTime|On Time|pct|42;100", "inFull|In Full|pct|60;100", "otif|OTIF|pct|38;100", "avgDelayDays|Average Delay|float|0;12;days;1", "date|Period End|date|-240;0"],
    statuses: ["Excellent", "Acceptable", "Below Target", "Critical"],
    measure: "shipments",
  },

  "route-optimization": {
    name: "Route Optimisation", kind: "analytics", summary: "Consolidation and detour savings",
    entity: "Route Case", ref: "ROP",
    fields: ["route|Route|enum|Dhaka → Chattogram Port;Gazipur → Dhaka ICD;Dhaka → Airport;Multi-drop city;Chattogram → Buyer DC", "currentKm|Current Distance|int|8;420;km", "optimisedKm|Optimised Distance|int|6;400;km", "saving|Monthly Saving|money|40;9800", "trips|Trips per Month|int|2;90", "date|Analysed On|date|-200;0"],
    statuses: ["Opportunity", "Under Trial", "Implemented", "Rejected"],
    measure: "saving",
  },

  "gate-out": {
    name: "Gate Out Register", kind: "list", summary: "Every vehicle leaving with cargo",
    entity: "Gate Out", ref: "GOT",
    fields: [VEHICLE, ORDER, "challan|Challan Ref|enum|DCH-26-0411;DCH-26-0428;DCH-26-0443;DCH-26-0461", "cartons|Cartons|int|4;700", "sealNo|Seal No|enum|SL-88214;SL-88237;SL-88259;SL-88274;SL-88290", "security|Cleared By|person", "date|Gate Out On|date|-90;0"],
    statuses: ["Pending", "Cleared", "Held at Gate", "Returned"],
    measure: "cartons",
  },

  "loading-schedule": {
    name: "Loading Schedule", kind: "calendar", summary: "Dock slots and loading crews",
    entity: "Loading Slot", ref: "LDS",
    fields: [ORDER, "dock|Dock|enum|Dock 1;Dock 2;Dock 3;Export Bay", VEHICLE, "cartons|Cartons|int|10;900", "crew|Crew Size|int|2;16", "hours|Loading Hours|float|0.5;8;hrs;1", "date|Slot Date|date|-8;25"],
    statuses: ["Booked", "In Progress", "Completed", "Missed", "Rescheduled"],
    measure: "cartons",
  },

  "consignment-tracking": {
    name: "Consignment Register", kind: "list", summary: "Every consignment and its reference",
    entity: "Consignment", ref: "CNS",
    fields: [ORDER, BUYER, MODE, "awb|AWB / BL No|enum|AWB-77412;AWB-77468;BL-MAEU4471;BL-MAEU4520;CN-88214", TRANSPORTER, "weight|Weight|float|20;16000;kg;0", "value|Value|money|1200;220000", "date|Handover Date|date|-180;10"],
    statuses: ["Booked", "Handed Over", "In Transit", "Delivered", "Returned"],
    measure: "value",
  },

  "freight-invoice": {
    name: "Freight Invoices", kind: "list", summary: "Carrier bills and verification",
    entity: "Freight Invoice", ref: "FIV",
    fields: [TRANSPORTER, "invoiceNo|Invoice No|enum|FI-9911;FI-9928;FI-9943;FI-9967;FI-9981", "billed|Billed Amount|money|200;58000", "verified|Verified Amount|money|180;58000", "variance|Variance|pct|88;114", "trips|Trips Covered|int|1;40", "date|Invoice Date|date|-180;0"],
    statuses: ["Received", "Under Verification", "Approved", "Disputed", "Paid"],
    measure: "billed",
  },

  courier: {
    name: "Courier Shipments", kind: "list", summary: "Samples and documents by courier",
    entity: "Courier Shipment", ref: "CUR",
    fields: [BUYER, "courier|Courier|enum|DHL;FedEx;UPS;Aramex;Local courier", "contents|Contents|enum|Samples;Documents;Swatches;Trial pieces;Spare parts", "weight|Weight|float|0.2;40;kg;2", "cost|Charge|money|8;1800", "awb|AWB No|enum|AWB-77412;AWB-77468;AWB-77501;AWB-77534", "date|Shipped On|date|-150;0"],
    statuses: ["Booked", "Picked Up", "In Transit", "Delivered", "Lost"],
    measure: "cost",
  },

  contracts: {
    name: "Transport Contracts", kind: "list", summary: "Rate agreements with carriers",
    entity: "Contract", ref: "TCT",
    fields: [TRANSPORTER, MODE, "lane|Lane|enum|Dhaka → Chattogram Port;Dhaka → Airport;Dhaka → Hamburg;Chattogram → Rotterdam;Local", "rate|Contract Rate|float|0.2;9;USD/kg;2", "volumeCommit|Volume Commitment|float|1000;90000;kg;0", "value|Contract Value|money|4000;280000", "date|Valid Until|date|-60;500"],
    statuses: ["Active", "Expiring", "Expired", "Under Renewal", "Terminated"],
    measure: "value",
  },

  "damage-claims": {
    name: "Transit Damage Claims", kind: "list", summary: "Loss and damage recovery",
    entity: "Claim", ref: "TDC",
    fields: [TRANSPORTER, ORDER, "damageType|Damage|enum|Water damage;Carton crush;Pilferage;Container leak;Handling drop", "cartons|Cartons Affected|int|1;90", "claimValue|Claim Value|money|100;42000", "recovered|Recovered|money|0;42000", "date|Claim Date|date|-240;0"],
    statuses: ["Raised", "Under Assessment", "Accepted", "Partially Settled", "Rejected"],
    measure: "claimValue",
  },

  "fuel-log": {
    name: "Fuel & Trip Log", kind: "list", summary: "Own-fleet running cost",
    entity: "Trip Log", ref: "FUL",
    fields: [VEHICLE, "driver|Driver|person", "distanceKm|Distance|int|8;480;km", "fuelLitres|Fuel|float|4;180;L;1", "mileage|Mileage|float|2;9;km/L;2", "cost|Trip Cost|money|10;1800", "date|Trip Date|date|-120;0"],
    statuses: ["Logged", "Verified", "Posted", "Disputed"],
    measure: "cost",
  },

  "driver-roster": {
    name: "Driver Roster", kind: "list", summary: "Driver assignment and licences",
    entity: "Driver", ref: "DRV",
    fields: ["driver|Driver|person", VEHICLE, "licenceClass|Licence Class|enum|Heavy;Medium;Light;Hazardous endorsement", "tripsMonth|Trips this Month|int|0;48", "incidents|Incidents|int|0;5", "rating|Rating|pct|50;100", "date|Licence Expiry|date|-60;900"],
    statuses: ["On Duty", "Off Duty", "On Leave", "Licence Expiring", "Suspended"],
    measure: "tripsMonth",
  },

  "dispatch-entry": {
    name: "Dispatch Entry", kind: "form", summary: "Raise a dispatch from finished stock",
    entity: "Dispatch", ref: "DSE",
    fields: [ORDER, BUYER, VEHICLE, MODE, "cartons|Cartons|int|4;700", "weight|Gross Weight|float|20;12000;kg;1", OWNER, "date|Dispatch Date|date|-5;20"],
    statuses: ["Draft", "Submitted", "Approved", "Dispatched", "Cancelled"],
    measure: "cartons",
  },

  "logistics-settings": {
    name: "Logistics Controls", kind: "settings", summary: "Dispatch and carrier rules",
    entity: "Control Rule", ref: "LSET",
    fields: ["rule|Rule|enum|Block dispatch without POD of previous trip;Mandatory seal number;Auto-consolidate same-destination shipments;Require freight rate match;Alert on delayed consignment", "threshold|Threshold|pct|60;100", OWNER, "date|Effective From|date|-300;0", "shipmentsAffected|Shipments Affected|int|1;220"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Require a seal number before a vehicle can leave the gate", "Alert the buyer's merchandiser when a consignment slips its ETA"],
  },
};
