/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · AI Course Assistant API (Vercel Serverless)
   ★ Enhanced Study Companion — v2.0 ★
   
   Two answer modes:
   1. COURSE mode  → answers from the built-in course FAQ context (fast, cheap, accurate
      for assessment / sprints / deadlines / teams / portfolios / simulation).
   2. STUDY mode   → for HR terms & concepts, does a LIVE INTERNET SEARCH via
      Perplexity Sonar (OpenRouter) and returns a grounded answer WITH CITATIONS,
      so students can study HR terminology, trends and real-world context beyond the
      course slides. The course context is still passed so answers stay relevant.
   ═══════════════════════════════════════════════════════════════ */

const COURSE_KEYWORDS = [
  "assessment", "grade", "mid-term", "midterm", "end-term", "endterm", "internal",
  "sprint", "portfolio", "quiz", "capstone", "deadline", "submis", "session",
  "module", "simulation", "team-", "team 1", "team 2", "team 3", "journal",
  "peer", "login", "password", "globaltech", "rubric", "portfolio", "attendance",
  "deliverable", "tools", "textbook", "kavanagh", "hr flow", "leaderboard",
  "my results", "weight", "marks", "schedule", "class", "syllabus", "credit"
];

/* Course facts used in BOTH modes so the assistant stays grounded. */
const FAQ_CONTEXT = `You are the official MG3003 course assistant at Silicon University, Bhubaneswar. You may answer course-specific questions from the information below (be concise, friendly, accurate), and you may ALSO use internet/web search to explain HR concepts and terminology in simple language for engineering students.

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

SESSIONS & MODULES
- Module 1: HRIS Fundamentals (Sessions 1-2)
- Module 2: Talent Acquisition & Core HR (Sessions 3-4)
- Module 3: Time, Payroll & Compensation (Sessions 5-6)
- Module 4: Performance, Learning & Succession (Sessions 7-8)
- Module 5: Service Delivery, Integration & Analytics (Sessions 9-10)

SPRINTS (10 weekly team deliverables at 4% of the 40% sprint bucket)
- Each week your team produces a consulting deliverable for GlobalTech Inc.
- Examples: current-state analysis, ERD, ATS architecture, compliance matrix, payroll flow, RBAC matrix
- Graded on: Completeness (30%), Technical Accuracy (30%), Team Contribution (20%), Documentation (20%)
- Grades adjusted by peer evaluation

INDIVIDUAL PORTFOLIO
- YOUR personal evidence of learning — 5 artifacts, one per module
- You may reinterpret a team deliverable in your own words — must be your own version
- Format: PDF or GitHub repo (recommended for interviews)
- Graded on: Design Quality (30%), Reflective Depth (20%), Technical Accuracy (20%), Completeness (15%), Presentation (15%)

LEARNING JOURNAL
- Write what you learned each session — what surprised you, what's fuzzy, what you'd do differently
- Part of Internal Assessment (10%)
- Low-stakes reflection, not length-based

CAUTION — for any classic HR terms (e.g. what is an HRIS, what is talent management, what is an ERD / data dictionary / effective dating / payroll / benefits), ALWAYS search the web to get a clear, simple definition with examples, then tie it back to the course.

Students are ENGINEERS: explain with everyday analogies and short, structured answers.`;

/* Detect whether a question is course-specific (use fast model) vs a study/term/
   concept question (use web search). Keyword match is a fast, dependency-free router. */
function isCourseQuestion(q) {
  const s = " " + q.toLowerCase() + " ";
  for (const k of COURSE_KEYWORDS) {
    if (s.includes(" " + k + " ")) return true;
    if (s.includes(k)) return true;
  }
  return false;
}

async function callOpenRouter(model, messages, maxTokens, env) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://hr-flow-liart.vercel.app",
      "X-Title": "MG3003 HR Flow Lab"
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.3 })
  });
  return res;
}

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

  const useWeb = !isCourseQuestion(q);
  const COURSE_MODEL = env.ASK_COURSE_MODEL || "google/gemini-2.5-flash-lite";
  const WEB_MODEL = env.ASK_WEB_MODEL || "perplexity/sonar";

  try {
    if (!useWeb) {
      /* ── COURSE MODE: answer from course context (fast, no web) ── */
      const r = await callOpenRouter(
        COURSE_MODEL,
        [
          { role: "system", content: FAQ_CONTEXT },
          { role: "user", content: q }
        ],
        600,
        env
      );
      const d = await r.json();
      if (!r.ok) {
        console.error("OpenRouter course error:", JSON.stringify(d).slice(0, 300));
        return res.status(502).json({ error: "AI service error. Please try again." });
      }
      const answer = d.choices?.[0]?.message?.content?.trim();
      if (!answer) return res.status(502).json({ error: "Empty response." });
      return res.status(200).json({ answer, source: "course" });
    }

    /* ── STUDY MODE (web search via Perplexity Sonar) ── */
    const r = await callOpenRouter(
      WEB_MODEL,
      [
        { role: "system", content: FAQ_CONTEXT + "\n\nAlways ground technical/HR answers with a live web search and include 2-4 clickable source links at the end under 'Sources:'." },
        { role: "user", content: q }
      ],
      1000,
      env
    );
    const d = await r.json();
    if (!r.ok) {
      console.error("OpenRouter web error:", JSON.stringify(d).slice(0, 300));
      // fallback to course model so the user still gets an answer
      const r2 = await callOpenRouter(COURSE_MODEL,
        [{ role: "system", content: FAQ_CONTEXT }, { role: "user", content: q }], 600, env);
      const d2 = await r2.json();
      const ans2 = d2.choices?.[0]?.message?.content?.trim();
      if (ans2) return res.status(200).json({ answer: ans2, source: "course" });
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const answer = d.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "Empty response." });

    /* Pull citations if provided (Perplexity returns them), else extract links from text. */
    let citations = [];
    try { citations = d.citations || []; } catch (_) {}
    if (!citations.length) {
      const urls = answer.match(/https?:\/\/[^\s\)\]\}]+/g) || [];
      citations = [...new Set(urls)].slice(0, 4);
    }
    return res.status(200).json({ answer, source: "web", citations });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to get answer. Please try again." });
  }
};