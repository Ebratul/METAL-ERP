import type { ModuleSpecs } from "../types";

/** Module 67 — Fleet & Transport Management. */

const VEHICLE = "vehicle|Vehicle|enum|DHK-METRO-GA 11-4471;DHK-METRO-KHA 13-2208;CTG-METRO-TA 51-7719;DHK-METRO-SHA 17-9903;GAZ-METRO-HA 12-3345;DHK-METRO-CHA 15-6612;CTG-METRO-JA 11-8890";
const VEHICLE_TYPE = "vehicleType|Type|enum|Covered van;Pickup;Staff bus;Microbus;Truck 5T;Truck 10T;Forklift;Executive car";
const DRIVER = "driver|Driver|person";
const ROUTE = "route|Route|enum|Factory → Chattogram Port;Factory → Dhaka Airport;Factory → Head Office;Staff route — Uttara;Staff route — Mirpur;Staff route — Savar;Supplier pickup — Narayanganj";
const INCHARGE = "incharge|Transport In-charge|person";

export const FLEET_TRANSPORT: ModuleSpecs = {
  "fleet-register": {
    name: "Fleet Register", kind: "list", summary: "Every vehicle on strength",
    entity: "Vehicle", ref: "VEH",
    fields: [VEHICLE, VEHICLE_TYPE, "ownership|Ownership|enum|Owned;Leased;Hired;Contractor", "capacity|Capacity|float|0.5;12;MT;1", "odometer|Odometer|int|4000;480000;km", "bookValue|Book Value|money|4000;180000", INCHARGE, "date|Acquired On|date|-3600;-30"],
    statuses: ["Available", "On Trip", "Under Maintenance", "Off Road", "Disposed"],
    measure: "bookValue", rows: 40,
    insight: "Two covered vans account for 46% of the month's fuel spend while carrying 28% of the tonnage — both are overdue for injector service.",
  },

  drivers: {
    name: "Driver Management", kind: "list", summary: "Licences, duty and record",
    entity: "Driver", ref: "DRV",
    fields: [DRIVER, "licenceClass|Licence Class|enum|Light;Medium;Heavy;PSV;Forklift", "experience|Experience|float|0.5;28;yrs;1", "tripsMonth|Trips This Month|int|0;90", "kmMonth|Kilometres|int|0;9800;km", "violations|Violations (12m)|int|0;12", "licenceExpiry|Licence Expiry|date|-60;900", "date|Joined On|date|-4200;-30"],
    statuses: ["On Duty", "Off Duty", "On Leave", "Licence Expiring", "Suspended"],
    measure: "kmMonth",
  },

  "trip-log": {
    name: "Trip Log", kind: "list", summary: "Trip sheets and mileage",
    entity: "Trip", ref: "TRP",
    fields: [VEHICLE, DRIVER, ROUTE, "purpose|Purpose|enum|Export despatch;Local delivery;Raw material pickup;Staff transport;Document courier;Maintenance run", "distance|Distance|int|4;480;km", "loadMt|Load Carried|float|0;12;MT;2", "durationHrs|Duration|float|0.3;18;hrs;1", "date|Trip Date|date|-90;0"],
    statuses: ["Planned", "In Transit", "Completed", "Delayed", "Cancelled"],
    measure: "distance", rows: 58,
  },

  "fuel-log": {
    name: "Fuel Log", kind: "analytics", summary: "Consumption and cost",
    entity: "Fuel Entry", ref: "FUL",
    fields: [VEHICLE, "fuelType|Fuel|enum|Diesel;Octane;Petrol;CNG;LPG", "quantity|Quantity|float|5;220;L;1", "rate|Rate|float|0.6;1.6;USD/L;2", "amount|Amount|money|4;480", "mileage|Mileage|float|2;18;km/L;2", "station|Station|enum|Padma Filling — Gazipur;Meghna Fuel — Savar;Jamuna CNG — Tongi;In-house tank;Chattogram Depot", DRIVER, "date|Filled On|date|-120;0"],
    statuses: ["Recorded", "Verified", "Variance Flagged", "Disputed"],
    measure: "amount", rows: 56,
  },

  "vehicle-maintenance": {
    name: "Vehicle Maintenance", kind: "calendar", summary: "Service and repair schedule",
    entity: "Service Job", ref: "VMS",
    fields: [VEHICLE, "job|Job|enum|Engine oil change;Brake pad replacement;Tyre rotation;AC servicing;Clutch overhaul;Suspension repair;Full body work;Annual servicing", "serviceType|Service Type|enum|Preventive;Breakdown;Accident repair;Statutory;Upgrade", "cost|Cost|money|20;9800", "downtimeDays|Downtime|int|0;22;days", "workshop|Workshop|enum|In-house garage;Rancon Service;Navana Workshop;Local garage;Authorised dealer", "date|Scheduled For|date|-120;120"],
    statuses: ["Scheduled", "In Workshop", "Completed", "Overdue", "Cancelled"],
    measure: "cost",
  },

  "vehicle-documents": {
    name: "Vehicle Documents", kind: "list", summary: "Fitness, tax token and insurance",
    entity: "Vehicle Document", ref: "VDC",
    fields: [VEHICLE, "document|Document|enum|Registration certificate;Fitness certificate;Tax token;Route permit;Insurance policy;Pollution certificate", "issuer|Issuing Authority|enum|BRTA;Insurance company;City Corporation;Department of Environment", "fee|Renewal Fee|money|20;4800", "responsible|Responsible|person", "expiry|Expires On|date|-60;540", "date|Issued On|date|-1200;0"],
    statuses: ["Valid", "Renewal Due", "Under Renewal", "Expired", "Not Applicable"],
    measure: "fee",
  },

  "route-plan": {
    name: "Route Planning", kind: "calendar", summary: "Cargo and staff routes",
    entity: "Route Plan", ref: "RTP",
    fields: [ROUTE, VEHICLE, DRIVER, "stops|Stops|int|1;18", "distance|Planned Distance|int|4;480;km", "departure|Departure|enum|05:30;06:15;07:00;08:30;13:00;17:30;20:00;22:00", "passengers|Passengers / Load|int|0;54", "date|Plan Date|date|-30;60"],
    statuses: ["Active", "Draft", "Suspended", "Seasonal", "Retired"],
    measure: "distance",
  },

  "gps-tracking": {
    name: "GPS Tracking", kind: "analytics", summary: "Where the fleet is right now",
    entity: "Tracking Record", ref: "GPS",
    fields: [VEHICLE, DRIVER, "location|Last Location|enum|Factory gate;Dhaka–Chattogram Highway;Meghna Bridge;Chattogram Port yard;Head office;Uttara;Savar EPZ;Workshop", "speed|Speed|int|0;110;km/h", "idleMin|Idle Time|int|0;240;min", "geofence|Geofence|enum|Inside route;Deviation;Restricted area;Depot;Unknown", "signalPct|Signal Quality|pct|20;100", "date|Last Ping|date|-3;0"],
    statuses: ["Moving", "Idling", "Stopped", "Signal Lost", "Off Route"],
    measure: "speed", rows: 48,
  },

  utilization: {
    name: "Vehicle Utilisation", kind: "analytics", summary: "Running against idle",
    entity: "Utilisation Record", ref: "UTL",
    fields: [VEHICLE, VEHICLE_TYPE, "availableHrs|Available Hours|float|40;720;hrs;0", "runningHrs|Running Hours|float|4;700;hrs;0", "utilisation|Utilisation|pct|8;98", "loadFactor|Load Factor|pct|12;100", "tripsMonth|Trips|int|0;120", "date|Period End|date|-330;0"],
    statuses: ["Well Utilised", "Under Utilised", "Over Utilised", "Idle"],
    measure: "runningHrs",
  },

  "transport-cost": {
    name: "Transport Cost", kind: "analytics", summary: "Cost per kilometre and per trip",
    entity: "Cost Record", ref: "TCS",
    fields: [VEHICLE, "head|Cost Head|enum|Fuel;Driver wages;Maintenance;Tyres;Insurance;Tolls & fees;Depreciation;Hired vehicle charge", "amount|Amount|money|20;98000", "kilometres|Kilometres|int|100;24000;km", "costPerKm|Cost / km|float|0.08;2.8;USD;3", "budget|Budget|money|40;120000", "period|Period|enum|Jan 2026;Feb 2026;Mar 2026;Apr 2026;May 2026", "date|Period End|date|-330;0"],
    statuses: ["Within Budget", "Marginal", "Over Budget", "Under Review"],
    measure: "amount", rows: 52,
  },

  "hired-vehicles": {
    name: "Hired Vehicles", kind: "list", summary: "Third-party transport we book",
    entity: "Hire Booking", ref: "HIR",
    fields: ["provider|Provider|enum|Chattogram Carriers;Meghna Transport;Speedline Logistics;Green Line Cargo;Local vendor", VEHICLE_TYPE, ROUTE, "trips|Trips|int|1;48", "rate|Rate per Trip|money|30;2400", "amount|Amount|money|30;68000", "performance|On-Time Rate|pct|48;100", "date|Booked On|date|-200;30"],
    statuses: ["Booked", "In Progress", "Completed", "Billed", "Disputed"],
    measure: "amount",
  },

  "staff-transport": {
    name: "Staff Transport", kind: "list", summary: "Employee pick-up and drop",
    entity: "Staff Route", ref: "STF",
    fields: ["staffRoute|Route|enum|Uttara — Factory;Mirpur — Factory;Savar — Factory;Tongi — Factory;Gulshan — Head Office;Agrabad — Unit 3", VEHICLE, DRIVER, "seats|Seats|int|12;54", "occupied|Occupied|int|4;54", "occupancy|Occupancy|pct|20;100", "monthlyCost|Monthly Cost|money|200;9800", "date|Effective From|date|-600;30"],
    statuses: ["Running", "Suspended", "Under Review", "Discontinued"],
    measure: "monthlyCost",
  },

  "driver-duty": {
    name: "Driver Duty Roster", kind: "calendar", summary: "Who drives when",
    entity: "Duty", ref: "DTY",
    fields: [DRIVER, VEHICLE, "shift|Shift|enum|Morning (06–14);Evening (14–22);Night (22–06);General (09–18)", ROUTE, "dutyHrs|Duty Hours|float|4;14;hrs;1", "overtimeHrs|Overtime|float|0;6;hrs;1", "date|Duty Date|date|-30;30"],
    statuses: ["Rostered", "Reported", "Absent", "Substituted", "Off"],
    measure: "dutyHrs", rows: 54,
  },

  accidents: {
    name: "Accident Register", kind: "list", summary: "Incidents and their cost",
    entity: "Accident", ref: "ACD",
    fields: [VEHICLE, DRIVER, "accidentType|Type|enum|Minor collision;Major collision;Pedestrian incident;Rollover;Fire;Cargo damage;Property damage", "location|Location|enum|Highway;City road;Factory yard;Port area;Parking;Workshop", "damageCost|Damage Cost|money|20;98000", "injuries|Injuries|int|0;6", "insuranceClaim|Insurance Claimed|bool|Yes;No", "date|Occurred On|date|-720;0"],
    statuses: ["Reported", "Under Investigation", "Claim Filed", "Settled", "Closed"],
    measure: "damageCost",
  },

  "fines-violations": {
    name: "Fines & Violations", kind: "list", summary: "Traffic penalties and recovery",
    entity: "Violation", ref: "VIO",
    fields: [VEHICLE, DRIVER, "violation|Violation|enum|Over speeding;Wrong parking;Signal violation;Overloading;Expired document;Lane violation;Mobile phone use", "fine|Fine Amount|money|4;480", "recovered|Recovered from Driver|bool|Yes;No", "authority|Issued By|enum|Traffic police;Highway police;City Corporation;BRTA", "date|Issued On|date|-500;0"],
    statuses: ["Pending Payment", "Paid", "Under Appeal", "Waived", "Recovered"],
    measure: "fine",
  },

  "tyre-management": {
    name: "Tyre Management", kind: "list", summary: "Fitment, rotation and life",
    entity: "Tyre Record", ref: "TYR",
    fields: [VEHICLE, "position|Position|enum|Front left;Front right;Rear left outer;Rear left inner;Rear right outer;Rear right inner;Spare", "brand|Brand|enum|Apollo;MRF;Bridgestone;Michelin;Birla;Retreaded", "fittedKm|Fitted at Odometer|int|1000;420000;km", "runKm|Kilometres Run|int|100;98000;km", "lifeUsed|Life Consumed|pct|4;100", "cost|Cost|money|30;980", "date|Fitted On|date|-900;0"],
    statuses: ["In Service", "Due for Rotation", "Near End of Life", "Retreaded", "Scrapped"],
    measure: "runKm",
  },

  "spare-parts": {
    name: "Fleet Spare Parts", kind: "list", summary: "Parts consumed by the garage",
    entity: "Spare Issue", ref: "SPR",
    fields: [VEHICLE, "part|Part|enum|Engine oil filter;Air filter;Brake pad set;Clutch plate;Battery;Head lamp;Wiper blade;Radiator hose;Injector", "quantity|Quantity|int|1;24;pcs", "unitCost|Unit Cost|money|2;980", "amount|Amount|money|2;9800", "store|Issued From|enum|Garage store;Main spare store;Purchased outside;Warranty replacement", "date|Issued On|date|-260;0"],
    statuses: ["Issued", "Reserved", "Returned", "Backordered"],
    measure: "amount", rows: 50,
  },

  "fuel-cards": {
    name: "Fuel Cards & Limits", kind: "list", summary: "Card allocation and monthly ceiling",
    entity: "Fuel Card", ref: "FCD",
    fields: [VEHICLE, DRIVER, "provider|Card Provider|enum|Padma Oil;Meghna Petroleum;Jamuna Oil;Corporate credit card;In-house coupon", "monthlyLimit|Monthly Limit|money|60;4800", "consumed|Consumed|money|0;5200", "utilisation|Utilisation|pct|0;128", "expiry|Card Expiry|date|-30;900", "date|Issued On|date|-900;0"],
    statuses: ["Active", "Near Limit", "Limit Exceeded", "Blocked", "Expired"],
    measure: "consumed",
  },

  "vehicle-requests": {
    name: "Vehicle Requests", kind: "board", summary: "Who needs a vehicle, and when",
    entity: "Vehicle Request", ref: "VRQ",
    fields: ["requester|Requested By|person", "purpose|Purpose|enum|Buyer pickup;Airport drop;Site visit;Material collection;Emergency;Document delivery", VEHICLE_TYPE, "passengers|Passengers|int|1;40", "fromTo|From → To|enum|Factory → Airport;Head Office → Factory;Factory → Port;Head Office → Buyer office;Factory → Supplier", "requiredOn|Required On|date|-10;40", "date|Raised On|date|-90;0"],
    statuses: ["Submitted", "Approved", "Vehicle Assigned", "Completed", "Rejected"],
    measure: "passengers",
  },

  "fleet-settings": {
    name: "Fleet Configuration", kind: "settings", summary: "Policy, limits and alerts",
    entity: "Fleet Rule", ref: "FST",
    fields: ["rule|Rule|enum|Service interval;Mileage variance threshold;Speed limit alert;Document renewal notice;Personal use policy;Idle time alert", "value|Configured Value|enum|5,000 km;10%;80 km/h;30 days before;Not permitted;20 minutes", INCHARGE, "date|Effective From|date|-500;60"],
    statuses: ["Active", "Draft", "Under Approval", "Superseded"],
    settings: ["Alert the transport in-charge 30 days before any document expires", "Flag a fuel entry when mileage deviates more than 10% from the vehicle norm", "Block trip creation for a vehicle whose fitness certificate has lapsed"],
  },
};
