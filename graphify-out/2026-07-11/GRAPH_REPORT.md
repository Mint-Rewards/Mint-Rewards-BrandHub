# Graph Report - .  (2026-07-03)

## Corpus Check
- Large corpus: 143 files · ~797,497 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 856 nodes · 1445 edges · 63 communities (57 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Brand Admin Routing & Campaign Forms|Brand Admin Routing & Campaign Forms]]
- [[_COMMUNITY_Brand API Actions & Analytics Types|Brand API Actions & Analytics Types]]
- [[_COMMUNITY_npm Dependencies|npm Dependencies]]
- [[_COMMUNITY_graphify Export & Watch Commands|graphify Export & Watch Commands]]
- [[_COMMUNITY_Dashboard Feature Docs|Dashboard Feature Docs]]
- [[_COMMUNITY_Site Header & UI SheetSeparator|Site Header & UI Sheet/Separator]]
- [[_COMMUNITY_Campaigns Tab Component|Campaigns Tab Component]]
- [[_COMMUNITY_npm devDependencies|npm devDependencies]]
- [[_COMMUNITY_Toast Component|Toast Component]]
- [[_COMMUNITY_Overview Tab Analytics|Overview Tab Analytics]]
- [[_COMMUNITY_TS App Config|TS App Config]]
- [[_COMMUNITY_Avatar & Checkbox UI|Avatar & Checkbox UI]]
- [[_COMMUNITY_Button & Calendar UI|Button & Calendar UI]]
- [[_COMMUNITY_shadcn Components Config|shadcn Components Config]]
- [[_COMMUNITY_TS Node Config|TS Node Config]]
- [[_COMMUNITY_Campaign Form Screenshot & Fields|Campaign Form Screenshot & Fields]]
- [[_COMMUNITY_Users Dashboard Screenshot|Users Dashboard Screenshot]]
- [[_COMMUNITY_Rewards Impact Dashboard Screenshot|Rewards Impact Dashboard Screenshot]]
- [[_COMMUNITY_Carousel UI Component|Carousel UI Component]]
- [[_COMMUNITY_Root TS Config|Root TS Config]]
- [[_COMMUNITY_Users Impact Dashboard Screenshot|Users Impact Dashboard Screenshot]]
- [[_COMMUNITY_Menubar UI Component|Menubar UI Component]]
- [[_COMMUNITY_Future Projections Dashboard Screenshot|Future Projections Dashboard Screenshot]]
- [[_COMMUNITY_Settings Tab & Brand Profile|Settings Tab & Brand Profile]]
- [[_COMMUNITY_Deals Empty State Screenshot|Deals Empty State Screenshot]]
- [[_COMMUNITY_RalphLoop PowerShell Script|RalphLoop PowerShell Script]]
- [[_COMMUNITY_Context Menu UI Component|Context Menu UI Component]]
- [[_COMMUNITY_Campaigns & Discounts Performance Screenshot|Campaigns & Discounts Performance Screenshot]]
- [[_COMMUNITY_Company Impact Dashboard Screenshot|Company Impact Dashboard Screenshot]]
- [[_COMMUNITY_Spec Queue Shell Script|Spec Queue Shell Script]]
- [[_COMMUNITY_Table UI Component|Table UI Component]]
- [[_COMMUNITY_Sector Performance Screenshot|Sector Performance Screenshot]]
- [[_COMMUNITY_Breadcrumb UI Component|Breadcrumb UI Component]]
- [[_COMMUNITY_Drawer UI Component|Drawer UI Component]]
- [[_COMMUNITY_Navigation Menu UI Component|Navigation Menu UI Component]]
- [[_COMMUNITY_Campaigns Tab Screenshot|Campaigns Tab Screenshot]]
- [[_COMMUNITY_Toggle Group UI Component|Toggle Group UI Component]]
- [[_COMMUNITY_Deals Form Screenshot & Fields|Deals Form Screenshot & Fields]]
- [[_COMMUNITY_Input OTP UI Component|Input OTP UI Component]]
- [[_COMMUNITY_Ralph Loop Bash Script|Ralph Loop Bash Script]]
- [[_COMMUNITY_Ralph Loop Codex Script|Ralph Loop Codex Script]]
- [[_COMMUNITY_Ralph Loop Gemini Script|Ralph Loop Gemini Script]]
- [[_COMMUNITY_Alert UI Component|Alert UI Component]]
- [[_COMMUNITY_Sonner Toaster|Sonner Toaster]]
- [[_COMMUNITY_Accordion UI Component|Accordion UI Component]]
- [[_COMMUNITY_graphify Repo Merge Commands|graphify Repo Merge Commands]]
- [[_COMMUNITY_Mint Rewards Brand Logo|Mint Rewards Brand Logo]]
- [[_COMMUNITY_App Shell Entry|App Shell Entry]]
- [[_COMMUNITY_Vercel Config|Vercel Config]]
- [[_COMMUNITY_Placeholder Image Asset|Placeholder Image Asset]]
- [[_COMMUNITY_robots.txt|robots.txt]]
- [[_COMMUNITY_Empty README|Empty README]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 71 edges
2. `compilerOptions` - 20 edges
3. `Button` - 19 edges
4. `useToast()` - 18 edges
5. `getApiBaseUrl()` - 16 edges
6. `Design System: MintRewards BrandHub` - 16 edges
7. `Card` - 14 edges
8. `compilerOptions` - 14 edges
9. `CardHeader` - 13 edges
10. `CardTitle` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Brand Hub UI Audit` --semantically_similar_to--> `Critique: BrandDashboard.tsx (2026-06-20)`  [INFERRED] [semantically similar]
  UI_AUDIT.md → .impeccable/critique/2026-06-20T10-48-58Z__src-pages-branddashboard-tsx.md
- `Brand Hub UI Audit` --semantically_similar_to--> `Critique: Index.tsx (2026-06-26)`  [INFERRED] [semantically similar]
  UI_AUDIT.md → .impeccable/critique/2026-06-26T13-53-39Z__src-pages-index-tsx.md
- `The Context Requirement (No Bare KPIs)` --semantically_similar_to--> `Data Earns Trust Principle`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `Decorative Card Mockup (Empty Rectangles)` --conceptually_related_to--> `Design System: MintRewards BrandHub`  [INFERRED]
  .impeccable/critique/2026-06-26T13-53-39Z__src-pages-index-tsx.md → DESIGN.md
- `CLAUDE.md — Graphify Instructions` --conceptually_related_to--> `AGENTS.md (Ralph Loop Agent Instructions)`  [AMBIGUOUS]
  CLAUDE.md → .specify/memory/AGENTS.md

## Import Cycles
- 1-file cycle: `src/components/ui/sonner.tsx -> src/components/ui/sonner.tsx`
- 1-file cycle: `src/components/ui/input-otp.tsx -> src/components/ui/input-otp.tsx`

## Hyperedges (group relationships)
- **Default /graphify build pipeline (Steps 2-9)** — claude_skills_graphify_skill_step2_detect_files, claude_skills_graphify_skill_step3_extraction, claude_skills_graphify_skill_step4_build_graph, claude_skills_graphify_skill_step5_label_communities, claude_skills_graphify_skill_step6_obsidian_html, claude_skills_graphify_skill_step9_manifest_cost_cleanup [EXTRACTED 1.00]
- **Optional export flags (only run on their flag)** — claude_skills_graphify_references_exports_wiki_export, claude_skills_graphify_references_exports_neo4j_export, claude_skills_graphify_references_exports_falkordb_export, claude_skills_graphify_references_exports_svg_export, claude_skills_graphify_references_exports_graphml_export, claude_skills_graphify_references_exports_mcp_server [EXTRACTED 1.00]
- **Graph query interface (query/path/explain + feedback loop)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result, claude_skills_graphify_references_query_reflect_lessons [EXTRACTED 1.00]
- **Shared AI-Slop Anti-Pattern Taxonomy** — hero_metric_kpi_ban, identical_card_grid_antipattern, nested_cards_ban, decorative_card_mockup [INFERRED 0.85]
- **Design Governance Document Set** — design, product, ui_audit [INFERRED 0.80]
- **Ralph Loop Autonomous Workflow Documents** — specify_memory_constitution, specify_memory_agents, prompt_build, prompt_plan [EXTRACTED 1.00]

## Communities (63 total, 6 thin omitted)

### Community 0 - "Brand Admin Routing & Campaign Forms"
Cohesion: 0.06
Nodes (67): App(), queryClient, AdminProtectedRoute(), CampaignFormData, campaignSchema, CreateDealForm(), CreateDealFormProps, DealFormData (+59 more)

### Community 1 - "Brand API Actions & Analytics Types"
Cohesion: 0.06
Nodes (53): BrandAnalytics, CampaignSummary, createCampaign(), createDeal(), deleteCampaign(), deleteDeal(), fetchAllCampaigns(), fetchAllDeals() (+45 more)

### Community 2 - "npm Dependencies"
Cohesion: 0.04
Nodes (51): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers, lucide-react (+43 more)

### Community 3 - "graphify Export & Watch Commands"
Cohesion: 0.05
Nodes (48): graphify /graphify trigger (root CLAUDE.md), /graphify add <url>, --watch (background folder watcher), Step 7a - FalkorDB export (--falkordb/--falkordb-push), Step 7c - GraphML export (--graphml), Step 7d - MCP server (--mcp), Step 7 - Neo4j export (--neo4j/--neo4j-push), Step 7b - SVG export (--svg) (+40 more)

### Community 4 - "Dashboard Feature Docs"
Cohesion: 0.06
Nodes (47): CLAUDE.md — Graphify Instructions, Dashboard Overview Document, Campaign & Deal Management Module, Future Projections Feature, Impact Analytics Feature, Privacy & Security Features, Rewards Performance Feature, Sector Performance Feature (+39 more)

### Community 5 - "Site Header & UI Sheet/Separator"
Cohesion: 0.05
Nodes (38): SiteHeaderProps, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+30 more)

### Community 6 - "Campaigns Tab Component"
Cohesion: 0.06
Nodes (34): STATUS_CONFIG, CreateCampaignForm(), getContrastingTextColor(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter() (+26 more)

### Community 7 - "npm devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, lovable-tagger (+20 more)

### Community 8 - "Toast Component"
Cohesion: 0.11
Nodes (23): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+15 more)

### Community 9 - "Overview Tab Analytics"
Cohesion: 0.11
Nodes (16): AnalyticsDashboard(), CO2_SAVINGS_PER_KG, EQUIVALENT_CONVERSIONS, hex(), mockAnalyticsData, ChartConfig, ChartContainer, ChartContext (+8 more)

### Community 10 - "TS App Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, ignoreDeprecations, isolatedModules, jsx, lib, module (+14 more)

### Community 11 - "Avatar & Checkbox UI"
Cohesion: 0.10
Nodes (11): Avatar, AvatarFallback, AvatarImage, Checkbox, HoverCardContent, RadioGroup, RadioGroupItem, ScrollArea (+3 more)

### Community 12 - "Button & Calendar UI"
Cohesion: 0.16
Nodes (16): ButtonProps, buttonVariants, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+8 more)

### Community 13 - "shadcn Components Config"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 14 - "TS Node Config"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 15 - "Campaign Form Screenshot & Fields"
Cohesion: 0.22
Nodes (14): Campaign Data Entity (title, type, description, budget, start/end date, target audience), Campaigns Form Screenshot (Create New Campaign Modal), Brand Dashboard Nav Tabs (Overview, Campaigns, Deals, Settings), Budget ($) Input Field, Campaign Management Page, Campaign Title Input Field, Campaign Type Dropdown (General), Create Campaign Button (Header + Modal Submit) (+6 more)

### Community 16 - "Users Dashboard Screenshot"
Cohesion: 0.16
Nodes (14): User Engagement Metric (Collection, Waste/User, MAU, New Users), User Performance Tier (Platinum/Gold/Silver/Bronze/Starter), Dashboard - Users Screenshot, Analytics Sub-tabs (Impact, Rewards, Users, Brands, Sector Performance), Brand Approved Welcome Banner, Brand Dashboard Header (Dummy Brand), Main Nav Tabs (Overview, Campaigns, Deals, Settings), Stat Summary Row (Wastage, CO2, Recycled, Registered, Active) (+6 more)

### Community 17 - "Rewards Impact Dashboard Screenshot"
Cohesion: 0.18
Nodes (14): Brand Dashboard - Rewards Impact (Overview screen), Active Campaigns stat (0, +1 from last month), Analytics sub-tabs (Impact, Rewards, Users, Brands, Sector Performance), Welcome/approval banner (brand approved, dashboard active), Eco Users Reached stat (3.2K, +15% from last month), Growth Rate stat (+24%, +4% from last month), Impact metric cards (Total Wastage Collected 15.6K kg, CO2 Emissions Saved 8.4 tons, Waste Recycled 14.9K kg, Users Registered 12.8K, Active Users 3.2K), Points Earned vs Redeemed bar chart (Redemption Rate 72%) (+6 more)

### Community 18 - "Carousel UI Component"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 19 - "Root TS Config"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, baseUrl, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck (+4 more)

### Community 20 - "Users Impact Dashboard Screenshot"
Cohesion: 0.21
Nodes (12): Dashboard - Users Impact (Screenshot), Sustainability Analytics Dashboard, User Community Impact Summary Panel, Environmental Equivalents Panel, Impact Company / Impact Users Toggle, Analytics Sub-tabs (Impact, Rewards, Users, Brands, Sector Performance), Metric Summary Row (Wastage, CO2, Recycled, Users, Active Users), Brand Dashboard Overview Tab (+4 more)

### Community 21 - "Menubar UI Component"
Cohesion: 0.17
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 22 - "Future Projections Dashboard Screenshot"
Cohesion: 0.27
Nodes (11): Dashboard - Overview Screenshot (inferred prior tab), Dashboard - Future Projections Screenshot, 3-Month Forecast (December 2025), 6-Month Forecast (March 2026), Current Month Statistics (September 2025 baseline metrics), Growth Opportunities Panel, Key Performance Indicators Panel, Metric Tabs (Impact, Rewards, Users, Brands, Sector, Projections) (+3 more)

### Community 23 - "Settings Tab & Brand Profile"
Cohesion: 0.24
Nodes (10): Brand Approval Welcome Banner (Active status), Campaigns Tab, Deals Tab, Overview Tab, Settings Tab, Brand Profile Fields (Name, Category, Contact Email, Contact Phone), Brand Settings Panel, Edit Profile Button (+2 more)

### Community 24 - "Deals Empty State Screenshot"
Cohesion: 0.24
Nodes (10): Active Status Badge, Brand Approved Welcome Banner, Brand Dashboard Header, Create Deal Button, Deals & Discounts Section, Deals Empty State Screenshot, Deals Tab, Exit Dashboard Button (+2 more)

### Community 25 - "RalphLoop PowerShell Script"
Cohesion: 0.36
Nodes (8): Invoke-RalphLoop(), Resolve-RalphMode(), Test-YoloEnabled(), Write-RalphPromptFiles(), Get-IncompleteRootSpecs(), Get-RootSpecs(), Get-SpecQueueSummary(), Test-RootSpecComplete()

### Community 26 - "Context Menu UI Component"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 27 - "Campaigns & Discounts Performance Screenshot"
Cohesion: 0.28
Nodes (9): Brand Approval / Active Status Banner, Analytics Tabs: Impact / Rewards / Users / Brands / Sector Performance, Brand Dashboard Overview Tab, Campaign Performance List (Summer Eco Sale, Green Friday Deals, Sustainability Rewards), Dashboard - Campaigns and Discounts Performance (Screenshot), Statistics Period: September 2025, Sustainability Analytics Dashboard Section, Sustainability Metrics & Recent Activity Summary Cards (+1 more)

### Community 28 - "Company Impact Dashboard Screenshot"
Cohesion: 0.28
Nodes (9): Dashboard - Company Impact Screenshot, Sustainability Analytics Dashboard (Sept 2025 stats: waste, CO2, recycled, users), Company CO2 Savings Breakdown List (by material, kg CO2 saved), Distribution by Percentage Donut Chart, Impact Sub-Navigation Tabs (Impact, Rewards, Users, Brands, Sector, Projections), Brand Dashboard Overview Tab, Sustainability Metrics Summary Cards (Active Campaigns, Eco Users Reached, Reward Redemptions, Growth Rate), Weight by Material Bar Chart (kg) (+1 more)

### Community 29 - "Spec Queue Shell Script"
Cohesion: 0.36
Nodes (8): count_incomplete_root_specs(), count_root_specs(), get_first_incomplete_root_spec(), get_incomplete_root_specs(), get_root_specs(), is_root_spec_complete(), _is_spec_complete(), spec_queue.sh script

### Community 30 - "Table UI Component"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 31 - "Sector Performance Screenshot"
Cohesion: 0.32
Nodes (8): Brand Dashboard - Overview Tab, Performance Highlights (Waste, CO2, Users, Recycling), Performance Summary (Strengths & Opportunities), Your Performance vs Category (progress bar comparison), Sector Performance Overview (Brand vs Technology Category Average), Sustainability Analytics Dashboard, Sustainability Metrics & Recent Activity summary cards, Dashboard - Sector Performance: Brand vs Category Average

### Community 32 - "Breadcrumb UI Component"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 33 - "Drawer UI Component"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 34 - "Navigation Menu UI Component"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 35 - "Campaigns Tab Screenshot"
Cohesion: 0.38
Nodes (7): Brand Approved Welcome Banner, Brand Dashboard Header (Dummy Brand, Active status, Exit Dashboard), Campaign Management Panel, Campaigns Tab Screen (Brand Dashboard), Create Campaign Button, Dashboard Navigation Tabs (Overview, Campaigns, Deals, Settings), Empty State: No Campaigns Yet

### Community 36 - "Toggle Group UI Component"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 37 - "Deals Form Screenshot & Fields"
Cohesion: 0.40
Nodes (6): Brand Dashboard Navigation (Overview / Campaigns / Deals / Settings), Deal Data Model (title, promoCode, description, discountPercentage, discountAmount, startDate, endDate, maxUses, minPurchase), Campaign Form Screenshot (related prior chunk), Deals Form Screenshot (Create New Deal Modal), Create New Deal Modal, Deals & Discounts Page (background)

### Community 38 - "Input OTP UI Component"
Cohesion: 0.40
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 39 - "Ralph Loop Bash Script"
Cohesion: 0.70
Nodes (4): print_latest_output(), ralph-loop.sh script, show_help(), watch_latest_output()

### Community 40 - "Ralph Loop Codex Script"
Cohesion: 0.70
Nodes (4): print_latest_output(), ralph-loop-codex.sh script, show_help(), watch_latest_output()

### Community 41 - "Ralph Loop Gemini Script"
Cohesion: 0.70
Nodes (4): print_latest_output(), ralph-loop-gemini.sh script, show_help(), watch_latest_output()

### Community 42 - "Alert UI Component"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 43 - "Sonner Toaster"
Cohesion: 0.67
Nodes (3): sonner, Toaster(), ToasterProps

### Community 44 - "Accordion UI Component"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 45 - "graphify Repo Merge Commands"
Cohesion: 0.67
Nodes (3): graphify clone <github-url>, graphify merge-graphs (cross-repo), Multiple local subfolders merge (monorepo)

## Ambiguous Edges - Review These
- `AGENTS.md (Ralph Loop Agent Instructions)` → `CLAUDE.md — Graphify Instructions`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `Dashboard - Future Projections Screenshot` → `Dashboard - Overview Screenshot (inferred prior tab)`  [AMBIGUOUS]
  screenshots/07 - Dashboard - Future Projections.png · relation: conceptually_related_to

## Knowledge Gaps
- **389 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `AGENTS.md (Ralph Loop Agent Instructions)` and `CLAUDE.md — Graphify Instructions`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Dashboard - Future Projections Screenshot` and `Dashboard - Overview Screenshot (inferred prior tab)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `Button & Calendar UI` to `Brand Admin Routing & Campaign Forms`, `Breadcrumb UI Component`, `Drawer UI Component`, `Navigation Menu UI Component`, `Toggle Group UI Component`, `Site Header & UI Sheet/Separator`, `Campaigns Tab Component`, `Input OTP UI Component`, `Toast Component`, `Overview Tab Analytics`, `Alert UI Component`, `Avatar & Checkbox UI`, `Accordion UI Component`, `Carousel UI Component`, `Menubar UI Component`, `Context Menu UI Component`, `Table UI Component`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `dependencies` connect `npm Dependencies` to `Sonner Toaster`, `Input OTP UI Component`, `npm devDependencies`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `input-otp` connect `Input OTP UI Component` to `npm Dependencies`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _400 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Brand Admin Routing & Campaign Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.06059405940594059 - nodes in this community are weakly interconnected._