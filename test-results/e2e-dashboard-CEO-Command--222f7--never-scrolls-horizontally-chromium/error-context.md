# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\dashboard.spec.ts >> CEO Command Center >> the page body never scrolls horizontally
- Location: tests\e2e\dashboard.spec.ts:90:7

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 1009
Received:    1015
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - navigation "Module navigation" [ref=e5]:
        - link "Smart Global IT METAL ERP" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - generic [ref=e10]:
            - generic [ref=e11]: Smart Global IT
            - generic [ref=e12]: METAL ERP
        - generic [ref=e13]:
          - generic [ref=e14]:
            - paragraph [ref=e15]: OVERVIEW
            - list [ref=e16]:
              - listitem [ref=e17]:
                - generic [ref=e18]:
                  - link "Executive Dashboard Live data 20" [ref=e19] [cursor=pointer]:
                    - /url: /m/executive-dashboard
                    - generic [ref=e26]: Executive Dashboard
                    - generic "Live data" [ref=e27]
                    - generic [ref=e28]: "20"
                  - button "Expand Executive Dashboard submodules" [ref=e29]
              - listitem [ref=e32]:
                - generic [ref=e33]:
                  - link "AI Center Live data 6" [ref=e34] [cursor=pointer]:
                    - /url: /m/ai-center
                    - generic [ref=e39]: AI Center
                    - generic "Live data" [ref=e40]
                    - generic [ref=e41]: "6"
                  - button "Expand AI Center submodules" [ref=e42]
              - listitem [ref=e45]:
                - generic [ref=e46]:
                  - link "BI & Analytics 20" [ref=e47] [cursor=pointer]:
                    - /url: /m/bi-analytics
                    - generic [ref=e51]: BI & Analytics
                    - generic [ref=e52]: "20"
                  - button "Expand BI & Analytics submodules" [ref=e53]
          - generic [ref=e56]:
            - paragraph [ref=e57]: PEOPLE & HR
            - list [ref=e58]:
              - listitem [ref=e59]:
                - generic [ref=e60]:
                  - link "HRMS & Payroll 13" [ref=e61] [cursor=pointer]:
                    - /url: /m/hrms-payroll
                    - generic [ref=e67]: HRMS & Payroll
                    - generic [ref=e68]: "13"
                  - button "Expand HRMS & Payroll submodules" [ref=e69]
          - generic [ref=e72]:
            - paragraph [ref=e73]: SETUP & MASTER DATA
            - list [ref=e74]:
              - listitem [ref=e75]:
                - generic [ref=e76]:
                  - link "Organization 20" [ref=e77] [cursor=pointer]:
                    - /url: /m/organization-management
                    - generic [ref=e83]: Organization
                    - generic [ref=e84]: "20"
                  - button "Expand Organization submodules" [ref=e85]
              - listitem [ref=e88]:
                - generic [ref=e89]:
                  - link "Master Data 20" [ref=e90] [cursor=pointer]:
                    - /url: /m/master-data
                    - generic [ref=e96]: Master Data
                    - generic [ref=e97]: "20"
                  - button "Expand Master Data submodules" [ref=e98]
              - listitem [ref=e101]:
                - generic [ref=e102]:
                  - link "AI Document Input 12" [ref=e103] [cursor=pointer]:
                    - /url: /m/ai-document-input
                    - generic [ref=e108]: AI Document Input
                    - generic [ref=e109]: "12"
                  - button "Expand AI Document Input submodules" [ref=e110]
              - listitem [ref=e113]:
                - generic [ref=e114]:
                  - link "Documents 20" [ref=e115] [cursor=pointer]:
                    - /url: /m/dms
                    - generic [ref=e119]: Documents
                    - generic [ref=e120]: "20"
                  - button "Expand Documents submodules" [ref=e121]
              - listitem [ref=e124]:
                - generic [ref=e125]:
                  - link "Factory & Plant 20" [ref=e126] [cursor=pointer]:
                    - /url: /m/factory-plant
                    - generic [ref=e130]: Factory & Plant
                    - generic [ref=e131]: "20"
                  - button "Expand Factory & Plant submodules" [ref=e132]
              - listitem [ref=e135]:
                - generic [ref=e136]:
                  - link "Branch & Location 20" [ref=e137] [cursor=pointer]:
                    - /url: /m/branch-location
                    - generic [ref=e143]: Branch & Location
                    - generic [ref=e144]: "20"
                  - button "Expand Branch & Location submodules" [ref=e145]
              - listitem [ref=e148]:
                - generic [ref=e149]:
                  - link "Buyer Master 20" [ref=e150] [cursor=pointer]:
                    - /url: /m/buyer-master
                    - generic [ref=e156]: Buyer Master
                    - generic [ref=e157]: "20"
                  - button "Expand Buyer Master submodules" [ref=e158]
          - generic [ref=e161]:
            - paragraph [ref=e162]: SALES & MERCHANDISING
            - list [ref=e163]:
              - listitem [ref=e164]:
                - generic [ref=e165]:
                  - link "CRM & Marketing 20" [ref=e166] [cursor=pointer]:
                    - /url: /m/crm-marketing
                    - generic [ref=e173]: CRM & Marketing
                    - generic [ref=e174]: "20"
                  - button "Expand CRM & Marketing submodules" [ref=e175]
              - listitem [ref=e178]:
                - generic [ref=e179]:
                  - link "Inquiry & Lead 18" [ref=e180] [cursor=pointer]:
                    - /url: /m/inquiry-lead
                    - generic [ref=e185]: Inquiry & Lead
                    - generic [ref=e186]: "18"
                  - button "Expand Inquiry & Lead submodules" [ref=e187]
              - listitem [ref=e190]:
                - generic [ref=e191]:
                  - link "Quotation & Costing 9" [ref=e192] [cursor=pointer]:
                    - /url: /m/quotation-costing
                    - generic [ref=e196]: Quotation & Costing
                    - generic [ref=e197]: "9"
                  - button "Expand Quotation & Costing submodules" [ref=e198]
              - listitem [ref=e201]:
                - generic [ref=e202]:
                  - link "Proforma Invoice 24" [ref=e203] [cursor=pointer]:
                    - /url: /m/proforma-invoice
                    - generic [ref=e208]: Proforma Invoice
                    - generic [ref=e209]: "24"
                  - button "Expand Proforma Invoice submodules" [ref=e210]
              - listitem [ref=e213]:
                - generic [ref=e214]:
                  - link "Sales Orders Live data 24" [ref=e215] [cursor=pointer]:
                    - /url: /m/sales-order
                    - generic [ref=e220]: Sales Orders
                    - generic "Live data" [ref=e221]
                    - generic [ref=e222]: "24"
                  - button "Expand Sales Orders submodules" [ref=e223]
              - listitem [ref=e226]:
                - generic [ref=e227]:
                  - link "Buyer Portal 20" [ref=e228] [cursor=pointer]:
                    - /url: /m/buyer-portal
                    - generic [ref=e233]: Buyer Portal
                    - generic [ref=e234]: "20"
                  - button "Expand Buyer Portal submodules" [ref=e235]
              - listitem [ref=e238]:
                - generic [ref=e239]:
                  - link "Sales & BD 20" [ref=e240] [cursor=pointer]:
                    - /url: /m/sales-business-development
                    - generic [ref=e246]: Sales & BD
                    - generic [ref=e247]: "20"
                  - button "Expand Sales & BD submodules" [ref=e248]
              - listitem [ref=e251]:
                - generic [ref=e252]:
                  - link "Customer Service 9" [ref=e253] [cursor=pointer]:
                    - /url: /m/customer-service
                    - generic [ref=e258]: Customer Service
                    - generic [ref=e259]: "9"
                  - button "Expand Customer Service submodules" [ref=e260]
              - listitem [ref=e263]:
                - generic [ref=e264]:
                  - link "RMA & Claims 6" [ref=e265] [cursor=pointer]:
                    - /url: /m/rma-claims
                    - generic [ref=e270]: RMA & Claims
                    - generic [ref=e271]: "6"
                  - button "Expand RMA & Claims submodules" [ref=e272]
          - generic [ref=e275]:
            - paragraph [ref=e276]: PRODUCT & ENGINEERING
            - list [ref=e277]:
              - listitem [ref=e278]:
                - generic [ref=e279]:
                  - link "Product Development 20" [ref=e280] [cursor=pointer]:
                    - /url: /m/product-development
                    - generic [ref=e284]: Product Development
                    - generic [ref=e285]: "20"
                  - button "Expand Product Development submodules" [ref=e286]
              - listitem [ref=e289]:
                - generic [ref=e290]:
                  - link "PLM 20" [ref=e291] [cursor=pointer]:
                    - /url: /m/plm
                    - generic [ref=e297]: PLM
                    - generic [ref=e298]: "20"
                  - button "Expand PLM submodules" [ref=e299]
              - listitem [ref=e302]:
                - generic [ref=e303]:
                  - link "Sample Management 15" [ref=e304] [cursor=pointer]:
                    - /url: /m/sample-management
                    - generic [ref=e308]: Sample Management
                    - generic [ref=e309]: "15"
                  - button "Expand Sample Management submodules" [ref=e310]
              - listitem [ref=e313]:
                - generic [ref=e314]:
                  - link "Artwork & Design 20" [ref=e315] [cursor=pointer]:
                    - /url: /m/artwork-design
                    - generic [ref=e323]: Artwork & Design
                    - generic [ref=e324]: "20"
                  - button "Expand Artwork & Design submodules" [ref=e325]
              - listitem [ref=e328]:
                - generic [ref=e329]:
                  - link "Engineering 20" [ref=e330] [cursor=pointer]:
                    - /url: /m/engineering
                    - generic [ref=e343]: Engineering
                    - generic [ref=e344]: "20"
                  - button "Expand Engineering submodules" [ref=e345]
              - listitem [ref=e348]:
                - generic [ref=e349]:
                  - link "Tool Room 20" [ref=e350] [cursor=pointer]:
                    - /url: /m/tool-room
                    - generic [ref=e354]: Tool Room
                    - generic [ref=e355]: "20"
                  - button "Expand Tool Room submodules" [ref=e356]
              - listitem [ref=e359]:
                - generic [ref=e360]:
                  - link "Die & Mold 20" [ref=e361] [cursor=pointer]:
                    - /url: /m/die-mold
                    - generic [ref=e367]: Die & Mold
                    - generic [ref=e368]: "20"
                  - button "Expand Die & Mold submodules" [ref=e369]
              - listitem [ref=e372]:
                - generic [ref=e373]:
                  - link "BOM 20" [ref=e374] [cursor=pointer]:
                    - /url: /m/bom
                    - generic [ref=e379]: BOM
                    - generic [ref=e380]: "20"
                  - button "Expand BOM submodules" [ref=e381]
              - listitem [ref=e384]:
                - generic [ref=e385]:
                  - link "Routing & Process 20" [ref=e386] [cursor=pointer]:
                    - /url: /m/routing-process
                    - generic [ref=e392]: Routing & Process
                    - generic [ref=e393]: "20"
                  - button "Expand Routing & Process submodules" [ref=e394]
          - generic [ref=e397]:
            - paragraph [ref=e398]: PLANNING & PROCUREMENT
            - list [ref=e399]:
              - listitem [ref=e400]:
                - generic [ref=e401]:
                  - link "Time & Action 31" [ref=e402] [cursor=pointer]:
                    - /url: /m/time-action
                    - generic [ref=e408]: Time & Action
                    - generic [ref=e409]: "31"
                  - button "Expand Time & Action submodules" [ref=e410]
              - listitem [ref=e413]:
                - generic [ref=e414]:
                  - link "Production Planning Live data 20" [ref=e415] [cursor=pointer]:
                    - /url: /m/production-planning
                    - generic [ref=e419]: Production Planning
                    - generic "Live data" [ref=e420]
                    - generic [ref=e421]: "20"
                  - button "Expand Production Planning submodules" [ref=e422]
              - listitem [ref=e425]:
                - generic [ref=e426]:
                  - link "MRP 20" [ref=e427] [cursor=pointer]:
                    - /url: /m/mrp
                    - generic [ref=e435]: MRP
                    - generic [ref=e436]: "20"
                  - button "Expand MRP submodules" [ref=e437]
              - listitem [ref=e440]:
                - generic [ref=e441]:
                  - link "Procurement 27" [ref=e442] [cursor=pointer]:
                    - /url: /m/procurement
                    - generic [ref=e448]: Procurement
                    - generic [ref=e449]: "27"
                  - button "Expand Procurement submodules" [ref=e450]
              - listitem [ref=e453]:
                - generic [ref=e454]:
                  - link "Supplier Relations 20" [ref=e455] [cursor=pointer]:
                    - /url: /m/srm
                    - generic [ref=e462]: Supplier Relations
                    - generic [ref=e463]: "20"
                  - button "Expand Supplier Relations submodules" [ref=e464]
              - listitem [ref=e467]:
                - generic [ref=e468]:
                  - link "Purchase Orders 14" [ref=e469] [cursor=pointer]:
                    - /url: /m/purchase-order
                    - generic [ref=e475]: Purchase Orders
                    - generic [ref=e476]: "14"
                  - button "Expand Purchase Orders submodules" [ref=e477]
              - listitem [ref=e480]:
                - generic [ref=e481]:
                  - link "Import Commercial 31" [ref=e482] [cursor=pointer]:
                    - /url: /m/import-commercial
                    - generic [ref=e489]: Import Commercial
                    - generic [ref=e490]: "31"
                  - button "Expand Import Commercial submodules" [ref=e491]
              - listitem [ref=e494]:
                - generic [ref=e495]:
                  - link "Capacity & Scheduling 20" [ref=e496] [cursor=pointer]:
                    - /url: /m/capacity-scheduling
                    - generic [ref=e501]: Capacity & Scheduling
                    - generic [ref=e502]: "20"
                  - button "Expand Capacity & Scheduling submodules" [ref=e503]
              - listitem [ref=e506]:
                - generic [ref=e507]:
                  - link "Forecasting 20" [ref=e508] [cursor=pointer]:
                    - /url: /m/demand-forecasting
                    - generic [ref=e513]: Forecasting
                    - generic [ref=e514]: "20"
                  - button "Expand Forecasting submodules" [ref=e515]
          - generic [ref=e518]:
            - paragraph [ref=e519]: INVENTORY & WAREHOUSE
            - list [ref=e520]:
              - listitem [ref=e521]:
                - generic [ref=e522]:
                  - link "RM Warehouse 20" [ref=e523] [cursor=pointer]:
                    - /url: /m/raw-material-warehouse
                    - generic [ref=e528]: RM Warehouse
                    - generic [ref=e529]: "20"
                  - button "Expand RM Warehouse submodules" [ref=e530]
              - listitem [ref=e533]:
                - generic [ref=e534]:
                  - link "Inventory & Store Live data 41" [ref=e535] [cursor=pointer]:
                    - /url: /m/inventory-store
                    - generic [ref=e547]: Inventory & Store
                    - generic "Live data" [ref=e548]
                    - generic [ref=e549]: "41"
                  - button "Expand Inventory & Store submodules" [ref=e550]
              - listitem [ref=e553]:
                - generic [ref=e554]:
                  - link "Barcode & RFID Live data 20" [ref=e555] [cursor=pointer]:
                    - /url: /m/barcode-rfid
                    - generic [ref=e562]: Barcode & RFID
                    - generic "Live data" [ref=e563]
                    - generic [ref=e564]: "20"
                  - button "Expand Barcode & RFID submodules" [ref=e565]
              - listitem [ref=e568]:
                - generic [ref=e569]:
                  - link "FG Warehouse 20" [ref=e570] [cursor=pointer]:
                    - /url: /m/fg-warehouse
                    - generic [ref=e577]: FG Warehouse
                    - generic [ref=e578]: "20"
                  - button "Expand FG Warehouse submodules" [ref=e579]
          - generic [ref=e582]:
            - paragraph [ref=e583]: PRODUCTION
            - list [ref=e584]:
              - listitem [ref=e585]:
                - generic [ref=e586]:
                  - link "Production Management Live data 7" [ref=e587] [cursor=pointer]:
                    - /url: /m/production-management
                    - generic [ref=e591]: Production Management
                    - generic "Live data" [ref=e592]
                    - generic [ref=e593]: "7"
                  - button "Expand Production Management submodules" [ref=e594]
              - listitem [ref=e597]:
                - generic [ref=e598]:
                  - link "Manufacturing Live data 35" [ref=e599] [cursor=pointer]:
                    - /url: /m/product-manufacturing
                    - generic [ref=e604]: Manufacturing
                    - generic "Live data" [ref=e605]
                    - generic [ref=e606]: "35"
                  - button "Expand Manufacturing submodules" [ref=e607]
              - listitem [ref=e610]:
                - generic [ref=e611]:
                  - link "Tracking Live data 35" [ref=e612] [cursor=pointer]:
                    - /url: /m/production-tracking
                    - generic [ref=e619]: Tracking
                    - generic "Live data" [ref=e620]
                    - generic [ref=e621]: "35"
                  - button "Expand Tracking submodules" [ref=e622]
              - listitem [ref=e625]:
                - generic [ref=e626]:
                  - link "Chemical 20" [ref=e627] [cursor=pointer]:
                    - /url: /m/chemical-management
                    - generic [ref=e631]: Chemical
                    - generic [ref=e632]: "20"
                  - button "Expand Chemical submodules" [ref=e633]
              - listitem [ref=e636]:
                - generic [ref=e637]:
                  - link "Plating & Finishing Live data 20" [ref=e638] [cursor=pointer]:
                    - /url: /m/plating-finishing
                    - generic [ref=e643]: Plating & Finishing
                    - generic "Live data" [ref=e644]
                    - generic [ref=e645]: "20"
                  - button "Expand Plating & Finishing submodules" [ref=e646]
          - generic [ref=e649]:
            - paragraph [ref=e650]: QUALITY & COMPLIANCE
            - list [ref=e651]:
              - listitem [ref=e652]:
                - generic [ref=e653]:
                  - link "Lab & Testing 20" [ref=e654] [cursor=pointer]:
                    - /url: /m/laboratory-testing
                    - generic [ref=e660]: Lab & Testing
                    - generic [ref=e661]: "20"
                  - button "Expand Lab & Testing submodules" [ref=e662]
              - listitem [ref=e665]:
                - generic [ref=e666]:
                  - link "QMS 11" [ref=e667] [cursor=pointer]:
                    - /url: /m/qms
                    - generic [ref=e672]: QMS
                    - generic [ref=e673]: "11"
                  - button "Expand QMS submodules" [ref=e674]
              - listitem [ref=e677]:
                - generic [ref=e678]:
                  - link "Rework & Rejection 20" [ref=e679] [cursor=pointer]:
                    - /url: /m/rework-rejection
                    - generic [ref=e686]: Rework & Rejection
                    - generic [ref=e687]: "20"
                  - button "Expand Rework & Rejection submodules" [ref=e688]
              - listitem [ref=e691]:
                - generic [ref=e692]:
                  - link "Scrap & Waste 20" [ref=e693] [cursor=pointer]:
                    - /url: /m/scrap-waste
                    - generic [ref=e702]: Scrap & Waste
                    - generic [ref=e703]: "20"
                  - button "Expand Scrap & Waste submodules" [ref=e704]
              - listitem [ref=e707]:
                - generic [ref=e708]:
                  - link "Compliance 5" [ref=e709] [cursor=pointer]:
                    - /url: /m/compliance
                    - generic [ref=e714]: Compliance
                    - generic [ref=e715]: "5"
                  - button "Expand Compliance submodules" [ref=e716]
          - generic [ref=e719]:
            - paragraph [ref=e720]: LOGISTICS & EXPORT
            - list [ref=e721]:
              - listitem [ref=e722]:
                - generic [ref=e723]:
                  - link "Packaging 20" [ref=e724] [cursor=pointer]:
                    - /url: /m/packaging
                    - generic [ref=e730]: Packaging
                    - generic [ref=e731]: "20"
                  - button "Expand Packaging submodules" [ref=e732]
              - listitem [ref=e735]:
                - generic [ref=e736]:
                  - link "Dispatch & Logistics Live data 8" [ref=e737] [cursor=pointer]:
                    - /url: /m/dispatch-logistics
                    - generic [ref=e744]: Dispatch & Logistics
                    - generic "Live data" [ref=e745]
                    - generic [ref=e746]: "8"
                  - button "Expand Dispatch & Logistics submodules" [ref=e747]
              - listitem [ref=e750]:
                - generic [ref=e751]:
                  - link "Export Commercial 116" [ref=e752] [cursor=pointer]:
                    - /url: /m/export-commercial
                    - generic [ref=e758]: Export Commercial
                    - generic [ref=e759]: "116"
                  - button "Expand Export Commercial submodules" [ref=e760]
              - listitem [ref=e763]:
                - generic [ref=e764]:
                  - link "Fleet & Transport 20" [ref=e765] [cursor=pointer]:
                    - /url: /m/fleet-transport
                    - generic [ref=e771]: Fleet & Transport
                    - generic [ref=e772]: "20"
                  - button "Expand Fleet & Transport submodules" [ref=e773]
          - generic [ref=e776]:
            - paragraph [ref=e777]: FINANCE & ACCOUNTS
            - list [ref=e778]:
              - listitem [ref=e779]:
                - generic [ref=e780]:
                  - link "Finance & Accounts 19" [ref=e781] [cursor=pointer]:
                    - /url: /m/finance-accounts
                    - generic [ref=e786]: Finance & Accounts
                    - generic [ref=e787]: "19"
                  - button "Expand Finance & Accounts submodules" [ref=e788]
              - listitem [ref=e791]:
                - generic [ref=e792]:
                  - link "Cost & Budget 20" [ref=e793] [cursor=pointer]:
                    - /url: /m/cost-budget
                    - generic [ref=e798]: Cost & Budget
                    - generic [ref=e799]: "20"
                  - button "Expand Cost & Budget submodules" [ref=e800]
              - listitem [ref=e803]:
                - generic [ref=e804]:
                  - link "Treasury & Cash 20" [ref=e805] [cursor=pointer]:
                    - /url: /m/treasury-cash
                    - generic [ref=e810]: Treasury & Cash
                    - generic [ref=e811]: "20"
                  - button "Expand Treasury & Cash submodules" [ref=e812]
              - listitem [ref=e815]:
                - generic [ref=e816]:
                  - link "LC & Banking 20" [ref=e817] [cursor=pointer]:
                    - /url: /m/lc-banking
                    - generic [ref=e821]: LC & Banking
                    - generic [ref=e822]: "20"
                  - button "Expand LC & Banking submodules" [ref=e823]
              - listitem [ref=e826]:
                - generic [ref=e827]:
                  - link "Tax & VAT 20" [ref=e828] [cursor=pointer]:
                    - /url: /m/tax-vat
                    - generic [ref=e832]: Tax & VAT
                    - generic [ref=e833]: "20"
                  - button "Expand Tax & VAT submodules" [ref=e834]
              - listitem [ref=e837]:
                - generic [ref=e838]:
                  - link "Currency & Forex 20" [ref=e839] [cursor=pointer]:
                    - /url: /m/multi-currency-forex
                    - generic [ref=e846]: Currency & Forex
                    - generic [ref=e847]: "20"
                  - button "Expand Currency & Forex submodules" [ref=e848]
          - generic [ref=e851]:
            - paragraph [ref=e852]: ASSETS & MAINTENANCE
            - list [ref=e853]:
              - listitem [ref=e854]:
                - generic [ref=e855]:
                  - link "Asset Management 20" [ref=e856] [cursor=pointer]:
                    - /url: /m/asset-management
                    - generic [ref=e860]: Asset Management
                    - generic [ref=e861]: "20"
                  - button "Expand Asset Management submodules" [ref=e862]
              - listitem [ref=e865]:
                - generic [ref=e866]:
                  - link "Maintenance 16" [ref=e867] [cursor=pointer]:
                    - /url: /m/maintenance
                    - generic [ref=e871]: Maintenance
                    - generic [ref=e872]: "16"
                  - button "Expand Maintenance submodules" [ref=e873]
              - listitem [ref=e876]:
                - generic [ref=e877]:
                  - link "IoT Monitoring Live data 20" [ref=e878] [cursor=pointer]:
                    - /url: /m/iot-monitoring
                    - generic [ref=e886]: IoT Monitoring
                    - generic "Live data" [ref=e887]
                    - generic [ref=e888]: "20"
                  - button "Expand IoT Monitoring submodules" [ref=e889]
              - listitem [ref=e892]:
                - generic [ref=e893]:
                  - link "Energy 20" [ref=e894] [cursor=pointer]:
                    - /url: /m/energy
                    - generic [ref=e898]: Energy
                    - generic [ref=e899]: "20"
                  - button "Expand Energy submodules" [ref=e900]
          - generic [ref=e903]:
            - paragraph [ref=e904]: GOVERNANCE & PLATFORM
            - list [ref=e905]:
              - listitem [ref=e906]:
                - generic [ref=e907]:
                  - link "Security & Gate Pass 20" [ref=e908] [cursor=pointer]:
                    - /url: /m/security-gatepass
                    - generic [ref=e913]: Security & Gate Pass
                    - generic [ref=e914]: "20"
                  - button "Expand Security & Gate Pass submodules" [ref=e915]
              - listitem [ref=e918]:
                - generic [ref=e919]:
                  - link "Workflow & Approval 23" [ref=e920] [cursor=pointer]:
                    - /url: /m/workflow-approval
                    - generic [ref=e926]: Workflow & Approval
                    - generic [ref=e927]: "23"
                  - button "Expand Workflow & Approval submodules" [ref=e928]
              - listitem [ref=e931]:
                - generic [ref=e932]:
                  - link "Mobile App 20" [ref=e933] [cursor=pointer]:
                    - /url: /m/mobile-app
                    - generic [ref=e937]: Mobile App
                    - generic [ref=e938]: "20"
                  - button "Expand Mobile App submodules" [ref=e939]
              - listitem [ref=e942]:
                - generic [ref=e943]:
                  - link "API & Integration 20" [ref=e944] [cursor=pointer]:
                    - /url: /m/api-integration
                    - generic [ref=e948]: API & Integration
                    - generic [ref=e949]: "20"
                  - button "Expand API & Integration submodules" [ref=e950]
              - listitem [ref=e953]:
                - generic [ref=e954]:
                  - link "Sustainability & Risk 20" [ref=e955] [cursor=pointer]:
                    - /url: /m/sustainability-risk-audit
                    - generic [ref=e960]: Sustainability & Risk
                    - generic [ref=e961]: "20"
                  - button "Expand Sustainability & Risk submodules" [ref=e962]
              - listitem [ref=e965]:
                - generic [ref=e966]:
                  - link "Contracts 20" [ref=e967] [cursor=pointer]:
                    - /url: /m/contract-management
                    - generic [ref=e971]: Contracts
                    - generic [ref=e972]: "20"
                  - button "Expand Contracts submodules" [ref=e973]
              - listitem [ref=e976]:
                - generic [ref=e977]:
                  - link "Identity & Access 20" [ref=e978] [cursor=pointer]:
                    - /url: /m/iam
                    - generic [ref=e984]: Identity & Access
                    - generic [ref=e985]: "20"
                  - button "Expand Identity & Access submodules" [ref=e986]
              - listitem [ref=e989]:
                - generic [ref=e990]:
                  - link "Notifications 34" [ref=e991] [cursor=pointer]:
                    - /url: /m/notification-center
                    - generic [ref=e998]: Notifications
                    - generic [ref=e999]: "34"
                  - button "Expand Notifications submodules" [ref=e1000]
              - listitem [ref=e1003]:
                - generic [ref=e1004]:
                  - link "Knowledge & SOP 20" [ref=e1005] [cursor=pointer]:
                    - /url: /m/knowledge-sop
                    - generic [ref=e1009]: Knowledge & SOP
                    - generic [ref=e1010]: "20"
                  - button "Expand Knowledge & SOP submodules" [ref=e1011]
        - generic [ref=e1015]:
          - generic [ref=e1016]:
            - generic [ref=e1017]: System Status
            - generic [ref=e1018]: LIVE
          - paragraph [ref=e1020]: All systems operational
          - paragraph [ref=e1021]: 75 modules · 1808 workspaces
    - generic [ref=e1022]:
      - banner [ref=e1023]:
        - button "Collapse sidebar" [ref=e1024]
        - generic [ref=e1035]:
          - generic [ref=e1036]: CEO Command Center
          - generic [ref=e1037]: DASHBOARD
        - button "Search modules… K" [ref=e1038]:
          - generic [ref=e1042]: Search modules…
          - generic [ref=e1043]: K
        - generic [ref=e1048]:
          - generic [ref=e1049]: Smart Global IT
          - button "Switch to light theme" [ref=e1051]
          - button "Language" [ref=e1058]
          - link "Messages, 5 unread" [ref=e1062] [cursor=pointer]:
            - /url: /m/crm-marketing/activities
            - generic [ref=e1066]: "5"
          - button "Notifications, 6 unread" [ref=e1068]:
            - generic [ref=e1072]: "6"
          - button "Account menu" [ref=e1074]:
            - generic [ref=e1075]: MS
            - generic [ref=e1076]:
              - generic [ref=e1077]: Mohammad Sayem
              - generic [ref=e1078]: Super-Admin
      - main [ref=e1081]:
        - generic [ref=e1082]:
          - generic [ref=e1083]:
            - navigation "Breadcrumb" [ref=e1084]:
              - list [ref=e1085]:
                - listitem [ref=e1086]:
                  - link "Home" [ref=e1087] [cursor=pointer]:
                    - /url: /dashboard
                - listitem [ref=e1090]:
                  - generic [ref=e1091]: CEO Command Center
            - generic [ref=e1092]:
              - generic [ref=e1100]:
                - generic [ref=e1101]:
                  - heading "CEO Command Center" [level=1] [ref=e1102]
                  - generic [ref=e1103]: LIVE
                - paragraph [ref=e1105]: Real-time overview of your entire business
              - generic [ref=e1106]:
                - group "Reporting period" [ref=e1107]:
                  - button "Month" [ref=e1108]
                  - button "Quarter" [ref=e1109]
                  - button "Year" [pressed] [ref=e1110]
                - button "Export" [ref=e1111] [cursor=pointer]
                - link "All 75 Modules" [ref=e1116] [cursor=pointer]:
                  - /url: /modules
          - region "Headline performance indicators" [ref=e1120]:
            - generic [ref=e1121]:
              - generic [ref=e1122]:
                - paragraph [ref=e1129]: Total Revenue
                - generic [ref=e1130]:
                  - generic [ref=e1131]:
                    - paragraph [ref=e1132]: $24.57M
                    - generic [ref=e1133]:
                      - generic [ref=e1134]: +12.5%
                      - generic [ref=e1139]: vs last year
                  - img "Total Revenue trend" [ref=e1140]
              - generic [ref=e1144]:
                - paragraph [ref=e1151]: Total Profit
                - generic [ref=e1152]:
                  - generic [ref=e1153]:
                    - paragraph [ref=e1154]: $6.42M
                    - generic [ref=e1155]:
                      - generic [ref=e1156]: +18.7%
                      - generic [ref=e1161]: 26.1% margin
                  - img "Total Profit trend" [ref=e1162]
              - generic [ref=e1166]:
                - paragraph [ref=e1173]: Sales Orders
                - generic [ref=e1174]:
                  - generic [ref=e1175]:
                    - paragraph [ref=e1176]: 25,846
                    - generic [ref=e1177]:
                      - generic [ref=e1178]: +9.2%
                      - generic [ref=e1183]: 1,284 open
                  - img "Sales Orders trend" [ref=e1184]
              - generic [ref=e1188]:
                - paragraph [ref=e1194]: Production Output
                - generic [ref=e1195]:
                  - generic [ref=e1196]:
                    - paragraph [ref=e1197]: 182.4M pcs
                    - generic [ref=e1198]:
                      - generic [ref=e1199]: +7.8%
                      - generic [ref=e1204]: this fiscal year
                  - img "Production Output trend" [ref=e1205]
              - generic [ref=e1209]:
                - paragraph [ref=e1218]: Active Buyers
                - generic [ref=e1219]:
                  - generic [ref=e1220]:
                    - paragraph [ref=e1221]: "568"
                    - generic [ref=e1222]:
                      - generic [ref=e1223]: +4.6%
                      - generic [ref=e1228]: 42 new this quarter
                  - img "Active Buyers trend" [ref=e1229]
              - generic [ref=e1233]:
                - paragraph [ref=e1242]: On-Time In-Full
                - generic [ref=e1243]:
                  - generic [ref=e1244]:
                    - paragraph [ref=e1245]: 94.2%
                    - generic [ref=e1246]:
                      - generic [ref=e1247]: +2.1%
                      - generic [ref=e1252]: target 95%
                  - img "On-Time In-Full trend" [ref=e1253]
          - region "Financial performance" [ref=e1257]:
            - generic [ref=e1258]:
              - generic [ref=e1259]:
                - generic [ref=e1261]:
                  - heading "Business Performance" [level=2] [ref=e1262]
                  - paragraph [ref=e1263]: Revenue, profit and expenses on one scale
                - group "Business Performance view" [ref=e1266]:
                  - button "Chart view" [pressed] [ref=e1267]
                  - button "Table view" [ref=e1270]
              - generic [ref=e1273]:
                - generic [ref=e1274]: Revenue
                - generic [ref=e1276]: Profit
                - generic [ref=e1278]: Expenses
              - application [ref=e1283]:
                - generic [ref=e1297]:
                  - generic [ref=e1298]:
                    - generic [ref=e1299]: Jan
                    - generic [ref=e1301]: Feb
                    - generic [ref=e1303]: Mar
                    - generic [ref=e1305]: Apr
                    - generic [ref=e1307]: May
                    - generic [ref=e1309]: Jun
                    - generic [ref=e1311]: Jul
                    - generic [ref=e1313]: Aug
                    - generic [ref=e1315]: Sep
                    - generic [ref=e1317]: Oct
                    - generic [ref=e1319]: Nov
                    - generic [ref=e1321]: Dec
                  - generic [ref=e1323]:
                    - generic [ref=e1324]: $0
                    - generic [ref=e1326]: $6.5M
                    - generic [ref=e1328]: $13M
                    - generic [ref=e1330]: $19.5M
                    - generic [ref=e1332]: $26M
              - generic [ref=e1334]: All three measures share one currency axis — a second y-scale would invent a correlation that isn't in the data.
            - generic [ref=e1335]:
              - generic [ref=e1336]:
                - generic [ref=e1338]:
                  - heading "Revenue Composition" [level=2] [ref=e1339]
                  - paragraph [ref=e1340]: Where the $24.57M comes from
                - group "Revenue Composition view" [ref=e1343]:
                  - button "Chart view" [pressed] [ref=e1344]
                  - button "Table view" [ref=e1347]
              - generic [ref=e1351]:
                - generic [ref=e1352]:
                  - application [ref=e1355]
                  - generic:
                    - generic: Total Revenue
                    - generic: $24.57M
                    - generic: FY 2025–26
                - list [ref=e1374]:
                  - listitem [ref=e1375]:
                    - generic [ref=e1376]:
                      - generic [ref=e1377]: Export Sales
                      - generic [ref=e1380]: $18.92M
                    - generic [ref=e1381]:
                      - progressbar "Export Sales share" [ref=e1382]
                      - generic [ref=e1384]: 77.0%
                  - listitem [ref=e1385]:
                    - generic [ref=e1386]:
                      - generic [ref=e1387]: Local Sales
                      - generic [ref=e1390]: $2.45M
                    - generic [ref=e1391]:
                      - progressbar "Local Sales share" [ref=e1392]
                      - generic [ref=e1394]: 10.0%
                  - listitem [ref=e1395]:
                    - generic [ref=e1396]:
                      - generic [ref=e1397]: Subcontract Service
                      - generic [ref=e1400]: $1.85M
                    - generic [ref=e1401]:
                      - progressbar "Subcontract Service share" [ref=e1402]
                      - generic [ref=e1404]: 7.5%
                  - listitem [ref=e1405]:
                    - generic [ref=e1406]:
                      - generic [ref=e1407]: Tooling & Die Recovery
                      - generic [ref=e1410]: $890K
                    - generic [ref=e1411]:
                      - progressbar "Tooling & Die Recovery share" [ref=e1412]
                      - generic [ref=e1414]: 3.6%
                  - listitem [ref=e1415]:
                    - generic [ref=e1416]:
                      - generic [ref=e1417]: Scrap & Recovery
                      - generic [ref=e1420]: $460K
                    - generic [ref=e1421]:
                      - progressbar "Scrap & Recovery share" [ref=e1422]
                      - generic [ref=e1424]: 1.9%
          - region "Financial summary" [ref=e1425]:
            - generic [ref=e1426]:
              - generic [ref=e1433]:
                - heading "Cash Position" [level=2] [ref=e1434]
                - paragraph [ref=e1435]: As of today
              - list [ref=e1436]:
                - listitem [ref=e1437]:
                  - generic [ref=e1442]: Cash in Hand
                  - generic [ref=e1443]: $2.45M
                - listitem [ref=e1444]:
                  - generic [ref=e1448]: Bank Balance
                  - generic [ref=e1449]: $8.92M
                - listitem [ref=e1450]:
                  - generic [ref=e1454]: Accounts Receivable
                  - generic [ref=e1455]: $5.32M
                - listitem [ref=e1456]:
                  - generic [ref=e1461]: Accounts Payable
                  - generic [ref=e1462]: "-$3.15M"
              - generic [ref=e1463]:
                - generic [ref=e1464]:
                  - generic [ref=e1465]: Net Cash Flow
                  - generic [ref=e1466]: "-$8.1M"
                - generic [ref=e1467]:
                  - generic [ref=e1468]: 13-week rolling
                  - generic [ref=e1469]: +9.4%
            - generic [ref=e1474]:
              - generic [ref=e1475]:
                - generic [ref=e1477]:
                  - heading "Cash Flow Forecast" [level=2] [ref=e1478]
                  - paragraph [ref=e1479]: 13-week rolling inflow against outflow
                - group "Cash Flow Forecast view" [ref=e1482]:
                  - button "Chart view" [pressed] [ref=e1483]
                  - button "Table view" [ref=e1486]
              - generic [ref=e1489]:
                - generic [ref=e1490]: Inflow
                - generic [ref=e1492]: Outflow
              - application [ref=e1497]:
                - generic [ref=e1586]:
                  - generic [ref=e1587]:
                    - generic [ref=e1588]: W1
                    - generic [ref=e1590]: W2
                    - generic [ref=e1592]: W3
                    - generic [ref=e1594]: W4
                    - generic [ref=e1596]: W5
                    - generic [ref=e1598]: W6
                    - generic [ref=e1600]: W7
                    - generic [ref=e1602]: W8
                    - generic [ref=e1604]: W9
                    - generic [ref=e1606]: W10
                    - generic [ref=e1608]: W11
                    - generic [ref=e1610]: W12
                    - generic [ref=e1612]: W13
                  - generic [ref=e1614]:
                    - generic [ref=e1615]: $0
                    - generic [ref=e1617]: $700K
                    - generic [ref=e1619]: $1.4M
                    - generic [ref=e1621]: $2.1M
                    - generic [ref=e1623]: $2.8M
          - region "Operational counts" [ref=e1625]:
            - generic [ref=e1626]:
              - generic [ref=e1633]:
                - paragraph [ref=e1634]: Total Products
                - generic [ref=e1635]:
                  - generic [ref=e1636]: 18,742
                  - generic [ref=e1637]: +4.3%
              - generic [ref=e1654]:
                - paragraph [ref=e1655]: Inventory Value
                - generic [ref=e1656]:
                  - generic [ref=e1657]: $12.78M
                  - generic [ref=e1658]: +6.7%
              - generic [ref=e1667]:
                - paragraph [ref=e1668]: Low Stock Items
                - generic [ref=e1669]:
                  - generic [ref=e1670]: "236"
                  - generic [ref=e1671]: "-2.1%"
              - generic [ref=e1683]:
                - paragraph [ref=e1684]: Active Suppliers
                - generic [ref=e1685]:
                  - generic [ref=e1686]: 1,245
                  - generic [ref=e1687]: +3.2%
              - generic [ref=e1699]:
                - paragraph [ref=e1700]: Shipments in Transit
                - generic [ref=e1701]:
                  - generic [ref=e1702]: "156"
                  - generic [ref=e1703]: +8.4%
              - generic [ref=e1713]:
                - paragraph [ref=e1714]: Warehouses
                - generic [ref=e1715]:
                  - generic [ref=e1716]: "45"
                  - generic [ref=e1717]: +1.6%
              - generic [ref=e1728]:
                - paragraph [ref=e1729]: Plants & Branches
                - generic [ref=e1730]:
                  - generic [ref=e1731]: "32"
                  - generic [ref=e1732]: +2.0%
              - generic [ref=e1742]:
                - paragraph [ref=e1743]: Export Countries
                - generic [ref=e1744]:
                  - generic [ref=e1745]: "42"
                  - generic [ref=e1746]: +5.0%
          - region "Market performance" [ref=e1751]:
            - generic [ref=e1752]:
              - generic [ref=e1753]:
                - generic [ref=e1755]:
                  - heading "Sales by Country" [level=2] [ref=e1756]
                  - paragraph [ref=e1757]: Revenue share across export markets
                - group "Sales by Country view" [ref=e1760]:
                  - button "Chart view" [pressed] [ref=e1761]
                  - button "Table view" [ref=e1764]
              - list [ref=e1769]:
                - listitem [ref=e1770]:
                  - generic [ref=e1771]: Bangladesh
                  - generic [ref=e1774]: $5.45M
                  - generic [ref=e1775]: +15.2%
                - listitem [ref=e1776]:
                  - generic [ref=e1777]: China
                  - generic [ref=e1780]: $4.12M
                  - generic [ref=e1781]: +11.3%
                - listitem [ref=e1782]:
                  - generic [ref=e1783]: Vietnam
                  - generic [ref=e1786]: $3.28M
                  - generic [ref=e1787]: +18.4%
                - listitem [ref=e1788]:
                  - generic [ref=e1789]: India
                  - generic [ref=e1792]: $2.85M
                  - generic [ref=e1793]: +9.8%
                - listitem [ref=e1794]:
                  - generic [ref=e1795]: Turkey
                  - generic [ref=e1798]: $2.24M
                  - generic [ref=e1799]: +7.6%
                - listitem [ref=e1800]:
                  - generic [ref=e1801]: Indonesia
                  - generic [ref=e1804]: $1.68M
                  - generic [ref=e1805]: +12.1%
                - listitem [ref=e1806]:
                  - generic [ref=e1807]: Cambodia
                  - generic [ref=e1810]: $1.42M
                  - generic [ref=e1811]: +6.3%
                - listitem [ref=e1812]:
                  - generic [ref=e1813]: Others
                  - generic [ref=e1816]: $3.53M
                  - generic [ref=e1817]: +5.4%
            - generic [ref=e1818]:
              - generic [ref=e1819]:
                - generic [ref=e1821]:
                  - heading "Product Family Mix" [level=2] [ref=e1822]
                  - paragraph [ref=e1823]: Revenue by accessory family
                - group "Product Family Mix view" [ref=e1826]:
                  - button "Chart view" [pressed] [ref=e1827]
                  - button "Table view" [ref=e1830]
              - generic [ref=e1834]:
                - generic [ref=e1835]:
                  - application [ref=e1838]
                  - generic:
                    - generic: Families
                    - generic: "7"
                    - generic: $24.57M total
                - list [ref=e1860]:
                  - listitem [ref=e1861]:
                    - generic [ref=e1863]: Metal Buttons
                  - listitem [ref=e1864]:
                    - generic [ref=e1866]: Zippers & Sliders
                  - listitem [ref=e1867]:
                    - generic [ref=e1869]: Rivets & Burrs
                  - listitem [ref=e1870]:
                    - generic [ref=e1872]: Snap Fasteners
                  - listitem [ref=e1873]:
                    - generic [ref=e1875]: Metal Labels & Tags
                  - listitem [ref=e1876]:
                    - generic [ref=e1878]: Buckles & Hooks
            - generic [ref=e1880]:
              - generic [ref=e1881]:
                - heading "Live Alerts" [level=2] [ref=e1887]
                - generic [ref=e1888]: LIVE
              - list [ref=e1891]:
                - listitem [ref=e1892]:
                  - link "Low Stock Alert 236 items are low in stock 5 min ago" [ref=e1893] [cursor=pointer]:
                    - /url: /m/inventory-store/min-max
                    - generic [ref=e1897]:
                      - generic [ref=e1898]: Low Stock Alert
                      - generic [ref=e1899]: 236 items are low in stock
                    - generic [ref=e1900]: 5 min ago
                - listitem [ref=e1901]:
                  - link "Payment Received $285,000 received from H&M Global 18 min ago" [ref=e1902] [cursor=pointer]:
                    - /url: /m/treasury-cash/receipts
                    - generic [ref=e1907]:
                      - generic [ref=e1908]: Payment Received
                      - generic [ref=e1909]: $285,000 received from H&M Global
                    - generic [ref=e1910]: 18 min ago
                - listitem [ref=e1911]:
                  - 'link "New Order Received Order #SO-25246 received 26 min ago" [ref=e1912] [cursor=pointer]':
                    - /url: /m/sales-order/order-book
                    - generic [ref=e1916]:
                      - generic [ref=e1917]: New Order Received
                      - generic [ref=e1918]: "Order #SO-25246 received"
                    - generic [ref=e1919]: 26 min ago
                - listitem [ref=e1920]:
                  - link "Approval Required 23 requests are pending 34 min ago" [ref=e1921] [cursor=pointer]:
                    - /url: /m/workflow-approval/my-approvals
                    - generic [ref=e1925]:
                      - generic [ref=e1926]: Approval Required
                      - generic [ref=e1927]: 23 requests are pending
                    - generic [ref=e1928]: 34 min ago
                - listitem [ref=e1929]:
                  - 'link "High Value Order Order #SO-25246 — $845,000 41 min ago" [ref=e1930] [cursor=pointer]':
                    - /url: /m/sales-order/order-value
                    - generic [ref=e1934]:
                      - generic [ref=e1935]: High Value Order
                      - generic [ref=e1936]: "Order #SO-25246 — $845,000"
                    - generic [ref=e1937]: 41 min ago
                - listitem [ref=e1938]:
                  - link "Die Life Threshold Die DM-0412 at 94% of rated shots 1 hr ago" [ref=e1939] [cursor=pointer]:
                    - /url: /m/die-mold/shot-count
                    - generic [ref=e1943]:
                      - generic [ref=e1944]: Die Life Threshold
                      - generic [ref=e1945]: Die DM-0412 at 94% of rated shots
                    - generic [ref=e1946]: 1 hr ago
          - region "Order pipeline" [ref=e1947]:
            - generic [ref=e1948]:
              - generic [ref=e1949]:
                - generic [ref=e1951]:
                  - heading "Order Pipeline" [level=2] [ref=e1952]
                  - paragraph [ref=e1953]: Inquiry to shipment conversion
                - group "Order Pipeline view" [ref=e1956]:
                  - button "Chart view" [pressed] [ref=e1957]
                  - button "Table view" [ref=e1960]
              - list [ref=e1965]:
                - listitem [ref=e1966]:
                  - generic [ref=e1967]: Inquiries
                  - generic [ref=e1968]: 1,842
                  - generic [ref=e1971]: 100%
                - listitem [ref=e1973]:
                  - generic [ref=e1974]: Quotations
                  - generic [ref=e1975]: 1,284
                  - generic [ref=e1978]: 69.7%
                - listitem [ref=e1980]:
                  - generic [ref=e1981]: Proforma Invoices
                  - generic [ref=e1982]: "892"
                  - generic [ref=e1985]: 69.5%
                - listitem [ref=e1987]:
                  - generic [ref=e1988]: Confirmed Orders
                  - generic [ref=e1989]: "648"
                  - generic [ref=e1992]: 72.6%
                - listitem [ref=e1994]:
                  - generic [ref=e1995]: In Production
                  - generic [ref=e1996]: "512"
                  - generic [ref=e1999]: 79.0%
                - listitem [ref=e2001]:
                  - generic [ref=e2002]: Shipped
                  - generic [ref=e2003]: "468"
                  - generic [ref=e2006]: 91.4%
              - generic [ref=e2008]: Stages are ordered, so they take a single-hue ordinal ramp rather than eight categorical colours.
            - generic [ref=e2009]:
              - generic [ref=e2010]:
                - generic [ref=e2018]:
                  - heading "Top Performing Buyers" [level=2] [ref=e2019]
                  - paragraph [ref=e2020]: By revenue this fiscal year
                - link "All buyers" [ref=e2022] [cursor=pointer]:
                  - /url: /m/crm-marketing/accounts
              - table [ref=e2027]:
                - caption [ref=e2028]: Top performing buyers by revenue, orders, margin and growth
                - rowgroup [ref=e2029]:
                  - row [ref=e2030]:
                    - columnheader "Buyer" [ref=e2031]
                    - columnheader "Country" [ref=e2032]
                    - columnheader "Revenue" [ref=e2033]
                    - columnheader "Orders" [ref=e2034]
                    - columnheader "Margin" [ref=e2035]
                    - columnheader "Growth" [ref=e2036]
                - rowgroup [ref=e2037]:
                  - row [ref=e2038]:
                    - rowheader "H&M Global Sourcing Active" [ref=e2039]:
                      - generic [ref=e2040]: H&M Global Sourcing
                      - generic [ref=e2041]: Active
                    - cell "Sweden" [ref=e2046]
                    - cell "$3.42M" [ref=e2047]
                    - cell "412" [ref=e2048]
                    - cell "27.4%" [ref=e2049]
                    - cell "+14.2%" [ref=e2050]
                  - row [ref=e2056]:
                    - rowheader "Inditex / Zara Active" [ref=e2057]:
                      - generic [ref=e2058]: Inditex / Zara
                      - generic [ref=e2059]: Active
                    - cell "Spain" [ref=e2064]
                    - cell "$2.98M" [ref=e2065]
                    - cell "368" [ref=e2066]
                    - cell "29.1%" [ref=e2067]
                    - cell "+18.6%" [ref=e2068]
                  - row [ref=e2074]:
                    - rowheader "Levi Strauss & Co. Active" [ref=e2075]:
                      - generic [ref=e2076]: Levi Strauss & Co.
                      - generic [ref=e2077]: Active
                    - cell "USA" [ref=e2082]
                    - cell "$2.64M" [ref=e2083]
                    - cell "296" [ref=e2084]
                    - cell "31.2%" [ref=e2085]
                    - cell "+9.4%" [ref=e2086]
                  - row [ref=e2092]:
                    - rowheader "Primark Sourcing At Risk" [ref=e2093]:
                      - generic [ref=e2094]: Primark Sourcing
                      - generic [ref=e2095]: At Risk
                    - cell "Ireland" [ref=e2099]
                    - cell "$2.18M" [ref=e2100]
                    - cell "344" [ref=e2101]
                    - cell "22.8%" [ref=e2102]
                    - cell "-3.2%" [ref=e2103]
                  - row [ref=e2109]:
                    - rowheader "Uniqlo / Fast Retailing Active" [ref=e2110]:
                      - generic [ref=e2111]: Uniqlo / Fast Retailing
                      - generic [ref=e2112]: Active
                    - cell "Japan" [ref=e2117]
                    - cell "$1.92M" [ref=e2118]
                    - cell "254" [ref=e2119]
                    - cell "28.6%" [ref=e2120]
                    - cell "+21.5%" [ref=e2121]
                  - row [ref=e2127]:
                    - rowheader "Decathlon Sourcing Active" [ref=e2128]:
                      - generic [ref=e2129]: Decathlon Sourcing
                      - generic [ref=e2130]: Active
                    - cell "France" [ref=e2135]
                    - cell "$1.64M" [ref=e2136]
                    - cell "218" [ref=e2137]
                    - cell "25.3%" [ref=e2138]
                    - cell "+12.8%" [ref=e2139]
                  - row [ref=e2145]:
                    - rowheader "C&A Buying Active" [ref=e2146]:
                      - generic [ref=e2147]: C&A Buying
                      - generic [ref=e2148]: Active
                    - cell "Germany" [ref=e2153]
                    - cell "$1.38M" [ref=e2154]
                    - cell "186" [ref=e2155]
                    - cell "24.1%" [ref=e2156]
                    - cell "+4.6%" [ref=e2157]
                  - row [ref=e2163]:
                    - rowheader "Bestseller A/S New" [ref=e2164]:
                      - generic [ref=e2165]: Bestseller A/S
                      - generic [ref=e2166]: New
                    - cell "Denmark" [ref=e2170]
                    - cell "$1.12M" [ref=e2171]
                    - cell "164" [ref=e2172]
                    - cell "26.7%" [ref=e2173]
                    - cell "+32.4%" [ref=e2174]
          - region "Manufacturing performance" [ref=e2180]:
            - generic [ref=e2181]:
              - generic [ref=e2182]:
                - generic [ref=e2184]:
                  - heading "Line OEE" [level=2] [ref=e2185]
                  - paragraph [ref=e2186]: Availability × performance × quality
                - group "Line OEE view" [ref=e2189]:
                  - button "Chart view" [pressed] [ref=e2190]
                  - button "Table view" [ref=e2193]
              - generic [ref=e2196]:
                - generic [ref=e2197]: Availability
                - generic [ref=e2199]: Performance
                - generic [ref=e2201]: Quality
              - generic [ref=e2204]:
                - generic:
                  - generic:
                    - generic: 85.5%
                    - generic: Plant OEE
                    - generic: "World-class benchmark: 85%"
                - list [ref=e2205]:
                  - listitem [ref=e2206]:
                    - generic [ref=e2207]: Stamping A
                    - generic [ref=e2208]:
                      - progressbar "Stamping A OEE" [ref=e2209]
                      - generic [ref=e2211]: 87.4%
                  - listitem [ref=e2212]:
                    - generic [ref=e2213]: Stamping B
                    - generic [ref=e2214]:
                      - progressbar "Stamping B OEE" [ref=e2215]
                      - generic [ref=e2217]: 82.1%
                  - listitem [ref=e2218]:
                    - generic [ref=e2219]: Plating 1
                    - generic [ref=e2220]:
                      - progressbar "Plating 1 OEE" [ref=e2221]
                      - generic [ref=e2223]: 91.2%
                  - listitem [ref=e2224]:
                    - generic [ref=e2225]: Plating 2
                    - generic [ref=e2226]:
                      - progressbar "Plating 2 OEE" [ref=e2227]
                      - generic [ref=e2229]: 94.6%
                  - listitem [ref=e2230]:
                    - generic [ref=e2231]: Plating 3
                    - generic [ref=e2232]:
                      - progressbar "Plating 3 OEE" [ref=e2233]
                      - generic [ref=e2235]: 68.4%
                  - listitem [ref=e2236]:
                    - generic [ref=e2237]: Assembly 1
                    - generic [ref=e2238]:
                      - progressbar "Assembly 1 OEE" [ref=e2239]
                      - generic [ref=e2241]: 89.7%
                  - listitem [ref=e2242]:
                    - generic [ref=e2243]: Assembly 2
                    - generic [ref=e2244]:
                      - progressbar "Assembly 2 OEE" [ref=e2245]
                      - generic [ref=e2247]: 85.3%
            - generic [ref=e2248]:
              - generic [ref=e2249]:
                - generic [ref=e2251]:
                  - heading "Machine Capacity Utilisation" [level=2] [ref=e2252]
                  - paragraph [ref=e2253]: Percent of available hours used, by line and weekday
                - group "Machine Capacity Utilisation view" [ref=e2256]:
                  - button "Chart view" [pressed] [ref=e2257]
                  - button "Table view" [ref=e2260]
              - generic [ref=e2265]:
                - generic [ref=e2268]:
                  - generic [ref=e2270]: Mon
                  - generic [ref=e2271]: Tue
                  - generic [ref=e2272]: Wed
                  - generic [ref=e2273]: Thu
                  - generic [ref=e2274]: Fri
                  - generic [ref=e2275]: Sat
                  - generic [ref=e2276]: Sun
                  - generic [ref=e2277]: Stamping A
                  - 'button "Stamping A, Mon: 64%" [ref=e2278]'
                  - 'button "Stamping A, Tue: 80%" [ref=e2279]'
                  - 'button "Stamping A, Wed: 63%" [ref=e2280]'
                  - 'button "Stamping A, Thu: 87%" [ref=e2281]'
                  - 'button "Stamping A, Fri: 79%" [ref=e2282]'
                  - 'button "Stamping A, Sat: 80%" [ref=e2283]'
                  - 'button "Stamping A, Sun: 35%" [ref=e2284]'
                  - generic [ref=e2285]: Stamping B
                  - 'button "Stamping B, Mon: 89%" [ref=e2286]'
                  - 'button "Stamping B, Tue: 89%" [ref=e2287]'
                  - 'button "Stamping B, Wed: 71%" [ref=e2288]'
                  - 'button "Stamping B, Thu: 71%" [ref=e2289]'
                  - 'button "Stamping B, Fri: 94%" [ref=e2290]'
                  - 'button "Stamping B, Sat: 66%" [ref=e2291]'
                  - 'button "Stamping B, Sun: 20%" [ref=e2292]'
                  - generic [ref=e2293]: Plating 1
                  - 'button "Plating 1, Mon: 68%" [ref=e2294]'
                  - 'button "Plating 1, Tue: 84%" [ref=e2295]'
                  - 'button "Plating 1, Wed: 95%" [ref=e2296]'
                  - 'button "Plating 1, Thu: 99%" [ref=e2297]'
                  - 'button "Plating 1, Fri: 70%" [ref=e2298]'
                  - 'button "Plating 1, Sat: 62%" [ref=e2299]'
                  - 'button "Plating 1, Sun: 37%" [ref=e2300]'
                  - generic [ref=e2301]: Plating 2
                  - 'button "Plating 2, Mon: 70%" [ref=e2302]'
                  - 'button "Plating 2, Tue: 90%" [ref=e2303]'
                  - 'button "Plating 2, Wed: 87%" [ref=e2304]'
                  - 'button "Plating 2, Thu: 92%" [ref=e2305]'
                  - 'button "Plating 2, Fri: 99%" [ref=e2306]'
                  - 'button "Plating 2, Sat: 68%" [ref=e2307]'
                  - 'button "Plating 2, Sun: 28%" [ref=e2308]'
                  - generic [ref=e2309]: Plating 3
                  - 'button "Plating 3, Mon: 65%" [ref=e2310]'
                  - 'button "Plating 3, Tue: 75%" [ref=e2311]'
                  - 'button "Plating 3, Wed: 78%" [ref=e2312]'
                  - 'button "Plating 3, Thu: 82%" [ref=e2313]'
                  - 'button "Plating 3, Fri: 87%" [ref=e2314]'
                  - 'button "Plating 3, Sat: 80%" [ref=e2315]'
                  - 'button "Plating 3, Sun: 41%" [ref=e2316]'
                  - generic [ref=e2317]: Assembly 1
                  - 'button "Assembly 1, Mon: 96%" [ref=e2318]'
                  - 'button "Assembly 1, Tue: 78%" [ref=e2319]'
                  - 'button "Assembly 1, Wed: 63%" [ref=e2320]'
                  - 'button "Assembly 1, Thu: 75%" [ref=e2321]'
                  - 'button "Assembly 1, Fri: 94%" [ref=e2322]'
                  - 'button "Assembly 1, Sat: 71%" [ref=e2323]'
                  - 'button "Assembly 1, Sun: 44%" [ref=e2324]'
                  - generic [ref=e2325]: Assembly 2
                  - 'button "Assembly 2, Mon: 63%" [ref=e2326]'
                  - 'button "Assembly 2, Tue: 99%" [ref=e2327]'
                  - 'button "Assembly 2, Wed: 98%" [ref=e2328]'
                  - 'button "Assembly 2, Thu: 78%" [ref=e2329]'
                  - 'button "Assembly 2, Fri: 77%" [ref=e2330]'
                  - 'button "Assembly 2, Sat: 87%" [ref=e2331]'
                  - 'button "Assembly 2, Sun: 53%" [ref=e2332]'
                - generic [ref=e2333]:
                  - generic [ref=e2334]:
                    - generic [ref=e2335]: 0%
                    - generic [ref=e2344]: 99%
                  - paragraph
            - generic [ref=e2345]:
              - generic [ref=e2346]:
                - generic [ref=e2348]:
                  - heading "Production Flow" [level=2] [ref=e2349]
                  - paragraph [ref=e2350]: Pieces cleared per stage
                - group "Production Flow view" [ref=e2353]:
                  - button "Chart view" [pressed] [ref=e2354]
                  - button "Table view" [ref=e2357]
              - list [ref=e2362]:
                - listitem [ref=e2363]:
                  - generic [ref=e2364]: Casting / Stamping
                  - generic: 42.8M
                  - generic [ref=e2367]: 100%
                - listitem [ref=e2369]:
                  - generic [ref=e2370]: Polishing
                  - generic: 38.4M
                  - generic [ref=e2373]: 89.7%
                - listitem [ref=e2375]:
                  - generic [ref=e2376]: Plating
                  - generic: 34.1M
                  - generic [ref=e2379]: 88.8%
                - listitem [ref=e2381]:
                  - generic [ref=e2382]: Assembly
                  - generic: 29.6M
                  - generic [ref=e2385]: 86.8%
                - listitem [ref=e2387]:
                  - generic [ref=e2388]: Inspection
                  - generic: 27.9M
                  - generic [ref=e2391]: 94.3%
                - listitem [ref=e2393]:
                  - generic [ref=e2394]: Packing
                  - generic: 26.4M
                  - generic [ref=e2397]: 94.6%
          - region "Quality performance" [ref=e2399]:
            - generic [ref=e2400]:
              - generic [ref=e2401]:
                - generic [ref=e2403]:
                  - heading "Quality Trend" [level=2] [ref=e2404]
                  - paragraph [ref=e2405]: Rejection, rework and first-pass yield — all in percent
                - group "Quality Trend view" [ref=e2408]:
                  - button "Chart view" [pressed] [ref=e2409]
                  - button "Table view" [ref=e2412]
              - generic [ref=e2415]:
                - generic [ref=e2416]: First Pass Yield
                - generic [ref=e2418]: Rejection Rate
                - generic [ref=e2420]: Rework Rate
              - application [ref=e2425]:
                - generic [ref=e2439]:
                  - generic [ref=e2440]:
                    - generic [ref=e2441]: Jan
                    - generic [ref=e2443]: Feb
                    - generic [ref=e2445]: Mar
                    - generic [ref=e2447]: Apr
                    - generic [ref=e2449]: May
                    - generic [ref=e2451]: Jun
                    - generic [ref=e2453]: Jul
                    - generic [ref=e2455]: Aug
                    - generic [ref=e2457]: Sep
                    - generic [ref=e2459]: Oct
                    - generic [ref=e2461]: Nov
                    - generic [ref=e2463]: Dec
                  - generic [ref=e2465]:
                    - generic [ref=e2466]: 0%
                    - generic [ref=e2468]: 25%
                    - generic [ref=e2470]: 50%
                    - generic [ref=e2472]: 75%
                    - generic [ref=e2474]: 100%
                  - generic [ref=e2476]: FPY target 95%
            - generic [ref=e2477]:
              - generic [ref=e2478]:
                - generic [ref=e2480]:
                  - heading "Defect Pareto" [level=2] [ref=e2481]
                  - paragraph [ref=e2482]: Top defect drivers this quarter
                - group "Defect Pareto view" [ref=e2485]:
                  - button "Chart view" [pressed] [ref=e2486]
                  - button "Table view" [ref=e2489]
              - list [ref=e2494]:
                - listitem [ref=e2495]:
                  - generic [ref=e2496]: Plating Peel-off
                  - generic [ref=e2499]: "428"
                - listitem [ref=e2500]:
                  - generic [ref=e2501]: Dimension Out of Tol.
                  - generic [ref=e2504]: "316"
                - listitem [ref=e2505]:
                  - generic [ref=e2506]: Colour Mismatch
                  - generic [ref=e2509]: "274"
                - listitem [ref=e2510]:
                  - generic [ref=e2511]: Surface Scratch
                  - generic [ref=e2514]: "208"
                - listitem [ref=e2515]:
                  - generic [ref=e2516]: Burr / Sharp Edge
                  - generic [ref=e2519]: "164"
                - listitem [ref=e2520]:
                  - generic [ref=e2521]: Weak Attachment
                  - generic [ref=e2524]: "112"
                - listitem [ref=e2525]:
                  - generic [ref=e2526]: Rust Spot
                  - generic [ref=e2529]: "68"
              - generic [ref=e2530]: One measure, nominal categories — every bar takes the same hue. Colouring by value would re-encode bar length.
          - region "Inventory and supply" [ref=e2531]:
            - generic [ref=e2532]:
              - generic [ref=e2533]:
                - generic [ref=e2535]:
                  - heading "Inventory Composition" [level=2] [ref=e2536]
                  - paragraph [ref=e2537]: $12.78M held across stock types
                - group "Inventory Composition view" [ref=e2540]:
                  - button "Chart view" [pressed] [ref=e2541]
                  - button "Table view" [ref=e2544]
              - generic [ref=e2548]:
                - generic [ref=e2549]:
                  - application [ref=e2552]
                  - generic:
                    - generic: Inventory Value
                    - generic: $12.78M
                - list [ref=e2571]:
                  - listitem [ref=e2572]:
                    - generic [ref=e2573]: Raw Material
                    - generic [ref=e2576]: $5.24M
                  - listitem [ref=e2577]:
                    - generic [ref=e2578]: Work in Progress
                    - generic [ref=e2581]: $3.18M
                  - listitem [ref=e2582]:
                    - generic [ref=e2583]: Finished Goods
                    - generic [ref=e2586]: $2.94M
                  - listitem [ref=e2587]:
                    - generic [ref=e2588]: Packing Material
                    - generic [ref=e2591]: $860K
                  - listitem [ref=e2592]:
                    - generic [ref=e2593]: Consumables & Chemicals
                    - generic [ref=e2596]: $560K
            - generic [ref=e2597]:
              - generic [ref=e2598]:
                - generic [ref=e2600]:
                  - heading "Stock Aging" [level=2] [ref=e2601]
                  - paragraph [ref=e2602]: Value held by age bucket
                - group "Stock Aging view" [ref=e2605]:
                  - button "Chart view" [pressed] [ref=e2606]
                  - button "Table view" [ref=e2609]
              - application [ref=e2615]:
                - generic [ref=e2638]:
                  - generic [ref=e2639]:
                    - generic [ref=e2640]: 0–30 d
                    - generic [ref=e2642]: 31–60 d
                    - generic [ref=e2644]: 91–180 d
                    - generic [ref=e2646]: 180+ d
                  - generic [ref=e2648]:
                    - generic [ref=e2649]: $0
                    - generic [ref=e2651]: $2M
                    - generic [ref=e2653]: $4M
                    - generic [ref=e2655]: $6M
                    - generic [ref=e2657]: $8M
              - generic [ref=e2659]: Age buckets are ordered, so the reader should see the order — but with one series, slot 1 plus the axis order carries it.
            - generic [ref=e2660]:
              - generic [ref=e2661]:
                - generic [ref=e2663]:
                  - heading "Supplier Capability" [level=2] [ref=e2664]
                  - paragraph [ref=e2665]: Top supplier against the supplier-base average
                - group "Supplier Capability view" [ref=e2668]:
                  - button "Chart view" [pressed] [ref=e2669]
                  - button "Table view" [ref=e2672]
              - generic [ref=e2675]:
                - generic [ref=e2676]: Top Supplier
                - generic [ref=e2678]: Base Average
              - application [ref=e2683]:
                - generic [ref=e2703]:
                  - generic [ref=e2706]:
                    - generic [ref=e2707]: Quality
                    - generic [ref=e2709]: Delivery
                    - generic [ref=e2712]: Price
                    - generic [ref=e2715]: Responsiveness
                    - generic [ref=e2717]: Compliance
                    - generic [ref=e2720]: Capacity
                  - generic [ref=e2724]:
                    - generic [ref=e2725]: "0"
                    - generic [ref=e2727]: "25"
                    - generic [ref=e2729]: "50"
                    - generic [ref=e2731]: "75"
                    - generic [ref=e2733]: "100"
          - region "Margin, energy and logistics" [ref=e2735]:
            - generic [ref=e2736]:
              - generic [ref=e2737]:
                - generic [ref=e2739]:
                  - heading "Order Value vs Margin" [level=2] [ref=e2740]
                  - paragraph [ref=e2741]: Each bubble is one order; size is quantity
                - group "Order Value vs Margin view" [ref=e2744]:
                  - button "Chart view" [pressed] [ref=e2745]
                  - button "Table view" [ref=e2748]
              - generic [ref=e2751]:
                - generic [ref=e2752]: Metal Buttons
                - generic [ref=e2754]: Zippers & Sliders
                - generic [ref=e2756]: Rivets & Burrs
              - application [ref=e2761]:
                - generic [ref=e3010]:
                  - generic [ref=e3011]:
                    - generic [ref=e3012]: $0
                    - generic [ref=e3014]: $150K
                    - generic [ref=e3016]: $300K
                    - generic [ref=e3018]: $450K
                    - generic [ref=e3020]: $600K
                  - generic [ref=e3022]: Order value (USD)
                  - generic [ref=e3023]:
                    - generic [ref=e3024]: 0%
                    - generic [ref=e3026]: 9%
                    - generic [ref=e3028]: 18%
                    - generic [ref=e3030]: 27%
                    - generic [ref=e3032]: 36%
              - generic [ref=e3034]: "Scatter is an all-pairs form: any two marks can touch, so it carries a three-series cap rather than the usual eight."
            - generic [ref=e3035]:
              - generic [ref=e3036]:
                - generic [ref=e3038]:
                  - heading "Energy Consumption" [level=2] [ref=e3039]
                  - paragraph [ref=e3040]: Purchased and self-generated, in kWh equivalent
                - group "Energy Consumption view" [ref=e3043]:
                  - button "Chart view" [pressed] [ref=e3044]
                  - button "Table view" [ref=e3047]
              - generic [ref=e3050]:
                - generic [ref=e3051]: Grid Electricity
                - generic [ref=e3053]: Natural Gas
                - generic [ref=e3055]: Solar Generation
              - application [ref=e3060]:
                - generic [ref=e3086]:
                  - generic [ref=e3087]:
                    - generic [ref=e3088]: Feb
                    - generic [ref=e3090]: Apr
                    - generic [ref=e3092]: Jun
                    - generic [ref=e3094]: Aug
                    - generic [ref=e3096]: Oct
                    - generic [ref=e3098]: Dec
                  - generic [ref=e3100]:
                    - generic [ref=e3101]: "0"
                    - generic [ref=e3103]: 350K
                    - generic [ref=e3105]: 700K
                    - generic [ref=e3107]: 1.05M
                    - generic [ref=e3109]: 1.4M
            - generic [ref=e3111]:
              - generic [ref=e3120]:
                - heading "Shipment Status" [level=2] [ref=e3121]
                - paragraph [ref=e3122]: 1,536 shipments this quarter
              - generic [ref=e3123]:
                - generic [ref=e3124]:
                  - generic [ref=e3125]:
                    - generic [ref=e3126]: Delivered
                    - generic [ref=e3130]: 1,284
                  - generic [ref=e3131]:
                    - progressbar "Delivered share" [ref=e3132]
                    - generic [ref=e3134]: 83.6%
                - generic [ref=e3135]:
                  - generic [ref=e3136]:
                    - generic [ref=e3137]: In Transit
                    - generic [ref=e3140]: "156"
                  - generic [ref=e3141]:
                    - progressbar "In Transit share" [ref=e3142]
                    - generic [ref=e3144]: 10.2%
                - generic [ref=e3145]:
                  - generic [ref=e3146]:
                    - generic [ref=e3147]: At Port
                    - generic [ref=e3150]: "72"
                  - generic [ref=e3151]:
                    - progressbar "At Port share" [ref=e3152]
                    - generic [ref=e3154]: 4.7%
                - generic [ref=e3155]:
                  - generic [ref=e3156]:
                    - generic [ref=e3157]: Delayed
                    - generic [ref=e3160]: "24"
                  - generic [ref=e3161]:
                    - progressbar "Delayed share" [ref=e3162]
                    - generic [ref=e3164]: 1.6%
                - generic [ref=e3165]:
                  - generic [ref=e3166]:
                    - generic [ref=e3167]: Workforce present
                    - generic [ref=e3168]: 2,255 / 2,453
                  - generic [ref=e3169]:
                    - progressbar "Attendance rate" [ref=e3170]
                    - generic [ref=e3172]: 91.9%
          - region "Insights and governance" [ref=e3173]:
            - generic [ref=e3175]:
              - generic [ref=e3176]:
                - generic [ref=e3182]:
                  - heading "AI Business Insights" [level=2] [ref=e3183]
                  - paragraph [ref=e3184]: Ranked by revenue impact
                - link "View all" [ref=e3186] [cursor=pointer]:
                  - /url: /m/ai-center/insight-feed
              - list [ref=e3190]:
                - listitem [ref=e3191]:
                  - link "Sales are up 12.5% this month Metal buttons and rivets are driving the gain across EU buyers." [ref=e3192] [cursor=pointer]:
                    - /url: /m/bi-analytics/sales-analytics
                    - generic [ref=e3197]:
                      - generic [ref=e3198]: Sales are up 12.5% this month
                      - generic [ref=e3199]: Metal buttons and rivets are driving the gain across EU buyers.
                - listitem [ref=e3200]:
                  - link "236 products are running low in stock Reorder now to avoid stockouts on 14 confirmed orders." [ref=e3201] [cursor=pointer]:
                    - /url: /m/mrp/shortage
                    - generic [ref=e3205]:
                      - generic [ref=e3206]: 236 products are running low in stock
                      - generic [ref=e3207]: Reorder now to avoid stockouts on 14 confirmed orders.
                - listitem [ref=e3208]:
                  - link "Plating line 2 shows the best yield Consider shifting antique-finish volume from line 4 to line 2." [ref=e3209] [cursor=pointer]:
                    - /url: /m/plating-finishing/line-efficiency
                    - generic [ref=e3213]:
                      - generic [ref=e3214]: Plating line 2 shows the best yield
                      - generic [ref=e3215]: Consider shifting antique-finish volume from line 4 to line 2.
                - listitem [ref=e3216]:
                  - link "Profit margin improved by 2.3% Zinc alloy price negotiation is holding through this quarter." [ref=e3217] [cursor=pointer]:
                    - /url: /m/cost-budget/variance-analysis
                    - generic [ref=e3222]:
                      - generic [ref=e3223]: Profit margin improved by 2.3%
                      - generic [ref=e3224]: Zinc alloy price negotiation is holding through this quarter.
                - listitem [ref=e3225]:
                  - link "Order SO-25188 is at delivery risk Plating stage is 4 days behind the T&A critical path." [ref=e3226] [cursor=pointer]:
                    - /url: /m/time-action/delay-alerts
                    - generic [ref=e3230]:
                      - generic [ref=e3231]: Order SO-25188 is at delivery risk
                      - generic [ref=e3232]: Plating stage is 4 days behind the T&A critical path.
            - generic [ref=e3234]:
              - generic [ref=e3235]:
                - generic [ref=e3242]:
                  - heading "Waiting on You" [level=2] [ref=e3243]
                  - paragraph [ref=e3244]: 88 approvals pending
                - link "Open queue" [ref=e3246] [cursor=pointer]:
                  - /url: /m/workflow-approval/my-approvals
              - list [ref=e3250]:
                - listitem [ref=e3251]:
                  - link "Purchase Requisitions 27" [ref=e3252] [cursor=pointer]:
                    - /url: /m/procurement/requisitions
                    - generic [ref=e3253]: Purchase Requisitions
                    - generic [ref=e3254]: "27"
                - listitem [ref=e3255]:
                  - link "Quotation Discounts 9" [ref=e3256] [cursor=pointer]:
                    - /url: /m/quotation-costing/approval-matrix
                    - generic [ref=e3257]: Quotation Discounts
                    - generic [ref=e3258]: "9"
                - listitem [ref=e3259]:
                  - link "Sample Approvals 15" [ref=e3260] [cursor=pointer]:
                    - /url: /m/sample-management/approval-tracking
                    - generic [ref=e3261]: Sample Approvals
                    - generic [ref=e3262]: "15"
                - listitem [ref=e3263]:
                  - link "Payment Releases 19" [ref=e3264] [cursor=pointer]:
                    - /url: /m/finance-accounts/accounts-payable
                    - generic [ref=e3265]: Payment Releases
                    - generic [ref=e3266]: "19"
                - listitem [ref=e3267]:
                  - link "Engineering Changes 6" [ref=e3268] [cursor=pointer]:
                    - /url: /m/plm/change-requests
                    - generic [ref=e3269]: Engineering Changes
                    - generic [ref=e3270]: "6"
                - listitem [ref=e3271]:
                  - link "Overtime Sanctions 12" [ref=e3272] [cursor=pointer]:
                    - /url: /m/organization-management/shifts
                    - generic [ref=e3273]: Overtime Sanctions
                    - generic [ref=e3274]: "12"
            - generic [ref=e3275]:
              - generic [ref=e3276]:
                - generic [ref=e3277]:
                  - generic [ref=e3283]:
                    - heading "System Status" [level=2] [ref=e3284]
                    - paragraph [ref=e3285]: 1 service degraded
                  - generic [ref=e3286]: LIVE
                - list [ref=e3289]:
                  - listitem [ref=e3290]:
                    - generic [ref=e3291]: Application Server
                    - generic [ref=e3294]:
                      - generic [ref=e3295]: 99.99%
                      - generic [ref=e3296]: operational
                  - listitem [ref=e3297]:
                    - generic [ref=e3298]: Database Cluster
                    - generic [ref=e3301]:
                      - generic [ref=e3302]: 99.98%
                      - generic [ref=e3303]: operational
                  - listitem [ref=e3304]:
                    - generic [ref=e3305]: Backup & Replication
                    - generic [ref=e3308]:
                      - generic [ref=e3309]: 100%
                      - generic [ref=e3310]: operational
                  - listitem [ref=e3311]:
                    - generic [ref=e3312]: Security Gateway
                    - generic [ref=e3315]:
                      - generic [ref=e3316]: 99.97%
                      - generic [ref=e3317]: operational
                  - listitem [ref=e3318]:
                    - generic [ref=e3319]: API Services
                    - generic [ref=e3322]:
                      - generic [ref=e3323]: 99.42%
                      - generic [ref=e3324]: degraded
                  - listitem [ref=e3325]:
                    - generic [ref=e3326]: Payment Gateway
                    - generic [ref=e3329]:
                      - generic [ref=e3330]: 99.95%
                      - generic [ref=e3331]: operational
                  - listitem [ref=e3332]:
                    - generic [ref=e3333]: IoT Ingest Pipeline
                    - generic [ref=e3336]:
                      - generic [ref=e3337]: 99.91%
                      - generic [ref=e3338]: operational
              - generic [ref=e3339]:
                - heading "Quick Actions" [level=2] [ref=e3347]
                - generic [ref=e3348]:
                  - link "New Sales Order" [ref=e3349] [cursor=pointer]:
                    - /url: /m/sales-order/create-order
                  - link "Create Quotation" [ref=e3355] [cursor=pointer]:
                    - /url: /m/quotation-costing/new-quotation
                  - link "Raise Purchase Order" [ref=e3360] [cursor=pointer]:
                    - /url: /m/purchase-order/create-po
                  - link "Log Production" [ref=e3367] [cursor=pointer]:
                    - /url: /m/production/output-entry
                  - link "Sample Request" [ref=e3372] [cursor=pointer]:
                    - /url: /m/sample-management/sample-requests
                  - link "Stock Transfer" [ref=e3377] [cursor=pointer]:
                    - /url: /m/inventory-store/transfers
          - region "Cost structure" [ref=e3390]:
            - generic [ref=e3391]:
              - generic [ref=e3392]:
                - generic [ref=e3394]:
                  - heading "Revenue, Profit and Expense by Month" [level=2] [ref=e3395]
                  - paragraph [ref=e3396]: Bars are revenue and expenses; the line is profit — one shared currency scale
                - group "Revenue, Profit and Expense by Month view" [ref=e3399]:
                  - button "Chart view" [pressed] [ref=e3400]
                  - button "Table view" [ref=e3403]
              - generic [ref=e3407]:
                - generic [ref=e3408]:
                  - paragraph [ref=e3409]: Total Revenue
                  - paragraph [ref=e3410]: $224.41M
                - generic [ref=e3411]:
                  - paragraph [ref=e3412]: Total Expenses
                  - paragraph [ref=e3413]: $160.71M
                - generic [ref=e3414]:
                  - paragraph [ref=e3415]: Net Profit
                  - paragraph [ref=e3416]: $63.7M
                - generic [ref=e3417]:
                  - paragraph [ref=e3418]: Profit Margin
                  - paragraph [ref=e3419]: 28.4%
              - generic [ref=e3420]:
                - generic [ref=e3421]: Revenue
                - generic [ref=e3423]: Expenses
                - generic [ref=e3425]: Profit
              - application [ref=e3430]:
                - generic [ref=e3517]:
                  - generic [ref=e3518]:
                    - generic [ref=e3519]: Jan
                    - generic [ref=e3521]: Feb
                    - generic [ref=e3523]: Mar
                    - generic [ref=e3525]: Apr
                    - generic [ref=e3527]: May
                    - generic [ref=e3529]: Jun
                    - generic [ref=e3531]: Jul
                    - generic [ref=e3533]: Aug
                    - generic [ref=e3535]: Sep
                    - generic [ref=e3537]: Oct
                    - generic [ref=e3539]: Nov
                    - generic [ref=e3541]: Dec
                  - generic [ref=e3543]:
                    - generic [ref=e3544]: $0
                    - generic [ref=e3546]: $6.5M
                    - generic [ref=e3548]: $13M
                    - generic [ref=e3550]: $19.5M
                    - generic [ref=e3552]: $26M
          - generic [ref=e3554]:
            - generic [ref=e3555]: Smart Metal Garments Accessories ERP · AI Powered World Class Enterprise Edition
            - generic [ref=e3556]: Demo data — no backend connected
      - contentinfo [ref=e3559]:
        - paragraph [ref=e3560]: "Metal ERP · Smart Global IT · Director: Mohammad Sayem · +8801711-772407"
        - paragraph [ref=e3561]: Chittagong South Kulshi, Bangladesh
  - alert [ref=e3562]
  - generic [ref=e3563]: "0"
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.describe("CEO Command Center", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto("/dashboard");
  6   |   });
  7   | 
  8   |   test("renders the headline KPI band", async ({ page }) => {
  9   |     const band = page.getByRole("region", {
  10  |       name: "Headline performance indicators",
  11  |     });
  12  |     await expect(band).toBeVisible();
  13  | 
  14  |     for (const label of [
  15  |       "Total Revenue",
  16  |       "Total Profit",
  17  |       "Sales Orders",
  18  |       "Production Output",
  19  |       "Active Buyers",
  20  |       "On-Time In-Full",
  21  |     ]) {
  22  |       await expect(band.getByText(label, { exact: true })).toBeVisible();
  23  |     }
  24  |   });
  25  | 
  26  |   test("renders every analytics section", async ({ page }) => {
  27  |     for (const name of [
  28  |       "Financial performance",
  29  |       "Financial summary",
  30  |       "Operational counts",
  31  |       "Market performance",
  32  |       "Order pipeline",
  33  |       "Manufacturing performance",
  34  |       "Quality performance",
  35  |       "Inventory and supply",
  36  |       "Margin, energy and logistics",
  37  |       "Insights and governance",
  38  |       "Cost structure",
  39  |     ]) {
  40  |       await expect(page.getByRole("region", { name })).toBeVisible();
  41  |     }
  42  |   });
  43  | 
  44  |   test("charts actually draw marks", async ({ page }) => {
  45  |     // Recharts renders into an <svg class="recharts-surface">. If the chart
  46  |     // layer failed, the cards would still be present but empty.
  47  |     const surfaces = page.locator("svg.recharts-surface");
  48  |     await expect(surfaces.first()).toBeVisible();
  49  |     expect(await surfaces.count()).toBeGreaterThan(8);
  50  |   });
  51  | 
  52  |   test("every multi-series chart ships a legend", async ({ page }) => {
  53  |     // Identity must never be carried by colour alone.
  54  |     const performance = page
  55  |       .getByRole("region", { name: "Financial performance" })
  56  |       .first();
  57  |     for (const label of ["Revenue", "Profit", "Expenses"]) {
  58  |       await expect(performance.getByText(label, { exact: true }).first()).toBeVisible();
  59  |     }
  60  |   });
  61  | 
  62  |   test("chart cards expose a table view twin", async ({ page }) => {
  63  |     const tableToggle = page.getByRole("button", { name: "Table view" }).first();
  64  |     await tableToggle.click();
  65  | 
  66  |     // The table view must carry the same numbers the plot showed.
  67  |     const table = page.getByRole("table").first();
  68  |     await expect(table).toBeVisible();
  69  |     await expect(table.locator("tbody tr").first()).toBeVisible();
  70  |   });
  71  | 
  72  |   test("period filter re-scopes the surface", async ({ page }) => {
  73  |     const group = page.getByRole("group", { name: "Reporting period" });
  74  |     await expect(group).toBeVisible();
  75  | 
  76  |     await group.getByRole("button", { name: "Quarter" }).click();
  77  |     await expect(group.getByRole("button", { name: "Quarter" })).toHaveAttribute(
  78  |       "aria-pressed",
  79  |       "true",
  80  |     );
  81  |   });
  82  | 
  83  |   test("live alerts link into their module", async ({ page }) => {
  84  |     const alerts = page.getByRole("link", { name: /Low Stock Alert/ });
  85  |     await expect(alerts.first()).toBeVisible();
  86  |     await alerts.first().click();
  87  |     await expect(page).toHaveURL(/\/m\/inventory-store\/min-max$/);
  88  |   });
  89  | 
  90  |   test("the page body never scrolls horizontally", async ({ page }) => {
  91  |     const overflow = await page.evaluate(() => {
  92  |       const el = document.getElementById("main-content");
  93  |       if (!el) return { scrollWidth: 0, clientWidth: 1 };
  94  |       return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
  95  |     });
  96  |     // Wide tables scroll inside their own container, not the page.
> 97  |     expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
      |                                  ^ Error: expect(received).toBeLessThanOrEqual(expected)
  98  |   });
  99  | 
  100 |   test("renders without console errors", async ({ page }) => {
  101 |     const errors: string[] = [];
  102 |     page.on("console", (message) => {
  103 |       if (message.type() === "error") errors.push(message.text());
  104 |     });
  105 |     page.on("pageerror", (error) => errors.push(error.message));
  106 | 
  107 |     await page.reload();
  108 |     await page.waitForLoadState("networkidle");
  109 | 
  110 |     expect(errors).toEqual([]);
  111 |   });
  112 | });
  113 | 
  114 | test.describe("Flagship workspaces", () => {
  115 |   const FLAGSHIPS = [
  116 |     { path: "/m/sales-order/order-book", heading: "Order Book" },
  117 |     { path: "/m/mes/shop-floor", heading: "Shop Floor Control" },
  118 |     { path: "/m/inventory-store/stock-summary", heading: "Stock Summary" },
  119 |     { path: "/m/qms/quality-dashboard", heading: "Quality Dashboard" },
  120 |     {
  121 |       path: "/m/finance-accounts/financial-overview",
  122 |       heading: "Financial Overview",
  123 |     },
  124 |   ];
  125 | 
  126 |   for (const flagship of FLAGSHIPS) {
  127 |     test(`${flagship.heading} renders its bespoke surface`, async ({ page }) => {
  128 |       await page.goto(flagship.path);
  129 |       await expect(
  130 |         page.getByRole("heading", { name: flagship.heading, level: 1 }),
  131 |       ).toBeVisible();
  132 | 
  133 |       const surfaces = page.locator("svg.recharts-surface");
  134 |       await expect(surfaces.first()).toBeVisible();
  135 |       expect(await surfaces.count()).toBeGreaterThan(2);
  136 |     });
  137 |   }
  138 | 
  139 |   test("order book filters and sorts", async ({ page }) => {
  140 |     await page.goto("/m/sales-order/order-book");
  141 | 
  142 |     const filter = page.getByRole("group", { name: "Order filter" });
  143 |     await filter.getByRole("button", { name: "At Risk" }).click();
  144 |     await expect(filter.getByRole("button", { name: "At Risk" })).toHaveAttribute(
  145 |       "aria-pressed",
  146 |       "true",
  147 |     );
  148 | 
  149 |     const table = page.getByRole("table", { name: /Sales order book/ });
  150 |     await expect(table).toBeVisible();
  151 | 
  152 |     await table.getByRole("button", { name: /Order Value/ }).click();
  153 |     await expect(table.locator("tbody tr").first()).toBeVisible();
  154 |   });
  155 | 
  156 |   test("data table search narrows rows", async ({ page }) => {
  157 |     await page.goto("/m/sales-order/order-book");
  158 | 
  159 |     const search = page.getByRole("searchbox", {
  160 |       name: /Search Sales order book/,
  161 |     });
  162 |     await search.fill("Levi");
  163 | 
  164 |     const table = page.getByRole("table", { name: /Sales order book/ });
  165 |     const rows = table.locator("tbody tr");
  166 |     expect(await rows.count()).toBeGreaterThan(0);
  167 |     await expect(rows.first()).toContainText("Levi");
  168 |   });
  169 | 
  170 |   test("shop floor shows machine states", async ({ page }) => {
  171 |     await page.goto("/m/mes/shop-floor");
  172 |     const region = page.getByRole("region", { name: "Machine status" });
  173 |     await expect(region).toBeVisible();
  174 |     await expect(region.getByText(/Running \(/)).toBeVisible();
  175 |   });
  176 | });
  177 | 
  178 | test.describe("Generated workspaces", () => {
  179 |   const SAMPLES = [
  180 |     { path: "/m/master-data/item-master", heading: "Item Master" },
  181 |     { path: "/m/plm/change-requests", heading: "Engineering Change Requests" },
  182 |     { path: "/m/time-action/tna-calendar", heading: "T&A Calendar" },
  183 |     { path: "/m/purchase-order/create-po", heading: "Create PO" },
  184 |     { path: "/m/dms/retention", heading: "Retention Policy" },
  185 |     { path: "/m/bi-analytics/sales-analytics", heading: "Sales Analytics" },
  186 |   ];
  187 | 
  188 |   for (const sample of SAMPLES) {
  189 |     test(`${sample.heading} renders`, async ({ page }) => {
  190 |       await page.goto(sample.path);
  191 |       await expect(
  192 |         page.getByRole("heading", { name: sample.heading, level: 1 }),
  193 |       ).toBeVisible();
  194 |       await expect(
  195 |         page.getByRole("region", { name: "Key indicators" }),
  196 |       ).toBeVisible();
  197 |     });
```