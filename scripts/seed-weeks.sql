-- ═══════════════════════════════════════════════════════════════
-- MG3003 — Add week column and seed 9 weeks of custom scenarios
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Add week column to custom_scenarios
ALTER TABLE custom_scenarios ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1;

-- 2. Add active_week column to classroom_runs to track which week is active
ALTER TABLE classroom_runs ADD COLUMN IF NOT EXISTS active_week INTEGER DEFAULT 1;

-- 3. Set the current week 1 active
UPDATE classroom_runs SET active_week = 1 WHERE active_week IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- WEEK 2: Digital Transformation & HRTech
-- ═══════════════════════════════════════════════════════════════

INSERT INTO custom_scenarios (module, title, description, options, week_number, created_by) VALUES
('Workforce Planning', 'Cloud HRMS migration decision', 'GlobalTech''s legacy on-premise HRIS (PeopleSoft 9.2) is end-of-life. The board wants a cloud migration plan but the CTO is worried about data security.', '[
  {"text": "Choose a unified cloud HCM suite (Workday/SuccessFactors) and plan a phased 12-month migration.", "flow": "Workforce Planning -> HRIS -> Recruitment", "impact": {"hrEfficiency": 12, "talentQuality": 5, "budgetHealth": -12, "legalSafety": 3}},
  {"text": "Build a custom middleware layer to extend the legacy system by 3 more years.", "flow": "Workforce Planning -> IT -> Compliance", "impact": {"budgetHealth": 5, "legalSafety": -5, "hrEfficiency": -8}},
  {"text": "Migrate only Core HR and Payroll to cloud first, defer Talent modules to Phase 2.", "flow": "Workforce Planning -> HRIS -> Payroll", "impact": {"hrEfficiency": 6, "budgetHealth": -6, "talentQuality": 2, "employeeTrust": 3}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Recruitment', 'AI-powered candidate screening backlash', 'The talent team introduced an AI screener that shortlisted candidates 3x faster — but 40% of rejected candidates from underrepresented groups have filed complaints.', '[
  {"text": "Pause the AI tool, audit the training data for bias, and implement fairness guardrails.", "flow": "Recruitment -> Compliance -> Employee Relations", "impact": {"employeeTrust": 10, "legalSafety": 8, "hrEfficiency": -5, "talentQuality": 3}},
  {"text": "Defend the tool — the 3x speed gain outweighs bias concerns. Add a manual appeal process.", "flow": "Recruitment -> Legal -> PR", "impact": {"hrEfficiency": 6, "legalSafety": -8, "employeeTrust": -10}},
  {"text": "Replace the AI screener with a structured work-sample test for all candidates.", "flow": "Recruitment -> Performance -> L&D", "impact": {"talentQuality": 8, "hrEfficiency": -3, "budgetHealth": -4, "employeeTrust": 5}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Onboarding', 'Remote onboarding failing globally', 'GlobalTech hired 200 new employees across 12 countries this quarter. Exit interviews show 30% of new hires who left within 60 days cite "confusing onboarding" as the top reason.', '[
  {"text": "Build a unified digital onboarding portal with country-specific compliance checklists and a buddy system.", "flow": "Onboarding -> HRIS -> Compliance", "impact": {"employeeTrust": 12, "hrEfficiency": 7, "legalSafety": 5, "budgetHealth": -5}},
  {"text": "Standardize onboarding globally with a single PDF packet and a mandatory Zoom orientation.", "flow": "Onboarding -> Compliance", "impact": {"hrEfficiency": 4, "legalSafety": -3, "employeeTrust": -6, "talentQuality": -2}},
  {"text": "Outsource onboarding to a BPO firm that handles compliance paperwork and sends a weekly progress report.", "flow": "Onboarding -> Vendor Mgmt -> Payroll", "impact": {"hrEfficiency": 5, "budgetHealth": -6, "legalSafety": -4, "employeeTrust": -3}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Payroll', 'Multi-country payroll consolidation', 'GlobalTech runs 6 separate payroll systems across 30 countries. The CFO reports that reconciling payroll takes 8 business days each month and error rates are 4%.', '[
  {"text": "Consolidate onto a single global payroll platform (e.g., CloudPay, ADP GlobalView) with unified reporting.", "flow": "Payroll -> HRIS -> Finance", "impact": {"hrEfficiency": 12, "legalSafety": 6, "budgetHealth": -15, "employeeTrust": 4}},
  {"text": "Build a payroll data warehouse that consolidates reports from all 6 systems without changing the underlying engines.", "flow": "Payroll -> IT -> Analytics", "impact": {"hrEfficiency": 5, "budgetHealth": -4, "legalSafety": 2, "talentQuality": 3}},
  {"text": "Standardize pay codes and tax rules across all 6 systems. Keep the engines but align the data model.", "flow": "Payroll -> Compliance -> Finance", "impact": {"hrEfficiency": 4, "legalSafety": 5, "budgetHealth": -3, "employeeTrust": 2}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Performance', 'OKR roll-out met with resistance', 'The new CHRO wants to replace the old annual review system with quarterly OKRs. Managers say it''s "more admin work" and engineering VPs are pushing back.', '[
  {"text": "Run a pilot with 3 departments first. Collect data on productivity impact before company-wide roll-out.", "flow": "Performance -> Analytics -> L&D", "impact": {"employeeTrust": 6, "talentQuality": 5, "hrEfficiency": -3, "budgetHealth": -2}},
  {"text": "Full roll-out immediately with mandatory training for all managers and a 6-month adjustment period.", "flow": "Performance -> L&D -> Employee Relations", "impact": {"talentQuality": 8, "hrEfficiency": -6, "employeeTrust": -4, "budgetHealth": -3}},
  {"text": "Keep the annual review but add a mid-year check-in. Address the biggest pain point without overhauling the system.", "flow": "Performance -> Employee Relations", "impact": {"employeeTrust": 3, "hrEfficiency": 2, "talentQuality": -2, "budgetHealth": 1}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('L&D', 'Skills gap in AI and data engineering', 'GlobalTech''s data team is losing talent to competitors. 60% of current engineers lack cloud/AI skills needed for the next-gen product roadmap.', '[
  {"text": "Launch an internal AI Academy with hands-on projects, certifications, and mentorship from senior engineers.", "flow": "L&D -> Talent -> Performance", "impact": {"talentQuality": 12, "employeeTrust": 8, "hrEfficiency": -3, "budgetHealth": -8}},
  {"text": "Hire externally for the top 20% of roles. Offer retention bonuses to critical existing staff.", "flow": "L&D -> Recruitment -> Finance", "impact": {"talentQuality": 6, "budgetHealth": -10, "employeeTrust": -3, "hrEfficiency": 2}},
  {"text": "Partner with Coursera for Business. Give every engineer a learning budget and time allocation.", "flow": "L&D -> Vendor Mgmt -> Performance", "impact": {"talentQuality": 5, "employeeTrust": 4, "budgetHealth": -3, "hrEfficiency": 1}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Compliance', 'GDPR audit reveals data gaps', 'A routine GDPR audit found that 15% of employee records lack proper consent documentation, and data retention policies are not enforced across 8 countries.', '[
  {"text": "Launch a company-wide data hygiene project: re-consent all employees, automate retention policies, and audit quarterly.", "flow": "Compliance -> HRIS -> Employee Relations", "impact": {"legalSafety": 14, "employeeTrust": 4, "hrEfficiency": -5, "budgetHealth": -6}},
  {"text": "Fix only the 8 countries flagged by the auditor. Document the rest as a future improvement plan.", "flow": "Compliance -> Legal", "impact": {"legalSafety": 5, "budgetHealth": -2, "hrEfficiency": 2, "employeeTrust": -3}},
  {"text": "Implement a data privacy dashboard that automates consent tracking and retention scheduling across all regions.", "flow": "Compliance -> HRIS -> Analytics", "impact": {"legalSafety": 10, "hrEfficiency": 6, "budgetHealth": -5, "employeeTrust": 3}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Employee Relations', 'Hybrid work policy creating tension', 'Remote employees feel left out of promotions and key projects. Office-based staff resent the flexibility gap. 3 teams have filed formal grievances.', '[
  {"text": "Design a transparent hybrid work policy: 3 days in-office mandatory, clear promotion criteria, and asynchronous communication norms.", "flow": "Employee Relations -> Policy -> Performance", "impact": {"employeeTrust": 10, "hrEfficiency": 4, "talentQuality": 3, "legalSafety": 5}},
  {"text": "Let each team decide their own hybrid model. Set minimum guidelines for collaboration hours.", "flow": "Employee Relations -> Team Leads", "impact": {"employeeTrust": 3, "hrEfficiency": -2, "talentQuality": -4, "legalSafety": -3}},
  {"text": "Go fully remote-first. Close 2 office leases, invest in collaboration tools, and run quarterly in-person offsites.", "flow": "Employee Relations -> Finance -> HRIS", "impact": {"budgetHealth": 8, "employeeTrust": 5, "talentQuality": -3, "hrEfficiency": -2}}
]', 2, (SELECT id FROM auth.users LIMIT 1)),

('Capstone', 'GlobalTech HRIS vendor selection', 'The board has approved the HRMS budget. You must recommend one vendor and present your implementation roadmap. Workday, SAP SuccessFactors, and Oracle HCM Cloud are finalists.', '[
  {"text": "Recommend Workday: best UX, unified finance+HR, fastest time-to-value but limited global payroll depth.", "flow": "Capstone -> HRIS -> Finance", "impact": {"hrEfficiency": 10, "employeeTrust": 6, "budgetHealth": -8, "talentQuality": 5}},
  {"text": "Recommend SAP SuccessFactors: best for global compliance, deep integration with existing SAP ERP, but heavier implementation.", "flow": "Capstone -> HRIS -> Compliance", "impact": {"legalSafety": 10, "talentQuality": 5, "hrEfficiency": 5, "budgetHealth": -10}},
  {"text": "Recommend Oracle HCM Cloud: strongest payroll engine, best analytics, but complex pricing and longer deployment.", "flow": "Capstone -> HRIS -> Analytics", "impact": {"talentQuality": 8, "hrEfficiency": 6, "budgetHealth": -12, "legalSafety": 4}}
]', 2, (SELECT id FROM auth.users LIMIT 1));

-- ═══════════════════════════════════════════════════════════════
-- WEEKS 3-10: Similar INSERT statements would go here
-- (I'll generate these in a separate file to keep this manageable)
-- ═══════════════════════════════════════════════════════════════

-- Verify
SELECT week_number, COUNT(*) as scenarios FROM custom_scenarios GROUP BY week_number ORDER BY week_number;