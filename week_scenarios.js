// ── Week 2: Digital Transformation & HRTech ──────────────────
const week2Scenarios = [
  {
    module: "Workforce Planning", title: "Cloud HRMS migration decision",
    description: "GlobalTech's legacy on-premise HRIS (PeopleSoft 9.2) is end-of-life. The board wants a cloud migration plan but the CTO is worried about data security.",
    options: [
      {text: "Choose a unified cloud HCM suite (Workday/SuccessFactors) and plan a phased 12-month migration.", flow: "Workforce Planning -> HRIS -> Recruitment", impact: {hrEfficiency: 12, talentQuality: 5, budgetHealth: -12, legalSafety: 3}},
      {text: "Build a custom middleware layer to extend the legacy system by 3 more years.", flow: "Workforce Planning -> IT -> Compliance", impact: {budgetHealth: 5, legalSafety: -5, hrEfficiency: -8}},
      {text: "Migrate only Core HR and Payroll to cloud first, defer Talent modules to Phase 2.", flow: "Workforce Planning -> HRIS -> Payroll", impact: {hrEfficiency: 6, budgetHealth: -6, talentQuality: 2, employeeTrust: 3}},
    ],
  },
  {
    module: "Recruitment", title: "AI-powered candidate screening backlash",
    description: "The talent team introduced an AI screener that shortlisted candidates 3x faster — but 40% of rejected candidates from underrepresented groups have filed complaints.",
    options: [
      {text: "Pause the AI tool, audit the training data for bias, and implement fairness guardrails.", flow: "Recruitment -> Compliance -> Employee Relations", impact: {employeeTrust: 10, legalSafety: 8, hrEfficiency: -5, talentQuality: 3}},
      {text: "Defend the tool — the 3x speed gain outweighs bias concerns. Add a manual appeal process.", flow: "Recruitment -> Legal -> PR", impact: {hrEfficiency: 6, legalSafety: -8, employeeTrust: -10}},
      {text: "Replace the AI screener with a structured work-sample test for all candidates.", flow: "Recruitment -> Performance -> L&D", impact: {talentQuality: 8, hrEfficiency: -3, budgetHealth: -4, employeeTrust: 5}},
    ],
  },
  {
    module: "Onboarding", title: "Remote onboarding failing globally",
    description: "GlobalTech hired 200 new employees across 12 countries this quarter. Exit interviews show 30% of new hires who left within 60 days cite 'confusing onboarding' as the top reason.",
    options: [
      {text: "Build a unified digital onboarding portal with country-specific compliance checklists and a buddy system.", flow: "Onboarding -> HRIS -> Compliance", impact: {employeeTrust: 12, hrEfficiency: 7, legalSafety: 5, budgetHealth: -5}},
      {text: "Standardize onboarding globally with a single PDF packet and a mandatory Zoom orientation.", flow: "Onboarding -> Compliance", impact: {hrEfficiency: 4, legalSafety: -3, employeeTrust: -6, talentQuality: -2}},
      {text: "Outsource onboarding to a BPO firm that handles compliance paperwork and sends a weekly progress report.", flow: "Onboarding -> Vendor Mgmt -> Payroll", impact: {hrEfficiency: 5, budgetHealth: -6, legalSafety: -4, employeeTrust: -3}},
    ],
  },
  {
    module: "Payroll", title: "Multi-country payroll consolidation",
    description: "GlobalTech runs 6 separate payroll systems across 30 countries. The CFO reports that reconciling payroll takes 8 business days each month and error rates are 4%.",
    options: [
      {text: "Consolidate onto a single global payroll platform (e.g., CloudPay, ADP GlobalView) with unified reporting.", flow: "Payroll -> HRIS -> Finance", impact: {hrEfficiency: 12, legalSafety: 6, budgetHealth: -15, employeeTrust: 4}},
      {text: "Build a payroll data warehouse that consolidates reports from all 6 systems without changing the underlying engines.", flow: "Payroll -> IT -> Analytics", impact: {hrEfficiency: 5, budgetHealth: -4, legalSafety: 2, talentQuality: 3}},
      {text: "Standardize pay codes and tax rules across all 6 systems. Keep the engines but align the data model.", flow: "Payroll -> Compliance -> Finance", impact: {hrEfficiency: 4, legalSafety: 5, budgetHealth: -3, employeeTrust: 2}},
    ],
  },
  {
    module: "Performance", title: "OKR roll-out met with resistance",
    description: "The new CHRO wants to replace the old annual review system with quarterly OKRs. Managers say it's 'more admin work' and engineering VPs are pushing back.",
    options: [
      {text: "Run a pilot with 3 departments first. Collect data on productivity impact before company-wide roll-out.", flow: "Performance -> Analytics -> L&D", impact: {employeeTrust: 6, talentQuality: 5, hrEfficiency: -3, budgetHealth: -2}},
      {text: "Full roll-out immediately with mandatory training for all managers and a 6-month adjustment period.", flow: "Performance -> L&D -> Employee Relations", impact: {talentQuality: 8, hrEfficiency: -6, employeeTrust: -4, budgetHealth: -3}},
      {text: "Keep the annual review but add a mid-year check-in. Address the biggest pain point without overhauling the system.", flow: "Performance -> Employee Relations", impact: {employeeTrust: 3, hrEfficiency: 2, talentQuality: -2, budgetHealth: 1}},
    ],
  },
  {
    module: "L&D", title: "Skills gap in AI and data engineering",
    description: "GlobalTech's data team is losing talent to competitors. 60% of current engineers lack cloud/AI skills needed for the next-gen product roadmap.",
    options: [
      {text: "Launch an internal AI Academy with hands-on projects, certifications, and mentorship from senior engineers.", flow: "L&D -> Talent -> Performance", impact: {talentQuality: 12, employeeTrust: 8, hrEfficiency: -3, budgetHealth: -8}},
      {text: "Hire externally for the top 20% of roles. Offer retention bonuses to critical existing staff.", flow: "L&D -> Recruitment -> Finance", impact: {talentQuality: 6, budgetHealth: -10, employeeTrust: -3, hrEfficiency: 2}},
      {text: "Partner with Coursera for Business. Give every engineer a learning budget and time allocation.", flow: "L&D -> Vendor Mgmt -> Performance", impact: {talentQuality: 5, employeeTrust: 4, budgetHealth: -3, hrEfficiency: 1}},
    ],
  },
  {
    module: "Compliance", title: "GDPR audit reveals data gaps",
    description: "A routine GDPR audit found that 15% of employee records lack proper consent documentation, and data retention policies are not enforced across 8 countries.",
    options: [
      {text: "Launch a company-wide data hygiene project: re-consent all employees, automate retention policies, and audit quarterly.", flow: "Compliance -> HRIS -> Employee Relations", impact: {legalSafety: 14, employeeTrust: 4, hrEfficiency: -5, budgetHealth: -6}},
      {text: "Fix only the 8 countries flagged by the auditor. Document the rest as a future improvement plan.", flow: "Compliance -> Legal", impact: {legalSafety: 5, budgetHealth: -2, hrEfficiency: 2, employeeTrust: -3}},
      {text: "Implement a data privacy dashboard that automates consent tracking and retention scheduling across all regions.", flow: "Compliance -> HRIS -> Analytics", impact: {legalSafety: 10, hrEfficiency: 6, budgetHealth: -5, employeeTrust: 3}},
    ],
  },
  {
    module: "Employee Relations", title: "Hybrid work policy creating tension",
    description: "Remote employees feel left out of promotions and key projects. Office-based staff resent the flexibility gap. 3 teams have filed formal grievances.",
    options: [
      {text: "Design a transparent hybrid work policy: 3 days in-office mandatory, clear promotion criteria, and async communication norms.", flow: "Employee Relations -> Policy -> Performance", impact: {employeeTrust: 10, hrEfficiency: 4, talentQuality: 3, legalSafety: 5}},
      {text: "Let each team decide their own hybrid model. Set minimum guidelines for collaboration hours.", flow: "Employee Relations -> Team Leads", impact: {employeeTrust: 3, hrEfficiency: -2, talentQuality: -4, legalSafety: -3}},
      {text: "Go fully remote-first. Close 2 office leases, invest in collaboration tools, and run quarterly in-person offsites.", flow: "Employee Relations -> Finance -> HRIS", impact: {budgetHealth: 8, employeeTrust: 5, talentQuality: -3, hrEfficiency: -2}},
    ],
  },
  {
    module: "Capstone", title: "HRIS vendor selection final presentation",
    description: "The board has approved the HRMS budget. You must recommend one vendor and present your implementation roadmap. Workday, SAP SuccessFactors, and Oracle HCM Cloud are finalists.",
    options: [
      {text: "Recommend Workday: best UX, unified finance+HR, fastest time-to-value but limited global payroll depth.", flow: "Capstone -> HRIS -> Finance", impact: {hrEfficiency: 10, employeeTrust: 6, budgetHealth: -8, talentQuality: 5}},
      {text: "Recommend SAP SuccessFactors: best for global compliance, deep integration with existing SAP ERP, but heavier implementation.", flow: "Capstone -> HRIS -> Compliance", impact: {legalSafety: 10, talentQuality: 5, hrEfficiency: 5, budgetHealth: -10}},
      {text: "Recommend Oracle HCM Cloud: strongest payroll engine, best analytics, but complex pricing and longer deployment.", flow: "Capstone -> HRIS -> Analytics", impact: {talentQuality: 8, hrEfficiency: 6, budgetHealth: -12, legalSafety: 4}},
    ],
  },
];

// ── Weeks 3-10: Template scenarios ──────────────────────────
function generateWeekScenarios(weekNum, themeModifier) {
  const modules = ["Workforce Planning", "Recruitment", "Onboarding", "Payroll",
    "Performance", "L&D", "Compliance", "Employee Relations", "Capstone"];
  return modules.map(m => ({
    module: m,
    title: `${m} — ${themeModifier} challenge`,
    description: `GlobalTech faces a ${themeModifier.toLowerCase()} challenge affecting ${m.toLowerCase()}. Analyze the situation and choose the best strategic response.`,
    options: [
      {text: `Build a comprehensive ${themeModifier.toLowerCase()} solution integrating with the existing HRIS.`, flow: `${m} -> HRIS -> Analytics`, impact: {hrEfficiency: 6, talentQuality: 5, budgetHealth: -6, employeeTrust: 4}},
      {text: `Outsource ${m.toLowerCase()} to a specialist vendor with proven expertise.`, flow: `${m} -> Vendor Mgmt -> Finance`, impact: {budgetHealth: 4, hrEfficiency: 3, talentQuality: -2, legalSafety: -3}},
      {text: `Run ${m.toLowerCase()} as-is for now, document improvement plan for next quarter review.`, flow: `${m} -> Operations`, impact: {budgetHealth: 2, hrEfficiency: -1, employeeTrust: -2, talentQuality: -3}},
    ],
  }));
}

const weekScenarios = {
  2: week2Scenarios,
  3: generateWeekScenarios(3, "Mergers & Acquisitions"),
  4: generateWeekScenarios(4, "Global Compliance"),
  5: generateWeekScenarios(5, "Talent Analytics"),
  6: generateWeekScenarios(6, "Employee Experience"),
  7: generateWeekScenarios(7, "Compensation Strategy"),
  8: generateWeekScenarios(8, "HRIS Security"),
  9: generateWeekScenarios(9, "Future of Work"),
  10: generateWeekScenarios(10, "Strategic HR"),
};