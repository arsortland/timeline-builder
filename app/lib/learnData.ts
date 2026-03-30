// Created: 2026-03-30
// Version: v1.3 - Removed consultant-specific language; made ZTA post broadly applicable
// Description: Blog post data for the Learn page
// Purpose: Provides an array of blog posts displayed on the Learn page.
//          Each post has a short description (card excerpt) and a content array (full article paragraphs).

import { BlogPost } from "./types";

export const posts: BlogPost[] = [
  {
    id: "zero-trust-getting-started",
    title: "Zero Trust: What It Is, Why It Matters, and How to Get Started",
    description:
      "A practical guide to Zero Trust — from the core principles and Microsoft's security model to using the Zero Trust Assessment tool to baseline, remediate, and verify improvements in your tenant.",
    content: [
      "## What is Zero Trust?",

      "Zero Trust is a security model built on a simple principle: never trust, always verify. Unlike traditional perimeter-based security — where anything inside the corporate network was implicitly trusted — Zero Trust assumes that every request, regardless of origin, is potentially hostile. Every identity, device, and network flow must be explicitly validated before access is granted.",

      "Microsoft frames Zero Trust around three guiding principles: (1) Verify explicitly — always authenticate and authorize based on all available data points including identity, location, device health, workload, data classification, and anomalies. (2) Use least-privilege access — limit access with just-in-time and just-enough-access (JIT/JEA), risk-based adaptive policies, and data protection controls. (3) Assume breach — minimize blast radius and segment access, verify end-to-end encryption, use analytics for visibility, and drive threat detection forward.",

      "## Why is Zero Trust used?",

      "The world has changed. Users work from anywhere, applications run in the cloud, and data flows between SaaS platforms, mobile devices, and on-premises servers. The traditional network perimeter no longer exists. At the same time, identity-based attacks have skyrocketed — token theft, credential stuffing, and phishing are daily threats. Zero Trust addresses this reality by making identity the primary security perimeter.",

      "Adopting Zero Trust means reducing the attack surface, containing breaches faster, and meeting increasingly strict compliance requirements. Frameworks like NIST 800-207, CISA's Zero Trust Maturity Model, and even the EU's NIS2 directive all point toward Zero Trust as the baseline expectation for modern organizations.",

      "The key is understanding where your organization stands today and what concrete steps you can take to improve. That starts with assessment.",

      "## How is Zero Trust implemented in the Microsoft ecosystem?",

      "Microsoft's approach to Zero Trust spans six foundational pillars: Identity, Devices, Applications, Data, Infrastructure, and Networks. In practice, for most organizations on the Microsoft stack, the work centres on:",

      "Identity — Microsoft Entra ID is the control plane. Conditional Access policies enforce access decisions based on user risk, device compliance, location, and application sensitivity. Privileged Identity Management (PIM) provides just-in-time elevation. Authentication methods (passwordless, phishing-resistant MFA) reduce credential theft risk.",

      "Devices — Microsoft Intune manages device compliance and health. Conditional Access can block or limit access from non-compliant or unmanaged devices.",

      "Applications — App registrations and service principals are governed through Entra ID. Permissions are reviewed and scoped to least privilege. Defender for Cloud Apps provides session controls and shadow IT discovery.",

      "Data — Microsoft Purview classifies, labels, and protects sensitive data across M365 and beyond. Data Loss Prevention (DLP) policies prevent exfiltration.",

      "Infrastructure and Networks — Azure security controls, network segmentation, private endpoints, and Azure Firewall/NSGs reduce lateral movement. Defender for Cloud monitors workload security posture.",

      "## Using the Zero Trust Assessment tool",

      "The Zero Trust Assessment (ZTA) is a PowerShell module by Microsoft that automatically tests hundreds of security configuration items across your tenant. It evaluates Microsoft Entra ID, Intune, Exchange Online, SharePoint, and Azure configurations against Zero Trust pillars and the Secure Future Initiative (SFI). The output is an interactive HTML report — organized by Identity, Devices, Network, and Data — where each finding includes a risk level and remediation guidance.",

      "### When to use it",

      "Run the Zero Trust Assessment at the very start of any security improvement initiative. It gives you an objective, evidence-based snapshot of the tenant's current security posture before any changes are made. This baseline report is critical — it sets the starting point against which all improvements will be measured. It is also valuable to run periodically (quarterly or after major configuration changes) to catch configuration drift and ensure the tenant stays aligned with Zero Trust principles.",

      "### How to run it",

      "The tool requires PowerShell 7. Install it with Install-Module ZeroTrustAssessment -Scope CurrentUser. The first run requires Global Administrator to grant consent for the required permissions. Subsequent runs only need Global Reader plus Exchange Administrator and SharePoint Administrator roles. Connect with Connect-ZtAssessment, then run Invoke-ZtAssessment. The HTML report opens automatically in your browser once the assessment completes. Save the report file — you will need it later for comparison.",

      "### How to read the data",

      "The HTML report is organized into sections matching the Zero Trust pillars: Identity, Devices, Network, and Data. Each section contains a list of checks. Every check shows a status (pass, fail, or warning), a risk level (high, medium, or low), and a description of what was tested. Failed checks with a high risk level are your priority items — these represent the most significant gaps in your security posture. Warnings indicate partial compliance or configurations that could be strengthened. Passed checks confirm that a specific control is already in place.",

      "Walk through the report section by section. The Identity section typically surfaces the most findings — missing Conditional Access policies, legacy authentication still enabled, privileged roles without PIM, weak MFA configurations. The Devices section highlights gaps in Intune compliance policies and device-based access controls. Network and Data sections cover Exchange, SharePoint, and Azure infrastructure hardening.",

      "img:/ztademo.webp|Source: github.com/microsoft/zerotrustassessment",

      "### Turning findings into actionable tasks",

      "Each failed check in the report maps to a specific configuration change. The approach is straightforward: extract every failed and warning item, categorize them by risk level, and build a prioritized remediation backlog. High-risk items come first — these are the changes that reduce the most risk with the highest urgency.",

      "For example, if the report flags that legacy authentication is not blocked, the remediation task is to create a Conditional Access policy that blocks legacy authentication protocols for all users. If PIM is not enabled for privileged roles, the task is to configure PIM eligible assignments and remove standing access. If MFA is not enforced for administrators, the task is to create or update a Conditional Access policy requiring MFA for all admin roles.",

      "Structure the remediation as a project plan with clear owners, timelines, and dependencies. Some changes (like blocking legacy authentication) may require a communication period so users can migrate to modern clients. Others (like enabling security defaults or tightening app consent settings) can be implemented immediately. Group quick wins together for early momentum and schedule higher-complexity items (like Intune compliance policy rollouts) across later phases.",

      "### Remediating",

      "Work through the backlog methodically. For each task, make the configuration change, document what was changed and why, and note any user impact. Keep a change log — this is essential for internal change management and for your own records. Test changes in a controlled manner where possible: use Conditional Access report-only mode before enforcing new policies, pilot Intune compliance policies with a test group before broad rollout, and validate that critical business applications still function after tightening permissions.",

      "### Verifying positive changes",

      "Once a remediation phase is complete, re-run the Zero Trust Assessment with the same command: Invoke-ZtAssessment. The new report will reflect the current state of the tenant. Compare it side by side with the baseline report. Previously failed checks should now show as passed. The delta between the two reports is your evidence of progress — it objectively demonstrates that your security posture has improved.",

      "Present both reports to leadership and the security team. The before-and-after comparison is powerful: it turns abstract security work into a visible, measurable outcome. The value is demonstrated not through slides or opinions, but through documented, repeatable assessment results that show the gap closing over time.",

      "Schedule recurring assessments (monthly or quarterly) to catch configuration drift. Tenants are living environments — new users, new applications, policy changes, and admin turnover can all introduce regressions. Regular reassessment ensures your Zero Trust posture is maintained, not just achieved once and forgotten.",

      "If you want to see how the assessment report looks and feels, there is a [live demo](https://microsoft.github.io/zerotrustassessment/demo/) worth checking out.",

      "_ By André Sortland, Senior Consultant, Atea.",
    ],
    image: "/ZTAblog.png",
    date: "March 30, 2026",
    readTime: "10 min read",
  },
];
