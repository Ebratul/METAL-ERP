# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Shell and navigation >> expanding a module reveals its submodules and navigates
- Location: tests\e2e\navigation.spec.ts:33:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByRole('navigation', { name: 'Module navigation' }).getByRole('button', { name: /Expand Sales Orders submodules/ })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e4]:
    - banner [ref=e5]:
      - button "Open navigation" [ref=e6]
      - button "Search modules…" [ref=e8]
      - generic [ref=e13]:
        - button "Switch to light theme" [ref=e14]
        - button "Notifications, 6 unread" [ref=e22]:
          - generic [ref=e26]: "6"
        - button "Account menu" [ref=e28]:
          - generic [ref=e29]: MS
    - main [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - navigation "Breadcrumb" [ref=e33]:
            - list [ref=e34]:
              - listitem [ref=e35]:
                - link "Home" [ref=e36] [cursor=pointer]:
                  - /url: /dashboard
              - listitem [ref=e39]:
                - generic [ref=e40]: CEO Command Center
          - generic [ref=e41]:
            - generic [ref=e49]:
              - generic [ref=e50]:
                - heading "CEO Command Center" [level=1] [ref=e51]
                - generic [ref=e52]: LIVE
              - paragraph [ref=e54]: Real-time overview of your entire business
            - generic [ref=e55]:
              - group "Reporting period" [ref=e56]:
                - button "Month" [ref=e57]
                - button "Quarter" [ref=e58]
                - button "Year" [pressed] [ref=e59]
              - button [ref=e60] [cursor=pointer]
              - link [ref=e64] [cursor=pointer]:
                - /url: /modules
        - region "Headline performance indicators" [ref=e67]:
          - generic [ref=e68]:
            - generic [ref=e69]:
              - paragraph [ref=e76]: Total Revenue
              - generic [ref=e77]:
                - generic [ref=e78]:
                  - paragraph [ref=e79]: $24.57M
                  - generic [ref=e80]:
                    - generic [ref=e81]: +12.5%
                    - generic [ref=e86]: vs last year
                - img "Total Revenue trend" [ref=e87]
            - generic [ref=e91]:
              - paragraph [ref=e98]: Total Profit
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - paragraph [ref=e101]: $6.42M
                  - generic [ref=e102]:
                    - generic [ref=e103]: +18.7%
                    - generic [ref=e108]: 26.1% margin
                - img "Total Profit trend" [ref=e109]
            - generic [ref=e113]:
              - paragraph [ref=e120]: Sales Orders
              - generic [ref=e121]:
                - generic [ref=e122]:
                  - paragraph [ref=e123]: 25,846
                  - generic [ref=e124]:
                    - generic [ref=e125]: +9.2%
                    - generic [ref=e130]: 1,284 open
                - img "Sales Orders trend" [ref=e131]
            - generic [ref=e135]:
              - paragraph [ref=e141]: Production Output
              - generic [ref=e142]:
                - generic [ref=e143]:
                  - paragraph [ref=e144]: 182.4M pcs
                  - generic [ref=e145]:
                    - generic [ref=e146]: +7.8%
                    - generic [ref=e151]: this fiscal year
                - img "Production Output trend" [ref=e152]
            - generic [ref=e156]:
              - paragraph [ref=e165]: Active Buyers
              - generic [ref=e166]:
                - generic [ref=e167]:
                  - paragraph [ref=e168]: "568"
                  - generic [ref=e169]:
                    - generic [ref=e170]: +4.6%
                    - generic [ref=e175]: 42 new this quarter
                - img "Active Buyers trend" [ref=e176]
            - generic [ref=e180]:
              - paragraph [ref=e189]: On-Time In-Full
              - generic [ref=e190]:
                - generic [ref=e191]:
                  - paragraph [ref=e192]: 94.2%
                  - generic [ref=e193]:
                    - generic [ref=e194]: +2.1%
                    - generic [ref=e199]: target 95%
                - img "On-Time In-Full trend" [ref=e200]
        - region "Financial performance" [ref=e204]:
          - generic [ref=e205]:
            - generic [ref=e206]:
              - generic [ref=e208]:
                - heading "Business Performance" [level=2] [ref=e209]
                - paragraph [ref=e210]: Revenue, profit and expenses on one scale
              - group "Business Performance view" [ref=e213]:
                - button "Chart view" [pressed] [ref=e214]
                - button "Table view" [ref=e217]
            - generic [ref=e220]:
              - generic [ref=e221]: Revenue
              - generic [ref=e223]: Profit
              - generic [ref=e225]: Expenses
            - application [ref=e230]:
              - generic [ref=e244]:
                - generic [ref=e245]:
                  - generic [ref=e246]: Jan
                  - generic [ref=e248]: Feb
                  - generic [ref=e250]: Mar
                  - generic [ref=e252]: Apr
                  - generic [ref=e254]: May
                  - generic [ref=e256]: Jun
                  - generic [ref=e258]: Jul
                  - generic [ref=e260]: Aug
                  - generic [ref=e262]: Sep
                  - generic [ref=e264]: Oct
                  - generic [ref=e266]: Nov
                  - generic [ref=e268]: Dec
                - generic [ref=e270]:
                  - generic [ref=e271]: $0
                  - generic [ref=e273]: $6.5M
                  - generic [ref=e275]: $13M
                  - generic [ref=e277]: $19.5M
                  - generic [ref=e279]: $26M
            - generic [ref=e281]: All three measures share one currency axis — a second y-scale would invent a correlation that isn't in the data.
          - generic [ref=e282]:
            - generic [ref=e283]:
              - generic [ref=e285]:
                - heading "Revenue Composition" [level=2] [ref=e286]
                - paragraph [ref=e287]: Where the $24.57M comes from
              - group "Revenue Composition view" [ref=e290]:
                - button "Chart view" [pressed] [ref=e291]
                - button "Table view" [ref=e294]
            - generic [ref=e298]:
              - generic [ref=e299]:
                - application [ref=e302]
                - generic:
                  - generic: Total Revenue
                  - generic: $24.57M
                  - generic: FY 2025–26
              - list [ref=e321]:
                - listitem [ref=e322]:
                  - generic [ref=e323]:
                    - generic [ref=e324]: Export Sales
                    - generic [ref=e327]: $18.92M
                  - generic [ref=e328]:
                    - progressbar "Export Sales share" [ref=e329]
                    - generic [ref=e331]: 77.0%
                - listitem [ref=e332]:
                  - generic [ref=e333]:
                    - generic [ref=e334]: Local Sales
                    - generic [ref=e337]: $2.45M
                  - generic [ref=e338]:
                    - progressbar "Local Sales share" [ref=e339]
                    - generic [ref=e341]: 10.0%
                - listitem [ref=e342]:
                  - generic [ref=e343]:
                    - generic [ref=e344]: Subcontract Service
                    - generic [ref=e347]: $1.85M
                  - generic [ref=e348]:
                    - progressbar "Subcontract Service share" [ref=e349]
                    - generic [ref=e351]: 7.5%
                - listitem [ref=e352]:
                  - generic [ref=e353]:
                    - generic [ref=e354]: Tooling & Die Recovery
                    - generic [ref=e357]: $890K
                  - generic [ref=e358]:
                    - progressbar "Tooling & Die Recovery share" [ref=e359]
                    - generic [ref=e361]: 3.6%
                - listitem [ref=e362]:
                  - generic [ref=e363]:
                    - generic [ref=e364]: Scrap & Recovery
                    - generic [ref=e367]: $460K
                  - generic [ref=e368]:
                    - progressbar "Scrap & Recovery share" [ref=e369]
                    - generic [ref=e371]: 1.9%
        - region "Financial summary" [ref=e372]:
          - generic [ref=e373]:
            - generic [ref=e380]:
              - heading "Cash Position" [level=2] [ref=e381]
              - paragraph [ref=e382]: As of today
            - list [ref=e383]:
              - listitem [ref=e384]:
                - generic [ref=e389]: Cash in Hand
                - generic [ref=e390]: $2.45M
              - listitem [ref=e391]:
                - generic [ref=e395]: Bank Balance
                - generic [ref=e396]: $8.92M
              - listitem [ref=e397]:
                - generic [ref=e401]: Accounts Receivable
                - generic [ref=e402]: $5.32M
              - listitem [ref=e403]:
                - generic [ref=e408]: Accounts Payable
                - generic [ref=e409]: "-$3.15M"
            - generic [ref=e410]:
              - generic [ref=e411]:
                - generic [ref=e412]: Net Cash Flow
                - generic [ref=e413]: "-$8.1M"
              - generic [ref=e414]:
                - generic [ref=e415]: 13-week rolling
                - generic [ref=e416]: +9.4%
          - generic [ref=e421]:
            - generic [ref=e422]:
              - generic [ref=e424]:
                - heading "Cash Flow Forecast" [level=2] [ref=e425]
                - paragraph [ref=e426]: 13-week rolling inflow against outflow
              - group "Cash Flow Forecast view" [ref=e429]:
                - button "Chart view" [pressed] [ref=e430]
                - button "Table view" [ref=e433]
            - generic [ref=e436]:
              - generic [ref=e437]: Inflow
              - generic [ref=e439]: Outflow
            - application [ref=e444]:
              - generic [ref=e533]:
                - generic [ref=e534]:
                  - generic [ref=e535]: W1
                  - generic [ref=e537]: W2
                  - generic [ref=e539]: W3
                  - generic [ref=e541]: W4
                  - generic [ref=e543]: W5
                  - generic [ref=e545]: W6
                  - generic [ref=e547]: W7
                  - generic [ref=e549]: W8
                  - generic [ref=e551]: W9
                  - generic [ref=e553]: W11
                  - generic [ref=e555]: W13
                - generic [ref=e557]:
                  - generic [ref=e558]: $0
                  - generic [ref=e560]: $700K
                  - generic [ref=e562]: $1.4M
                  - generic [ref=e564]: $2.1M
                  - generic [ref=e566]: $2.8M
        - region "Operational counts" [ref=e568]:
          - generic [ref=e569]:
            - generic [ref=e576]:
              - paragraph [ref=e577]: Total Products
              - generic [ref=e578]:
                - generic [ref=e579]: 18,742
                - generic [ref=e580]: +4.3%
            - generic [ref=e597]:
              - paragraph [ref=e598]: Inventory Value
              - generic [ref=e599]:
                - generic [ref=e600]: $12.78M
                - generic [ref=e601]: +6.7%
            - generic [ref=e610]:
              - paragraph [ref=e611]: Low Stock Items
              - generic [ref=e612]:
                - generic [ref=e613]: "236"
                - generic [ref=e614]: "-2.1%"
            - generic [ref=e626]:
              - paragraph [ref=e627]: Active Suppliers
              - generic [ref=e628]:
                - generic [ref=e629]: 1,245
                - generic [ref=e630]: +3.2%
            - generic [ref=e642]:
              - paragraph [ref=e643]: Shipments in Transit
              - generic [ref=e644]:
                - generic [ref=e645]: "156"
                - generic [ref=e646]: +8.4%
            - generic [ref=e656]:
              - paragraph [ref=e657]: Warehouses
              - generic [ref=e658]:
                - generic [ref=e659]: "45"
                - generic [ref=e660]: +1.6%
            - generic [ref=e671]:
              - paragraph [ref=e672]: Plants & Branches
              - generic [ref=e673]:
                - generic [ref=e674]: "32"
                - generic [ref=e675]: +2.0%
            - generic [ref=e685]:
              - paragraph [ref=e686]: Export Countries
              - generic [ref=e687]:
                - generic [ref=e688]: "42"
                - generic [ref=e689]: +5.0%
        - region "Market performance" [ref=e694]:
          - generic [ref=e695]:
            - generic [ref=e696]:
              - generic [ref=e698]:
                - heading "Sales by Country" [level=2] [ref=e699]
                - paragraph [ref=e700]: Revenue share across export markets
              - group "Sales by Country view" [ref=e703]:
                - button "Chart view" [pressed] [ref=e704]
                - button "Table view" [ref=e707]
            - list [ref=e712]:
              - listitem [ref=e713]:
                - generic [ref=e714]: Bangladesh
                - generic [ref=e717]: $5.45M
              - listitem [ref=e718]:
                - generic [ref=e719]: China
                - generic [ref=e722]: $4.12M
              - listitem [ref=e723]:
                - generic [ref=e724]: Vietnam
                - generic [ref=e727]: $3.28M
              - listitem [ref=e728]:
                - generic [ref=e729]: India
                - generic [ref=e732]: $2.85M
              - listitem [ref=e733]:
                - generic [ref=e734]: Turkey
                - generic [ref=e737]: $2.24M
              - listitem [ref=e738]:
                - generic [ref=e739]: Indonesia
                - generic [ref=e742]: $1.68M
              - listitem [ref=e743]:
                - generic [ref=e744]: Cambodia
                - generic [ref=e747]: $1.42M
              - listitem [ref=e748]:
                - generic [ref=e749]: Others
                - generic [ref=e752]: $3.53M
          - generic [ref=e753]:
            - generic [ref=e754]:
              - generic [ref=e756]:
                - heading "Product Family Mix" [level=2] [ref=e757]
                - paragraph [ref=e758]: Revenue by accessory family
              - group "Product Family Mix view" [ref=e761]:
                - button "Chart view" [pressed] [ref=e762]
                - button "Table view" [ref=e765]
            - generic [ref=e769]:
              - generic [ref=e770]:
                - application [ref=e773]
                - generic:
                  - generic: Families
                  - generic: "7"
                  - generic: $24.57M total
              - list [ref=e795]:
                - listitem [ref=e796]:
                  - generic [ref=e798]: Metal Buttons
                - listitem [ref=e799]:
                  - generic [ref=e801]: Zippers & Sliders
                - listitem [ref=e802]:
                  - generic [ref=e804]: Rivets & Burrs
                - listitem [ref=e805]:
                  - generic [ref=e807]: Snap Fasteners
                - listitem [ref=e808]:
                  - generic [ref=e810]: Metal Labels & Tags
                - listitem [ref=e811]:
                  - generic [ref=e813]: Buckles & Hooks
          - generic [ref=e815]:
            - generic [ref=e816]:
              - heading "Live Alerts" [level=2] [ref=e822]
              - generic [ref=e823]: LIVE
            - list [ref=e826]:
              - listitem [ref=e827]:
                - link "Low Stock Alert 236 items are low in stock 5 min ago" [ref=e828] [cursor=pointer]:
                  - /url: /m/inventory-store/min-max
                  - generic [ref=e832]:
                    - generic [ref=e833]: Low Stock Alert
                    - generic [ref=e834]: 236 items are low in stock
                  - generic [ref=e835]: 5 min ago
              - listitem [ref=e836]:
                - link "Payment Received $285,000 received from H&M Global 18 min ago" [ref=e837] [cursor=pointer]:
                  - /url: /m/treasury-cash/receipts
                  - generic [ref=e842]:
                    - generic [ref=e843]: Payment Received
                    - generic [ref=e844]: $285,000 received from H&M Global
                  - generic [ref=e845]: 18 min ago
              - listitem [ref=e846]:
                - 'link "New Order Received Order #SO-25246 received 26 min ago" [ref=e847] [cursor=pointer]':
                  - /url: /m/sales-order/order-book
                  - generic [ref=e851]:
                    - generic [ref=e852]: New Order Received
                    - generic [ref=e853]: "Order #SO-25246 received"
                  - generic [ref=e854]: 26 min ago
              - listitem [ref=e855]:
                - link "Approval Required 23 requests are pending 34 min ago" [ref=e856] [cursor=pointer]:
                  - /url: /m/workflow-approval/my-approvals
                  - generic [ref=e860]:
                    - generic [ref=e861]: Approval Required
                    - generic [ref=e862]: 23 requests are pending
                  - generic [ref=e863]: 34 min ago
              - listitem [ref=e864]:
                - 'link "High Value Order Order #SO-25246 — $845,000 41 min ago" [ref=e865] [cursor=pointer]':
                  - /url: /m/sales-order/order-value
                  - generic [ref=e869]:
                    - generic [ref=e870]: High Value Order
                    - generic [ref=e871]: "Order #SO-25246 — $845,000"
                  - generic [ref=e872]: 41 min ago
              - listitem [ref=e873]:
                - link "Die Life Threshold Die DM-0412 at 94% of rated shots 1 hr ago" [ref=e874] [cursor=pointer]:
                  - /url: /m/die-mold/shot-count
                  - generic [ref=e878]:
                    - generic [ref=e879]: Die Life Threshold
                    - generic [ref=e880]: Die DM-0412 at 94% of rated shots
                  - generic [ref=e881]: 1 hr ago
        - region "Order pipeline" [ref=e882]:
          - generic [ref=e883]:
            - generic [ref=e884]:
              - generic [ref=e886]:
                - heading "Order Pipeline" [level=2] [ref=e887]
                - paragraph [ref=e888]: Inquiry to shipment conversion
              - group "Order Pipeline view" [ref=e891]:
                - button "Chart view" [pressed] [ref=e892]
                - button "Table view" [ref=e895]
            - list [ref=e900]:
              - listitem [ref=e901]:
                - generic [ref=e902]: Inquiries
                - generic [ref=e903]: 1,842
                - generic [ref=e906]: 100%
              - listitem [ref=e908]:
                - generic [ref=e909]: Quotations
                - generic [ref=e910]: 1,284
                - generic [ref=e913]: 69.7%
              - listitem [ref=e915]:
                - generic [ref=e916]: Proforma Invoices
                - generic [ref=e917]: "892"
                - generic [ref=e920]: 69.5%
              - listitem [ref=e922]:
                - generic [ref=e923]: Confirmed Orders
                - generic [ref=e924]: "648"
                - generic [ref=e927]: 72.6%
              - listitem [ref=e929]:
                - generic [ref=e930]: In Production
                - generic [ref=e931]: "512"
                - generic [ref=e934]: 79.0%
              - listitem [ref=e936]:
                - generic [ref=e937]: Shipped
                - generic [ref=e938]: "468"
                - generic [ref=e941]: 91.4%
            - generic [ref=e943]: Stages are ordered, so they take a single-hue ordinal ramp rather than eight categorical colours.
          - generic [ref=e944]:
            - generic [ref=e945]:
              - generic [ref=e953]:
                - heading "Top Performing Buyers" [level=2] [ref=e954]
                - paragraph [ref=e955]: By revenue this fiscal year
              - link "All buyers" [ref=e957] [cursor=pointer]:
                - /url: /m/crm-marketing/accounts
            - table [ref=e962]:
              - caption [ref=e963]: Top performing buyers by revenue, orders, margin and growth
              - rowgroup [ref=e964]:
                - row [ref=e965]:
                  - columnheader "Buyer" [ref=e966]
                  - columnheader "Country" [ref=e967]
                  - columnheader "Revenue" [ref=e968]
                  - columnheader "Orders" [ref=e969]
                  - columnheader "Margin" [ref=e970]
                  - columnheader "Growth" [ref=e971]
              - rowgroup [ref=e972]:
                - row [ref=e973]:
                  - rowheader "H&M Global Sourcing Active" [ref=e974]:
                    - generic [ref=e975]: H&M Global Sourcing
                    - generic [ref=e976]: Active
                  - cell "Sweden" [ref=e981]
                  - cell "$3.42M" [ref=e982]
                  - cell "412" [ref=e983]
                  - cell "27.4%" [ref=e984]
                  - cell "+14.2%" [ref=e985]
                - row [ref=e991]:
                  - rowheader "Inditex / Zara Active" [ref=e992]:
                    - generic [ref=e993]: Inditex / Zara
                    - generic [ref=e994]: Active
                  - cell "Spain" [ref=e999]
                  - cell "$2.98M" [ref=e1000]
                  - cell "368" [ref=e1001]
                  - cell "29.1%" [ref=e1002]
                  - cell "+18.6%" [ref=e1003]
                - row [ref=e1009]:
                  - rowheader "Levi Strauss & Co. Active" [ref=e1010]:
                    - generic [ref=e1011]: Levi Strauss & Co.
                    - generic [ref=e1012]: Active
                  - cell "USA" [ref=e1017]
                  - cell "$2.64M" [ref=e1018]
                  - cell "296" [ref=e1019]
                  - cell "31.2%" [ref=e1020]
                  - cell "+9.4%" [ref=e1021]
                - row [ref=e1027]:
                  - rowheader "Primark Sourcing At Risk" [ref=e1028]:
                    - generic [ref=e1029]: Primark Sourcing
                    - generic [ref=e1030]: At Risk
                  - cell "Ireland" [ref=e1034]
                  - cell "$2.18M" [ref=e1035]
                  - cell "344" [ref=e1036]
                  - cell "22.8%" [ref=e1037]
                  - cell "-3.2%" [ref=e1038]
                - row [ref=e1044]:
                  - rowheader "Uniqlo / Fast Retailing Active" [ref=e1045]:
                    - generic [ref=e1046]: Uniqlo / Fast Retailing
                    - generic [ref=e1047]: Active
                  - cell "Japan" [ref=e1052]
                  - cell "$1.92M" [ref=e1053]
                  - cell "254" [ref=e1054]
                  - cell "28.6%" [ref=e1055]
                  - cell "+21.5%" [ref=e1056]
                - row [ref=e1062]:
                  - rowheader "Decathlon Sourcing Active" [ref=e1063]:
                    - generic [ref=e1064]: Decathlon Sourcing
                    - generic [ref=e1065]: Active
                  - cell "France" [ref=e1070]
                  - cell "$1.64M" [ref=e1071]
                  - cell "218" [ref=e1072]
                  - cell "25.3%" [ref=e1073]
                  - cell "+12.8%" [ref=e1074]
                - row [ref=e1080]:
                  - rowheader "C&A Buying Active" [ref=e1081]:
                    - generic [ref=e1082]: C&A Buying
                    - generic [ref=e1083]: Active
                  - cell "Germany" [ref=e1088]
                  - cell "$1.38M" [ref=e1089]
                  - cell "186" [ref=e1090]
                  - cell "24.1%" [ref=e1091]
                  - cell "+4.6%" [ref=e1092]
                - row [ref=e1098]:
                  - rowheader "Bestseller A/S New" [ref=e1099]:
                    - generic [ref=e1100]: Bestseller A/S
                    - generic [ref=e1101]: New
                  - cell "Denmark" [ref=e1105]
                  - cell "$1.12M" [ref=e1106]
                  - cell "164" [ref=e1107]
                  - cell "26.7%" [ref=e1108]
                  - cell "+32.4%" [ref=e1109]
        - region "Manufacturing performance" [ref=e1115]:
          - generic [ref=e1116]:
            - generic [ref=e1117]:
              - generic [ref=e1119]:
                - heading "Line OEE" [level=2] [ref=e1120]
                - paragraph [ref=e1121]: Availability × performance × quality
              - group "Line OEE view" [ref=e1124]:
                - button "Chart view" [pressed] [ref=e1125]
                - button "Table view" [ref=e1128]
            - generic [ref=e1131]:
              - generic [ref=e1132]: Availability
              - generic [ref=e1134]: Performance
              - generic [ref=e1136]: Quality
            - generic [ref=e1139]:
              - generic:
                - generic:
                  - generic: 85.5%
                  - generic: Plant OEE
                  - generic: "World-class benchmark: 85%"
              - list [ref=e1140]:
                - listitem [ref=e1141]:
                  - generic [ref=e1142]: Stamping A
                  - generic [ref=e1143]:
                    - progressbar "Stamping A OEE" [ref=e1144]
                    - generic [ref=e1146]: 87.4%
                - listitem [ref=e1147]:
                  - generic [ref=e1148]: Stamping B
                  - generic [ref=e1149]:
                    - progressbar "Stamping B OEE" [ref=e1150]
                    - generic [ref=e1152]: 82.1%
                - listitem [ref=e1153]:
                  - generic [ref=e1154]: Plating 1
                  - generic [ref=e1155]:
                    - progressbar "Plating 1 OEE" [ref=e1156]
                    - generic [ref=e1158]: 91.2%
                - listitem [ref=e1159]:
                  - generic [ref=e1160]: Plating 2
                  - generic [ref=e1161]:
                    - progressbar "Plating 2 OEE" [ref=e1162]
                    - generic [ref=e1164]: 94.6%
                - listitem [ref=e1165]:
                  - generic [ref=e1166]: Plating 3
                  - generic [ref=e1167]:
                    - progressbar "Plating 3 OEE" [ref=e1168]
                    - generic [ref=e1170]: 68.4%
                - listitem [ref=e1171]:
                  - generic [ref=e1172]: Assembly 1
                  - generic [ref=e1173]:
                    - progressbar "Assembly 1 OEE" [ref=e1174]
                    - generic [ref=e1176]: 89.7%
                - listitem [ref=e1177]:
                  - generic [ref=e1178]: Assembly 2
                  - generic [ref=e1179]:
                    - progressbar "Assembly 2 OEE" [ref=e1180]
                    - generic [ref=e1182]: 85.3%
          - generic [ref=e1183]:
            - generic [ref=e1184]:
              - generic [ref=e1186]:
                - heading "Machine Capacity Utilisation" [level=2] [ref=e1187]
                - paragraph [ref=e1188]: Percent of available hours used, by line and weekday
              - group "Machine Capacity Utilisation view" [ref=e1191]:
                - button "Chart view" [pressed] [ref=e1192]
                - button "Table view" [ref=e1195]
            - generic [ref=e1200]:
              - generic [ref=e1203]:
                - generic [ref=e1205]: Mon
                - generic [ref=e1206]: Tue
                - generic [ref=e1207]: Wed
                - generic [ref=e1208]: Thu
                - generic [ref=e1209]: Fri
                - generic [ref=e1210]: Sat
                - generic [ref=e1211]: Sun
                - generic [ref=e1212]: Stamping A
                - 'button "Stamping A, Mon: 64%" [ref=e1213]'
                - 'button "Stamping A, Tue: 80%" [ref=e1214]'
                - 'button "Stamping A, Wed: 63%" [ref=e1215]'
                - 'button "Stamping A, Thu: 87%" [ref=e1216]'
                - 'button "Stamping A, Fri: 79%" [ref=e1217]'
                - 'button "Stamping A, Sat: 80%" [ref=e1218]'
                - 'button "Stamping A, Sun: 35%" [ref=e1219]'
                - generic [ref=e1220]: Stamping B
                - 'button "Stamping B, Mon: 89%" [ref=e1221]'
                - 'button "Stamping B, Tue: 89%" [ref=e1222]'
                - 'button "Stamping B, Wed: 71%" [ref=e1223]'
                - 'button "Stamping B, Thu: 71%" [ref=e1224]'
                - 'button "Stamping B, Fri: 94%" [ref=e1225]'
                - 'button "Stamping B, Sat: 66%" [ref=e1226]'
                - 'button "Stamping B, Sun: 20%" [ref=e1227]'
                - generic [ref=e1228]: Plating 1
                - 'button "Plating 1, Mon: 68%" [ref=e1229]'
                - 'button "Plating 1, Tue: 84%" [ref=e1230]'
                - 'button "Plating 1, Wed: 95%" [ref=e1231]'
                - 'button "Plating 1, Thu: 99%" [ref=e1232]'
                - 'button "Plating 1, Fri: 70%" [ref=e1233]'
                - 'button "Plating 1, Sat: 62%" [ref=e1234]'
                - 'button "Plating 1, Sun: 37%" [ref=e1235]'
                - generic [ref=e1236]: Plating 2
                - 'button "Plating 2, Mon: 70%" [ref=e1237]'
                - 'button "Plating 2, Tue: 90%" [ref=e1238]'
                - 'button "Plating 2, Wed: 87%" [ref=e1239]'
                - 'button "Plating 2, Thu: 92%" [ref=e1240]'
                - 'button "Plating 2, Fri: 99%" [ref=e1241]'
                - 'button "Plating 2, Sat: 68%" [ref=e1242]'
                - 'button "Plating 2, Sun: 28%" [ref=e1243]'
                - generic [ref=e1244]: Plating 3
                - 'button "Plating 3, Mon: 65%" [ref=e1245]'
                - 'button "Plating 3, Tue: 75%" [ref=e1246]'
                - 'button "Plating 3, Wed: 78%" [ref=e1247]'
                - 'button "Plating 3, Thu: 82%" [ref=e1248]'
                - 'button "Plating 3, Fri: 87%" [ref=e1249]'
                - 'button "Plating 3, Sat: 80%" [ref=e1250]'
                - 'button "Plating 3, Sun: 41%" [ref=e1251]'
                - generic [ref=e1252]: Assembly 1
                - 'button "Assembly 1, Mon: 96%" [ref=e1253]'
                - 'button "Assembly 1, Tue: 78%" [ref=e1254]'
                - 'button "Assembly 1, Wed: 63%" [ref=e1255]'
                - 'button "Assembly 1, Thu: 75%" [ref=e1256]'
                - 'button "Assembly 1, Fri: 94%" [ref=e1257]'
                - 'button "Assembly 1, Sat: 71%" [ref=e1258]'
                - 'button "Assembly 1, Sun: 44%" [ref=e1259]'
                - generic [ref=e1260]: Assembly 2
                - 'button "Assembly 2, Mon: 63%" [ref=e1261]'
                - 'button "Assembly 2, Tue: 99%" [ref=e1262]'
                - 'button "Assembly 2, Wed: 98%" [ref=e1263]'
                - 'button "Assembly 2, Thu: 78%" [ref=e1264]'
                - 'button "Assembly 2, Fri: 77%" [ref=e1265]'
                - 'button "Assembly 2, Sat: 87%" [ref=e1266]'
                - 'button "Assembly 2, Sun: 53%" [ref=e1267]'
              - generic [ref=e1268]:
                - generic [ref=e1269]:
                  - generic [ref=e1270]: 0%
                  - generic [ref=e1279]: 99%
                - paragraph
          - generic [ref=e1280]:
            - generic [ref=e1281]:
              - generic [ref=e1283]:
                - heading "Production Flow" [level=2] [ref=e1284]
                - paragraph [ref=e1285]: Pieces cleared per stage
              - group "Production Flow view" [ref=e1288]:
                - button "Chart view" [pressed] [ref=e1289]
                - button "Table view" [ref=e1292]
            - list [ref=e1297]:
              - listitem [ref=e1298]:
                - generic [ref=e1299]: Casting / Stamping
                - generic [ref=e1300]: 42.8M
                - generic [ref=e1303]: 100%
              - listitem [ref=e1305]:
                - generic [ref=e1306]: Polishing
                - generic [ref=e1307]: 38.4M
                - generic [ref=e1310]: 89.7%
              - listitem [ref=e1312]:
                - generic [ref=e1313]: Plating
                - generic [ref=e1314]: 34.1M
                - generic [ref=e1317]: 88.8%
              - listitem [ref=e1319]:
                - generic [ref=e1320]: Assembly
                - generic [ref=e1321]: 29.6M
                - generic [ref=e1324]: 86.8%
              - listitem [ref=e1326]:
                - generic [ref=e1327]: Inspection
                - generic [ref=e1328]: 27.9M
                - generic [ref=e1331]: 94.3%
              - listitem [ref=e1333]:
                - generic [ref=e1334]: Packing
                - generic [ref=e1335]: 26.4M
                - generic [ref=e1338]: 94.6%
        - region "Quality performance" [ref=e1340]:
          - generic [ref=e1341]:
            - generic [ref=e1342]:
              - generic [ref=e1344]:
                - heading "Quality Trend" [level=2] [ref=e1345]
                - paragraph [ref=e1346]: Rejection, rework and first-pass yield — all in percent
              - group "Quality Trend view" [ref=e1349]:
                - button "Chart view" [pressed] [ref=e1350]
                - button "Table view" [ref=e1353]
            - generic [ref=e1356]:
              - generic [ref=e1357]: First Pass Yield
              - generic [ref=e1359]: Rejection Rate
              - generic [ref=e1361]: Rework Rate
            - application [ref=e1366]:
              - generic [ref=e1380]:
                - generic [ref=e1381]:
                  - generic [ref=e1382]: Jan
                  - generic [ref=e1384]: Feb
                  - generic [ref=e1386]: Mar
                  - generic [ref=e1388]: Apr
                  - generic [ref=e1390]: May
                  - generic [ref=e1392]: Jun
                  - generic [ref=e1394]: Jul
                  - generic [ref=e1396]: Aug
                  - generic [ref=e1398]: Sep
                  - generic [ref=e1400]: Oct
                  - generic [ref=e1402]: Nov
                  - generic [ref=e1404]: Dec
                - generic [ref=e1406]:
                  - generic [ref=e1407]: 0%
                  - generic [ref=e1409]: 25%
                  - generic [ref=e1411]: 50%
                  - generic [ref=e1413]: 75%
                  - generic [ref=e1415]: 100%
                - generic [ref=e1417]: FPY target 95%
          - generic [ref=e1418]:
            - generic [ref=e1419]:
              - generic [ref=e1421]:
                - heading "Defect Pareto" [level=2] [ref=e1422]
                - paragraph [ref=e1423]: Top defect drivers this quarter
              - group "Defect Pareto view" [ref=e1426]:
                - button "Chart view" [pressed] [ref=e1427]
                - button "Table view" [ref=e1430]
            - list [ref=e1435]:
              - listitem [ref=e1436]:
                - generic [ref=e1437]: Plating Peel-off
                - generic [ref=e1440]: "428"
              - listitem [ref=e1441]:
                - generic [ref=e1442]: Dimension Out of Tol.
                - generic [ref=e1445]: "316"
              - listitem [ref=e1446]:
                - generic [ref=e1447]: Colour Mismatch
                - generic [ref=e1450]: "274"
              - listitem [ref=e1451]:
                - generic [ref=e1452]: Surface Scratch
                - generic [ref=e1455]: "208"
              - listitem [ref=e1456]:
                - generic [ref=e1457]: Burr / Sharp Edge
                - generic [ref=e1460]: "164"
              - listitem [ref=e1461]:
                - generic [ref=e1462]: Weak Attachment
                - generic [ref=e1465]: "112"
              - listitem [ref=e1466]:
                - generic [ref=e1467]: Rust Spot
                - generic [ref=e1470]: "68"
            - generic [ref=e1471]: One measure, nominal categories — every bar takes the same hue. Colouring by value would re-encode bar length.
        - region "Inventory and supply" [ref=e1472]:
          - generic [ref=e1473]:
            - generic [ref=e1474]:
              - generic [ref=e1476]:
                - heading "Inventory Composition" [level=2] [ref=e1477]
                - paragraph [ref=e1478]: $12.78M held across stock types
              - group "Inventory Composition view" [ref=e1481]:
                - button "Chart view" [pressed] [ref=e1482]
                - button "Table view" [ref=e1485]
            - generic [ref=e1489]:
              - generic [ref=e1490]:
                - application [ref=e1493]
                - generic:
                  - generic: Inventory Value
                  - generic: $12.78M
              - list [ref=e1512]:
                - listitem [ref=e1513]:
                  - generic [ref=e1514]: Raw Material
                  - generic [ref=e1517]: $5.24M
                - listitem [ref=e1518]:
                  - generic [ref=e1519]: Work in Progress
                  - generic [ref=e1522]: $3.18M
                - listitem [ref=e1523]:
                  - generic [ref=e1524]: Finished Goods
                  - generic [ref=e1527]: $2.94M
                - listitem [ref=e1528]:
                  - generic [ref=e1529]: Packing Material
                  - generic [ref=e1532]: $860K
                - listitem [ref=e1533]:
                  - generic [ref=e1534]: Consumables & Chemicals
                  - generic [ref=e1537]: $560K
          - generic [ref=e1538]:
            - generic [ref=e1539]:
              - generic [ref=e1541]:
                - heading "Stock Aging" [level=2] [ref=e1542]
                - paragraph [ref=e1543]: Value held by age bucket
              - group "Stock Aging view" [ref=e1546]:
                - button "Chart view" [pressed] [ref=e1547]
                - button "Table view" [ref=e1550]
            - application [ref=e1556]:
              - generic [ref=e1579]:
                - generic [ref=e1580]:
                  - generic [ref=e1581]: 0–30 d
                  - generic [ref=e1583]: 31–60 d
                  - generic [ref=e1585]: 61–90 d
                  - generic [ref=e1587]: 91–180 d
                  - generic [ref=e1589]: 180+ d
                - generic [ref=e1591]:
                  - generic [ref=e1592]: $0
                  - generic [ref=e1594]: $2M
                  - generic [ref=e1596]: $4M
                  - generic [ref=e1598]: $6M
                  - generic [ref=e1600]: $8M
            - generic [ref=e1602]: Age buckets are ordered, so the reader should see the order — but with one series, slot 1 plus the axis order carries it.
          - generic [ref=e1603]:
            - generic [ref=e1604]:
              - generic [ref=e1606]:
                - heading "Supplier Capability" [level=2] [ref=e1607]
                - paragraph [ref=e1608]: Top supplier against the supplier-base average
              - group "Supplier Capability view" [ref=e1611]:
                - button "Chart view" [pressed] [ref=e1612]
                - button "Table view" [ref=e1615]
            - generic [ref=e1618]:
              - generic [ref=e1619]: Top Supplier
              - generic [ref=e1621]: Base Average
            - application [ref=e1626]:
              - generic [ref=e1646]:
                - generic [ref=e1649]:
                  - generic [ref=e1650]: Quality
                  - generic [ref=e1652]: Delivery
                  - generic [ref=e1655]: Price
                  - generic [ref=e1658]: Responsiveness
                  - generic [ref=e1660]: Compliance
                  - generic [ref=e1663]: Capacity
                - generic [ref=e1667]:
                  - generic [ref=e1668]: "0"
                  - generic [ref=e1670]: "25"
                  - generic [ref=e1672]: "50"
                  - generic [ref=e1674]: "75"
                  - generic [ref=e1676]: "100"
        - region "Margin, energy and logistics" [ref=e1678]:
          - generic [ref=e1679]:
            - generic [ref=e1680]:
              - generic [ref=e1682]:
                - heading "Order Value vs Margin" [level=2] [ref=e1683]
                - paragraph [ref=e1684]: Each bubble is one order; size is quantity
              - group "Order Value vs Margin view" [ref=e1687]:
                - button "Chart view" [pressed] [ref=e1688]
                - button "Table view" [ref=e1691]
            - generic [ref=e1694]:
              - generic [ref=e1695]: Metal Buttons
              - generic [ref=e1697]: Zippers & Sliders
              - generic [ref=e1699]: Rivets & Burrs
            - application [ref=e1704]:
              - generic [ref=e1953]:
                - generic [ref=e1954]:
                  - generic [ref=e1955]: $0
                  - generic [ref=e1957]: $150K
                  - generic [ref=e1959]: $300K
                  - generic [ref=e1961]: $450K
                  - generic [ref=e1963]: $600K
                - generic [ref=e1965]: Order value (USD)
                - generic [ref=e1966]:
                  - generic [ref=e1967]: 0%
                  - generic [ref=e1969]: 9%
                  - generic [ref=e1971]: 18%
                  - generic [ref=e1973]: 27%
                  - generic [ref=e1975]: 36%
            - generic [ref=e1977]: "Scatter is an all-pairs form: any two marks can touch, so it carries a three-series cap rather than the usual eight."
          - generic [ref=e1978]:
            - generic [ref=e1979]:
              - generic [ref=e1981]:
                - heading "Energy Consumption" [level=2] [ref=e1982]
                - paragraph [ref=e1983]: Purchased and self-generated, in kWh equivalent
              - group "Energy Consumption view" [ref=e1986]:
                - button "Chart view" [pressed] [ref=e1987]
                - button "Table view" [ref=e1990]
            - generic [ref=e1993]:
              - generic [ref=e1994]: Grid Electricity
              - generic [ref=e1996]: Natural Gas
              - generic [ref=e1998]: Solar Generation
            - application [ref=e2003]:
              - generic [ref=e2023]:
                - generic [ref=e2024]:
                  - generic [ref=e2025]: Jan
                  - generic [ref=e2027]: Feb
                  - generic [ref=e2029]: Mar
                  - generic [ref=e2031]: Apr
                  - generic [ref=e2033]: May
                  - generic [ref=e2035]: Jun
                  - generic [ref=e2037]: Jul
                  - generic [ref=e2039]: Aug
                  - generic [ref=e2041]: Sep
                  - generic [ref=e2043]: Oct
                  - generic [ref=e2045]: Nov
                  - generic [ref=e2047]: Dec
                - generic [ref=e2049]:
                  - generic [ref=e2050]: "0"
                  - generic [ref=e2052]: 350K
                  - generic [ref=e2054]: 700K
                  - generic [ref=e2056]: 1.05M
                  - generic [ref=e2058]: 1.4M
          - generic [ref=e2060]:
            - generic [ref=e2069]:
              - heading "Shipment Status" [level=2] [ref=e2070]
              - paragraph [ref=e2071]: 1,536 shipments this quarter
            - generic [ref=e2072]:
              - generic [ref=e2073]:
                - generic [ref=e2074]:
                  - generic [ref=e2075]: Delivered
                  - generic [ref=e2079]: 1,284
                - generic [ref=e2080]:
                  - progressbar "Delivered share" [ref=e2081]
                  - generic [ref=e2083]: 83.6%
              - generic [ref=e2084]:
                - generic [ref=e2085]:
                  - generic [ref=e2086]: In Transit
                  - generic [ref=e2089]: "156"
                - generic [ref=e2090]:
                  - progressbar "In Transit share" [ref=e2091]
                  - generic [ref=e2093]: 10.2%
              - generic [ref=e2094]:
                - generic [ref=e2095]:
                  - generic [ref=e2096]: At Port
                  - generic [ref=e2099]: "72"
                - generic [ref=e2100]:
                  - progressbar "At Port share" [ref=e2101]
                  - generic [ref=e2103]: 4.7%
              - generic [ref=e2104]:
                - generic [ref=e2105]:
                  - generic [ref=e2106]: Delayed
                  - generic [ref=e2109]: "24"
                - generic [ref=e2110]:
                  - progressbar "Delayed share" [ref=e2111]
                  - generic [ref=e2113]: 1.6%
              - generic [ref=e2114]:
                - generic [ref=e2115]:
                  - generic [ref=e2116]: Workforce present
                  - generic [ref=e2117]: 2,255 / 2,453
                - generic [ref=e2118]:
                  - progressbar "Attendance rate" [ref=e2119]
                  - generic [ref=e2121]: 91.9%
        - region "Insights and governance" [ref=e2122]:
          - generic [ref=e2124]:
            - generic [ref=e2125]:
              - generic [ref=e2131]:
                - heading "AI Business Insights" [level=2] [ref=e2132]
                - paragraph [ref=e2133]: Ranked by revenue impact
              - link "View all" [ref=e2135] [cursor=pointer]:
                - /url: /m/ai-center/insight-feed
            - list [ref=e2139]:
              - listitem [ref=e2140]:
                - link "Sales are up 12.5% this month Metal buttons and rivets are driving the gain across EU buyers." [ref=e2141] [cursor=pointer]:
                  - /url: /m/bi-analytics/sales-analytics
                  - generic [ref=e2146]:
                    - generic [ref=e2147]: Sales are up 12.5% this month
                    - generic [ref=e2148]: Metal buttons and rivets are driving the gain across EU buyers.
              - listitem [ref=e2149]:
                - link "236 products are running low in stock Reorder now to avoid stockouts on 14 confirmed orders." [ref=e2150] [cursor=pointer]:
                  - /url: /m/mrp/shortage
                  - generic [ref=e2154]:
                    - generic [ref=e2155]: 236 products are running low in stock
                    - generic [ref=e2156]: Reorder now to avoid stockouts on 14 confirmed orders.
              - listitem [ref=e2157]:
                - link "Plating line 2 shows the best yield Consider shifting antique-finish volume from line 4 to line 2." [ref=e2158] [cursor=pointer]:
                  - /url: /m/plating-finishing/line-efficiency
                  - generic [ref=e2162]:
                    - generic [ref=e2163]: Plating line 2 shows the best yield
                    - generic [ref=e2164]: Consider shifting antique-finish volume from line 4 to line 2.
              - listitem [ref=e2165]:
                - link "Profit margin improved by 2.3% Zinc alloy price negotiation is holding through this quarter." [ref=e2166] [cursor=pointer]:
                  - /url: /m/cost-budget/variance-analysis
                  - generic [ref=e2171]:
                    - generic [ref=e2172]: Profit margin improved by 2.3%
                    - generic [ref=e2173]: Zinc alloy price negotiation is holding through this quarter.
              - listitem [ref=e2174]:
                - link "Order SO-25188 is at delivery risk Plating stage is 4 days behind the T&A critical path." [ref=e2175] [cursor=pointer]:
                  - /url: /m/time-action/delay-alerts
                  - generic [ref=e2179]:
                    - generic [ref=e2180]: Order SO-25188 is at delivery risk
                    - generic [ref=e2181]: Plating stage is 4 days behind the T&A critical path.
          - generic [ref=e2183]:
            - generic [ref=e2184]:
              - generic [ref=e2191]:
                - heading "Waiting on You" [level=2] [ref=e2192]
                - paragraph [ref=e2193]: 88 approvals pending
              - link "Open queue" [ref=e2195] [cursor=pointer]:
                - /url: /m/workflow-approval/my-approvals
            - list [ref=e2199]:
              - listitem [ref=e2200]:
                - link "Purchase Requisitions 27" [ref=e2201] [cursor=pointer]:
                  - /url: /m/procurement/requisitions
                  - generic [ref=e2202]: Purchase Requisitions
                  - generic [ref=e2203]: "27"
              - listitem [ref=e2204]:
                - link "Quotation Discounts 9" [ref=e2205] [cursor=pointer]:
                  - /url: /m/quotation-costing/approval-matrix
                  - generic [ref=e2206]: Quotation Discounts
                  - generic [ref=e2207]: "9"
              - listitem [ref=e2208]:
                - link "Sample Approvals 15" [ref=e2209] [cursor=pointer]:
                  - /url: /m/sample-management/approval-tracking
                  - generic [ref=e2210]: Sample Approvals
                  - generic [ref=e2211]: "15"
              - listitem [ref=e2212]:
                - link "Payment Releases 19" [ref=e2213] [cursor=pointer]:
                  - /url: /m/finance-accounts/accounts-payable
                  - generic [ref=e2214]: Payment Releases
                  - generic [ref=e2215]: "19"
              - listitem [ref=e2216]:
                - link "Engineering Changes 6" [ref=e2217] [cursor=pointer]:
                  - /url: /m/plm/change-requests
                  - generic [ref=e2218]: Engineering Changes
                  - generic [ref=e2219]: "6"
              - listitem [ref=e2220]:
                - link "Overtime Sanctions 12" [ref=e2221] [cursor=pointer]:
                  - /url: /m/organization-management/shifts
                  - generic [ref=e2222]: Overtime Sanctions
                  - generic [ref=e2223]: "12"
          - generic [ref=e2224]:
            - generic [ref=e2225]:
              - generic [ref=e2226]:
                - generic [ref=e2232]:
                  - heading "System Status" [level=2] [ref=e2233]
                  - paragraph [ref=e2234]: 1 service degraded
                - generic [ref=e2235]: LIVE
              - list [ref=e2238]:
                - listitem [ref=e2239]:
                  - generic [ref=e2240]: Application Server
                  - generic [ref=e2243]:
                    - generic [ref=e2244]: 99.99%
                    - generic [ref=e2245]: operational
                - listitem [ref=e2246]:
                  - generic [ref=e2247]: Database Cluster
                  - generic [ref=e2250]:
                    - generic [ref=e2251]: 99.98%
                    - generic [ref=e2252]: operational
                - listitem [ref=e2253]:
                  - generic [ref=e2254]: Backup & Replication
                  - generic [ref=e2257]:
                    - generic [ref=e2258]: 100%
                    - generic [ref=e2259]: operational
                - listitem [ref=e2260]:
                  - generic [ref=e2261]: Security Gateway
                  - generic [ref=e2264]:
                    - generic [ref=e2265]: 99.97%
                    - generic [ref=e2266]: operational
                - listitem [ref=e2267]:
                  - generic [ref=e2268]: API Services
                  - generic [ref=e2271]:
                    - generic [ref=e2272]: 99.42%
                    - generic [ref=e2273]: degraded
                - listitem [ref=e2274]:
                  - generic [ref=e2275]: Payment Gateway
                  - generic [ref=e2278]:
                    - generic [ref=e2279]: 99.95%
                    - generic [ref=e2280]: operational
                - listitem [ref=e2281]:
                  - generic [ref=e2282]: IoT Ingest Pipeline
                  - generic [ref=e2285]:
                    - generic [ref=e2286]: 99.91%
                    - generic [ref=e2287]: operational
            - generic [ref=e2288]:
              - heading "Quick Actions" [level=2] [ref=e2296]
              - generic [ref=e2297]:
                - link "New Sales Order" [ref=e2298] [cursor=pointer]:
                  - /url: /m/sales-order/create-order
                - link "Create Quotation" [ref=e2304] [cursor=pointer]:
                  - /url: /m/quotation-costing/new-quotation
                - link "Raise Purchase Order" [ref=e2309] [cursor=pointer]:
                  - /url: /m/purchase-order/create-po
                - link "Log Production" [ref=e2316] [cursor=pointer]:
                  - /url: /m/production/output-entry
                - link "Sample Request" [ref=e2321] [cursor=pointer]:
                  - /url: /m/sample-management/sample-requests
                - link "Stock Transfer" [ref=e2326] [cursor=pointer]:
                  - /url: /m/inventory-store/transfers
        - region "Cost structure" [ref=e2339]:
          - generic [ref=e2340]:
            - generic [ref=e2341]:
              - generic [ref=e2343]:
                - heading "Revenue, Profit and Expense by Month" [level=2] [ref=e2344]
                - paragraph [ref=e2345]: Bars are revenue and expenses; the line is profit — one shared currency scale
              - group "Revenue, Profit and Expense by Month view" [ref=e2348]:
                - button "Chart view" [pressed] [ref=e2349]
                - button "Table view" [ref=e2352]
            - generic [ref=e2356]:
              - generic [ref=e2357]:
                - paragraph [ref=e2358]: Total Revenue
                - paragraph [ref=e2359]: $224.41M
              - generic [ref=e2360]:
                - paragraph [ref=e2361]: Total Expenses
                - paragraph [ref=e2362]: $160.71M
              - generic [ref=e2363]:
                - paragraph [ref=e2364]: Net Profit
                - paragraph [ref=e2365]: $63.7M
              - generic [ref=e2366]:
                - paragraph [ref=e2367]: Profit Margin
                - paragraph [ref=e2368]: 28.4%
            - generic [ref=e2369]:
              - generic [ref=e2370]: Revenue
              - generic [ref=e2372]: Expenses
              - generic [ref=e2374]: Profit
            - application [ref=e2379]:
              - generic [ref=e2466]:
                - generic [ref=e2467]:
                  - generic [ref=e2468]: Jan
                  - generic [ref=e2470]: Feb
                  - generic [ref=e2472]: Mar
                  - generic [ref=e2474]: Apr
                  - generic [ref=e2476]: Jun
                  - generic [ref=e2478]: Jul
                  - generic [ref=e2480]: Aug
                  - generic [ref=e2482]: Sep
                  - generic [ref=e2484]: Oct
                  - generic [ref=e2486]: Nov
                  - generic [ref=e2488]: Dec
                - generic [ref=e2490]:
                  - generic [ref=e2491]: $0
                  - generic [ref=e2493]: $6.5M
                  - generic [ref=e2495]: $13M
                  - generic [ref=e2497]: $19.5M
                  - generic [ref=e2499]: $26M
        - generic [ref=e2501]:
          - generic [ref=e2502]: Smart Metal Garments Accessories ERP · AI Powered World Class Enterprise Edition
          - generic [ref=e2503]: Demo data — no backend connected
    - contentinfo [ref=e2506]:
      - paragraph [ref=e2507]: "Metal ERP · Smart Global IT · Director: Mohammad Sayem · +8801711-772407"
      - paragraph [ref=e2508]: Chittagong South Kulshi, Bangladesh
  - alert [ref=e2509]
  - generic [ref=e2510]: "0"
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.describe("Shell and navigation", () => {
  4   |   test("root redirects to the command centre", async ({ page }) => {
  5   |     await page.goto("/");
  6   |     await expect(page).toHaveURL(/\/dashboard$/);
  7   |     await expect(
  8   |       page.getByRole("heading", { name: "CEO Command Center", level: 1 }),
  9   |     ).toBeVisible();
  10  |   });
  11  | 
  12  |   test("sidebar lists every module group", async ({ page }) => {
  13  |     await page.goto("/dashboard");
  14  | 
  15  |     const nav = page.getByRole("navigation", { name: "Module navigation" });
  16  |     await expect(nav).toBeVisible();
  17  | 
  18  |     for (const caption of [
  19  |       "OVERVIEW",
  20  |       "PEOPLE & HR",
  21  |       "SALES & MERCHANDISING",
  22  |       "MANUFACTURING",
  23  |       "FINANCE & ACCOUNTS",
  24  |       "GOVERNANCE & PLATFORM",
  25  |     ]) {
  26  |       await expect(nav.getByText(caption, { exact: true })).toBeVisible();
  27  |     }
  28  |   });
  29  | 
  30  |   // The sidebar's own filter box was removed — module search is the ⌘K
  31  |   // command palette, covered under "Command palette" below.
  32  | 
  33  |   test("expanding a module reveals its submodules and navigates", async ({
  34  |     page,
  35  |   }) => {
  36  |     await page.goto("/dashboard");
  37  | 
  38  |     const nav = page.getByRole("navigation", { name: "Module navigation" });
  39  |     await nav
  40  |       .getByRole("button", { name: /Expand Sales Orders submodules/ })
> 41  |       .click();
      |        ^ Error: locator.click: Test timeout of 45000ms exceeded.
  42  | 
  43  |     const orderBook = nav.getByRole("link", { name: "Order Book", exact: true });
  44  |     await expect(orderBook).toBeVisible();
  45  |     await orderBook.click();
  46  | 
  47  |     await expect(page).toHaveURL(/\/m\/sales-order\/order-book$/);
  48  |     await expect(
  49  |       page.getByRole("heading", { name: "Order Book", level: 1 }),
  50  |     ).toBeVisible();
  51  |   });
  52  | 
  53  |   test("module directory lists all 75 modules", async ({ page }) => {
  54  |     await page.goto("/modules");
  55  | 
  56  |     await expect(
  57  |       page.getByRole("heading", { name: "All Modules", level: 1 }),
  58  |     ).toBeVisible();
  59  |     await expect(page.getByText(/75 core modules · 1,?500 workspaces/)).toBeVisible();
  60  |   });
  61  | 
  62  |   test("breadcrumbs walk back up the hierarchy", async ({ page }) => {
  63  |     await page.goto("/m/qms/capa");
  64  | 
  65  |     const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  66  |     await expect(crumbs).toBeVisible();
  67  |     await crumbs.getByRole("link", { name: "QMS" }).click();
  68  | 
  69  |     await expect(page).toHaveURL(/\/m\/qms$/);
  70  |     await expect(
  71  |       page.getByRole("heading", {
  72  |         name: "Quality Management System (QMS)",
  73  |         level: 1,
  74  |       }),
  75  |     ).toBeVisible();
  76  |   });
  77  | 
  78  |   test("unknown module slug renders the not-found page", async ({ page }) => {
  79  |     const response = await page.goto("/m/this-module-does-not-exist");
  80  |     expect(response?.status()).toBe(404);
  81  |     await expect(
  82  |       page.getByRole("heading", { name: "Workspace not found" }),
  83  |     ).toBeVisible();
  84  |   });
  85  | 
  86  |   test("unknown submodule slug renders the not-found page", async ({ page }) => {
  87  |     const response = await page.goto("/m/qms/not-a-real-workspace");
  88  |     expect(response?.status()).toBe(404);
  89  |     await expect(
  90  |       page.getByRole("heading", { name: "Workspace not found" }),
  91  |     ).toBeVisible();
  92  |   });
  93  | 
  94  |   test("skip link is reachable and targets main content", async ({ page }) => {
  95  |     await page.goto("/dashboard");
  96  |     await page.keyboard.press("Tab");
  97  | 
  98  |     const skip = page.getByRole("link", { name: "Skip to main content" });
  99  |     await expect(skip).toBeFocused();
  100 |     await expect(skip).toHaveAttribute("href", "#main-content");
  101 |   });
  102 | });
  103 | 
  104 | test.describe("Command palette", () => {
  105 |   test("opens with the keyboard and navigates to a workspace", async ({
  106 |     page,
  107 |   }) => {
  108 |     await page.goto("/dashboard");
  109 |     await page.keyboard.press("ControlOrMeta+k");
  110 | 
  111 |     const dialog = page.getByRole("dialog", {
  112 |       name: "Search modules and workspaces",
  113 |     });
  114 |     await expect(dialog).toBeVisible();
  115 | 
  116 |     await dialog.getByRole("textbox", { name: "Search" }).fill("shop floor");
  117 |     await page.keyboard.press("Enter");
  118 | 
  119 |     await expect(page).toHaveURL(/\/m\/mes\/shop-floor$/);
  120 |   });
  121 | 
  122 |   test("closes on Escape", async ({ page }) => {
  123 |     await page.goto("/dashboard");
  124 |     await page.keyboard.press("ControlOrMeta+k");
  125 | 
  126 |     const dialog = page.getByRole("dialog", {
  127 |       name: "Search modules and workspaces",
  128 |     });
  129 |     await expect(dialog).toBeVisible();
  130 | 
  131 |     await page.keyboard.press("Escape");
  132 |     await expect(dialog).toBeHidden();
  133 |   });
  134 | 
  135 |   test("reports no matches without crashing", async ({ page }) => {
  136 |     await page.goto("/dashboard");
  137 |     await page.keyboard.press("ControlOrMeta+k");
  138 | 
  139 |     const dialog = page.getByRole("dialog", {
  140 |       name: "Search modules and workspaces",
  141 |     });
```