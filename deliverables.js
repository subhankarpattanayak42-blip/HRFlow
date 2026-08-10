/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · Weekly Deliverables & Submission Panel
   Team-aware: shows personalized links based on logged-in user's team.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Submission destinations ────────────────────────────────
     Each team has its own sprint subfolders inside the master Drive.
     Folder URLs are constructed from the parent + team subfolder.
     Update these IDs once the Drive structure is finalised. */

  const MASTER_FOLDER_ID = "1GRHwPgOFTP9x9xbfOMm0DV3w6Zb30Wqs";

  const TEAM_FOLDERS = {
    1: { name: "Team-1", url: "https://drive.google.com/drive/folders/" },  // ← Insert Team-1 folder ID
    2: { name: "Team-2", url: "https://drive.google.com/drive/folders/" },  // ← Insert Team-2 folder ID
    3: { name: "Team-3", url: "https://drive.google.com/drive/folders/" },  // ← Insert Team-3 folder ID
  };

  const LINKS = {
    driveMaster: `https://drive.google.com/drive/folders/${MASTER_FOLDER_ID}`,
    tracker: "https://docs.google.com/spreadsheets/d/114XhDWMKLSjj-BBIxM2vFlbVRs__nYeUqfcjTVXDS3Q/edit",
    portfolios: `https://drive.google.com/drive/folders/${MASTER_FOLDER_ID}`  // 02-Portfolios subfolder
  };

  /* ── Per-week deliverables ────────────────────────────────── */
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
      // If the folder URL has a real ID, use it; otherwise fall back to master
      const driveHref = (tf && tf.url.length > 45)
        ? `${tf.url}`
        : `${LINKS.driveMaster}`;
      const teamLabel = tf ? tf.name : userTeam.name;
      // Individual portfolio link — student name from email
      const studentName = s.currentUser.email.split("@")[0];
      submitHtml = `
        <div class="deliv-team-badge">👥 Your Team: ${teamLabel}</div>
        <div class="deliv-actions">
          <a class="deliv-btn" href="${driveHref}" target="_blank" rel="noopener">📁 Submit ${teamLabel} Sprint</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.portfolios}" target="_blank" rel="noopener">📂 My Portfolio (${studentName})</a>
        </div>
        <p class="deliv-note">🔒 Team sprint folders are visible only to your team members. Portfolio folders are individual — only you and the instructor can see yours.</p>`;
    } else {
      submitHtml = `
        <div class="deliv-actions">
          <a class="deliv-btn" href="${LINKS.driveMaster}" target="_blank" rel="noopener">📁 Google Drive (Master)</a>
          <a class="deliv-btn deliv-btn-ghost" href="${LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
        </div>
        <p class="deliv-note">💡 Log in and select your team to see your personalised submission links.</p>`;
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