/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · AI Course Assistant (FAQ Chatbot)
   AI-generated answers via OpenRouter. Requires Vercel env var
   OPENROUTER_API_KEY to be set in Vercel dashboard.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. SUGGESTED QUESTIONS (quick chips) ──────────────────── */
  const SUGGESTED = [
    "How is my grade calculated?",
    "What is the Individual Portfolio?",
    "How does the weekly quiz work?",
    "How do I log in to HR Flow Lab?",
    "What are the 5 modules?",
    "How do team grades work?",
    "What is the Learning Journal?",
    "What tools do I need?"
  ];

  /* ── 2. AI ANSWER ENGINE ────────────────────────────────────── */
  const API_URL = window.location.origin + "/api/ask";

  async function answer(question) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data.answer) {
        return { text: data.answer, topic: data.source === "external" ? "💡 Try Google Gemini" : "AI Assistant", good: true };
      }
      throw new Error("No answer");
    } catch (e) {
      console.warn("AI API failed:", e);
      return {
        text: "I couldn't reach the AI right now. Try one of the suggested questions below, or ask the instructor directly.",
        topic: "Offline",
        good: false
      };
    }
  }

  /* ── 3. CHAT UI ────────────────────────────────────────────── */
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
          <span class="ask-sub">AI-powered · Course FAQ</span>
        </div>
        <button id="ask-close" aria-label="Close">&times;</button>
      </div>
      <div class="ask-body">
        <div class="ask-msg ask-bot">
          👋 Hi! I'm the MG3003 course assistant. Ask me anything about the course — assessment, quizzes, the simulation, the portfolio, teams, deadlines, tools. I'll answer using AI based on the course material!
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
      const typing = addMsg("…", "bot");
      typing.className = "ask-msg ask-bot ask-typing";
      answer(q).then(res => {
        typing.remove();
        const m = addMsg(res.text, "bot");
        if (res.topic) {
          const tag = document.createElement("span");
          tag.className = "ask-topic";
          tag.textContent = res.topic;
          m.appendChild(tag);
        }
      });
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

  /* ── 4. INIT ───────────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildChatUI);
  } else {
    buildChatUI();
  }

})();
