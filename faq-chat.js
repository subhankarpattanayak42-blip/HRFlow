/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · AI Course Assistant (FAQ Chatbot)
   Client-side knowledge engine. No API keys. Deployed with app.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. KNOWLEDGE BASE ─────────────────────────────────────────
     Each entry: { q: [keywords], a: answer, t: topic label }
     Keywords are matched against the user's question (lowercased). */
  const KNOWLEDGE = [
    /* ── Course overview ─────────────────────────────────────── */
    {
      t: "Course Overview",
      q: ["hris", "what is", "course", "about", "mg3003", "overview", "what do we learn", "syllabus"],
      a: "MG3003 — Enterprise HRIS Architecture & Implementation is a 5th-semester, 3-credit course at Silicon University, Bhubaneswar, taught by Subhankar Pattanayak. Over 10 sessions and 5 modules (42 topics), you learn how to design, model, and implement enterprise Human Resource Information Systems — not just how to use HR software, but how to think like someone who solves messy enterprise problems. You work in teams on the GlobalTech Inc. simulation, build an individual portfolio, and finish with a capstone HRMS proposal."
    },
    {
      t: "Course Overview",
      q: ["who teaches", "instructor", "faculty", "professor", "teacher", "subhankar"],
      a: "The course is taught by Subhankar Pattanayak, an AI Strategist at SAP. He brings real-world enterprise HRIS and AI experience into the classroom. His teaching philosophy: learn-and-enjoy — no exams, all deliverables, hands-on simulation, and build real artifacts you can show in interviews."
    },
    {
      t: "Modules",
      q: ["module", "5 module", "topics", "curriculum", "syllabus", "what will we cover"],
      a: "The course has 5 modules:\n1. HRIS Fundamentals & Enterprise Architecture (Sessions 1-2)\n2. Talent Acquisition & Core HR (Sessions 3-4)\n3. Time, Payroll & Compensation (Sessions 5-6)\n4. Performance, Learning & Succession (Sessions 7-8)\n5. HR Service Delivery, Integration & Analytics (Sessions 9-10)\n\n42 topics across 10 sessions, capped with a final capstone."
    },
    {
      t: "Course Overview",
      q: ["prerequisite", "require", "background", "need to know", "knowledge", "experience"],
      a: "No specialised HR or coding background is required. The course is designed for 5th-semester students who have done data structures, algorithms, and databases. If you can think logically about systems and data, you're ready. Postgraduate-level thinking is expected — you'll analyse trade-offs and defend decisions, not just memorise facts."
    },

    /* ── Assessment ──────────────────────────────────────────── */
    {
      t: "Assessment",
      q: ["grade", "mark", "assessment", "evaluation", "weight", "scoring", "breakdown", "percent"],
      a: "Your grade is 100% based on deliverables — there are NO exams. Breakdown:\n• Simulation Sprints (10) — 40% (4% each, team)\n• Individual Portfolio — 20% (5 artifacts, one per module)\n• Weekly Quiz — 10% (1% per session, lowest dropped)\n• Capstone Presentation — 20% (team)\n• Peer Evaluation — 10% (anonymous after each sprint)\n\nIn short: 40% teamwork, 40% your own work, 10% in-class performance, 10% how you work with your team."
    },
    {
      t: "Assessment",
      q: ["sprint", "simulation sprint", "deliverable", "team deliverable", "4%"],
      a: "Each week (10 sprints total) your team produces a consulting deliverable worth 4% of your grade. Examples: a current-state analysis, an ERD and org design, an ATS architecture, a compliance matrix, a payroll integration flow, an RBAC matrix. You submit one deliverable per team to your Google Drive sprint folder, and the whole team shares the grade — adjusted by peer evaluation."
    },
    {
      t: "Assessment",
      q: ["portfolio", "individual portfolio", "own work", "personal"],
      a: "The Individual Portfolio (20%) is YOUR personal evidence of learning — 5 artifacts, one per module. It's separate from team sprints. You may take a team sprint deliverable and reinterpret/extend it in your own words, but it must be your own version. Format: PDF or GitHub repo (recommended for interviews). This is what you walk into an interview with."
    },
    {
      t: "Assessment",
      q: ["quiz", "kahoot", "mcq", "weekly quiz", "test"],
      a: "Every session starts with a 5-minute quiz — 5 MCQs, Kahoot-style, on the previous session's material. It's worth 10% (1% per session, and your lowest score is dropped). The quiz app link changes each session and is shared at the start of class. There's a live leaderboard. No advance notice — just pay attention in class and refresh before walking in."
    },
    {
      t: "Assessment",
      q: ["capstone", "final", "presentation", "proposal", "hrms proposal"],
      a: "The Capstone Presentation (20%) is a final team presentation in Session 10 — a complete HRMS Implementation Proposal for GlobalTech. You present your platform recommendation with a vendor scorecard, full system architecture, an 18-month roadmap, risk register, and change management plan. This is where everything from the semester comes together."
    },
    {
      t: "Assessment",
      q: ["peer", "peer evaluation", "teamwork", "teammates"],
      a: "Peer Evaluation (10%) — after each sprint you anonymously evaluate your teammates (contribution, collaboration, reliability, quality of work). Your peer score is the average across your teammates for that sprint, averaged again across all 10 sprints. This adjusts your individual contribution within team grades."
    },
    {
      t: "Assessment",
      q: ["exam", "no exam", "test", "midterm", "final exam"],
      a: "There are NO exams in this course. No midterms, no finals. Your grade comes entirely from weekly deliverables, the portfolio, quizzes, capstone, and peer evaluation. The philosophy is learn-and-enjoy: you build things every week instead of cramming at the end."
    },

    /* ── Simulation: HR Flow Lab ─────────────────────────────── */
    {
      t: "Simulation",
      q: ["simulation", "hr flow lab", "app", "globaltech", "platform", "play", "how does it work"],
      a: "HR Flow Lab is the course's simulation app — this is where you play. You act as an HRIS consultant for GlobalTech Inc., a fictional multinational that faces a new challenge every week. You make decisions, see the impact on HR metrics (green/red), and build consulting artifacts. Admin activates a week, which resets all team sessions. Old results stay visible in the Leaderboard and My Results."
    },
    {
      t: "Simulation",
      q: ["login", "log in", "password", "sign in", "email", "access", "account"],
      a: "You log in with your @silicon.ac.in email. The default password for all accounts is mg3003@2026. After your first login you should change it. If you're a test student, use student@tech.com. If you can't log in, ask the instructor to re-seed your account."
    },
    {
      t: "Simulation",
      q: ["team", "team member", "join team", "which team", "group", "class team"],
      a: "Students are split into 3 teams: Team-1, Team-2, and Team-3. You work in these teams all semester on the sprints. Log in, select your team, and press Start Simulation. The test account (student@tech.com) has no team assigned. Your team has a shared Google Drive folder with 10 sprint subfolders for submitting deliverables."
    },
    {
      t: "Simulation",
      q: ["week", "active week", "week badge", "reset session", "new week"],
      a: "The instructor activates a week from the admin panel. When a new week is activated, your session auto-resets (a gold week badge shows the active week). Your old results from previous weeks stay saved in the Leaderboard and My Results. Each week has a theme — from HRIS Fundamentals in Week 1 to Strategic HR in Week 10."
    },
    {
      t: "Simulation",
      q: ["leaderboard", "score", "ranking", "my results", "best team"],
      a: "The Leaderboard shows all teams' scores and is visible to everyone. My Results shows your personal scores per week, filtered to just you. Beyond the simulation, every session starts with a Kahoot-style quiz that also has a live leaderboard."
    },
    {
      t: "Simulation",
      q: ["learning journal", "journal", "reflection", "write entry"],
      a: "The Learning Journal lets you record what you learned each session — what surprised you, what's still fuzzy, what you'd do differently. Just pick the session number, write your entry, and save. Low-stakes: it's about genuine reflection, not length."
    },

    /* ── Deliverables & submissions ──────────────────────────── */
    {
      t: "Deliverables",
      q: ["submit", "submission", "where to submit", "upload", "drive", "google drive", "folder"],
      a: "Team sprint deliverables go in your team's Google Drive folder (01-Teams/Team-X/Sprint-N/). Individual portfolio work goes in your personal folder (02-Portfolios/Your-Name/). The Master Tracker sheet (with Sprint-Grades, Portfolio-Grades, Peer-Evaluations, Final-Grades tabs) is where all grades are recorded."
    },
    {
      t: "Deliverables",
      q: ["deadline", "due", "when is"],
      a: "Each sprint deliverable is due at the end of that session's sprint. The capstone is in Session 10. The portfolio is due at the end of semester. Quizzes happen at the start of each session. For specific dates, check the Master Tracker sheet and your session plans."
    },
    {
      t: "Deliverables",
      q: ["format", "file type", "pdf", "diagram", "document"],
      a: "Sprint deliverables are typically single PDFs with embedded diagrams (ERD, UML, BPMN, swimlane). Portfolio can be a PDF, GitHub repo (recommended), or Google Drive/Notion folder. Use industry-standard notation — ERD, UML, BPMN where appropriate — because technical accuracy is a key rubric criterion."
    },

    /* ── Rubrics ─────────────────────────────────────────────── */
    {
      t: "Rubrics",
      q: ["rubric", "grading criteria", "how graded", "marks for", "what counts"],
      a: "Sprints are graded on Completeness (30%), Technical Accuracy (30%), Team Contribution (20%), and Documentation & Presentation (20%). The Portfolio is graded on Design Quality (30%), Reflective Depth (20%), Technical Accuracy (20%), Completeness (15%), and Presentation (15%). See the full rubrics in docs/rubrics.md."
    },
    {
      t: "Rubrics",
      q: ["pass", "fail", "threshold", "minimum", "what if i fail"],
      a: "There's no single pass/fail threshold at the course level — it's a weighted average across all components. Deliver consistently each week and you build a strong cumulative grade. The quiz drops your lowest score. If you're concerned about a component, talk to the instructor early so adjustments can be made before it compounds."
    },

    /* ── Tools & resources ───────────────────────────────────── */
    {
      t: "Tools",
      q: ["tool", "software", "lucidchart", "draw.io", "diagram tool", "figma", "miro"],
      a: "You'll use a mix of tools: Draw.io / Lucidchart / dbdiagram.io for diagrams and ERDs, Google Docs + Sheets for documents, Figma / Balsamiq for wireframes, Miro / Mural for collaboration, BPMN notation for process flows. Use whatever works — the notation matters more than the brand."
    },
    {
      t: "Resources",
      q: ["textbook", "reference", "reading", "book", "material", "study"],
      a: "Primary textbook: Kavanagh, Thite & Johnson — HRIS: Basics, Applications, Future Directions. Each session lists specific chapters plus free resources (SHRM topic hubs, Gartner glossary, SAP SuccessFactors Help, Workday Community). The course repo has session plans, handouts, reference cards, and worksheets."
    },

    /* ── Time commitment ─────────────────────────────────────── */
    {
      t: "Logistics",
      q: ["hours", "time", "duration", "how long", "sessions", "schedule", "when"],
      a: "10 sessions total, each 3h36m — totalling 36 contact hours. Each session breaks into: a 5-minute quiz, 1h40m of core concepts, and 1h40m of simulation sprint. 3 credits, 5th semester."
    },

    /* ── Contact / help ──────────────────────────────────────── */
    {
      t: "Help",
      q: ["help", "contact", "reach", "ask", "doubt", "question", "problem", "issue", "stuck"],
      a: "This AI assistant answers common course questions. For anything not covered here, or if you're stuck on a sprint, a technical issue with HR Flow Lab, or a grade concern — ask the instructor in class or after a session. The instructor's philosophy is Figure-It-Out: try to solve it yourself first, but don't suffer silently. (For a real human, that's Subhankar Pattanayak.)"
    },
    {
      t: "Access Control",
      q: ["access", "permission", "see", "view", "who can see", "private", "folder", "share", "only my team", "visibility"],
      a: "Access is controlled per team and per individual:\n\n👥 **Team sprint folders** (01-Teams/Team-X/): Only members of that team and the instructor can access them. When you log in to HR Flow Lab, the deliverables panel detects your team from your email and shows the correct submission link.\n\n👤 **Individual portfolio folders** (02-Portfolios/Your-Name/): Only you and the instructor can see your folder. The deliverables panel shows your portfolio link personalized with your name.\n\n📊 **Master Tracker Sheet**: All students can view (read-only). Only the instructor can edit.\n\n💡 If you're not logged in to HR Flow Lab, the panel shows generic master links. Log in with your @silicon.ac.in email to see your team-specific links."
    }
  ];

  /* ── 2. SUGGESTED QUESTIONS (quick chips) ──────────────────── */
  const SUGGESTED = [
    "How is my grade calculated?",
    "Are there any exams?",
    "How does the weekly quiz work?",
    "What is the Individual Portfolio?",
    "How do I log in to HR Flow Lab?",
    "What tools do I need?",
    "What are the 5 modules?",
    "How do team grades work?"
  ];

  /* ── 3. MATCHING ENGINE ────────────────────────────────────── */
  function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  function scoreEntry(entry, tokens) {
    let score = 0;
    for (const kw of entry.q) {
      for (const t of tokens) {
        if (kw === t) score += 3;
        else if (kw.includes(t) && kw.length > 3) score += 2;
        else if (t.includes(kw) && t.length > 3) score += 1;
      }
    }
    return score;
  }

  function answer(question) {
    const tokens = tokenize(question);
    let best = null, bestScore = 0;
    for (const entry of KNOWLEDGE) {
      const s = scoreEntry(entry, tokens);
      if (s > bestScore) { bestScore = s; best = entry; }
    }
    if (best && bestScore >= 2) {
      return { text: best.a, topic: best.t, good: true };
    }
    return {
      text: "I'm not 100% sure I caught that. Try asking about assessment, quizzes, the simulation, portfolio, teams, or deadlines — or use one of the suggested questions below. If it's still not answered, please ask the instructor directly.",
      topic: "Not sure",
      good: false
    };
  }

  /* ── 4. CHAT UI ────────────────────────────────────────────── */
  function buildChatUI() {
    // Floating button
    const btn = document.createElement("button");
    btn.id = "ask-btn";
    btn.innerHTML = "🤖 Ask MG3003";
    btn.setAttribute("aria-label", "Open course assistant");

    // Chat window
    const win = document.createElement("div");
    win.id = "ask-window";
    win.className = "ask-hidden";
    win.innerHTML = `
      <div class="ask-head">
        <div>
          <strong>🤖 MG3003 Assistant</strong>
          <span class="ask-sub">Course FAQ · AI-powered</span>
        </div>
        <button id="ask-close" aria-label="Close">&times;</button>
      </div>
      <div class="ask-body">
        <div class="ask-msg ask-bot">
          👋 Hi! I'm the MG3003 course assistant. Ask me anything about the course — assessment, quizzes, the simulation, the portfolio, teams, deadlines, tools. I'm here to help!
        </div>
        <div class="ask-chips"></div>
      </div>
      <form class="ask-input" autocomplete="off">
        <input type="text" placeholder="Ask a question…" aria-label="Ask a question" />
        <button type="submit">➤</button>
      </form>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(win);

    const chipsWrap = win.querySelector(".ask-chips");
    SUGGESTED.forEach(s => {
      const c = document.createElement("button");
      c.className = "ask-chip";
      c.textContent = s;
      c.addEventListener("click", () => send(s));
      chipsWrap.appendChild(c);
    });

    const body = win.querySelector(".ask-body");
    const input = win.querySelector("input");
    const form = win.querySelector(".ask-input");

    function addMsg(text, who) {
      const m = document.createElement("div");
      m.className = "ask-msg " + (who === "user" ? "ask-user" : "ask-bot");
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    function send(q) {
      q = q.trim();
      if (!q) return;
      addMsg(q, "user");
      input.value = "";
      // small typing delay for feel
      const typing = addMsg("…", "bot");
      typing.className = "ask-msg ask-bot ask-typing";
      setTimeout(() => {
        typing.remove();
        const res = answer(q);
        const m = addMsg(res.text, "bot");
        if (res.topic) {
          const tag = document.createElement("span");
          tag.className = "ask-topic";
          tag.textContent = res.topic;
          m.appendChild(tag);
        }
      }, 450);
    }

    btn.addEventListener("click", () => {
      const hidden = win.classList.toggle("ask-hidden");
      btn.classList.toggle("ask-active", !hidden);
      if (!hidden) input.focus();
    });
    win.querySelector("#ask-close").addEventListener("click", () => {
      win.classList.add("ask-hidden");
      btn.classList.remove("ask-active");
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  }

  /* ── 5. INIT ───────────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildChatUI);
  } else {
    buildChatUI();
  }

})();