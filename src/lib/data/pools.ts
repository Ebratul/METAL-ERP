/**
 * Shared value pools for the demo data.
 *
 * Every generated record draws its text values from these lists, so the whole
 * app speaks one vocabulary — a buyer seen in Sales Orders is the same buyer
 * seen in Proforma Invoices. Pools are plain frozen arrays: no React, no
 * randomness at module scope, safe to import from both server and client.
 */

export const PEOPLE = [
  "Rashed Khan",
  "Maria Gomez",
  "Tanvir Ahmed",
  "Li Wei",
  "Sadia Rahman",
  "James Taylor",
  "Nusrat Jahan",
  "Kenji Tanaka",
  "Farhan Chowdhury",
  "Emma Novak",
  "Arif Hossain",
  "Priya Nair",
  "Daniel Okafor",
  "Sumaiya Akter",
  "Mehedi Hasan",
  "Chen Yu Lin",
  "Rakib Islam",
  "Ana Silva",
  "Imran Kabir",
  "Hasina Begum",
  "Peter Novotny",
  "Shahin Alam",
  "Ritu Barua",
  "Mahmudul Haque",
] as const;

export const BUYERS = [
  "H&M Global Sourcing",
  "Inditex / Zara",
  "Levi Strauss & Co.",
  "Primark Sourcing",
  "Uniqlo / Fast Retailing",
  "Decathlon Sourcing",
  "C&A Buying",
  "Bestseller A/S",
  "Next Sourcing Ltd.",
  "Tesco F&F",
  "Marks & Spencer",
  "Carrefour Textiles",
  "PVH Corp.",
  "American Eagle",
  "Kiabi Sourcing",
  "Walmart Global",
] as const;

export const SUPPLIERS = [
  "Zhejiang Metal Works",
  "Dhaka Brass Industries",
  "Guangzhou Alloy Co.",
  "Nippon Plating Chemicals",
  "Korea Zipper Components",
  "Chattogram Packaging Ltd.",
  "Shanghai Die & Tool",
  "Ahmedabad Steel Strips",
  "Taiwan Precision Springs",
  "Vietnam Surface Finishing",
  "Ningbo Wire & Rod",
  "Kolkata Polymer Traders",
  "Bangkok Chem Supplies",
  "Sylhet Carton & Print",
  "Delta Lubricants Ltd.",
  "Meghna Industrial Gases",
] as const;

export const PRODUCTS = [
  "Antique Brass Snap Button 15mm",
  "Nickel-Free Jeans Button 17mm",
  "Gunmetal Slider #5",
  "Matte Black Rivet 9mm",
  "Gold Eyelet 4mm",
  "Zinc Alloy Buckle 25mm",
  "Engraved Metal Label 30x8mm",
  "Two-Way Zipper Puller",
  "Brushed Silver Burr 8mm",
  "Enamel-Filled Shank Button",
  "Copper Hook & Bar Set",
  "Laser-Etched Tack Button",
  "Silver Prong Snap 12mm",
  "Metal Cord End 6mm",
  "Rose Gold D-Ring 20mm",
  "Oxidised Chain Tag",
  "Stainless Toggle Clasp",
  "Antique Copper Grommet 10mm",
] as const;

export const RAW_MATERIALS = [
  "Brass Sheet 0.8mm",
  "Zinc Alloy Ingot ZA-3",
  "Copper Strip 0.5mm",
  "Stainless Steel Wire 1.2mm",
  "Aluminium Coil 0.6mm",
  "Iron Rod 3mm",
  "Nickel Anode Plate",
  "Tin Ingot 99.9%",
  "ABS Resin Granule",
  "Steel Strip CRCA 1.0mm",
  "Bronze Rod 5mm",
  "Zinc Anode Bar",
] as const;

export const CHEMICALS = [
  "Nickel Sulphate",
  "Copper Cyanide",
  "Bright Acid Zinc",
  "Chromic Acid",
  "Degreasing Agent DG-40",
  "Passivation Solution P-7",
  "Electro Polishing Salt",
  "Anti-Tarnish Lacquer",
  "Caustic Soda Flakes",
  "Sulphuric Acid 98%",
  "Trivalent Chrome Blue",
  "Gold Potassium Cyanide",
] as const;

export const MACHINES = [
  "Power Press PP-45T",
  "Power Press PP-63T",
  "Eyelet Machine EM-02",
  "Barrel Plating Line BP-1",
  "Rack Plating Line RP-2",
  "Vibratory Polisher VP-06",
  "Auto Assembly AS-11",
  "Laser Marker LM-03",
  "Injection Moulder IM-08",
  "CNC Milling CM-04",
  "EDM Wirecut WC-01",
  "Ultrasonic Cleaner UC-05",
  "Tumbling Barrel TB-09",
  "Air Compressor AC-02",
] as const;

export const WORK_CENTERS = [
  "Stamping Line A",
  "Stamping Line B",
  "Polishing Section",
  "Barrel Plating",
  "Rack Plating",
  "Assembly Line 1",
  "Assembly Line 2",
  "Laser & Engraving",
  "Inspection Bay",
  "Packing Hall",
] as const;

export const PROCESSES = [
  "Blanking",
  "Deep Drawing",
  "Forming",
  "Deburring",
  "Polishing",
  "Degreasing",
  "Electroplating",
  "Passivation",
  "Lacquering",
  "Assembly",
  "Inspection",
  "Packing",
] as const;

export const DEPARTMENTS = [
  "Production",
  "Quality Assurance",
  "Merchandising",
  "Planning (PPC)",
  "Procurement",
  "Store & Inventory",
  "Tool Room",
  "Plating",
  "Maintenance",
  "Finance & Accounts",
  "Human Resources",
  "IT & Systems",
  "Commercial",
  "Logistics",
  "R&D / Design",
] as const;

export const DESIGNATIONS = [
  "Operator",
  "Senior Operator",
  "Line Supervisor",
  "Technician",
  "Junior Officer",
  "Officer",
  "Senior Officer",
  "Executive",
  "Senior Executive",
  "Assistant Manager",
  "Deputy Manager",
  "Manager",
  "Senior Manager",
  "General Manager",
  "Director",
] as const;

export const PLANTS = [
  "Gazipur Plant 1",
  "Gazipur Plant 2",
  "Savar Unit",
  "Chattogram EPZ Unit",
  "Narayanganj Unit",
  "Adamjee EPZ Unit",
] as const;

export const WAREHOUSES = [
  "RM Store A",
  "RM Store B",
  "WIP Store",
  "FG Warehouse",
  "Packing Store",
  "Chemical Store",
  "Tool Crib",
  "Scrap Yard",
  "Bonded Warehouse",
  "Transit Store",
] as const;

export const BINS = [
  "A-01-03",
  "A-02-11",
  "B-04-06",
  "B-07-02",
  "C-01-09",
  "C-05-14",
  "D-02-05",
  "D-06-08",
  "E-03-01",
  "E-08-12",
] as const;

export const COST_CENTERS = [
  "CC-1001 Stamping",
  "CC-1002 Polishing",
  "CC-2001 Plating",
  "CC-2002 Assembly",
  "CC-3001 Packing",
  "CC-4001 Tool Room",
  "CC-5001 Quality",
  "CC-6001 Admin",
  "CC-7001 Logistics",
] as const;

export const COUNTRIES = [
  "Bangladesh",
  "China",
  "India",
  "Vietnam",
  "Turkey",
  "Germany",
  "Spain",
  "United Kingdom",
  "United States",
  "Japan",
  "South Korea",
  "Netherlands",
] as const;

export const PORTS = [
  "Chattogram",
  "Shanghai",
  "Ningbo",
  "Singapore",
  "Colombo",
  "Rotterdam",
  "Hamburg",
  "Jebel Ali",
  "Busan",
  "Mundra",
] as const;

export const CARRIERS = [
  "Maersk Line",
  "MSC",
  "CMA CGM",
  "Hapag-Lloyd",
  "DHL Global",
  "FedEx Freight",
  "Emirates SkyCargo",
  "Qatar Airways Cargo",
  "Evergreen Line",
  "OOCL",
] as const;

export const BANKS = [
  "Standard Chartered",
  "HSBC Bangladesh",
  "City Bank PLC",
  "BRAC Bank",
  "Eastern Bank PLC",
  "Dutch-Bangla Bank",
  "Prime Bank",
  "Islami Bank BD",
] as const;

export const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "CNY", "JPY", "INR"] as const;

export const UOMS = ["pcs", "gross", "kg", "set", "roll", "box", "litre", "metre"] as const;

export const FINISHES = [
  "Antique Brass",
  "Nickel Free",
  "Gunmetal",
  "Matte Black",
  "Shiny Gold",
  "Rose Gold",
  "Brushed Silver",
  "Oxidised Copper",
  "Electro Blue",
  "Satin Chrome",
] as const;

export const MATERIAL_GRADES = [
  "Brass C2680",
  "Zinc Alloy ZA-3",
  "Copper C1100",
  "SS 304",
  "SS 316L",
  "Aluminium 5052",
  "CRCA Steel",
  "Bronze C5191",
] as const;

export const ITEM_CATEGORIES = [
  "Buttons",
  "Zippers",
  "Rivets",
  "Snap Fasteners",
  "Metal Labels",
  "Buckles",
  "Eyelets",
  "Hooks & Bars",
  "Sliders",
  "Packing Material",
] as const;

export const DEFECTS = [
  "Plating Peel-off",
  "Colour Variation",
  "Burr / Sharp Edge",
  "Dimension Out of Tolerance",
  "Weak Prong Grip",
  "Surface Scratch",
  "Pin Hole",
  "Rust Spot",
  "Logo Misalignment",
  "Broken Shank",
  "Nickel Release Fail",
  "Under Weight",
] as const;

export const TEST_METHODS = [
  "Nickel Release EN 1811",
  "Pull Test 90N",
  "Salt Spray 24h",
  "Salt Spray 48h",
  "Corrosion Resistance",
  "Colour Fastness",
  "Azo-Free Test",
  "Cadmium Content",
  "Lead Content",
  "Sharp Point Test",
] as const;

export const TOOLS = [
  "Blanking Die BD-102",
  "Forming Die FD-215",
  "Progressive Die PD-330",
  "Piercing Punch PP-018",
  "Compound Die CD-044",
  "Injection Mould IM-076",
  "Trimming Die TD-120",
  "Coining Die CO-091",
  "Bending Fixture BF-055",
  "Assembly Jig AJ-011",
] as const;

export const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Unpaid Leave",
  "Compensatory Off",
] as const;

export const TRAINING_COURSES = [
  "5S & Workplace Safety",
  "Press Machine Operation",
  "Plating Bath Control",
  "ISO 9001 Awareness",
  "Chemical Handling",
  "First Aid & Fire Drill",
  "Quality Inspection Basics",
  "Lean Manufacturing",
  "ERP System Training",
  "Supervisory Skills",
] as const;

export const SKILLS = [
  "Press Setting",
  "Die Change",
  "Bath Titration",
  "Visual Inspection",
  "Calibration",
  "CAD Drafting",
  "Preventive Maintenance",
  "Packing Standards",
] as const;

export const LEAD_SOURCES = [
  "Trade Fair",
  "Buyer Referral",
  "Website Enquiry",
  "Cold Call",
  "Agent Network",
  "LinkedIn",
  "Existing Buyer",
  "Exhibition Lead",
] as const;

export const CAMPAIGNS = [
  "Spring Trims Showcase",
  "Sustainable Metal Push",
  "Nickel-Free Awareness",
  "EU Buyer Outreach",
  "Sample Week Promo",
  "Denim Trim Focus",
  "Festival Season Drive",
] as const;

export const DOCUMENT_TYPES = [
  "Purchase Order",
  "Proforma Invoice",
  "Commercial Invoice",
  "Packing List",
  "Bill of Lading",
  "Certificate of Origin",
  "Test Report",
  "Delivery Challan",
  "LC Document",
  "Bill of Entry",
] as const;

export const KPI_NAMES = [
  "On-Time Delivery",
  "First Pass Yield",
  "Order Fill Rate",
  "Gross Margin %",
  "Inventory Turns",
  "Machine OEE",
  "Rejection PPM",
  "Sample Approval Rate",
  "Labour Cost / 1000 pcs",
  "Energy per Tonne",
  "Absenteeism %",
  "Supplier OTIF",
  "Cash Conversion Cycle",
  "Scrap Recovery %",
  "Quote Win Rate",
] as const;

export const AI_INSIGHTS = [
  "Zipper slider demand up 18% next quarter",
  "Plating bath nickel drift detected on Line RP-2",
  "Buyer H&M order pattern suggests earlier PO release",
  "Brass sheet price expected to rise 6% in 30 days",
  "Press PP-45T shows early bearing wear signature",
  "Rejection spike correlated with humidity above 78%",
  "Quotation margin below floor on 12 open quotes",
  "Overtime trending 22% above plan in Assembly",
  "Reorder point breach predicted for SS wire in 9 days",
  "Sample lead time can drop 2 days by re-sequencing",
] as const;

export const AI_MODELS = [
  "Demand Forecast v4",
  "Anomaly Detector v2",
  "Price Optimiser v3",
  "OCR Extractor v6",
  "Defect Vision v2",
  "Lead Scorer v1",
  "Delay Predictor v3",
  "Consumption Estimator v2",
] as const;

export const REPORT_NAMES = [
  "Daily Production Summary",
  "Order Book Ageing",
  "Stock Valuation",
  "Rejection Analysis",
  "Buyer-wise Sales",
  "Supplier Performance",
  "Payroll Register",
  "Machine Downtime",
  "Consumption vs Standard",
  "Receivable Ageing",
  "Plating Chemical Usage",
  "Shipment Tracker",
] as const;

export const RISK_AREAS = [
  "Supply Continuity",
  "Buyer Concentration",
  "Compliance",
  "Cash Flow",
  "Machine Breakdown",
  "Chemical Safety",
  "Data Security",
  "Labour Unrest",
] as const;

export const SYSTEM_MODULES = [
  "Sales",
  "Procurement",
  "Production",
  "Quality",
  "Inventory",
  "Finance",
  "HR",
  "Logistics",
] as const;

export const PRIORITY = ["High", "Medium", "Low"] as const;
export const PRIORITY_WEIGHTS = [24, 52, 24] as const;

export const YES_NO = ["Yes", "No"] as const;
