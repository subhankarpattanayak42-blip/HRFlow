const BASELINE_METRICS = {
  talentQuality: 55,
  employeeTrust: 55,
  legalSafety: 55,
  hrEfficiency: 55,
  budgetHealth: 55,
};

const modules = [
  { id: "workforce", title: "Workforce Planning", sendsTo: "Recruitment" },
  { id: "recruitment", title: "Recruitment", sendsTo: "Onboarding" },
  { id: "onboarding", title: "Onboarding", sendsTo: "Payroll" },
  { id: "payroll", title: "Payroll", sendsTo: "Compliance" },
  { id: "performance", title: "Performance", sendsTo: "L&D" },
  { id: "learning", title: "L&D", sendsTo: "Career Paths" },
  { id: "compliance", title: "Compliance", sendsTo: "Leadership" },
  { id: "relations", title: "Employee Relations", sendsTo: "Policy Updates" },
];

const defaultScenarios = [
  {
    module: "Recruitment",
    title: "High attrition in software team",
    description: "You must fill 14 engineering roles in 5 weeks without lowering hiring quality.",
    options: [
      {
        text: "Use structured interviews + scorecards across all panels.",
        flow: "Recruitment -> Performance -> L&D",
        impact: { talentQuality: 12, hrEfficiency: 5, budgetHealth: -4 },
      },
      {
        text: "Use fastest-hire approach and skip technical calibration.",
        flow: "Recruitment -> Onboarding (rework)",
        impact: { hrEfficiency: 8, talentQuality: -11, employeeTrust: -3 },
      },
      {
        text: "Pause hiring for process redesign and employer-brand campaign.",
        flow: "Workforce Planning -> Recruitment",
        impact: { talentQuality: 4, budgetHealth: -8, hrEfficiency: -6 },
      },
    ],
  },
  {
    module: "Onboarding",
    title: "New joiners are confused in week 1",
    description: "Managers report delayed productivity and policy misunderstandings.",
    options: [
      {
        text: "Launch a 30-day onboarding checklist and buddy system.",
        flow: "Onboarding -> Employee Relations -> Performance",
        impact: { employeeTrust: 11, hrEfficiency: 6, budgetHealth: -2 },
      },
      {
        text: "Send one PDF handbook and track sign-offs only.",
        flow: "Onboarding -> Compliance",
        impact: { legalSafety: 4, employeeTrust: -7, talentQuality: -2 },
      },
      {
        text: "Run mandatory live bootcamp for all new hires.",
        flow: "Onboarding -> L&D",
        impact: { talentQuality: 5, budgetHealth: -7, employeeTrust: 4 },
      },
    ],
  },
  {
    module: "Payroll",
    title: "Payroll errors triggered complaints",
    description: "Three salary miscalculations reached social media and leadership is concerned.",
    options: [
      {
        text: "Introduce double-validation workflow and monthly audits.",
        flow: "Payroll -> Compliance -> Employee Relations",
        impact: { legalSafety: 10, employeeTrust: 8, hrEfficiency: -3 },
      },
      {
        text: "Outsource payroll quickly to cut immediate pressure.",
        flow: "Payroll -> Vendor Mgmt -> Compliance",
        impact: { hrEfficiency: 6, budgetHealth: -5, employeeTrust: -2 },
      },
      {
        text: "Ignore complaints unless formal tickets are raised.",
        flow: "Payroll (blocked)",
        impact: { employeeTrust: -12, legalSafety: -9, budgetHealth: 2 },
      },
    ],
  },
  {
    module: "Performance",
    title: "Mid-year review fairness dispute",
    description: "Students playing as managers report inconsistent ratings across teams.",
    options: [
      {
        text: "Deploy calibration committee and clear rating rubric.",
        flow: "Performance -> Leadership -> Compensation",
        impact: { employeeTrust: 9, talentQuality: 6, hrEfficiency: -2 },
      },
      {
        text: "Let every manager decide independently.",
        flow: "Performance -> Employee Relations (conflict)",
        impact: { hrEfficiency: 4, employeeTrust: -10, legalSafety: -4 },
      },
      {
        text: "Freeze all ratings and defer promotions.",
        flow: "Performance -> Retention Risk",
        impact: { budgetHealth: 6, employeeTrust: -8, talentQuality: -6 },
      },
    ],
  },
  {
    module: "L&D",
    title: "Skill gaps hurt project delivery",
    description: "Critical projects slowed because analysts lack negotiation and analytics capabilities.",
    options: [
      {
        text: "Create role-based learning paths tied to performance goals.",
        flow: "L&D -> Performance -> Career Paths",
        impact: { talentQuality: 10, employeeTrust: 6, budgetHealth: -4 },
      },
      {
        text: "Offer generic e-learning library with no follow-up.",
        flow: "L&D -> HRIS",
        impact: { hrEfficiency: 3, talentQuality: -4, employeeTrust: -3 },
      },
      {
        text: "Train only top 10% high performers.",
        flow: "L&D -> Succession",
        impact: { talentQuality: 4, budgetHealth: 2, employeeTrust: -8 },
      },
    ],
  },
  {
    module: "Compliance",
    title: "Audit revealed policy gaps",
    description: "An external audit flagged missing documentation for overtime and leave approvals.",
    options: [
      {
        text: "Digitize policy acknowledgements and manager reminders.",
        flow: "Compliance -> Payroll -> Leadership",
        impact: { legalSafety: 12, hrEfficiency: 5, budgetHealth: -3 },
      },
      {
        text: "Run one-time compliance workshop and move on.",
        flow: "Compliance -> L&D",
        impact: { legalSafety: 4, employeeTrust: 2, hrEfficiency: 1 },
      },
      {
        text: "Request exceptions until next quarter.",
        flow: "Compliance (risk grows)",
        impact: { legalSafety: -11, budgetHealth: 3, employeeTrust: -4 },
      },
    ],
  },
  {
    module: "Employee Relations",
    title: "Conflict between two project leads",
    description: "The dispute is affecting team morale and productivity in a flagship initiative.",
    options: [
      {
        text: "Mediation with action commitments and check-ins.",
        flow: "Employee Relations -> Performance -> Retention",
        impact: { employeeTrust: 10, hrEfficiency: 4, budgetHealth: -2 },
      },
      {
        text: "Transfer one lead without discussion.",
        flow: "Employee Relations -> Workforce Planning",
        impact: { hrEfficiency: 5, employeeTrust: -9, talentQuality: -3 },
      },
      {
        text: "Ignore it unless deadlines fail.",
        flow: "Employee Relations (deterioration)",
        impact: { employeeTrust: -12, talentQuality: -4, budgetHealth: -3 },
      },
    ],
  },
  {
    module: "Capstone",
    title: "Board asks for people strategy summary",
    description: "End of semester review: show what changed, where flow failed, and what to improve next.",
    options: [
      {
        text: "Present integrated dashboard linking all module outcomes.",
        flow: "All Modules -> Strategy",
        impact: { hrEfficiency: 8, legalSafety: 4, employeeTrust: 4 },
      },
      {
        text: "Highlight only hiring numbers and budget savings.",
        flow: "Recruitment + Finance only",
        impact: { budgetHealth: 4, talentQuality: -2, employeeTrust: -3 },
      },
      {
        text: "Skip metrics and present anecdotal stories.",
        flow: "No flow visibility",
        impact: { hrEfficiency: -8, legalSafety: -3, employeeTrust: -2 },
      },
    ],
  },
];

const metricLabels = {
  talentQuality: "Talent Quality",
  employeeTrust: "Employee Trust",
  legalSafety: "Legal Safety",
  hrEfficiency: "HR Efficiency",
  budgetHealth: "Budget Health",
};

const state = {
  supabase: null,
  connected: false,
  currentUser: null,
  teams: [],
  customScenarios: [],
  results: [],
  selectedTeamId: "",
  authListenerSet: false,
};

const refs = {
  registerForm: document.getElementById("register-form"),
  loginForm: document.getElementById("login-form"),
  registerName: document.getElementById("register-name"),
  registerEmail: document.getElementById("register-email"),
  registerPassword: document.getElementById("register-password"),
  registerRole: document.getElementById("register-role"),
  registerRoleWrap: document.getElementById("register-role-wrap"),
  loginName: document.getElementById("login-name"),
  loginPassword: document.getElementById("login-password"),
  authMessage: document.getElementById("auth-message"),
  sessionBanner: document.getElementById("session-banner"),
  logoutBtn: document.getElementById("logout-btn"),
  teamSelect: document.getElementById("team-select"),
  teamName: document.getElementById("team-name"),
  teamCreateWrap: document.getElementById("team-create-wrap"),
  createTeamBtn: document.getElementById("create-team-btn"),
  memberName: document.getElementById("member-name"),
  teamMemberWrap: document.getElementById("team-member-wrap"),
  addMemberBtn: document.getElementById("add-member-btn"),
  teamMembers: document.getElementById("team-members"),
  startBtn: document.getElementById("start-btn"),
  resetRunBtn: document.getElementById("reset-run-btn"),
  stats: document.getElementById("stats"),
  moduleMap: document.getElementById("module-map"),
  scenarioBox: document.getElementById("scenario-box"),
  options: document.getElementById("options"),
  timeline: document.getElementById("timeline"),
  roundLabel: document.getElementById("round-label"),
  summary: document.getElementById("summary"),
  leaderboard: document.getElementById("leaderboard"),
  leaderboardPanel: document.getElementById("leaderboard-panel"),
  analytics: document.getElementById("analytics"),
  analyticsPanel: document.getElementById("analytics-panel"),
  adminPanel: document.getElementById("admin-panel"),
  adminModule: document.getElementById("admin-module"),
  adminTitle: document.getElementById("admin-title"),
  adminDescription: document.getElementById("admin-description"),
  adminOptions: document.getElementById("admin-options"),
  addOptionBtn: document.getElementById("add-option-btn"),
  saveScenarioBtn: document.getElementById("save-scenario-btn"),
  seedOptionsBtn: document.getElementById("seed-options-btn"),
  adminMessage: document.getElementById("admin-message"),
  wipeResultsBtn: document.getElementById("wipe-results-btn"),
  resetSessionsBtn: document.getElementById("reset-sessions-btn"),
  wipeAllBtn: document.getElementById("wipe-all-btn"),
};

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function metricTone(value) {
  if (value >= 70) return "var(--ok)";
  if (value >= 40) return "var(--warn)";
  return "var(--bad)";
}

function showMessage(ref, text, isError = false) {
  ref.textContent = text;
  ref.style.color = isError ? "var(--bad)" : "var(--muted)";
}

function isAdminUser() {
  return !!(state.currentUser && state.currentUser.role === "admin");
}

function getScenarios() {
  const mappedCustom = state.customScenarios.map((row) => ({
    id: row.id,
    module: row.module,
    title: row.title,
    description: row.description,
    options: row.options,
  }));
  return [...defaultScenarios, ...mappedCustom];
}

function freshSession() {
  return {
    currentRound: 0,
    metrics: { ...BASELINE_METRICS },
    started: false,
    completed: false,
    log: [],
    resultSaved: false,
    updatedAt: nowISO(),
  };
}

function getTeam() {
  return state.teams.find((team) => team.id === state.selectedTeamId) || null;
}

function getSession() {
  const team = getTeam();
  if (!team) return null;
  if (!team.session || typeof team.session !== "object") {
    team.session = freshSession();
  }
  return team.session;
}

function overallGrade(metrics) {
  const avg = Math.round(
    Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length
  );

  if (avg >= 80) return { score: avg, label: "A - Strategic HR Leader" };
  if (avg >= 65) return { score: avg, label: "B - Strong HR Operator" };
  if (avg >= 50) return { score: avg, label: "C - Developing HR Manager" };
  return { score: avg, label: "D - High Process Risk" };
}

async function connectSupabase(url, anonKey) {
  try {
    if (!window.supabase || !window.supabase.createClient) {
      showMessage(refs.authMessage, "Supabase SDK failed to load.", true);
      return;
    }

    if (!url || !anonKey) {
      showMessage(refs.authMessage, "Supabase config is missing in index file.", true);
      return;
    }

    state.supabase = window.supabase.createClient(url, anonKey);
    state.connected = true;

  if (!state.authListenerSet) {
    state.supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user) {
        const ok = await hydrateCurrentUser(session.user);
        if (ok) {
          await loadRemoteData();
        }
      } else {
        state.currentUser = null;
        state.teams = [];
        state.customScenarios = [];
        state.results = [];
        state.selectedTeamId = "";
      }
      refreshUI();
    });
    state.authListenerSet = true;
  }

    const { data, error } = await state.supabase.auth.getSession();
    if (error) {
      showMessage(refs.authMessage, `Connection failed: ${error.message}`, true);
      state.connected = false;
      return;
    }

    if (data.session && data.session.user) {
      const ok = await hydrateCurrentUser(data.session.user);
      if (ok && state.currentUser) {
        await loadRemoteData();
        showMessage(refs.authMessage, `Session restored for ${state.currentUser.displayName}.`);
      } else {
        showMessage(refs.authMessage, "Connected, but profile restoration failed.", true);
      }
    } else {
      showMessage(refs.authMessage, "Connected to database. Please login.");
    }
  } catch (error) {
    state.connected = false;
    showMessage(refs.authMessage, `Connection exception: ${error.message}`, true);
  }

  refreshUI();
}

async function hydrateCurrentUser(user) {
  if (!state.supabase) return;

  const { data, error } = await state.supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    showMessage(refs.authMessage, `Profile fetch failed: ${error.message}`, true);
    return;
  }

  let profile = data;
  if (!profile) {
    const meta = user.user_metadata || {};
    const fallbackName = meta.display_name || user.email.split("@")[0];
    const fallbackRole = meta.role || "student";
    const inserted = await state.supabase.from("profiles").insert({
      id: user.id,
      display_name: fallbackName,
      role: fallbackRole,
    });

    if (inserted.error) {
      showMessage(refs.authMessage, `Profile creation failed: ${inserted.error.message}`, true);
      return false;
    }

    profile = { id: user.id, display_name: fallbackName, role: fallbackRole };
  }

  state.currentUser = {
    id: user.id,
    email: user.email,
    displayName: profile.display_name,
    role: profile.role,
  };
  return true;
}

async function loadRemoteData() {
  if (!state.supabase || !state.currentUser) return;

  const [teamsRes, customRes, resultsRes] = await Promise.all([
    state.supabase.from("teams").select("*").order("created_at", { ascending: true }),
    state.supabase.from("custom_scenarios").select("*").order("created_at", { ascending: true }),
    state.supabase.from("results").select("*").order("completed_at", { ascending: false }),
  ]);

  if (teamsRes.error || customRes.error || resultsRes.error) {
    const msg = teamsRes.error?.message || customRes.error?.message || resultsRes.error?.message;
    showMessage(refs.authMessage, `Data load failed: ${msg}`, true);
    return;
  }

  state.teams = (teamsRes.data || []).map((team) => ({
    ...team,
    members: Array.isArray(team.members) ? team.members : [],
    session: team.session || freshSession(),
  }));
  state.customScenarios = customRes.data || [];
  state.results = resultsRes.data || [];

  if (!state.selectedTeamId && state.teams.length) {
    state.selectedTeamId = state.teams[0].id;
  }
}

async function persistTeam(team) {
  if (!state.supabase || !team) return false;
  const { error } = await state.supabase
    .from("teams")
    .update({
      members: team.members,
      session: team.session,
      updated_at: nowISO(),
    })
    .eq("id", team.id);

  if (error) {
    showMessage(refs.authMessage, `Failed to save team state: ${error.message}`, true);
    return false;
  }

  return true;
}

function renderSessionBanner() {
  if (!state.connected) {
    refs.sessionBanner.textContent = "Backend not connected";
    refs.logoutBtn.disabled = true;
    return;
  }

  if (!state.currentUser) {
    refs.sessionBanner.textContent = "Connected | Not logged in";
    refs.logoutBtn.disabled = true;
    return;
  }

  const team = getTeam();
  const teamLabel = team ? ` | Team: ${team.name}` : "";
  refs.sessionBanner.textContent = `${state.currentUser.displayName} (${state.currentUser.role})${teamLabel}`;
  refs.logoutBtn.disabled = false;
}

function renderTeamSelect() {
  refs.teamSelect.innerHTML = "";

  if (!state.currentUser) {
    refs.teamSelect.innerHTML = `<option value="">Login to manage teams</option>`;
    refs.teamSelect.disabled = true;
    return;
  }

  refs.teamSelect.disabled = false;
  refs.teamSelect.innerHTML = `<option value="">Select team</option>`;
  state.teams.forEach((team) => {
    const option = document.createElement("option");
    option.value = team.id;
    option.textContent = team.name;
    if (team.id === state.selectedTeamId) option.selected = true;
    refs.teamSelect.appendChild(option);
  });
}

function renderTeamMembers() {
  const team = getTeam();
  if (!team) {
    refs.teamMembers.textContent = "No team selected.";
    return;
  }

  const members = team.members.length ? team.members.join(", ") : "No members yet";
  refs.teamMembers.textContent = `Members: ${members}`;
}

function renderModules(activeTitle = "") {
  refs.moduleMap.innerHTML = "";
  modules.forEach((module) => {
    const card = document.createElement("div");
    card.className = "module";
    const isActive = activeTitle.toLowerCase().includes(module.title.toLowerCase());
    if (isActive) card.classList.add("active", "connected");
    card.innerHTML = `<strong>${module.title}</strong><span>sends to: ${module.sendsTo}</span>`;
    refs.moduleMap.appendChild(card);
  });
}

function renderStats() {
  refs.stats.innerHTML = "";
  const session = getSession();
  const metrics = session ? session.metrics : BASELINE_METRICS;

  Object.entries(metrics).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "stat";
    row.innerHTML = `
      <div class="stat-head">
        <span>${metricLabels[key]}</span>
        <strong>${value}</strong>
      </div>
      <div class="bar-wrap">
        <div class="bar" style="width:${value}%; background:${metricTone(value)}"></div>
      </div>
    `;
    refs.stats.appendChild(row);
  });

  const round = session ? session.currentRound : 0;
  refs.roundLabel.textContent = `Round ${round} / ${getScenarios().length}`;
}

function renderTimeline() {
  refs.timeline.innerHTML = "";
  const session = getSession();
  if (!session || !session.log.length) return;

  [...session.log].reverse().forEach((entry) => {
    const item = document.createElement("li");
    const deltas = Object.entries(entry.impact)
      .map(([k, v]) => `${metricLabels[k]} ${v > 0 ? "+" : ""}${v}`)
      .join(" | ");
    item.innerHTML = `<strong>${entry.module}:</strong> ${entry.choice}<small>${entry.flow}</small><small>${deltas}</small>`;
    refs.timeline.appendChild(item);
  });
}

function renderScenario() {
  refs.summary.classList.add("hidden");
  const team = getTeam();
  const session = getSession();

  if (!state.connected) {
    refs.scenarioBox.innerHTML = "<p>Connect Supabase backend first.</p>";
    refs.options.innerHTML = "";
    refs.startBtn.disabled = true;
    return;
  }

  if (!state.currentUser) {
    refs.scenarioBox.innerHTML = "<p>Please login to start simulation.</p>";
    refs.options.innerHTML = "";
    refs.startBtn.disabled = true;
    return;
  }

  refs.startBtn.disabled = !team;
  if (!team) {
    refs.scenarioBox.innerHTML = "<p>Create or select a team to continue.</p>";
    refs.options.innerHTML = "";
    return;
  }

  if (!session.started) {
    refs.scenarioBox.innerHTML = "<p>Select team members and press <strong>Start Simulation</strong>.</p>";
    refs.options.innerHTML = "";
    refs.startBtn.textContent = "Start Simulation";
    return;
  }

  const scenarios = getScenarios();
  refs.startBtn.textContent = session.completed ? "Simulation Complete" : "Resume Simulation";

  if (session.currentRound >= scenarios.length) {
    session.completed = true;
    refs.scenarioBox.innerHTML = "<p>Simulation complete. Review your final report below.</p>";
    refs.options.innerHTML = "";
    renderModules("");
    showSummary();
    return;
  }

  const scenario = scenarios[session.currentRound];
  renderModules(scenario.module);
  refs.scenarioBox.innerHTML = `
    <p class="tag">${scenario.module}</p>
    <h3>${scenario.title}</h3>
    <p>${scenario.description}</p>
  `;

  refs.options.innerHTML = "";
  scenario.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<strong>${option.text}</strong><small>${option.flow}</small>`;
    btn.addEventListener("click", () => {
      void chooseOption(scenario, option);
    });
    refs.options.appendChild(btn);
  });
}

async function addResultIfNeeded(session) {
  if (session.resultSaved || session.resultSaved === "pending") return;
  const team = getTeam();
  if (!team || !state.currentUser) return;

  const grade = overallGrade(session.metrics);
  const payload = {
    team_id: team.id,
    team_name: team.name,
    user_id: state.currentUser.id,
    user_email: state.currentUser.email,
    score: grade.score,
    label: grade.label,
    metrics: session.metrics,
    modules_played: session.log.map((x) => x.module),
    completed_at: nowISO(),
  };

  session.resultSaved = "pending";
  const { error } = await state.supabase.from("results").insert(payload);
  if (error) {
    session.resultSaved = false;
    showMessage(refs.authMessage, `Failed to save result: ${error.message}`, true);
    return;
  }

  session.resultSaved = true;
  await persistTeam(team);
  await loadRemoteData();
}

function showSummary() {
  const session = getSession();
  if (!session) return;

  const grade = overallGrade(session.metrics);
  const strongest = Object.entries(session.metrics).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries(session.metrics).sort((a, b) => a[1] - b[1])[0];

  refs.summary.classList.remove("hidden");
  refs.summary.innerHTML = `
    <h2>Semester Complete</h2>
    <p><strong>Final Score:</strong> ${grade.score}/100 (${grade.label})</p>
    <p><strong>Best Area:</strong> ${metricLabels[strongest[0]]} (${strongest[1]})</p>
    <p><strong>Risk Area:</strong> ${metricLabels[weakest[0]]} (${weakest[1]})</p>
    <p><strong>Reflection Prompt:</strong> Which decision created the best information flow, and which one broke the chain?</p>
    <button id="restart-btn" class="primary" type="button">Play Again (Same Team)</button>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    void (async () => {
      const team = getTeam();
      if (!team) return;
      team.session = freshSession();
      const ok = await persistTeam(team);
      if (ok) refreshUI();
    })();
  });

  void addResultIfNeeded(session).then(() => {
    renderLeaderboard();
    renderAnalytics();
  });
}

async function chooseOption(scenario, option) {
  const session = getSession();
  const team = getTeam();
  if (!session || !team || session.completed) return;

  Object.entries(option.impact).forEach(([key, delta]) => {
    session.metrics[key] = clamp((session.metrics[key] || 0) + delta);
  });

  session.log.push({
    round: session.currentRound,
    module: scenario.module,
    choice: option.text,
    flow: option.flow,
    impact: option.impact,
  });

  session.currentRound += 1;
  session.updatedAt = nowISO();
  if (session.currentRound >= getScenarios().length) {
    session.completed = true;
  }

  const ok = await persistTeam(team);
  if (ok) refreshUI();
}

function renderLeaderboard() {
  refs.leaderboard.innerHTML = "";
  if (!state.results.length) {
    refs.leaderboard.innerHTML = "<li>No completed runs yet.</li>";
    return;
  }

  const top = [...state.results].sort((a, b) => b.score - a.score).slice(0, 10);
  top.forEach((entry, idx) => {
    const item = document.createElement("li");
    const date = new Date(entry.completed_at || entry.completedAt).toLocaleDateString();
    item.innerHTML = `<strong>#${idx + 1} ${entry.team_name || entry.teamName}</strong> - ${entry.score} (${entry.label})<small>Player: ${entry.user_email || "N/A"} | ${date}</small>`;
    refs.leaderboard.appendChild(item);
  });
}

function renderAnalytics() {
  const totalRuns = state.results.length;
  if (!totalRuns) {
    refs.analytics.innerHTML = "<p class='small muted'>Analytics appear after the first completed run.</p>";
    return;
  }

  const averageScore = Math.round(
    state.results.reduce((sum, record) => sum + record.score, 0) / totalRuns
  );

  const metricAvg = {};
  Object.keys(BASELINE_METRICS).forEach((key) => {
    metricAvg[key] = Math.round(
      state.results.reduce((sum, record) => sum + ((record.metrics || {})[key] || 0), 0) / totalRuns
    );
  });

  const moduleCounts = {};
  state.results.forEach((record) => {
    (record.modules_played || []).forEach((name) => {
      moduleCounts[name] = (moduleCounts[name] || 0) + 1;
    });
  });

  const topModules = Object.entries(moduleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count})`)
    .join(", ");

  refs.analytics.innerHTML = `
    <p><strong>Total Completed Runs:</strong> ${totalRuns}</p>
    <p><strong>Average Final Score:</strong> ${averageScore}</p>
    <p><strong>Most Frequent Modules:</strong> ${topModules || "N/A"}</p>
    <div class="stats">
      ${Object.entries(metricAvg)
        .map(
          ([key, value]) => `
        <div class="stat">
          <div class="stat-head">
            <span>${metricLabels[key]}</span>
            <strong>${value}</strong>
          </div>
          <div class="bar-wrap"><div class="bar" style="width:${value}%; background:${metricTone(value)}"></div></div>
        </div>`
        )
        .join("")}
    </div>
  `;
}

function addOptionEditor(prefill = null) {
  const wrap = document.createElement("div");
  wrap.className = "option-editor";

  const option = prefill || {
    text: "",
    flow: "",
    impact: "talentQuality:0,employeeTrust:0,legalSafety:0,hrEfficiency:0,budgetHealth:0",
  };

  wrap.innerHTML = `
    <div class="stack">
      <input type="text" class="opt-text" placeholder="Option text" value="${option.text}" />
      <input type="text" class="opt-flow" placeholder="Flow e.g. Recruitment -> Onboarding" value="${option.flow}" />
      <input type="text" class="opt-impact" placeholder="impact e.g. talentQuality:5,employeeTrust:-2" value="${option.impact}" />
      <button type="button" class="ghost remove-opt">Remove Option</button>
    </div>
  `;

  wrap.querySelector(".remove-opt").addEventListener("click", () => {
    wrap.remove();
  });

  refs.adminOptions.appendChild(wrap);
}

function parseImpact(input) {
  const impact = {
    talentQuality: 0,
    employeeTrust: 0,
    legalSafety: 0,
    hrEfficiency: 0,
    budgetHealth: 0,
  };

  input
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .forEach((part) => {
      const [rawKey, rawValue] = part.split(":");
      const key = (rawKey || "").trim();
      const value = Number((rawValue || "0").trim());
      if (Object.prototype.hasOwnProperty.call(impact, key) && !Number.isNaN(value)) {
        impact[key] = value;
      }
    });

  return impact;
}

function setupAuthHandlers() {
  refs.registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    void (async () => {
      if (!state.supabase) {
        showMessage(refs.authMessage, "Connect backend first.", true);
        return;
      }

      const displayName = refs.registerName.value.trim();
      const email = refs.registerEmail.value.trim();
      const password = refs.registerPassword.value.trim();
      const role = refs.registerRole.value;

      if (!displayName || !email || !password) {
        showMessage(refs.authMessage, "Display name, email and password are required.", true);
        return;
      }

      const { data, error } = await state.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
        },
      });

      if (error) {
        showMessage(refs.authMessage, error.message, true);
        return;
      }

      if (data.user) {
        const profileWrite = await state.supabase.from("profiles").upsert({
          id: data.user.id,
          display_name: displayName,
          role,
        });

        if (profileWrite.error) {
          showMessage(refs.authMessage, `Account created but profile failed: ${profileWrite.error.message}`, true);
          return;
        }
      }

      refs.registerForm.reset();
      showMessage(refs.authMessage, "Account created. Login if email confirmation is disabled.");
    })();
  });

  refs.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    void (async () => {
      try {
        if (!state.supabase || !state.connected) {
          showMessage(refs.authMessage, "Database not connected. Refresh and try again.", true);
          return;
        }

        const email = refs.loginName.value.trim();
        const password = refs.loginPassword.value.trim();

        const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
        if (error) {
          showMessage(refs.authMessage, `Login failed: ${error.message}`, true);
          return;
        }

        const ok = await hydrateCurrentUser(data.user);
        if (!ok || !state.currentUser) {
          showMessage(
            refs.authMessage,
            "Login succeeded, but profile load failed. Check profiles table/policies.",
            true
          );
          return;
        }
        await loadRemoteData();
        showMessage(refs.authMessage, `Welcome, ${state.currentUser.displayName}.`);
        refreshUI();
      } catch (error) {
        showMessage(refs.authMessage, `Login exception: ${error.message}`, true);
      }
    })();
  });

  refs.logoutBtn.addEventListener("click", () => {
    void (async () => {
      if (!state.supabase) return;
      await state.supabase.auth.signOut();
      state.currentUser = null;
      state.selectedTeamId = "";
      state.teams = [];
      state.customScenarios = [];
      state.results = [];
      refreshUI();
    })();
  });
}

function setupTeamHandlers() {
  refs.teamSelect.addEventListener("change", () => {
    state.selectedTeamId = refs.teamSelect.value;
    refreshUI();
  });

  refs.createTeamBtn.addEventListener("click", () => {
    void (async () => {
      if (!state.currentUser) return;
      const name = refs.teamName.value.trim();
      if (!name) return;

      const { data, error } = await state.supabase
        .from("teams")
        .insert({
          name,
          created_by: state.currentUser.id,
          members: [],
          session: freshSession(),
        })
        .select("*")
        .single();

      if (error) {
        showMessage(refs.authMessage, error.message, true);
        return;
      }

      state.teams.push(data);
      state.selectedTeamId = data.id;
      refs.teamName.value = "";
      refreshUI();
    })();
  });

  refs.addMemberBtn.addEventListener("click", () => {
    void (async () => {
      const team = getTeam();
      if (!team) return;
      const member = refs.memberName.value.trim();
      if (!member) return;

      team.members = Array.isArray(team.members) ? team.members : [];
      if (!team.members.includes(member)) {
        team.members.push(member);
        const ok = await persistTeam(team);
        if (ok) {
          refs.memberName.value = "";
          renderTeamMembers();
        }
      }
    })();
  });

  refs.startBtn.addEventListener("click", () => {
    void (async () => {
      const team = getTeam();
      if (!team) return;
      if (!team.session || typeof team.session !== "object") {
        team.session = freshSession();
      }
      if (!team.session.started) {
        team.session.started = true;
        team.session.updatedAt = nowISO();
      }

      const ok = await persistTeam(team);
      if (ok) refreshUI();
    })();
  });

  refs.resetRunBtn.addEventListener("click", () => {
    void (async () => {
      const team = getTeam();
      if (!team) return;
      team.session = freshSession();
      const ok = await persistTeam(team);
      if (ok) refreshUI();
    })();
  });
}

function setupAdminHandlers() {
  refs.addOptionBtn.addEventListener("click", () => addOptionEditor());

  refs.seedOptionsBtn.addEventListener("click", () => {
    if (refs.adminOptions.children.length) return;
    addOptionEditor();
    addOptionEditor();
    addOptionEditor();
  });

  refs.saveScenarioBtn.addEventListener("click", () => {
    void (async () => {
      if (!state.currentUser || state.currentUser.role !== "admin") {
        showMessage(refs.adminMessage, "Only admin can create scenarios.", true);
        return;
      }

      const moduleName = refs.adminModule.value.trim();
      const title = refs.adminTitle.value.trim();
      const description = refs.adminDescription.value.trim();
      const optionNodes = Array.from(refs.adminOptions.querySelectorAll(".option-editor"));

      if (!moduleName || !title || !description || optionNodes.length < 2) {
        showMessage(refs.adminMessage, "Provide module/title/description and at least 2 options.", true);
        return;
      }

      const options = optionNodes
        .map((node) => {
          const text = node.querySelector(".opt-text").value.trim();
          const flow = node.querySelector(".opt-flow").value.trim();
          const impactText = node.querySelector(".opt-impact").value.trim();
          if (!text || !flow) return null;
          return { text, flow, impact: parseImpact(impactText) };
        })
        .filter(Boolean);

      if (options.length < 2) {
        showMessage(refs.adminMessage, "Each option needs text and flow.", true);
        return;
      }

      const { data, error } = await state.supabase
        .from("custom_scenarios")
        .insert({
          module: moduleName,
          title,
          description,
          options,
          created_by: state.currentUser.id,
        })
        .select("*")
        .single();

      if (error) {
        showMessage(refs.adminMessage, error.message, true);
        return;
      }

      state.customScenarios.push(data);
      refs.adminModule.value = "";
      refs.adminTitle.value = "";
      refs.adminDescription.value = "";
      refs.adminOptions.innerHTML = "";
      addOptionEditor();
      addOptionEditor();
      addOptionEditor();
      showMessage(refs.adminMessage, "Scenario saved successfully.");
      refreshUI();
    })();
  });

  refs.wipeResultsBtn.addEventListener("click", () => {
    void (async () => {
      if (!isAdminUser()) return;
      const confirmWipe = window.confirm("Wipe ALL result rows from DB? This cannot be undone.");
      if (!confirmWipe) return;

      const { error } = await state.supabase
        .from("results")
        .delete()
        .not("id", "is", null);

      if (error) {
        showMessage(refs.adminMessage, `Wipe results failed: ${error.message}`, true);
        return;
      }

      await loadRemoteData();
      showMessage(refs.adminMessage, "All results wiped.");
      refreshUI();
    })();
  });

  refs.resetSessionsBtn.addEventListener("click", () => {
    void (async () => {
      if (!isAdminUser()) return;
      const confirmReset = window.confirm("Reset session progress for ALL teams?");
      if (!confirmReset) return;

      const currentTeams = [...state.teams];
      for (const team of currentTeams) {
        const { error } = await state.supabase
          .from("teams")
          .update({ session: freshSession(), updated_at: nowISO() })
          .eq("id", team.id);
        if (error) {
          showMessage(refs.adminMessage, `Reset sessions failed: ${error.message}`, true);
          return;
        }
      }

      await loadRemoteData();
      showMessage(refs.adminMessage, "All team sessions reset.");
      refreshUI();
    })();
  });

  refs.wipeAllBtn.addEventListener("click", () => {
    void (async () => {
      if (!isAdminUser()) return;
      const confirmWipe = window.confirm("Wipe ALL teams, scenarios, and results from DB?");
      if (!confirmWipe) return;
      const confirmAgain = window.confirm("Final confirmation: this permanently deletes previous DB values.");
      if (!confirmAgain) return;

      const wipeResults = await state.supabase.from("results").delete().not("id", "is", null);
      if (wipeResults.error) {
        showMessage(refs.adminMessage, `Wipe failed (results): ${wipeResults.error.message}`, true);
        return;
      }

      const wipeScenarios = await state.supabase
        .from("custom_scenarios")
        .delete()
        .not("id", "is", null);
      if (wipeScenarios.error) {
        showMessage(refs.adminMessage, `Wipe failed (scenarios): ${wipeScenarios.error.message}`, true);
        return;
      }

      const wipeTeams = await state.supabase.from("teams").delete().not("id", "is", null);
      if (wipeTeams.error) {
        showMessage(refs.adminMessage, `Wipe failed (teams): ${wipeTeams.error.message}`, true);
        return;
      }

      state.selectedTeamId = "";
      await loadRemoteData();
      showMessage(refs.adminMessage, "Database values wiped (teams, scenarios, results).");
      refreshUI();
    })();
  });
}

function setControlStates() {
  const hasConnection = state.connected;
  const hasUser = !!state.currentUser;
  const hasTeam = !!getTeam();
  const isAdmin = isAdminUser();

  refs.registerForm.querySelectorAll("input, select, button").forEach((el) => {
    el.disabled = !hasConnection;
  });
  refs.loginForm.querySelectorAll("input, button").forEach((el) => {
    el.disabled = !hasConnection;
  });

  refs.createTeamBtn.disabled = !hasUser || !isAdmin;
  refs.addMemberBtn.disabled = !hasUser || !hasTeam || !isAdmin;
  refs.resetRunBtn.disabled = !hasUser || !hasTeam;
}

function refreshUI() {
  renderSessionBanner();
  renderTeamSelect();
  renderTeamMembers();
  renderStats();
  renderTimeline();
  renderScenario();
  renderLeaderboard();
  renderAnalytics();
  setControlStates();

  const isAdmin = isAdminUser();
  const isStudent = !!state.currentUser && !isAdmin;
  refs.adminPanel.classList.toggle("hidden", !isAdmin);
  refs.leaderboardPanel.classList.toggle("hidden", !isAdmin);
  refs.analyticsPanel.classList.toggle("hidden", !isAdmin);
  refs.registerRoleWrap.classList.toggle("hidden", isStudent);
  refs.teamCreateWrap.classList.toggle("hidden", isStudent);
  refs.teamMemberWrap.classList.toggle("hidden", isStudent);
}

async function bootstrap() {
  if (!refs.adminOptions.children.length) {
    addOptionEditor();
    addOptionEditor();
    addOptionEditor();
  }

  setupAuthHandlers();
  setupTeamHandlers();
  setupAdminHandlers();
  renderModules("");

  const hardcoded = window.HRFLOW_SUPABASE || {};
  const savedUrl = hardcoded.url || "";
  const savedAnon = hardcoded.anonKey || "";

  if (savedUrl && savedAnon) {
    await connectSupabase(savedUrl, savedAnon);
  } else {
    showMessage(refs.authMessage, "Supabase config missing in index.html.");
    refreshUI();
  }
}

void bootstrap();
