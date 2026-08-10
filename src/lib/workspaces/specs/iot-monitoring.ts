import type { ModuleSpecs } from "../types";

/** Module 52 — IoT Machine Monitoring Management. */

const MACHINE = "machine|Machine|enum|Power Press 60T;Power Press 110T;Hydraulic Press 150T;Vibratory Polisher;Barrel Plating Line;Rack Plating Line;Air Compressor 75HP;Chiller Unit;Diesel Generator 500kVA";
const DEVICE = "device|Device|enum|SEN-VIB-01;SEN-TMP-04;SEN-CUR-07;SEN-PRS-02;SEN-FLW-05;GW-EDGE-01;GW-EDGE-02;CAM-QC-01";
const SIGNAL = "signal|Signal|enum|Vibration;Temperature;Current;Pressure;Flow rate;Cycle count;Humidity;Power factor";
const AREA = "area|Area|enum|Press Shop;Polishing;Plating;Assembly;Utilities;Warehouse";
const OWNER = "owner|Responsible|person";

export const IOT_MONITORING: ModuleSpecs = {
  "live-telemetry": {
    name: "Live Telemetry", kind: "overview", summary: "Real-time feed from the floor",
    entity: "Telemetry Reading", ref: "TLM",
    fields: [MACHINE, DEVICE, SIGNAL, "value|Current Value|float|0.2;480;;2", "threshold|Threshold|float|1;500;;2", "deviation|Deviation|pct|20;180", AREA, "date|Reading Time|date|-3;0"],
    statuses: ["Normal", "Warning", "Critical", "No Signal"],
    measure: "value", rows: 52,
    insight: "Two vibration sensors on the 110T press have drifted above the warning band for six straight shifts — a bearing check is overdue.",
  },

  "device-registry": {
    name: "Device Registry", kind: "list", summary: "Every connected device on site",
    entity: "Device", ref: "DEV",
    fields: [DEVICE, "deviceType|Type|enum|Vibration sensor;Temperature probe;Current transformer;Pressure sensor;Flow meter;Edge gateway;Vision camera", MACHINE, AREA, "protocol|Protocol|enum|MQTT;Modbus TCP;OPC UA;LoRaWAN;HTTP", "uptime|Uptime|pct|58;100", OWNER, "date|Installed On|date|-900;0"],
    statuses: ["Online", "Offline", "Degraded", "Maintenance", "Decommissioned"],
    measure: "uptime",
  },

  "sensor-data": {
    name: "Sensor Data Explorer", kind: "analytics", summary: "Historical signal analysis",
    entity: "Data Point", ref: "SDX",
    fields: [MACHINE, SIGNAL, "average|Average|float|0.2;420;;2", "peak|Peak|float|0.4;520;;2", "minimum|Minimum|float|0;380;;2", "samples|Samples|int|100;86000", "stdDev|Std Deviation|float|0.01;48;;3", "date|Period|date|-90;0"],
    statuses: ["Stable", "Drifting", "Volatile", "Insufficient Data"],
    measure: "samples",
  },

  thresholds: {
    name: "Threshold Configuration", kind: "settings", summary: "Alarm limits per signal",
    entity: "Threshold", ref: "THR",
    fields: [MACHINE, SIGNAL, "warnLevel|Warning Level|float|0.5;400;;2", "criticalLevel|Critical Level|float|1;520;;2", "hysteresis|Hysteresis|pct|1;20", "delaySec|Trigger Delay|int|0;300;sec", OWNER, "date|Updated On|date|-300;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Suppress repeated alarms within the hysteresis band", "Require engineering approval to relax a critical threshold"],
  },

  alarms: {
    name: "Alarm Log", kind: "list", summary: "Every threshold breach recorded",
    entity: "Alarm", ref: "ALM",
    fields: [MACHINE, DEVICE, SIGNAL, "severity|Severity|enum|Critical;High;Medium;Low", "peakValue|Peak Value|float|0.4;520;;2", "durationMin|Duration|int|1;480;min", OWNER, "date|Raised On|date|-90;0"],
    statuses: ["New", "Acknowledged", "Under Action", "Cleared", "Suppressed"],
    measure: "durationMin",
  },

  "machine-health": {
    name: "Machine Health Score", kind: "analytics", summary: "Composite condition index",
    entity: "Health Score", ref: "MHS",
    fields: [MACHINE, AREA, "healthScore|Health Score|pct|28;99", "vibrationScore|Vibration|pct|20;100", "thermalScore|Thermal|pct|20;100", "electricalScore|Electrical|pct|20;100", "riskLevel|Failure Risk|enum|High;Medium;Low", "date|Scored On|date|-60;0"],
    statuses: ["Healthy", "Watch", "Degraded", "Critical"],
    measure: "healthScore",
  },

  vibration: {
    name: "Vibration Analysis", kind: "analytics", summary: "Bearing and rotor condition",
    entity: "Vibration Reading", ref: "VIB",
    fields: [MACHINE, "point|Measurement Point|enum|Motor DE;Motor NDE;Gearbox input;Gearbox output;Main shaft;Pump housing", "rms|RMS Velocity|float|0.4;18;mm/s;2", "limit|ISO Limit|float|1.8;11;mm/s;2", "dominantFreq|Dominant Frequency|float|10;480;Hz;1", "diagnosis|Likely Cause|enum|Imbalance;Misalignment;Bearing wear;Looseness;Gear defect;Normal", "date|Measured On|date|-120;0"],
    statuses: ["Good", "Satisfactory", "Unsatisfactory", "Unacceptable"],
    measure: "rms",
  },

  temperature: {
    name: "Temperature Monitoring", kind: "analytics", summary: "Thermal trend by asset",
    entity: "Temperature Reading", ref: "TMP",
    fields: [MACHINE, "point|Point|enum|Motor winding;Bearing housing;Hydraulic oil;Panel interior;Plating bath;Compressor outlet", "value|Temperature|float|18;180;°C;1", "limit|Limit|float|40;190;°C;1", "ambient|Ambient|float|18;44;°C;1", "rise|Rise Above Ambient|float|0;140;°C;1", "date|Measured On|date|-90;0"],
    statuses: ["Normal", "Elevated", "High", "Critical"],
    measure: "value",
  },

  connectivity: {
    name: "Connectivity Status", kind: "analytics", summary: "Device uptime and packet health",
    entity: "Connectivity Record", ref: "CON",
    fields: [DEVICE, "gateway|Gateway|enum|GW-EDGE-01;GW-EDGE-02;GW-EDGE-03;Cloud direct", "uptime|Uptime|pct|40;100", "packetLoss|Packet Loss|pct|0;22", "latencyMs|Latency|int|4;900;ms", "lastSeenMin|Last Seen|int|0;2400;min", "date|Period End|date|-60;0"],
    statuses: ["Stable", "Intermittent", "Disconnected", "Under Repair"],
    measure: "uptime",
  },

  "gateway-status": {
    name: "Gateway Status", kind: "list", summary: "Edge gateways and their load",
    entity: "Gateway", ref: "GTW",
    fields: ["gateway|Gateway|enum|GW-EDGE-01;GW-EDGE-02;GW-EDGE-03;GW-EDGE-04", AREA, "devices|Devices Connected|int|1;42", "msgPerMin|Messages / min|int|10;9800", "cpuLoad|CPU Load|pct|4;98", "storageUsed|Buffer Used|pct|2;96", "date|Last Restart|date|-200;0"],
    statuses: ["Online", "Degraded", "Offline", "Maintenance"],
    measure: "msgPerMin",
  },

  firmware: {
    name: "Firmware Management", kind: "list", summary: "Versions deployed across the fleet",
    entity: "Firmware Record", ref: "FRM",
    fields: [DEVICE, "currentVersion|Current Version|enum|v1.2.4;v1.3.0;v1.4.1;v2.0.0;v2.1.3", "latestVersion|Latest Version|enum|v1.4.1;v2.0.0;v2.1.3;v2.2.0", "devices|Devices on Version|int|1;40", "updateWindow|Update Window|enum|Immediate;Next shutdown;Weekend;Planned outage", OWNER, "date|Last Updated|date|-400;0"],
    statuses: ["Up to Date", "Update Available", "Update Scheduled", "Update Failed", "Unsupported"],
    measure: "devices",
  },

  "data-quality": {
    name: "Data Quality", kind: "analytics", summary: "Completeness of the telemetry stream",
    entity: "Quality Record", ref: "DQL",
    fields: [DEVICE, SIGNAL, "expectedSamples|Expected Samples|int|1000;90000", "receivedSamples|Received|int|100;90000", "completeness|Completeness|pct|20;100", "outliers|Outliers|int|0;900", "gapsMin|Longest Gap|int|0;900;min", "date|Period End|date|-90;0"],
    statuses: ["Good", "Acceptable", "Poor", "Unusable"],
    measure: "receivedSamples",
  },

  "edge-rules": {
    name: "Edge Rules", kind: "list", summary: "Logic executed at the gateway",
    entity: "Edge Rule", ref: "EDR",
    fields: ["rule|Rule|enum|Aggregate to 1-minute average;Drop out-of-range samples;Raise alarm on threshold;Local buffer on link loss;Trigger camera capture", "gateway|Gateway|enum|GW-EDGE-01;GW-EDGE-02;GW-EDGE-03", SIGNAL, "executions|Executions (24h)|int|10;86000", "cpuCost|CPU Cost|pct|0.2;24", OWNER, "date|Deployed On|date|-300;0"],
    statuses: ["Active", "Draft", "Failing", "Retired"],
    measure: "executions",
  },

  "calibration-drift": {
    name: "Calibration Drift", kind: "analytics", summary: "Sensor accuracy over time",
    entity: "Drift Record", ref: "CDR",
    fields: [DEVICE, SIGNAL, "referenceValue|Reference|float|0.5;420;;2", "measuredValue|Measured|float|0.5;440;;2", "drift|Drift|pct|0;24", "toleranceLimit|Tolerance|pct|1;10", OWNER, "date|Checked On|date|-300;0"],
    statuses: ["Within Tolerance", "Drifting", "Out of Tolerance", "Recalibrated"],
    measure: "drift",
  },

  "power-monitoring": {
    name: "Power Monitoring", kind: "analytics", summary: "Electrical draw per machine",
    entity: "Power Reading", ref: "PWR",
    fields: [MACHINE, "current|Current|float|2;280;A;1", "voltage|Voltage|float|180;440;V;0", "powerKw|Power|float|0.4;180;kW;2", "powerFactor|Power Factor|float|0.6;1;;2", "energyKwh|Energy|float|1;1800;kWh;1", "date|Reading Date|date|-90;0"],
    statuses: ["Normal", "High Draw", "Low Power Factor", "Fault"],
    measure: "energyKwh",
  },

  "device-maintenance": {
    name: "Device Maintenance", kind: "calendar", summary: "Sensor servicing and battery swaps",
    entity: "Device Task", ref: "DMT",
    fields: [DEVICE, "task|Task|enum|Battery replacement;Sensor cleaning;Cable inspection;Recalibration;Mount check;Gateway restart", MACHINE, "durationMin|Duration|int|10;240;min", OWNER, "date|Due Date|date|-40;120"],
    statuses: ["Scheduled", "In Progress", "Completed", "Overdue", "Skipped"],
    measure: "durationMin",
  },

  "anomaly-events": {
    name: "Anomaly Events", kind: "board", summary: "Unusual patterns flagged by the model",
    entity: "Anomaly", ref: "ANO",
    fields: [MACHINE, SIGNAL, "anomalyType|Pattern|enum|Sudden spike;Slow drift;Missing signal;Oscillation;Step change;Correlated failure", "confidence|Model Confidence|pct|40;99", "impact|Estimated Impact|money|100;62000", OWNER, "date|Detected On|date|-90;0"],
    statuses: ["Detected", "Triaged", "Investigating", "Confirmed", "Dismissed"],
    measure: "impact",
  },

  "telemetry-export": {
    name: "Telemetry Export", kind: "form", summary: "Pull raw signal data for analysis",
    entity: "Export Job", ref: "TEX",
    fields: [MACHINE, SIGNAL, "fromDate|From|date|-180;0", "toDate|To|date|-30;0", "granularity|Granularity|enum|Raw;1 minute;5 minute;Hourly;Daily", "format|Format|enum|CSV;JSON;Parquet", "requester|Requested By|person", "rows|Estimated Rows|int|1000;480000"],
    statuses: ["Draft", "Queued", "Processing", "Ready", "Failed"],
  },

  "sensor-mapping": {
    name: "Sensor Mapping", kind: "list", summary: "Which signal belongs to which asset point",
    entity: "Mapping", ref: "MAP",
    fields: [DEVICE, MACHINE, "point|Mount Point|enum|Motor DE;Motor NDE;Gearbox;Main shaft;Panel;Bath;Outlet line", SIGNAL, "unit|Unit|enum|mm/s;°C;A;bar;L/min;kWh;%", "samplingSec|Sampling Interval|int|1;300;sec", "date|Mapped On|date|-500;0"],
    statuses: ["Verified", "Unverified", "Mismatch", "Retired"],
  },

  "iot-settings": {
    name: "IoT Controls", kind: "settings", summary: "Retention, alerting and access",
    entity: "Control Rule", ref: "ISET",
    fields: ["rule|Rule|enum|Raw data retention;Alarm escalation delay;Auto-create maintenance job;Suppress duplicate alarms;Restrict threshold edits", "retentionDays|Retention|int|7;730;days", OWNER, "date|Effective From|date|-400;0"],
    statuses: ["Active", "Draft", "Suspended", "Retired"],
    settings: ["Create a maintenance job automatically on a critical alarm", "Keep raw telemetry for 90 days, aggregates for two years"],
  },
};
