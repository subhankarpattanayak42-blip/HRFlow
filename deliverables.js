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

  /* ── Session slides on Google Drive ──────────────────────── */
  const SESSION_SLIDES = {
    0: { name: "📖 Course Intro", url: "https://docs.google.com/presentation/d/11CJwmvOzSTxzj1t5rKM8Ebp5mS64xTyR" },
    1: { name: "🧱 HRIS Foundations", url: "https://docs.google.com/presentation/d/1cjV3a-DeUQjO_Lx-ICrdKYy76zJfj1m4" },
    2: { name: "🗄️ Data Modeling & Org Architecture", url: "https://docs.google.com/presentation/d/1kLl41NttJXtT7okmqHHicWDGVXnx7ebt" },
    3: { name: "🎯 Talent Acquisition & ATS", url: "https://docs.google.com/presentation/d/1EWN5GWWzVDRONL4B1k7-u3hi3lg_03kK" },
    4: { name: "🌍 Onboarding & Global Compliance", url: "https://docs.google.com/presentation/d/1tTZ_r5nz_4Hd-E6Ygm1PFNGj13ATin-O" },
    5: { name: "⏱️ Time & Attendance", url: "https://docs.google.com/presentation/d/1rWxGXsIxkSj_gekgWF5zefFNvjrLsOcZ" },
    6: { name: "💰 Payroll & Compensation", url: "https://docs.google.com/presentation/d/170RsUz68kAJXTVuNXvbCY-gvHAMB1-1Y" },
    7: { name: "📈 Performance Management", url: "https://docs.google.com/presentation/d/1GBx2F4RM66gCGFwAOl6s4qDxn6l6X9qM" },
    8: { name: "🧠 Learning, Succession & Analytics", url: "https://docs.google.com/presentation/d/1VroYxm05v44L2osNqEb4Atx6BJqD-DO6" },
    9: { name: "🔒 Service Delivery & Security", url: "https://docs.google.com/presentation/d/1xn0kRwVds8gt_CFvzkEJj-86mD8qzYUl" },
    10: { name: "🔗 Integration, Analytics & Roadmap", url: "https://docs.google.com/presentation/d/1FT0q7_W2Vj7rt-m-9gvGPSzU-rMWiqEF" },
  };
  const SIM_INSTRUCTIONS_URL = "https://docs.google.com/presentation/d/105JWvqXTZZ5hPE2ftbO8AO57jV4wJvwK";
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
    if (userTeam) {
      const tf = TEAM_FOLDERS[userTeam.name === "Team-1" ? 1 : userTeam.name === "Team-2" ? 2 : 3];
      const studentEmail = s.currentUser.email;
      const portfolioUrl = PORTFOLIO_FOLDERS[studentEmail] || LINKS.portfolios;
      const teamLabel = tf ? tf.name : userTeam.name;
      const displayName = s.currentUser.displayName || studentEmail.split("@")[0];
      submitHtml = `
        <div class="deliv-team-badge">👥 Your Team: ${teamLabel}</div>
        <div class="deliv-actions">
          <a class="deliv-btn" href="${tf.url}" target="_blank" rel="noopener">📁 Submit ${teamLabel} Sprint</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
          <a class="deliv-btn deliv-btn-ghost" href="${portfolioUrl}" target="_blank" rel="noopener">📂 My Portfolio (${displayName})</a>
          <a class="deliv-btn deliv-btn-outline" href="https://interactive-polling-1bxf.bolt.host/join/EXRYDY" target="_blank" rel="noopener">📬 Poll & Ask</a>
        </div>
        <p class="deliv-note">🔒 Team sprint folders are visible only to your team members. Portfolio folders are individual — only you and the instructor can see yours. Have a question the FAQ didn't answer? Use <strong>Poll & Ask</strong>.</p>`;
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

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    renderDeliverables();
    window.refreshDeliverables = renderDeliverables;

    // Poll for state to become available
    let tries = 0;
    const poll = setInterval(() => {
      if (window.HRFLOW_STATE) {
        clearInterval(poll);
        renderDeliverables();
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