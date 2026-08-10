/* ═══════════════════════════════════════════════════════════════
   MG3003 — HR Flow Lab · Weekly Deliverables & Submission Panel
   Maps each activated week to its sprint deliverables + submission links.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* Submission destinations (shared across all weeks) */
  const SUBMISSION_LINKS = {
    drive: "https://drive.google.com/drive/folders/1GRHwPgOFTP9x9xbfOMm0DV3w6Zb30Wqs",
    tracker: "https://docs.google.com/spreadsheets/d/114XhDWMKLSjj-BBIxM2vFlbVRs__nYeUqfcjTVXDS3Q/edit"
  };

  /* Per-week deliverables: sprint name, event, and the deliverable list */
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

  /* ── Render the deliverables panel ─────────────────────────── */
  function renderDeliverables() {
    const container = document.getElementById("deliverables-content");
    if (!container) return;

    // Access global state from app
    const week = (window.HRFLOW_STATE && window.HRFLOW_STATE.activeWeek) || 1;
    const data = WEEK_DELIVERABLES[week] || WEEK_DELIVERABLES[1];

    let html = `
      <div class="deliv-head">
        <span class="deliv-week">Week ${week}</span>
        <h3>${data.sprint}</h3>
        <p class="deliv-event">📌 ${data.event}</p>
      </div>
      <ul class="deliv-list">
    `;
    data.items.forEach(it => {
      html += `<li class="deliv-item">✔ ${it}</li>`;
    });
    html += `</ul>
      <div class="deliv-actions">
        <a class="deliv-btn" href="${SUBMISSION_LINKS.drive}" target="_blank" rel="noopener">📁 Submit in Google Drive</a>
        <a class="deliv-btn deliv-btn-ghost" href="${SUBMISSION_LINKS.tracker}" target="_blank" rel="noopener">📊 Master Tracker Sheet</a>
      </div>`;

    container.innerHTML = html;
  }

  /* ── Init: render on load and whenever the app exposes state ── */
  function init() {
    // Try immediate render (script loads before app state is set)
    renderDeliverables();

    // Expose refresh so script.js can call it on week change
    window.refreshDeliverables = renderDeliverables;

    // Poll for when the app sets window.HRFLOW_STATE (if it does)
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