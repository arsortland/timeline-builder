// Created: 2026-03-30
// Updated: 2026-03-30
// Version: v1.3 - Added idPowerToys (CA Documenter + Entra Mind Map) as tool #15
// Description: Tool definitions for the Toolbox page
// Purpose: Provides an array of tools used by the Entra / Microsoft cloud team,
//          each with name, sourceType, description, tags, detailed description, and links.
//          v1.1: Added quickGuide and bestFor fields to all tools
//          v1.2: Added sourceType (microsoft/opensource/personal) to all tools

import { Tool } from "./types";

export const tools: Tool[] = [
  {
    id: "roadtools",
    name: "ROADtools",
    sourceType: "opensource",
    description:
      "Framework for interacting with Azure AD (Entra ID) using the ROADrecon and ROADlib modules. Great for auditing and mapping tenant configurations.",
    tags: ["Entra ID", "Audit", "Reconnaissance", "Python"],
    detailedDescription:
      "ROADtools is an open-source framework for Azure AD reconnaissance. It consists of ROADrecon (data gathering) and ROADlib (interaction library). Use it to enumerate users, groups, applications, service principals, and policies in an Entra ID tenant. The gathered data is stored in a local database for offline analysis and can be visualised via an interactive web front-end.",
    quickGuide:
      "Install via pip: pip install roadrecon. Authenticate with roadrecon auth, then gather data with roadrecon gather. Launch the interactive UI with roadrecon gui to explore the collected tenant data in your browser.",
    bestFor: [
      "Mapping all identities and relationships in an Entra ID tenant",
      "Auditing application registrations and service principals",
      "Offline analysis of tenant configuration during security assessments",
      "Visualising complex tenant structures for stakeholder presentations",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/dirkjanm/ROADtools" },
      {
        label: "Documentation",
        url: "https://dirkjanm.io/introducing-roadtools-and-roadrecon-azure-ad-exploration-framework/",
      },
    ],
  },
  {
    id: "bloodhound",
    name: "BloodHound",
    sourceType: "opensource",
    description:
      "Graph-based identity attack path analysis tool for Active Directory and Azure AD environments.",
    tags: ["Entra ID", "Active Directory", "Attack Paths", "Security"],
    detailedDescription:
      "BloodHound maps relationships and permissions across Active Directory and Entra ID to identify unintended attack paths. The Community Edition provides a modern web UI backed by Neo4j. Ingest data with SharpHound (AD) or AzureHound (Entra ID), then query the graph to find privilege escalation routes, over-permissioned principals, and Tier Zero assets.",
    quickGuide:
      "Deploy BloodHound CE with docker compose up. Run SharpHound.exe or AzureHound to collect data, then upload the JSON/ZIP output via the BloodHound UI. Use built-in queries like 'Shortest Path to Domain Admins' or write custom Cypher queries to explore attack paths.",
    bestFor: [
      "Identifying privilege escalation paths before attackers do",
      "Visualising complex AD/Entra ID trust relationships",
      "Prioritising remediation of Tier Zero attack paths",
      "Red-team and purple-team exercises in hybrid environments",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/BloodHoundAD/BloodHound" },
      {
        label: "BloodHound CE Docs",
        url: "https://support.bloodhoundenterprise.io/",
      },
    ],
  },
  {
    id: "maester",
    name: "Maester",
    sourceType: "opensource",
    description:
      "PowerShell-based Entra ID security configuration analyser that runs tests against best-practice benchmarks.",
    tags: ["Entra ID", "Security", "Compliance", "PowerShell"],
    detailedDescription:
      "Maester is an open-source PowerShell module that evaluates your Entra ID tenant against a comprehensive set of security best-practice tests. It checks conditional access policies, authentication methods, privileged roles, application registrations, and more. Results are presented in a clear HTML report you can share with stakeholders.",
    quickGuide:
      "Install with Install-Module Maester. Connect to your tenant with Connect-Maester, then run Invoke-Maester to execute all tests. The HTML report is generated automatically. Schedule it in a pipeline for continuous compliance monitoring.",
    bestFor: [
      "Continuous compliance monitoring of Entra ID configuration",
      "Generating security posture reports for management",
      "Validating conditional access policies against best practices",
      "Integrating tenant health checks into CI/CD pipelines",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/maester365/maester" },
      { label: "Website", url: "https://maester.dev/" },
    ],
  },
  {
    id: "graph-explorer",
    name: "Graph Explorer",
    sourceType: "microsoft",
    description:
      "Interactive web tool for building, testing, and learning Microsoft Graph API queries.",
    tags: ["Microsoft Graph", "API", "Testing", "Web Tool"],
    detailedDescription:
      "Graph Explorer is Microsoft's official interactive sandbox for the Microsoft Graph API. Sign in with your work or personal account to run GET, POST, PATCH, and DELETE requests against live data. It features IntelliSense-style auto-complete, request history, code snippets in multiple languages, and adaptive cards for visualising responses.",
    quickGuide:
      "Open Graph Explorer in your browser and sign in with your work account. Select a sample query or type your own (e.g. GET /me). Review the response JSON and use the 'Code snippets' tab to copy SDK code in C#, JavaScript, Java, or Go. Use the 'Modify permissions' tab to consent to additional scopes.",
    bestFor: [
      "Rapidly prototyping and testing Graph API queries",
      "Learning the Microsoft Graph data model interactively",
      "Generating SDK code snippets for automation scripts",
      "Troubleshooting permission and scope issues with Graph calls",
    ],
    links: [
      {
        label: "Open Graph Explorer",
        url: "https://developer.microsoft.com/en-us/graph/graph-explorer",
      },
      {
        label: "Graph API Docs",
        url: "https://learn.microsoft.com/en-us/graph/overview",
      },
    ],
  },
  {
    id: "azurehound",
    name: "AzureHound",
    sourceType: "opensource",
    description:
      "Data collector for BloodHound that enumerates Azure and Entra ID objects and relationships.",
    tags: ["Entra ID", "Azure", "Attack Paths", "Go"],
    detailedDescription:
      "AzureHound is the Azure/Entra ID data collector companion for BloodHound. Written in Go, it authenticates to Microsoft Graph and Azure Resource Manager to enumerate users, groups, applications, roles, subscriptions, VMs, and more. The output is ingested into BloodHound for graph-based analysis of Azure attack paths and privilege escalation opportunities.",
    quickGuide:
      "Download the latest binary from GitHub releases. Authenticate using azurehound start -u user@tenant.com or with a service principal. The output JSON is uploaded directly into the BloodHound CE UI for graph analysis.",
    bestFor: [
      "Collecting Entra ID and Azure resource data for BloodHound analysis",
      "Auditing Azure RBAC assignments and subscription-level permissions",
      "Identifying cross-resource attack paths in Azure environments",
      "Security assessments spanning both Entra ID and Azure resources",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/BloodHoundAD/AzureHound" },
    ],
  },
  {
    id: "scubagear",
    name: "ScubaGear",
    sourceType: "opensource",
    description:
      "CISA's tool for assessing M365 tenants against Secure Cloud Business Applications (SCuBA) baselines.",
    tags: ["Microsoft 365", "Security", "Compliance", "PowerShell"],
    detailedDescription:
      "ScubaGear (Secure Cloud Business Applications Gear) is developed by CISA to evaluate Microsoft 365 configurations against SCuBA security baselines. It assesses Exchange Online, SharePoint, OneDrive, Teams, Power Platform, and Entra ID settings, generating an HTML report that highlights deviations from recommended security configurations.",
    quickGuide:
      "Install with Install-Module ScubaGear. Run Invoke-SCuBA to assess all M365 workloads, or pass -ProductNames to target specific services. The HTML report is saved to the current directory and shows pass/fail/warning per control.",
    bestFor: [
      "Assessing Microsoft 365 configuration against CISA baselines",
      "Generating compliance evidence for auditors and regulators",
      "Identifying security gaps in Exchange, SharePoint, and Teams",
      "Establishing a security baseline for new M365 tenant deployments",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/cisagov/ScubaGear" },
      { label: "CISA SCuBA", url: "https://www.cisa.gov/scuba" },
    ],
  },
  {
    id: "monkey365",
    name: "Monkey365",
    sourceType: "opensource",
    description:
      "PowerShell module for auditing Microsoft 365, Azure, and Entra ID security configurations.",
    tags: ["Azure", "Microsoft 365", "Entra ID", "Audit", "PowerShell"],
    detailedDescription:
      "Monkey365 is a PowerShell-based security auditing tool that reviews configurations across Azure subscriptions, Entra ID tenants, and Microsoft 365 services. It checks against CIS benchmarks and other compliance frameworks, producing detailed HTML and JSON reports covering identity, networking, storage, compute, and M365 service settings.",
    quickGuide:
      "Clone the repo and import the module with Import-Module ./monkey365. Authenticate with Connect-MonkeyCloud, then run Invoke-Monkey365 targeting your subscription or M365 tenant. Reports are generated in HTML and JSON formats in an output directory.",
    bestFor: [
      "CIS benchmark compliance checks across Azure and M365",
      "Comprehensive multi-cloud security audits in a single tool",
      "Generating detailed compliance reports for governance teams",
      "Identifying misconfigurations in networking, storage, and compute",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/silverhack/monkey365" },
    ],
  },
  {
    id: "entra-admin-center",
    name: "Entra Admin Center",
    sourceType: "microsoft",
    description:
      "Microsoft's portal for managing Entra ID identities, access policies, and governance.",
    tags: ["Entra ID", "Portal", "Administration", "Microsoft"],
    detailedDescription:
      "The Microsoft Entra Admin Center is the primary management portal for Entra ID (formerly Azure AD). Use it to manage users, groups, enterprise applications, app registrations, conditional access policies, authentication methods, Privileged Identity Management (PIM), identity governance, and cross-tenant access settings.",
    quickGuide:
      "Navigate to entra.microsoft.com and sign in with your admin account. Use the left navigation to access Identity > Users, Applications, Protection (Conditional Access), or Identity Governance. Pin frequently used blades for quick access.",
    bestFor: [
      "Day-to-day Entra ID administration and user management",
      "Configuring and monitoring conditional access policies",
      "Managing Privileged Identity Management (PIM) role assignments",
      "Reviewing sign-in and audit logs for troubleshooting",
    ],
    links: [
      { label: "Open Entra Admin Center", url: "https://entra.microsoft.com/" },
      {
        label: "Documentation",
        url: "https://learn.microsoft.com/en-us/entra/",
      },
    ],
  },
  {
    id: "azure-resource-graph",
    name: "Azure Resource Graph Explorer",
    sourceType: "microsoft",
    description:
      "Query engine for exploring and analysing Azure resources at scale using Kusto Query Language.",
    tags: ["Azure", "KQL", "Governance", "Web Tool", "Microsoft Graph"],
    detailedDescription:
      "Azure Resource Graph Explorer lets you write Kusto Query Language (KQL) queries to search, filter, and aggregate Azure resource data across multiple subscriptions instantly. It is invaluable for inventory, compliance checks, cost analysis, and troubleshooting. Results can be pinned to dashboards or exported to CSV.",
    quickGuide:
      "Open the Azure portal and search for 'Resource Graph Explorer'. Write a KQL query such as 'Resources | where type == microsoft.compute/virtualmachines | project name, location, resourceGroup'. Run the query and export results to CSV or pin charts to an Azure Dashboard.",
    bestFor: [
      "Querying Azure resources at scale across all subscriptions",
      "Building inventory reports and compliance dashboards",
      "Troubleshooting resource configuration issues with KQL",
      "Cost analysis by aggregating resources by type, location, or tag",
    ],
    links: [
      {
        label: "Open Resource Graph Explorer",
        url: "https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade",
      },
      {
        label: "Documentation",
        url: "https://learn.microsoft.com/en-us/azure/governance/resource-graph/",
      },
    ],
  },
  {
    id: "aadinternals",
    name: "AADInternals",
    sourceType: "opensource",
    description:
      "Comprehensive PowerShell toolkit for Azure AD and Microsoft 365 administration and security research.",
    tags: ["Entra ID", "Microsoft 365", "Security", "PowerShell"],
    detailedDescription:
      "AADInternals is a PowerShell module originally created by Dr Nestori Syynimaa for researching Azure AD internals. It provides functions for managing users, tokens, federation settings, Pass-through Authentication, Seamless SSO, and more. It is widely used in red-team assessments and security research to understand and test Entra ID features that are not exposed through official tools.",
    quickGuide:
      "Install with Install-Module AADInternals. Import the module and use Get-AADIntAccessTokenForMSGraph to obtain a token. Explore functions with Get-Command -Module AADInternals. Use caution — some functions make changes to tenant configuration.",
    bestFor: [
      "Security research into Entra ID authentication mechanisms",
      "Red-team testing of federation, PTA, and SSO configurations",
      "Investigating undocumented Entra ID APIs and behaviours",
      "Advanced token manipulation and tenant reconnaissance",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Gerenios/AADInternals" },
      { label: "Documentation", url: "https://aadinternals.com/" },
    ],
  },
  {
    id: "zero-trust-assessment",
    name: "Zero Trust Assessment",
    sourceType: "microsoft",
    description:
      "Microsoft's open-source PowerShell module that evaluates your tenant configuration against Zero Trust and Secure Future Initiative baselines.",
    tags: ["Entra ID", "Intune", "Security", "Compliance", "PowerShell"],
    detailedDescription:
      "The Zero Trust Assessment is a PowerShell module by Microsoft that automatically tests hundreds of security configuration items in your tenant against Zero Trust pillars and the Secure Future Initiative (SFI). It checks Microsoft Entra, Intune, Exchange Online, SharePoint, and Azure configurations drawing from NIST, CISA, CIS standards and Microsoft's own internal security baselines. Results are presented in an interactive HTML report covering Identity, Devices, Network, and Data — with risk levels and remediation guidance for each finding.",
    quickGuide:
      "Requires PowerShell 7. Install with Install-Module ZeroTrustAssessment -Scope CurrentUser. Connect to all cloud services with Connect-ZtAssessment (first run requires Global Administrator for consent, subsequent runs only need Global Reader + Exchange/SharePoint Admin). Run the assessment with Invoke-ZtAssessment — the HTML report opens automatically in your browser.",
    bestFor: [
      "Establishing a Zero Trust security baseline for your Microsoft tenant",
      "Generating evidence-based security posture reports for leadership and auditors",
      "Identifying gaps in Entra ID, Intune, Exchange, and SharePoint configurations",
      "Tracking remediation progress across Zero Trust pillars over time",
    ],
    links: [
      {
        label: "Get Started",
        url: "https://learn.microsoft.com/en-gb/security/zero-trust/assessment/get-started",
      },
      {
        label: "GitHub",
        url: "https://github.com/microsoft/zerotrustassessment",
      },
      {
        label: "Interactive Demo",
        url: "https://aka.ms/zerotrust/demo",
      },
    ],
  },
  {
    id: "m365-maps",
    name: "M365 Maps",
    sourceType: "personal",
    description:
      "Interactive Microsoft 365 licensing diagrams and feature matrix by Aaron Dinnage, showing what's included in every M365 license.",
    tags: ["Microsoft 365", "Licensing", "Reference", "Comparison"],
    detailedDescription:
      "M365 Maps is the go-to community resource for understanding Microsoft 365 licensing. Created by Aaron Dinnage, it provides detailed visual diagrams for every M365 license (Enterprise, Business, Frontline, Education) and add-ons like EMS, Entra, Intune, Defender, Purview, and Copilot. The interactive feature matrix lets you compare features across all license tiers side-by-side, with clear indicators for included (✔), add-on (+), separate purchase (Δ), and package-only (⊡) features. Additional tools include a tenant storage calculator, product name change tracker, feature maps, and a compare/diff view for diagrams.",
    quickGuide:
      "Visit m365maps.com and select a license family (e.g. Microsoft 365 Enterprise E5) to see its full feature diagram. Use the Feature Matrix to compare features across all license tiers at once — toggle columns on/off to focus on the plans you care about. Use the Compare Diagrams tool to diff two licenses side-by-side. The Downloads page provides PDF/PNG exports for offline reference or presentations.",
    bestFor: [
      "Quickly checking which features are included in a specific M365 license",
      "Comparing license tiers side-by-side to justify upgrades or right-size subscriptions",
      "Preparing licensing overview slides for management or customer presentations",
      "Understanding the full scope of Entra, Intune, Defender, and Purview across license bundles",
    ],
    links: [
      {
        label: "M365 Maps Home",
        url: "https://m365maps.com/",
      },
      {
        label: "Feature Matrix",
        url: "https://m365maps.com/matrix.htm",
      },
      {
        label: "Compare Diagrams",
        url: "https://m365maps.com/compare.htm",
      },
      {
        label: "Downloads",
        url: "https://m365maps.com/downloads.htm",
      },
    ],
  },
  {
    id: "entra-ca-insight",
    name: "Entra CA Insight",
    sourceType: "personal",
    description:
      "Proactively discover gaps in Entra Conditional Access policies before attackers do, by evaluating every possible access combination offline.",
    tags: [
      "Entra ID",
      "Conditional Access",
      "Security",
      "Python",
      "Gap Analysis",
    ],
    detailedDescription:
      "CA Insight is an open-source Python tool by Emilien Socchi that takes an identity-centric approach to Conditional Access gap detection. Instead of reactively scanning sign-in logs (which only shows gaps already exploited), it retrieves your CA policies via the MS Graph API and then generates and evaluates all possible access combinations offline — covering identity type, application, platform, location, client type, and auth flow. A 'gap' is any combination where no policy enforces MFA, Authentication Strength, or Block. It supports all identity types: member users, guests, external users, workload identities, and agent identities. Results are available via a CLI for automation/CI-CD or an interactive web portal with dashboards, scan history, and policy browser.",
    quickGuide:
      "Requires Python and an Entra app registration with read-only Graph API permissions (see the wiki Installation page for the exact permissions list). Clone the repo, install dependencies from requirements.txt, then run a scan via the CLI or start the web portal for interactive exploration. Scans are read-only and never modify policies or settings. Use identity filters and resource scoping to focus on specific users or applications.",
    bestFor: [
      "Proactively finding Conditional Access gaps before they appear in sign-in logs",
      "Validating that all identity types (users, guests, workload identities) are covered by CA policies",
      "Tracking CA coverage trends over time with scan history and comparison",
      "Root-cause analysis of CA misconfigurations using the centralized policy browser",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/emiliensocchi/entra-ca-insight",
      },
      {
        label: "Wiki (Install & Usage)",
        url: "https://github.com/emiliensocchi/entra-ca-insight/wiki",
      },
    ],
  },
  {
    id: "aztier",
    name: "AzTier",
    sourceType: "personal",
    description:
      "Browse Azure, Entra, and MS Graph administrative assets categorized into security tiers based on known attack paths.",
    tags: [
      "Azure",
      "Entra ID",
      "Security",
      "RBAC",
      "Tiering",
      "Reference",
      "Web Tool",
    ],
    detailedDescription:
      "AzTier (Azure Administrative Tiering) is a web-based reference tool by Emilien Socchi that classifies Azure RBAC roles, Entra ID roles, and Microsoft Graph application permissions into security tiers (Tier 0 through Tier 3) based on known attack paths. Tier 0 represents the highest-privilege assets that can lead to full tenant compromise, while higher tiers represent progressively lower risk. The tool helps teams implement administrative tiering models by providing a clear, filterable view of which roles belong to which tier — essential for designing Privileged Access Management strategies, scoping PIM assignments, and reviewing role assignments for excessive privileges.",
    quickGuide:
      "Visit aztier.com and select a category: Azure Roles, Entra Roles, or MS Graph Application Permissions. Use the tier filter buttons (Tier 0–3) to narrow down the list. Each role links directly to Microsoft's official documentation. Use this as a reference when designing tiered admin models, reviewing PIM eligible assignments, or auditing which roles should be considered high-privilege.",
    bestFor: [
      "Designing and implementing administrative tiering models for Azure and Entra",
      "Identifying which RBAC and Entra roles are Tier 0 (highest privilege) during security reviews",
      "Scoping Privileged Identity Management (PIM) policies based on role tier classification",
      "Auditing MS Graph application permissions for excessive privilege in app registrations",
    ],
    links: [
      {
        label: "AzTier",
        url: "https://aztier.com/",
      },
      {
        label: "Azure Roles",
        url: "https://aztier.com/#azure",
      },
      {
        label: "Entra Roles",
        url: "https://aztier.com/#entra",
      },
      {
        label: "MS Graph Permissions",
        url: "https://aztier.com/#msgraph",
      },
    ],
  },
  {
    id: "idpowertoys",
    name: "idPowerToys",
    sourceType: "opensource",
    description:
      "Export Conditional Access policies to PowerPoint and explore Microsoft Entra products through an interactive mind map.",
    tags: [
      "Conditional Access",
      "Documentation",
      "Entra ID",
      "Web Tool",
      "PowerPoint",
      "Visualization",
    ],
    detailedDescription:
      "idPowerToys is a community-built collection of mini-apps for Microsoft Entra created by Merill Fernando (Microsoft employee and well-known identity community contributor). The flagship tool — CA Documenter — lets you export all your Conditional Access policies into a clean PowerPoint presentation, giving you a bird's-eye view of your security posture. It supports both automatic generation (sign in and policies are fetched directly) and manual generation (paste JSON). This makes it invaluable for policy reviews, audit preparation, and sharing CA configurations with security stakeholders who lack admin access. The suite also includes the Microsoft Entra Mind Map, an interactive visual guide that maps out every Microsoft Entra product and capability, useful for understanding the full Entra ecosystem at a glance.",
    quickGuide:
      "Navigate to idpowertoys.merill.net/ca to open CA Documenter. Choose Automatic Generation and sign in with your Entra ID account — your Conditional Access policies will be fetched and exported to a downloadable PowerPoint file. Alternatively, use Manual Generation to paste a JSON export of your policies. For the Entra Mind Map, visit idpowertoys.merill.net/mindmap to explore an interactive visual overview of all Microsoft Entra products and features.",
    bestFor: [
      "Exporting Conditional Access policies to PowerPoint for review or audit documentation",
      "Sharing CA policy configurations with security stakeholders who lack admin access",
      "Quickly generating a visual overview of your tenant's Conditional Access posture",
      "Exploring the full Microsoft Entra product landscape via the interactive mind map",
    ],
    links: [
      {
        label: "idPowerToys",
        url: "https://idpowertoys.merill.net/",
      },
      {
        label: "CA Documenter",
        url: "https://idpowertoys.merill.net/ca",
      },
      {
        label: "Entra Mind Map",
        url: "https://idpowertoys.merill.net/mindmap",
      },
      {
        label: "GitHub",
        url: "https://github.com/merill/idPowerToys",
      },
    ],
  },
];
