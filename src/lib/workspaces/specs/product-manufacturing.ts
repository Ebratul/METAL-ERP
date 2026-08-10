import type { ModuleSpecs } from "../types";

/**
 * Module 32 — Product Manufacturing Management.
 *
 * Thirty-five workspaces in the master serial order: one per metal accessory
 * product line, then the shared forming, plating and finishing processes, and
 * finally assembly, costing, quality, rework, packing and transfer.
 */

/* ── Shared field fragments ────────────────────────────────────────────── */

const BUYER = "buyer|Buyer|enum|@buyers";
const PRO_LINK = "productionOrder|Production Order|enum|PRO-26-1041;PRO-26-1056;PRO-26-1072;PRO-26-1088;PRO-26-1104;PRO-26-1121";
const OPERATOR = "operator|Operator|person";
const SUPERVISOR = "supervisor|Supervisor|person";
const SHIFT = "shift|Shift|enum|Shift A - 06:00;Shift B - 14:00;Shift C - 22:00;General Day";
const FINISH = "finish|Finish|enum|Antique Brass;Gunmetal;Matte Black;Nickel Free;Gold;Brushed Silver;Copper;White Enamel;Anti Silver";
const METAL = "metal|Metal|enum|Brass;Zinc alloy;Stainless steel;Mild steel;Aluminium;Copper alloy";
const ORDER_QTY = "orderQty|Order Qty|int|500;480000;pcs";
const PRODUCED_QTY = "producedQty|Produced Qty|int|0;480000;pcs";
const GOOD_QTY = "goodQty|Good Qty|int|0;480000;pcs";
const REJECT_QTY = "rejectQty|Reject Qty|int|0;48000;pcs";
const RUN_STATUSES = ["Completed", "Running", "Planned", "On Hold", "Cancelled"];

export const PRODUCT_MANUFACTURING: ModuleSpecs = {
  /* ── 01 ────────────────────────────────────────────────────────────── */
  "manufacturing-dashboard": {
    name: "Manufacturing Dashboard", kind: "overview", summary: "Every product line on one screen",
    entity: "Manufacturing Summary", ref: "MFD",
    fields: [BUYER, "productLine|Product Line|enum|Buttons;Snap buttons;Rivets;Eyelets;Jeans buttons;Buckles;Metal zippers;Nylon zippers;Sliders;Badges", "flowStage|Flow Stage|enum|Approved PI;Production Order;Work Order;BOM Verification;Routing Verification;Material Availability;Material Reservation;Material Issue;Manufacturing Process;IPQC;Semi Finished Goods;Final Processing;Final QC;Packing;Finished Goods;Ready For Delivery", ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "yieldPct|Yield|pct|58;100", "date|Production Date|date|-330;0"],
    statuses: ["On Target", "Running", "Behind Plan", "Completed", "Stopped"],
    measure: "producedQty", rows: 64,
    insight: "The flow stage column is the manufacturing route itself — from an approved PI through to ready for delivery. Most held quantity sits at IPQC, not at the machines.",
  },

  /* ── 02 ────────────────────────────────────────────────────────────── */
  "button-production": {
    name: "Button Production", kind: "list", summary: "Sew-through and shank buttons",
    entity: "Button Run", ref: "BTN",
    fields: [BUYER, "buttonType|Button Type|enum|4-hole sew;2-hole sew;Shank button;Covered button;Snap-on button", "sizeLigne|Size|enum|16L;18L;20L;24L;28L;32L;36L", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "machine|Machine|enum|Press-01;Press-02;Press-03;Assembly-01", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 56,
  },

  /* ── 03 ────────────────────────────────────────────────────────────── */
  "snap-button-production": {
    name: "Snap Button Production", kind: "list", summary: "Cap, socket, stud and post",
    entity: "Snap Run", ref: "SNP",
    fields: [BUYER, "snapType|Snap Type|enum|Ring snap;Prong snap;Spring snap;S-spring snap;Open ring snap", "sizeMm|Size|enum|10mm;12.5mm;15mm;17mm;20mm", "component|Component|enum|Cap;Socket;Stud;Post;Complete set", FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "springTension|Spring Tension|float|8;60;N;1", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 58,
    insight: "Snap sets are only as good as their weakest component — a socket run at 98% good against a cap run at 92% still yields 92% complete sets.",
  },

  /* ── 04 ────────────────────────────────────────────────────────────── */
  "rivet-production": {
    name: "Rivet Production", kind: "list", summary: "Double cap, tubular and jeans rivets",
    entity: "Rivet Run", ref: "RVT",
    fields: [BUYER, "rivetType|Rivet Type|enum|Double cap;Single cap;Tubular;Split rivet;Decorative;Jeans rivet", "sizeMm|Size|enum|6mm;7mm;8mm;9mm;10mm;12mm", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "pullStrength|Pull Strength|float|40;320;N;0", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 54,
  },

  /* ── 05 ────────────────────────────────────────────────────────────── */
  "eyelet-production": {
    name: "Eyelet Production", kind: "list", summary: "Plain, washer and self-piercing eyelets",
    entity: "Eyelet Run", ref: "EYL",
    fields: [BUYER, "eyeletType|Eyelet Type|enum|Plain eyelet;Washer eyelet;Self-piercing;Flanged;Decorative", "innerDia|Inner Diameter|enum|3mm;4mm;5mm;6mm;8mm;10mm", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "wallThickness|Wall Thickness|float|0.2;1.6;mm;2", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 52,
  },

  /* ── 06 ────────────────────────────────────────────────────────────── */
  "jeans-button-production": {
    name: "Jeans Button Production", kind: "list", summary: "Tack buttons with logo engraving",
    entity: "Jeans Button Run", ref: "JBT",
    fields: [BUYER, "buttonStyle|Style|enum|Tack button;Shank tack;Movable pin;Fixed pin;Hammer-on", "sizeMm|Size|enum|17mm;18mm;20mm;22mm", "logoType|Logo|enum|Laser engraved;Embossed;Debossed;Enamel filled;Plain", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 58,
  },

  /* ── 07 ────────────────────────────────────────────────────────────── */
  "hook-bar-production": {
    name: "Hook & Bar Production", kind: "list", summary: "Trouser and skirt closures",
    entity: "Hook & Bar Run", ref: "HKB",
    fields: [BUYER, "componentType|Component|enum|Hook;Bar;Hook and bar set;Trouser hook;Skirt hook", "widthMm|Width|enum|8mm;10mm;12mm;15mm;20mm", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "gripStrength|Grip Strength|float|20;180;N;0", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 48,
  },

  /* ── 08 ────────────────────────────────────────────────────────────── */
  "buckle-production": {
    name: "Buckle Production", kind: "list", summary: "Centre bar, roller and slide buckles",
    entity: "Buckle Run", ref: "BKL",
    fields: [BUYER, "buckleType|Buckle Type|enum|Centre bar;Roller buckle;Pin buckle;Slide buckle;D-ring;Tri-glide", "beltWidth|Belt Width|enum|15mm;20mm;25mm;30mm;38mm;50mm", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "castingMethod|Method|enum|Die cast;Stamped;Wire formed;Injection moulded", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 52,
  },

  /* ── 09 ────────────────────────────────────────────────────────────── */
  "metal-plate-production": {
    name: "Metal Plate Production", kind: "list", summary: "Logo, name and decorative plates",
    entity: "Plate Run", ref: "MPL",
    fields: [BUYER, "plateType|Plate Type|enum|Logo plate;Name plate;Back plate;Decorative plate;Rectangular tag", "dimensions|Dimensions|enum|30x8mm;40x10mm;25x12mm;50x15mm;20x20mm", "engraving|Engraving|enum|Laser;Chemical etched;Embossed;Stamped;Printed", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 50,
  },

  /* ── 10 ────────────────────────────────────────────────────────────── */
  "badge-production": {
    name: "Badge Production", kind: "list", summary: "Pin, enamel and sew-on badges",
    entity: "Badge Run", ref: "BDG",
    fields: [BUYER, "badgeType|Badge Type|enum|Pin badge;Sew-on badge;Enamel badge;Metal emblem;Rubber-metal badge", "enamelType|Enamel|enum|Soft enamel;Hard enamel;Offset printed;No enamel", "attachment|Attachment|enum|Butterfly clutch;Safety pin;Magnet;Sew holes;Adhesive", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 48,
  },

  /* ── 11 ────────────────────────────────────────────────────────────── */
  "metal-zipper-production": {
    name: "Metal Zipper Production", kind: "list", summary: "Brass and aluminium tooth chains",
    entity: "Metal Zipper Run", ref: "MZP",
    fields: [BUYER, "zipperSize|Zipper Size|enum|No. 3;No. 4;No. 5;No. 8;No. 10", "zipperType|Type|enum|Closed end;Open end;Two way;Two way open end;Reversible", "teethMetal|Teeth Metal|enum|Brass;Aluminium;Nickel;Antique brass;Gunmetal", "lengthCm|Length|float|8;120;cm;1", FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 56,
  },

  /* ── 12 ────────────────────────────────────────────────────────────── */
  "nylon-zipper-production": {
    name: "Nylon Zipper Production", kind: "list", summary: "Coil zippers on woven tape",
    entity: "Nylon Zipper Run", ref: "NZP",
    fields: [BUYER, "zipperSize|Zipper Size|enum|No. 3;No. 4;No. 5;No. 8;No. 10", "coilType|Coil Type|enum|Standard coil;Invisible;Water resistant;Reverse coil;Flame retardant", "tapeColor|Tape Colour|enum|Black;White;Navy;Beige;Red;Grey;Custom dyed", "lengthCm|Length|float|8;120;cm;1", ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "machine|Machine|enum|Coil-01;Coil-02;Coil-03;Gapping-01", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 54,
  },

  /* ── 13 ────────────────────────────────────────────────────────────── */
  "vislon-zipper-production": {
    name: "Vislon Zipper Production", kind: "list", summary: "Moulded resin tooth zippers",
    entity: "Vislon Zipper Run", ref: "VZP",
    fields: [BUYER, "zipperSize|Zipper Size|enum|No. 3;No. 5;No. 8;No. 10", "vislonType|Vislon Type|enum|Standard vislon;Reversible;Open end;Two way open end;Water resistant", "resinColor|Resin Colour|enum|Black;White;Navy;Red;Transparent;Custom match", "lengthCm|Length|float|8;120;cm;1", ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "mould|Mould|enum|MLD-1104;MLD-1128;MLD-1150;MLD-1172", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 50,
  },

  /* ── 14 ────────────────────────────────────────────────────────────── */
  "slider-production": {
    name: "Slider Production", kind: "list", summary: "Auto lock, pin lock and non lock",
    entity: "Slider Run", ref: "SLD",
    fields: [BUYER, "sliderType|Slider Type|enum|Auto lock;Pin lock;Non lock;Semi auto;Reversible", "sliderSize|Size|enum|No. 3;No. 4;No. 5;No. 8;No. 10", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "lockStrength|Lock Strength|float|10;120;N;0", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 54,
  },

  /* ── 15 ────────────────────────────────────────────────────────────── */
  "puller-production": {
    name: "Puller Production", kind: "list", summary: "Standard, logo and custom pullers",
    entity: "Puller Run", ref: "PLR",
    fields: [BUYER, "pullerType|Puller Type|enum|Standard puller;Logo puller;Rubber puller;Chain puller;Ring puller;Custom shape", "attachMethod|Attachment|enum|Crimped;Welded;Split ring;Moulded on;Screwed", METAL, FINISH, ORDER_QTY, PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "weightG|Unit Weight|float|0.2;24;g;2", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 50,
  },

  /* ── 16 ────────────────────────────────────────────────────────────── */
  "teeth-production": {
    name: "Teeth Production", kind: "list", summary: "Metal, vislon and coil teeth",
    entity: "Teeth Run", ref: "TTH",
    fields: [BUYER, "teethType|Teeth Type|enum|Metal teeth;Vislon teeth;Coil teeth", "teethMetal|Material|enum|Brass;Aluminium;Nickel;POM resin;Nylon", "zipperSize|For Size|enum|No. 3;No. 4;No. 5;No. 8;No. 10", "pitchMm|Teeth Pitch|float|2;12;mm;2", "lengthProduced|Length Produced|float|10;48000;m;1", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "machine|Machine|enum|Teeth-01;Teeth-02;Coil-01;Injection-02", "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "producedQty", rows: 48,
  },

  /* ── 17 ────────────────────────────────────────────────────────────── */
  "tape-weaving": {
    name: "Tape Weaving", kind: "list", summary: "Woven zipper and trim tape",
    entity: "Weaving Run", ref: "TPW",
    fields: [BUYER, "tapeType|Tape Type|enum|Polyester tape;Cotton tape;Nylon tape;Reflective tape;Water resistant tape", "widthMm|Tape Width|float|8;60;mm;1", "loom|Loom|enum|Loom-01;Loom-02;Loom-03;Loom-04;Needle Loom-01", "lengthWoven|Length Woven|float|100;480000;m;1", "gsm|Tape GSM|float|20;280;gsm;0", "defectsPerKm|Defects per km|float|0;24;defects;1", OPERATOR, SHIFT, "date|Run Date|date|-330;0"],
    statuses: RUN_STATUSES,
    measure: "lengthWoven", rows: 50,
  },

  /* ── 18 ────────────────────────────────────────────────────────────── */
  "tape-dyeing": {
    name: "Tape Dyeing", kind: "list", summary: "Shade matching and dye lots",
    entity: "Dyeing Run", ref: "TPD",
    fields: [BUYER, "dyeColor|Colour|enum|Black;White;Navy;Beige;Red;Grey;Olive;Custom shade", "dyeLot|Dye Lot|enum|DL-4471;DL-4489;DL-4502;DL-4517;DL-4530", "dyeMachine|Dyeing Machine|enum|Jet Dye-01;Jet Dye-02;Beam Dye-01;Continuous Dye-01", "lengthDyed|Length Dyed|float|100;480000;m;1", "shadeMatch|Shade Match|pct|60;100", "colourFastness|Colour Fastness|float|1;5;grade;1", "temperature|Dye Temperature|float|60;140;C;0", OPERATOR, "date|Run Date|date|-330;0"],
    statuses: ["Shade Approved", "Running", "Awaiting Shade Approval", "Re-dye Required", "Rejected"],
    measure: "lengthDyed", rows: 50,
    insight: "Re-dye is almost always a first-lot problem. Once a shade is approved against the buyer's swatch, repeat lots hold match above 97%.",
  },

  /* ── 19 ────────────────────────────────────────────────────────────── */
  "injection-molding": {
    name: "Injection Molding", kind: "list", summary: "Resin components and vislon teeth",
    entity: "Moulding Run", ref: "INJ",
    fields: ["mouldNo|Mould|enum|MLD-1104;MLD-1128;MLD-1150;MLD-1172;MLD-1196", "resin|Resin|enum|POM;Nylon 6;Polyester;ABS;Polypropylene", "cavities|Cavities|int|2;64", "shotWeight|Shot Weight|float|0.5;480;g;2", "cycleSec|Cycle Time|float|4;90;sec;1", "meltTemp|Melt Temperature|float|160;320;C;0", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "shortShot|Short Shot Reject|pct|0;14", "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Setup", "Mould Change", "Stopped"],
    measure: "producedQty", rows: 54,
  },

  /* ── 20 ────────────────────────────────────────────────────────────── */
  "die-casting": {
    name: "Die Casting", kind: "list", summary: "Zamak and aluminium castings",
    entity: "Casting Run", ref: "DCS",
    fields: ["dieNo|Die|enum|DIE-2041;DIE-2068;DIE-2094;DIE-2120;DIE-2146", "alloy|Alloy|enum|Zamak 3;Zamak 5;Aluminium ADC12;Brass CuZn39", "meltTemp|Melt Temperature|float|380;720;C;0", "shotWeight|Shot Weight|float|1;980;g;2", "cavities|Cavities|int|1;32", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "porosity|Porosity Reject|pct|0;12", "cycleSec|Cycle Time|float|6;120;sec;1", "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Setup", "Die Change", "Stopped"],
    measure: "producedQty", rows: 54,
  },

  /* ── 21 ────────────────────────────────────────────────────────────── */
  "press-operation": {
    name: "Press Operation", kind: "list", summary: "Stamping on power presses",
    entity: "Press Run", ref: "PRS",
    fields: ["press|Press|enum|25 Ton;45 Ton;60 Ton;80 Ton;110 Ton;160 Ton", "dieNo|Die|enum|DIE-2041;DIE-2068;DIE-2094;DIE-2120;DIE-2146", "strokesPerMin|Strokes|int|20;420;spm", "strokeCount|Die Stroke Count|int|1000;980000;strokes", "stripWidth|Strip Width|float|4;120;mm;1", "stripThickness|Strip Thickness|float|0.2;3.2;mm;2", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, OPERATOR, "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Setup", "Die Change", "Breakdown"],
    measure: "producedQty", rows: 58,
    insight: "Reject rate climbs sharply past 400k strokes on a die. Scheduling the regrind at 380k costs one shift and saves roughly four times that in scrap.",
  },

  /* ── 22 ────────────────────────────────────────────────────────────── */
  "punching-process": {
    name: "Punching Process", kind: "list", summary: "Blanking, piercing and trimming",
    entity: "Punching Run", ref: "PCH",
    fields: ["punchOperation|Operation|enum|Blanking;Piercing;Notching;Trimming;Coining;Embossing", "toolNo|Tool|enum|TL-3041;TL-3068;TL-3094;TL-3120;TL-3146", "burrHeight|Burr Height|float|0.01;0.4;mm;3", "clearance|Die Clearance|float|0.01;0.3;mm;3", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "scrapWeight|Web Scrap|float|1;4800;kg;1", OPERATOR, SHIFT, "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Setup", "Tool Change", "Stopped"],
    measure: "producedQty", rows: 54,
  },

  /* ── 23 ────────────────────────────────────────────────────────────── */
  "plating-process": {
    name: "Plating Process", kind: "list", summary: "Barrel and rack electroplating",
    entity: "Plating Batch", ref: "PLT",
    fields: ["platingType|Plating|enum|Nickel;Brass;Gunmetal;Antique brass;Gold;Chrome;Black nickel;Copper", "bath|Bath|enum|Barrel-01;Barrel-02;Barrel-03;Rack-01;Rack-02", "thicknessMicron|Coating Thickness|float|0.2;24;um;2", "cycleMin|Plating Cycle|float|8;180;min;0", "bathTemp|Bath Temperature|float|18;70;C;0", "phValue|Bath pH|float|3;11;pH;2", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "nickelRelease|Nickel Release Test|bool|Pass;Fail", "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Awaiting Bath", "Re-plating", "Rejected"],
    measure: "producedQty", rows: 58,
    insight: "Nickel release failures cluster in one barrel whose bath chemistry drifts fastest. Buyers testing to EN 1811 will find it before we do unless the dosing interval tightens.",
  },

  /* ── 24 ────────────────────────────────────────────────────────────── */
  "coating-finishing": {
    name: "Coating & Surface Finishing", kind: "list", summary: "Lacquer, PVD and powder coat",
    entity: "Coating Run", ref: "CSF",
    fields: ["coatingType|Coating|enum|Anti-tarnish lacquer;Epoxy coating;PVD;E-coating;Powder coating;Clear coat", "surfaceFinish|Surface Finish|enum|Matte;Glossy;Satin;Brushed;Hammered;Polished", "thicknessMicron|Coating Thickness|float|0.5;60;um;2", "adhesion|Adhesion Test|pct|60;100", "saltSprayHours|Salt Spray|int|8;480;hrs", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "curingTemp|Curing Temperature|float|40;220;C;0", "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Awaiting Cure", "Re-coating", "Rejected"],
    measure: "producedQty", rows: 52,
  },

  /* ── 25 ────────────────────────────────────────────────────────────── */
  "painting-coloring": {
    name: "Painting & Coloring", kind: "list", summary: "Spray, enamel fill and UV cure",
    entity: "Painting Run", ref: "PNT",
    fields: ["paintType|Paint|enum|Spray paint;Enamel fill;Epoxy resin;UV cure;Baked enamel", "colorCode|Colour|enum|Pantone 186C;Pantone 286C;Pantone Black 6C;RAL 9005;RAL 5013;Custom match", "coats|Coats|int|1;4", "colorMatch|Colour Match|pct|60;100", "curingTemp|Curing Temperature|float|60;220;C;0", PRODUCED_QTY, GOOD_QTY, REJECT_QTY, "paintUsage|Paint Used|float|0.1;480;kg;2", "date|Run Date|date|-330;0"],
    statuses: ["Completed", "Running", "Awaiting Cure", "Re-work Required", "Rejected"],
    measure: "producedQty", rows: 50,
  },

  /* ── 26 ────────────────────────────────────────────────────────────── */
  "product-assembly": {
    name: "Product Assembly", kind: "board", summary: "Multi-part sets brought together",
    entity: "Assembly Job", ref: "ASM",
    fields: [BUYER, "assemblyType|Assembly|enum|Snap set assembly;Zipper assembly;Slider and puller;Buckle and pin;Badge and clutch;Multi-part set", "components|Components per Set|int|2;8", "assembledQty|Assembled Qty|int|500;480000;sets", GOOD_QTY, REJECT_QTY, "assemblyRate|Assembly Rate|int|100;12000;sets/hr", "manpower|Manpower|int|2;64;people", SUPERVISOR, SHIFT, "date|Assembly Date|date|-330;0"],
    statuses: ["Components Ready", "In Assembly", "Assembled", "Short of Components", "On Hold"],
    measure: "assembledQty", rows: 56,
  },

  /* ── 27 ────────────────────────────────────────────────────────────── */
  "cost-sheet": {
    name: "Product Cost Sheet Management", kind: "analytics", summary: "Built-up cost per product",
    entity: "Cost Sheet Line", ref: "CSH",
    fields: ["item|Item|enum|@items", "costHead|Cost Head|enum|Raw material;Plating chemical;Labour;Machine hour;Tooling amortisation;Packing;Overhead;Rejection allowance", "basisQty|Basis Qty|int|1000;480000;pcs", "unitCost|Unit Cost|float|0.001;2.4;USD;4", "totalCost|Total Cost|money|100;980000", "sellingPrice|Selling Price|float|0.02;4.8;USD;3", "margin|Margin|pct|2;46", "sharePct|Share of Cost|pct|0.5;62", "costedBy|Costed By|person", "date|Costed On|date|-330;0"],
    statuses: ["Approved", "Draft", "Under Review", "Superseded"],
    measure: "totalCost", rows: 60,
  },

  /* ── 28 ────────────────────────────────────────────────────────────── */
  ipqc: {
    name: "In Process Quality Control (IPQC)", kind: "list", summary: "Checks taken during the run",
    entity: "IPQC Check", ref: "IPQ",
    fields: [PRO_LINK, "checkPoint|Check Point|enum|After blanking;After forming;After plating;After assembly;In-line dimension;In-line finish", "parameter|Parameter|enum|Dimension;Plating thickness;Colour shade;Spring tension;Pull strength;Surface defect;Burr height", "sampleQty|Sample Size|int|5;480;pcs", "passQty|Passed|int|0;480;pcs", "defectQty|Defects Found|int|0;120;pcs", "defectRate|Defect Rate|pct|0;24", "inspector|Inspector|person", SHIFT, "date|Checked On|date|-330;0"],
    statuses: ["Passed", "Passed with Observation", "Under Inspection", "Line Stopped", "Failed"],
    measure: "sampleQty", rows: 62,
  },

  /* ── 29 ────────────────────────────────────────────────────────────── */
  fqc: {
    name: "Final Quality Control (FQC)", kind: "list", summary: "AQL inspection before packing",
    entity: "FQC Inspection", ref: "FQC",
    fields: [BUYER, PRO_LINK, "lotQty|Lot Qty|int|500;480000;pcs", "aql|AQL Level|enum|AQL 1.0;AQL 1.5;AQL 2.5;AQL 4.0;100% inspection", "sampleQty|Sample Size|int|8;1250;pcs", "majorDefect|Major Defects|int|0;48", "minorDefect|Minor Defects|int|0;120", "verdict|Verdict|enum|Accepted;Accepted with deviation;Re-inspection;Rejected", "inspector|Inspector|person", "date|Inspected On|date|-330;0"],
    statuses: ["Accepted", "Accepted with Deviation", "Awaiting Inspection", "Re-inspection", "Rejected"],
    measure: "lotQty", rows: 58,
  },

  /* ── 30 ────────────────────────────────────────────────────────────── */
  "rework-production": {
    name: "Rework Production", kind: "board", summary: "Recovering what can be saved",
    entity: "Rework Job", ref: "RWP",
    fields: [BUYER, "reworkReason|Rework Reason|enum|Plating defect;Dimension out of tolerance;Colour mismatch;Burr;Loose assembly;Surface scratch;Logo misalignment", "reworkOperation|Rework Operation|enum|Re-plating;Re-polishing;Sorting;Re-assembly;Deburring;Re-painting", "reworkQty|Rework Qty|int|50;280000;pcs", "recoveredQty|Recovered|int|0;280000;pcs", "yieldPct|Recovery Yield|pct|20;100", "reworkCost|Rework Cost|money|20;280000", "savedValue|Value Recovered|money|0;480000", SUPERVISOR, "date|Scheduled On|date|-300;45"],
    statuses: ["Planned", "In Progress", "Completed", "Partially Recovered", "Abandoned"],
    measure: "savedValue", rows: 56,
  },

  /* ── 31 ────────────────────────────────────────────────────────────── */
  "reject-scrap": {
    name: "Reject & Scrap Processing", kind: "list", summary: "What cannot be saved, and its metal",
    entity: "Scrap Record", ref: "RSC",
    fields: ["rejectReason|Reject Reason|enum|Beyond rework;Material defect;Die mark;Casting porosity;Plating peel;Dimensional failure;Contamination", "rejectQty|Reject Qty|int|50;280000;pcs", METAL, "scrapWeight|Scrap Weight|float|1;24000;kg;1", "metalRecovered|Metal Recovered|float|0;24000;kg;1", "recoveryRate|Recovery Rate|pct|20;99", "scrapValue|Scrap Value|money|20;180000", "disposal|Disposal|enum|Re-melt in house;Sold to recycler;Returned to supplier;Landfill;Held for review", "date|Recorded On|date|-330;0"],
    statuses: ["Re-melted", "Sold", "Awaiting Disposal", "Held for Review", "Written Off"],
    measure: "scrapValue", rows: 54,
  },

  /* ── 32 ────────────────────────────────────────────────────────────── */
  "packing-production": {
    name: "Packing Production", kind: "list", summary: "Polybags, inner boxes and cartons",
    entity: "Packing Run", ref: "PKP",
    fields: [BUYER, PRO_LINK, "packType|Pack Type|enum|Polybag;Inner box;Master carton;Blister pack;Hanger card;Bulk drum", "packQty|Pieces per Pack|int|12;2400;pcs", "packsProduced|Packs Produced|int|10;24000;packs", "cartons|Cartons|int|1;2400;cartons", "netWeight|Net Weight|float|1;24000;kg;1", "labelType|Label|enum|Barcode label;QR label;Buyer label;Care label;Shipping mark", OPERATOR, "date|Packed On|date|-330;0"],
    statuses: ["Completed", "Running", "Planned", "Short Packed", "On Hold"],
    measure: "packsProduced", rows: 56,
  },

  /* ── 33 ────────────────────────────────────────────────────────────── */
  "finished-goods-transfer": {
    name: "Finished Goods Transfer", kind: "list", summary: "Floor to warehouse handover",
    entity: "Transfer Note", ref: "FGT",
    fields: ["transferNo|Transfer Note|code|FGT", BUYER, PRO_LINK, "transferQty|Transfer Qty|int|500;480000;pcs", "fromLocation|From|enum|Packing Hall;Assembly Hall;FQC Hold;Rework Area", "toLocation|To|enum|FG Warehouse;Bonded Store;Dispatch Bay;Buyer Hold Area", "cartons|Cartons|int|1;2400;cartons", "value|Transfer Value|money|100;980000", "receivedBy|Received By|person", "date|Transferred On|date|-330;0"],
    statuses: ["Received", "In Transit", "Pending", "Partially Received", "Rejected"],
    measure: "value", rows: 58,
  },

  /* ── 34 ────────────────────────────────────────────────────────────── */
  "manufacturing-reports": {
    name: "Manufacturing Reports", kind: "analytics", summary: "Output, yield and cost reporting",
    entity: "Report", ref: "MRP",
    fields: ["reportType|Report|enum|Production report;Product wise output;Process wise yield;Rework report;Reject report;Machine report;Operator report;Cost report;Daily output;Monthly summary", BUYER, "productLine|Product Line|enum|Buttons;Snap buttons;Rivets;Eyelets;Jeans buttons;Buckles;Metal zippers;Nylon zippers;Sliders;Badges", "period|Period|enum|Week 12;Week 13;Week 14;Month Mar 2026;Month Apr 2026;Month May 2026", "volumeQty|Volume|int|1000;980000;pcs", "value|Value|money|1000;4800000", "reportFormat|Output|enum|Dashboard chart;PDF;Excel;Scheduled email", "generatedBy|Generated By|person", "date|Generated On|date|-330;0"],
    statuses: ["Published", "Generated", "Scheduled", "Failed"],
    measure: "value", rows: 54,
  },

  /* ── 35 ────────────────────────────────────────────────────────────── */
  "ai-manufacturing-analytics": {
    name: "AI Manufacturing Analytics", kind: "analytics", summary: "Quality, yield and process prediction",
    entity: "AI Analysis", ref: "AMA",
    fields: ["analysisType|Analysis|enum|AI quality prediction;AI rework analysis;AI yield optimisation;AI process parameter tuning;AI defect root cause;AI machine utilisation;AI cost optimisation;AI throughput forecast", "productLine|Product Line|enum|Buttons;Snap buttons;Rivets;Eyelets;Jeans buttons;Buckles;Metal zippers;Nylon zippers;Sliders;Badges", "process|Process|enum|Press;Injection;Die casting;Plating;Coating;Assembly;Packing", "confidence|Confidence|pct|45;99", "predictedYield|Predicted Yield|pct|58;100", "impactValue|Value Impact|money|100;980000", "recommendation|AI Recommendation|text|Raise the plating cycle by 90 seconds;Regrind the die at 380k strokes;Drop the melt temperature 12 degrees;Move the lot to Barrel-03;Increase the sample size at IPQC;Tighten the strip nesting layout", "owner|Owner|person", "date|Generated On|date|-330;0"],
    statuses: ["Adopted", "Validated", "Monitoring", "New", "Rejected"],
    measure: "impactValue", rows: 56,
    insight: "Quality prediction on plating runs is the strongest model in the set — it flags a bath drifting out of specification about six hours before the first defective lot appears.",
  },
};
