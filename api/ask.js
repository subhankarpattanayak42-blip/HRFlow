/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · AI Course Assistant API (Vercel Serverless)
   COURSE FAQ MODE ONLY.
   Answers course-logistics questions from the built-in FAQ context using a
   fast, low-cost model. For general HR terms / concepts / web research, we
   tell the student to use Google AI Studio (Gemini) rather than paying for
   a live web-search model — cost-friendly for a class of students.
   ═══════════════════════════════════════════════════════════════ */

/* Detects HR-concept / study questions that are NOT answerable from the course
   FAQ and need external research → we nudge the student to Google Gemini.
   These are answered WITHOUT calling the LLM at all, so they cost zero tokens. */
const EXTERNAL_TERMS = [
  "hr analytics", "talent management", "payroll", "payroll cycle", "benefits admin",
  "compensation", "succession", "ats", "onboarding", "rbac", "compliance matrix",
  "workday", "sap successfactors", "oracle hcm", "effective dating", "data dictionary",
  "oracle", "successfactors", "er diagram", "erd", "normalization", "sql"
];

const FAQ_CONTEXT = `You are the official MG3003 course assistant at Silicon University, Bhubaneswar. Answer questions about the COURSE using the information below. Be concise, friendly, and accurate — engineers-friendly, use everyday analogies. If a question is about an HR concept/term NOT covered by the course facts (e.g. defining an HRIS, talent management, payroll, ERD, effective dating), do NOT guess — instead say: "That's a great topic to explore! For a detailed, web-search-backed explanation of <topic>, open Google AI Studio (Gemini) at https://aistudio.google.com/ — you can ask it anything about HR concepts and it will show sources. For course-specific help, ask me about assessment, quizzes, the simulation, the portfolio, teams, or deadlines!" Keep it short.

COURSE OVERVIEW
- MG3003 — Enterprise HRIS Architecture & Implementation, 5th semester, 3 credits
- Instructor: Subhankar Pattanayak, AI Strategist at SAP
- 10 sessions, 5 modules, 42 topics, 36 contact hours
- Teaching method: Team-based simulation (GlobalTech Inc.) + individual portfolio + capstone
- Philosophy: Learn by doing. Fail fast. Iterate. Ship.

ASSESSMENT (University: 30% Internal + 20% Mid-term + 50% End-term)
- MID-TERM (20%): Sprint 1-5 Team Score (10%) + Written Case Study Exam (10%)
- END-TERM (50%): Sprint 6-10 Team Score (10%) + Written Case Study Exam (25%) + Individual Portfolio (10%) + Capstone Presentation (5%)
- INTERNAL (30%): Weekly MCQ Quiz (10%) + Peer Evaluation (10%) + Learning Journal (10%)
- Sprint total: 20% overall (10% Sprints 1-5, 10% Sprints 6-10)
- Exams total 35% (10% midterm + 25% endterm)

SPRINTS (10 weekly team deliverables)
- Each week your team produces a consulting deliverable for GlobalTech Inc.
- Examples: current-state analysis, ERD, ATS architecture, compliance matrix, payroll flow, RBAC matrix
- Graded on: Completeness (30%), Technical Accuracy (30%), Team Contribution (20%), Documentation (20%)
- Grades adjusted by peer evaluation

INDIVIDUAL PORTFOLIO
- YOUR personal evidence of learning — 5 artifacts, one per module
- You may reinterpret a team deliverable in your own words — must be your own version
- Format: PDF or GitHub repo (recommended for interviews)
- Graded on: Design Quality (30%), Reflective Depth (20%), Technical Accuracy (20%), Completeness (15%), Presentation (15%)

SESSION/MODULES
- Module 1: HRIS Fundamentals (Sessions 1-2)
- Module 2: Talent Acquisition & Core HR (Sessions 3-4)
- Module 3: Time, Payroll & Compensation (Sessions 5-6)
- Module 4: Performance, Learning & Succession (Sessions 7-8)
- Module 5: Service Delivery, Integration & Analytics (Sessions 9-10)

LEARNING JOURNAL
- Write what you learned each session — what surprised you, what's fuzzy, what you'd do differently
- Part of Internal Assessment (10%)

TEAMS / SIMULATION
- 3 teams (Team-1, Team-2, Team-3). Test account student@tech.com / mg3003@2026
- Simulation app: hr-flow-liart.vercel.app · login @silicon.ac.in email / mg3003@2026
- Admin activates weeks; session auto-resets when week changes`

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { question } = req.body || {};
  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }
  const q = question.trim();

  const env = (process && process.env) || {};
  if (!env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  /* Cheap & deterministic: if the question mentions a known external HR/tech term,
     answer with a Google Gemini nudge WITHOUT spending an LLM call. */
  const lower = " " + q.toLowerCase() + " ";
  const external = EXTERNAL_TERMS.find(k => lower.includes(" " + k + " ") || lower.includes(k));
  if (external) {
    const topic = external === "erd" || external === "er diagram" ? "ERDs and data modelling"
      : external === "effective dating" ? "effective dating in HR systems"
      : external === "data dictionary" ? "data dictionaries"
      : external;
    return res.status(200).json({
      answer: `That's a great topic to explore! For a detailed, web-search-backed explanation of ${topic}, open Google AI Studio (Gemini) at https://aistudio.google.com/ — you can ask it anything HR and it will show sources. For course-specific help (assessment, sprints, portfolio, teams, deadlines), just ask me!`,
      source: "external"
    });
  }

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://hr-flow-liart.vercel.app",
        "X-Title": "MG3003 HR Flow Lab"
      },
      body: JSON.stringify({
        model: env.ASK_COURSE_MODEL || "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: FAQ_CONTEXT },
          { role: "user", content: q }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    const d = await r.json();
    if (!r.ok) {
      console.error("OpenRouter error:", JSON.stringify(d).slice(0, 300));
      return res.status(502).json({ error: "AI service error. Please try again." });
    }
    const answer = d.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "Empty response." });
    return res.status(200).json({ answer, source: "course" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to get answer. Please try again." });
  }
};