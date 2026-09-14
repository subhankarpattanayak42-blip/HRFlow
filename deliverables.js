/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · Weekly Deliverables & Submission Panel
   Team-aware: shows personalized links based on logged-in user's team.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Submission destinations ────────────────────────────────
     Real folder IDs pulled from Google Drive (MG3003-HRIS-2026).
     Portfolio folders are individual — mapped by student email. */

  const MASTER_FOLDER_ID = "1GRHwPgOFTP9x9xbfOMm0DV3w6Zb30Wqs";

  const TEAM_FOLDERS = {
    1: { name: "Team-1", url: "https://drive.google.com/drive/folders/1mY2uOPBjTbRzdMo7IqrX1lpQsB1RM7Zc" },
    2: { name: "Team-2", url: "https://drive.google.com/drive/folders/1e6zZwfS7ky28BcRgcnY1bb0MTBWCzq_t" },
    3: { name: "Team-3", url: "https://drive.google.com/drive/folders/1GT-xgAetJn9ks131kIKmC0_ekk5B84wP" },
  };

  /* Individual portfolio folders — keyed by student email */
  const PORTFOLIO_FOLDERS = {
    "cse.24bcsg59@silicon.ac.in": "https://drive.google.com/drive/folders/1dXmr_YZ7OmWdtuYwyptgG1tY0ljlTb13", // Anikesh Ransingh
    "cse.24bcsa13@silicon.ac.in": "https://drive.google.com/drive/folders/140EKI47EgAYuHFGhJ060noJzlM0gmY1J", // Gayatri Pati
    "cse.24bcsh39@silicon.ac.in": "https://drive.google.com/drive/folders/1m15m8XXdsI1aBcaDGZRAioNzDmLxNwxi", // Swastik Ranjan Das
    "cse.24bcsf14@silicon.ac.in": "https://drive.google.com/drive/folders/1xcXT53geSRbbAJdkfB2k7YqcbOrUmM5Q", // Ritika Behera
    "ece.24becf22@silicon.ac.in": "https://drive.google.com/drive/folders/1ki3Ra8uuUBm5YpUUhL-uinDQ0PsO8hjz", // Sindhuja Gouda
    "cse.24bcsg10@silicon.ac.in": "https://drive.google.com/drive/folders/1rh5tdIqayWJ-snSdtJWoQxGGs4gvz-Za", // Abhisekh Mohanty
    "cse.25bcsl20@silicon.ac.in": "https://drive.google.com/drive/folders/1MqCVXnfA6QjN_DdS9CpTB5h0N95BdNGw", // Prithwish Sarkar
    "cse.24bcsf23@silicon.ac.in": "https://drive.google.com/drive/folders/1MlSzVq-sMNeDnpgIG_QerWY2lSoLjdmZ", // Smruti Ranjan Nayak
    "cse.24bcsh51@silicon.ac.in": "https://drive.google.com/drive/folders/1WKCj8jk0JUg0uiM9dTVLuXtc3XIwPv9W", // Deepakshi Nayak
    "cse.24bcsc59@silicon.ac.in": "https://drive.google.com/drive/folders/1Q58Wmg-PKSJZTjxql_ekVly5jcAGB28Z", // Eva Adyasha Dash
    "ece.24becf01@silicon.ac.in": "https://drive.google.com/drive/folders/154KS_7pFlPyD2tMa2_vBxSytxgixOG52", // Priyanshu Kumar Singh
    "ece.24bece88@silicon.ac.in": "https://drive.google.com/drive/folders/1YqD_NTx8tv5SWb2Uxtw6t0Npy7xp0FiD", // Abhigyan Dash
    "ece.24bech61@silicon.ac.in": "https://drive.google.com/drive/folders/10wiSc2FqJP-uKkqolo5ejUsCHLTYmnAY", // Abinash Nanda
    "ece.24beca89@silicon.ac.in": "https://drive.google.com/drive/folders/1Hz9Qmg9DC0i2e3TYdU2OXn30uaA2YTC4", // Rajashree Priyadarshini Bihari
    "ece.24bece58@silicon.ac.in": "https://drive.google.com/drive/folders/1PZI9aLPeX0UJraucmhVH6rBpkCOneTQe", // Tapaswini Sahoo
    "eee.24beeg29@silicon.ac.in": "https://drive.google.com/drive/folders/1U1Z2iIvhaSgkgJ0c-qU82n0OyHrRGsrX", // Jayprakash Sahu
    "eee.24beeb59@silicon.ac.in": "https://drive.google.com/drive/folders/1bKG4YBKIPJc3XEXc1iByj2EeOd-5c3vB", // Sammona Mohanty
  };

  const LINKS = {
    driveMaster: `https://drive.google.com/drive/folders/${MASTER_FOLDER_ID}`,
    tracker: "https://docs.google.com/spreadsheets/d/114XhDWMKLSjj-BBIxM2vFlbVRs__nYeUqfcjTVXDS3Q/edit",
    portfolios: "https://drive.google.com/drive/folders/1KrrMdJzAKYyRGJWTyEFdnITyfC6HGJl4"  // 02-Portfolios root
  };

  /* Expose to admin code (script.js) so the admin portfolio view can resolve
     each student's existing Drive folder for the 'drive' destination. */
  window.PORTFOLIO_FOLDERS = PORTFOLIO_FOLDERS;
  window.PORTFOLIO_LINKS = LINKS;

  /* ── Session slides on Google Drive ──────────────────────── */
  const SESSION_SLIDES = {
    0: { name: "📖 Course Intro", url: "https://docs.google.com/presentation/d/11CJwmvOzSTxzj1t5rKM8Ebp5mS64xTyR" },
    1: { name: "🧱 HRIS Foundations", url: "https://docs.google.com/presentation/d/1cjV3a-DeUQjO_Lx-ICrdKYy76zJfj1m4" },
    2: { name: "🗄️ Data Modeling & Org Architecture", url: "https://docs.google.com/presentation/d/1TcmOA88B8bPVXbZl6bICx7SI2oZzR9blKeFcZbYgx54" },
    3: { name: "🎯 Talent Acquisition & ATS", url: "https://docs.google.com/presentation/d/1s7m-aAkmA9DJGqz_Nd-CViHzD30rqX8C13-4stBpReM" },
    4: { name: "🌍 Onboarding & Global Compliance", url: "https://docs.google.com/presentation/d/17ZDvzaqmXoYVludGiOszzC8Drgghz_IMc-R1d7az1x0" },
    5: { name: "⏱️ Time & Attendance", url: "https://docs.google.com/presentation/d/1AbiwT5jC90fTp-sylAWEyhzq3DmvrUYt" },
    6: { name: "💰 Payroll & Compensation", url: "https://docs.google.com/presentation/d/1PLb7KvAi11RFCSnlcLDgaof_RCmg3ZFz1ptSISF2Hwk" },
    7: { name: "📈 Performance Management", url: "https://docs.google.com/presentation/d/1smsmuIOrk6loVUfjM-sfQLLNIwnk2W6Y" },
    8: { name: "🧠 Learning, Succession & Analytics", url: "https://docs.google.com/presentation/d/1VS4DmbW0EZAs_Tg5sgmzDugYC3i8sity" },
    9: { name: "🔒 Service Delivery & Security", url: "https://docs.google.com/presentation/d/19X_shDoE9PLslWSsnz3DXDIaG6x_-i2y" },
    10: { name: "🔗 Integration, Analytics & Roadmap", url: "https://docs.google.com/presentation/d/1Oyi8ByK6QVAxT2AooDcrl6jVmh60a0jB" },
  };
  const SIM_INSTRUCTIONS_URL = "https://docs.google.com/presentation/d/1fzdvOpQVGNROKsjOsVkULV2uhcIVBlmG";
  const SLIDES_FOLDER_URL = "https://drive.google.com/drive/folders/1Oe6G2mGYE73wti9hMlANawZuOKsa4Oae";
  const WEEK_DELIVERABLES = {
    1: {
      sprint: "Foundation Assessment",
      event: "GlobalTech scenario reveal & team formation",
      items: [
        "Current state analysis",
        "HRIS requirements matrix",
        "High-level system architecture diagram",
        "Project charter"
      ]
    },
    2: {
      sprint: "Data Model & Org Design",
      event: "Event Card #1 — Acquisition Announcement (500-person European co.)",
      items: [
        "Comprehensive ERD for Core HR",
        "Organisational hierarchy design",
        "Job architecture framework",
        "Data dictionary",
        "Effective dating strategy"
      ]
    },
    3: {
      sprint: "Talent Acquisition Blueprint",
      event: "Hire 200 engineers in 3 months",
      items: [
        "End-to-end recruiting workflow diagram",
        "ATS integration architecture (Core HR + external vendors)",
        "Candidate-to-employee data mapping",
        "Compliance checklist"
      ]
    },
    4: {
      sprint: "Global Onboarding Design",
      event: "Event Card #2 — Labor Law Compliance Audit",
      items: [
        "Onboarding workflow design",
        "Compliance matrix",
        "Audit trail design"
      ]
    },
    5: {
      sprint: "Time & Attendance Architecture",
      event: "Event Card #2 continues — remote time tracking",
      items: [
        "Time collection architecture",
        "Business rules engine",
        "Absence accrual algorithm",
        "Time-to-payroll integration flow",
        "Mobile app wireframes"
      ]
    },
    6: {
      sprint: "Payroll & Benefits Design",
      event: "Multi-country expansion",
      items: [
        "Payroll integration design",
        "Error handling workflow",
        "Benefits workflow",
        "Carrier feeds",
        "ACA reporting"
      ]
    },
    7: {
      sprint: "Performance System Design",
      event: "Event Card #3 — Quarterly check-ins overhaul",
      items: [
        "Goal cascading architecture",
        "Performance cycle calendar",
        "Feedback workflow design",
        "360-feedback configuration with privacy controls"
      ]
    },
    8: {
      sprint: "Talent Management Design",
      event: "Event Card #4 — Pay Equity Audit",
      items: [
        "LMS + skills taxonomy",
        "9-box succession model",
        "Calibration model",
        "Pay equity framework",
        "Flight risk dashboard"
      ]
    },
    9: {
      sprint: "Service Delivery & Security Design",
      event: "Event Card #5 — Data Breach Incident",
      items: [
        "HR service delivery architecture (tier model)",
        "RBAC matrix",
        "Privacy impact assessment",
        "Incident response plan",
        "Audit trail design"
      ]
    },
    10: {
      sprint: "Final Capstone — HRMS Proposal",
      event: "Budget Cut (30%)",
      items: [
        "Vendor scorecard",
        "Full system architecture",
        "18-month implementation roadmap",
        "Risk register",
        "Change management plan"
      ]
    }
  };

  /* ── Detect user's team ───────────────────────────────────── */
  function getUserTeam() {
    const s = window.HRFLOW_STATE;
    if (!s || !s.currentUser || !s.teams) return null;
    const email = s.currentUser.email;
    for (const team of s.teams) {
      if (team.members && team.members.includes(email)) {
        return team;
      }
    }
    return null;
  }

  /* ── Render ───────────────────────────────────────────────── */
  function renderDeliverables() {
    const container = document.getElementById("deliverables-content");
    if (!container) return;

    const s = window.HRFLOW_STATE;
    const week = (s && s.activeWeek) || 1;
    const userTeam = getUserTeam();
    const data = WEEK_DELIVERABLES[week] || WEEK_DELIVERABLES[1];

    /* Build submission link */
    let submitHtml = "";
    const studentEmail = s && s.currentUser ? s.currentUser.email : null;
    const isAdmin = !!(s && s.currentUser && s.currentUser.role === "admin");
    if (userTeam) {
      const tf = TEAM_FOLDERS[userTeam.name === "Team-1" ? 1 : userTeam.name === "Team-2" ? 2 : 3];
      const teamLabel = tf ? tf.name : userTeam.name;
      const displayName = (s.currentUser && s.currentUser.displayName) || (studentEmail || "").split("@")[0];
      submitHtml = `
        <div class="deliv-team-badge">👥 Your Team: ${teamLabel}</div>
        <div class="deliv-actions">
          <a class="deliv-btn" href="${tf.url}" target="_blank" rel="noopener">📁 Submit ${teamLabel} Sprint</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
          <a class="deliv-btn deliv-btn-outline" href="https://interactive-polling-1bxf.bolt.host/join/EXRYDY" target="_blank" rel="noopener">📬 Poll & Ask</a>
        </div>
        <p class="deliv-note">🔒 Team sprint folders are visible only to your team members. Have a question the FAQ didn't answer? Use <strong>Poll & Ask</strong>.</p>
        ${studentEmail && !isAdmin ? portfolioWidgetSkeleton() : ""}`;
    } else if (studentEmail && !isAdmin) {
      // Logged-in student with no team — portfolio is individual, still available.
      submitHtml = `
        <div class="deliv-actions">
          <a class="deliv-btn" href="${LINKS.driveMaster}" target="_blank" rel="noopener">📁 Google Drive (Master)</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
          <a class="deliv-btn deliv-btn-outline" href="https://interactive-polling-1bxf.bolt.host/join/EXRYDY" target="_blank" rel="noopener">📬 Poll & Ask</a>
        </div>
        <p class="deliv-note">💡 No team selected yet — but your individual portfolio is ready below. Have a question? Use <strong>Poll & Ask</strong>.</p>
        ${portfolioWidgetSkeleton()}`;
    } else {
      submitHtml = `
        <div class="deliv-actions">
          <a class="deliv-btn" href="${LINKS.driveMaster}" target="_blank" rel="noopener">📁 Google Drive (Master)</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
          <a class="deliv-btn deliv-btn-outline" href="https://interactive-polling-1bxf.bolt.host/join/EXRYDY" target="_blank" rel="noopener">📬 Poll & Ask</a>
        </div>
        <p class="deliv-note">💡 Log in and select your team to see your personalised submission links. Have a question? Use <strong>Poll & Ask</strong>.</p>`;
    }

    /* Build deliverable items */
    let itemsHtml = "";
    data.items.forEach(it => {
      itemsHtml += `<li class="deliv-item">✔ ${it}</li>`;
    });

    container.innerHTML = `
      <div class="deliv-head">
        <span class="deliv-week">Week ${week}</span>
        <h3>${data.sprint}</h3>
        <p class="deliv-event">📌 ${data.event}</p>
      </div>
      <ul class="deliv-list">${itemsHtml}</ul>
      ${submitHtml}
      <div class="deliv-slides">
        <div class="deliv-slides-head">📽️ Session Slides</div>
        <a class="deliv-slide-link" href="${SESSION_SLIDES[week] ? SESSION_SLIDES[week].url : SESSION_SLIDES[1].url}" target="_blank" rel="noopener">
          <span class="deliv-slide-current">📺 Current: ${SESSION_SLIDES[week] ? SESSION_SLIDES[week].name : SESSION_SLIDES[1].name}</span>
        </a>
        <div class="deliv-slide-all">
          ${Object.entries(SESSION_SLIDES).map(([k, v]) =>
            `<a class="deliv-slide-pill" href="${v.url}" target="_blank" rel="noopener">${v.name}</a>`
          ).join('')}
          <a class="deliv-slide-pill deliv-slide-pill-sim" href="${SIM_INSTRUCTIONS_URL}" target="_blank" rel="noopener">🎮 Sim Instructions</a>
        </div>
        <a class="deliv-slide-alllink" href="${SLIDES_FOLDER_URL}" target="_blank" rel="noopener">📂 All slides on Google Drive →</a>
      </div>
    `;
  }

  /* ── Individual Portfolio widget ────────────────────────────────
     Student picks ONE destination: Drive folder (existing) | GitHub | Website.
     GitHub/Website → capture + save a URL to the portfolio_links table (editable anytime).
     Drive → just opens their existing personal folder (no URL needed). */

  const PORTFOLIO_TYPES = [
    { key: "drive",  icon: "📁", label: "Drive folder",  hint: "Use my existing personal folder" },
    { key: "github", icon: "🐙", label: "GitHub",        hint: "I have a repo link for my portfolio" },
    { key: "website",icon: "🌐", label: "Website",       hint: "I have a hosted portfolio / site link" },
  ];

  function portfolioWidgetSkeleton() {
    return `
      <div class="deliv-portfolio" id="deliv-portfolio">
        <div class="deliv-portfolio-head">
          <span class="deliv-portfolio-title">📂 My Individual Portfolio</span>
          <span id="pf-status" class="deliv-portfolio-status"></span>
        </div>
        <div class="deliv-portfolio-grid" id="pf-type-choices"></div>
        <div class="deliv-portfolio-form" id="pf-form"></div>
        <p class="deliv-portfolio-note">Pick where you'll submit your individual portfolio. If you choose <strong>GitHub</strong> or <strong>Website</strong>, paste the link below — it's saved to your record and visible to the instructor. You can change this any time.</p>
      </div>`;
  }

  // Determine this student's current saved choice + the drive fallback URL.
  function portfolioPref() {
    const s = window.HRFLOW_STATE;
    const email = s && s.currentUser ? s.currentUser.email : null;
    return {
      email,
      driveUrl: (email && PORTFOLIO_FOLDERS[email]) || LINKS.portfolios,
    };
  }

  function portfolioSupabase() {
    const s = window.HRFLOW_STATE;
    return (s && s.supabase) ? s.supabase : null;
  }

  async function loadPortfolioRow() {
    const sup = portfolioSupabase();
    const { email } = portfolioPref();
    if (!sup || !email) return null;
    try {
      const { data } = await sup.from("portfolio_links").select("*").eq("user_email", email).maybeSingle();
      return data || null;
    } catch (e) { return null; }
  }

  function renderPortfolioWidget(saved) {
    const { email, driveUrl } = portfolioPref();
    const choicesBox = document.getElementById("pf-type-choices");
    const formBox = document.getElementById("pf-form");
    const status = document.getElementById("pf-status");
    if (!choicesBox) return;

    const chosen = (saved && saved.portfolio_type) || "drive";

    choicesBox.innerHTML = PORTFOLIO_TYPES.map(t =>
      `<button type="button" class="deliv-portfolio-choice${t.key === chosen ? " active" : ""}" data-type="${t.key}" title="${t.hint}">
         <span class="deliv-portfolio-choice-icon">${t.icon}</span>
         <span class="deliv-portfolio-choice-label">${t.label}</span>
       </button>`).join("");

    arraySelector(".deliv-portfolio-choice").forEach(btn => {
      btn.addEventListener("click", () => selectPortfolioType(btn.dataset.type));
    });

    renderPortfolioForm(chosen, saved, driveUrl);

    if (status) {
      status.innerHTML = chosen === "drive"
        ? `Using my personal Drive folder`
        : `Saved: <a href="${escapeHtml((saved && saved.url) || "#")}" target="_blank" rel="noopener" class="deliv-portfolio-link">${(saved && saved.url) ? escapeHtml(shortUrl(saved.url)) : "no link yet"}</a>`;
      status.style.display = "";
    }
  }

  function renderPortfolioForm(chosen, saved, driveUrl) {
    const formBox = document.getElementById("pf-form");
    if (!formBox) return;

    if (chosen === "drive") {
      formBox.innerHTML = `
        <div class="deliv-portfolio-drive">
          <span class="deliv-portfolio-drive-icon">📁</span>
          <span>Your personal folder is ready —</span>
          <a class="deliv-btn deliv-btn-ghost" href="${escapeHtml(driveUrl)}" target="_blank" rel="noopener">📂 Open my portfolio folder</a>
        </div>`;
      return;
    }

    const label = chosen === "github" ? "GitHub repository link" : "Website link";
    const placeholderText = chosen === "github"
      ? "https://github.com/you/your-portfolio-repo"
      : "https://yoursite.example.com";
    const currentUrl = (saved && saved.portfolio_type === chosen && saved.url) ? saved.url : "";
    formBox.innerHTML = `
      <div class="deliv-portfolio-urlrow">
        <input id="pf-url" type="url" class="deliv-portfolio-input"
          placeholder="${placeholderText}" value="${escapeHtml(currentUrl)}" />
        <button id="pf-save" type="button" class="primary" style="font-size:0.8rem">💾 Save Link</button>
      </div>
      <p id="pf-save-msg" class="small muted" style="font-size:0.75rem"></p>`;

    const input = document.getElementById("pf-url");
    const saveBtn = document.getElementById("pf-save");
    const msg = document.getElementById("pf-save-msg");
    if (!input || !saveBtn) return;

    const doSave = async () => {
      const url = (input.value || "").trim();
      if (!/^https?:\/\/.+\..+/.test(url)) {
        msg.textContent = "Please enter a full link starting with https://";
        return;
      }
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving…";
      const sup = portfolioSupabase();
      const { email } = portfolioPref();
      const payload = {
        user_email: email,
        portfolio_type: chosen,
        url,
        updated_at: new Date().toISOString(),
      };
      try {
        const { error } = await sup.from("portfolio_links").upsert(payload, { onConflict: "user_email" });
        if (error) throw error;
        msg.textContent = `✓ Saved — ${chosen === "github" ? "GitHub" : "Website"} link updated.`;
        msg.style.color = "#059669";
        msg.style.display = "";
        if (window.refreshDeliverables) window.refreshDeliverables(); // refresh status line
      } catch (e) {
        msg.textContent = `Save failed: ${(e.message || e).toString().slice(0, 140)}`;
        msg.style.color = "#b91c1c";
        msg.style.display = "";
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save Link";
      }
    };

    saveBtn.addEventListener("click", doSave);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSave(); });
  }

  function selectPortfolioType(type) {
    arraySelector(".deliv-portfolio-choice").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });
    // Save the type choice immediately (drive needs no url; github/website get the form).
    const sup = portfolioSupabase();
    const { email } = portfolioPref();
    if (!sup || !email) return;
    sup.from("portfolio_links").upsert(
      { user_email: email, portfolio_type: type, updated_at: new Date().toISOString() },
      { onConflict: "user_email" }).then(({ error }) => {
        const status = document.getElementById("pf-status");
        if (status) status.textContent = type === "drive"
          ? "Using my personal Drive folder"
          : (error ? "Type saved (link pending)" : "Choice saved — now add your link ↓");
      });
    renderPortfolioForm(type, null, portfolioPref().driveUrl);
  }

  function shortUrl(u) {
    try { return u.replace(/^https?:\/\//, "").replace(/\/$/, ""); } catch (e) { return u; }
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function arraySelector(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  async function hydratePortfolioWidget() {
    const widget = document.getElementById("deliv-portfolio");
    const sup = portfolioSupabase();
    const { email } = portfolioPref();
    if (!widget || !sup || !email) return;
    const saved = await loadPortfolioRow();
    renderPortfolioWidget(saved || {});
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    renderDeliverables();
    window.refreshDeliverables = renderDeliverables;
    window.refreshPortfolio = hydratePortfolioWidget;

    // Poll for state to become available
    let tries = 0;
    const poll = setInterval(() => {
      if (window.HRFLOW_STATE) {
        clearInterval(poll);
        renderDeliverables();
        hydratePortfolioWidget();
      } else if (++tries > 40) {
        clearInterval(poll);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();