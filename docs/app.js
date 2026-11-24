import { COUNTRIES, EVENTS, MATCHES, NEWS_ITEMS, PLAYERS, POSITIONS, TEAMS } from "./data.js";

const TEAMS_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.team_id, t]));
const PLAYERS_BY_ID = Object.fromEntries(PLAYERS.map((p) => [p.player_id, p]));

const DATASET_FILES = [
  {
    id: "matches",
    title: "euro2024_matches.json (5)",
    path: "euro2024_data/euro2024_matches.json",
    firestore: 'Firestore collection("matches") via euro2024_matches.py',
    summary:
      "Contains 5 synthetic demonstration matches dated 2024-07-22 through 2024-07-26 (after real UEFA Euro 2024 ended on 2024-07-14). Drives MatchesView, MatchDetailView, and LeagueStandingViewModel.",
    sample: MATCHES[0],
  },
  {
    id: "events",
    title: "euro2024_events.json (19)",
    path: "euro2024_data/euro2024_events.json",
    firestore: 'Subcollection matches/match_{i}/events/event_{j}',
    summary:
      "19 goal events seeded by euro2024_matches.py matching all 19 goals across the 5 sample matches (0 yellow/red cards in bundled JSON).",
    sample: EVENTS.slice(0, 3),
  },
  {
    id: "teams",
    title: "euro2024_teams.json (20)",
    path: "euro2024_data/euro2024_teams.json + TeamViewModel.swift",
    firestore: "Hardcoded sampleTeams in TeamViewModel.swift (not queried from Firestore)",
    summary:
      "20 European national teams with illustrative ratings (75–91). Includes Sweden, Russia, and Wales (not in real 24-team UEFA Euro 2024).",
    sample: TEAMS.slice(0, 4).map(({ team_id, name, rating }) => ({ team_id, name, rating })),
  },
  {
    id: "players",
    title: "euro2024_players.json (220)",
    path: "euro2024_data/euro2024_players.json",
    firestore: 'Firestore collection("players") via PlayerViewModel.swift',
    summary:
      "220 real footballers (11 starters × 20 teams) from a Euro 2020/2021-era squad snapshot. Phase A normalized the Center/Central Midfielder filter mismatch so all 220 players are filterable.",
    sample: PLAYERS.slice(0, 2).map(({ player_id, name, position, team_id, country, rating }) => ({
      player_id,
      name,
      position,
      team_id,
      country,
      rating,
    })),
  },
  {
    id: "news",
    title: "NewsViewModel.swift (2)",
    path: "Euro2024App/News Folder/NewsViewModel.swift",
    firestore: "Hardcoded local stub array (no remote news API)",
    summary:
      "Static 2-item stub array created as an API integration placeholder. Displayed faithfully in NewsView without fabricating live journalism.",
    sample: NEWS_ITEMS,
  },
];

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderPlayerAvatar(player, cls) {
  if (!player) {
    return `<div class="${cls}" style="background:#334155">?</div>`;
  }
  if (player.photo) {
    return `<div class="${cls}"><img src="${escapeHtml(player.photo)}" alt="${escapeHtml(player.name)} portrait" /></div>`;
  }
  const team = TEAMS_BY_ID[player.team_id];
  const bg = team ? team.accent : "#334155";
  return `<div class="${cls}" style="background:${bg}" aria-label="${escapeHtml(player.name)} initials">${escapeHtml(getInitials(player.name))}</div>`;
}

// Mirrors LeagueStandingViewModel.calculateStandings exactly (3 win, 1 draw, 0 loss, sorted by points)
function computeStandings() {
  const map = new Map();
  for (const t of TEAMS) {
    map.set(t.team_id, {
      teamID: t.team_id,
      teamName: t.name,
      teamLogo: t.logo,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    });
  }
  for (const m of MATCHES) {
    const s1 = map.get(m.team1_id);
    const s2 = map.get(m.team2_id);
    if (!s1 || !s2) continue;
    s1.goalsFor += m.team1_score;
    s1.goalsAgainst += m.team2_score;
    s2.goalsFor += m.team2_score;
    s2.goalsAgainst += m.team1_score;
    if (m.team1_score > m.team2_score) {
      s1.points += 3;
      s1.wins += 1;
      s2.losses += 1;
    } else if (m.team1_score < m.team2_score) {
      s2.points += 3;
      s2.wins += 1;
      s1.losses += 1;
    } else {
      s1.points += 1;
      s2.points += 1;
      s1.draws += 1;
      s2.draws += 1;
    }
  }
  return Array.from(map.values()).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
}

function createInitialState() {
  return {
    isLoggedIn: false,
    username: "",
    email: "",
    screen: "landing", // landing | login | register | analyzes | match-detail | team-detail | players-standalone | news | profile
    analyzesSegment: 0, // 0 Matches | 1 Standings | 2 Teams | 3 Players
    selectedMatchId: MATCHES[0].id,
    selectedTeamId: TEAMS[0].team_id,
    filters: {
      position: "All",
      country: "All",
      minRating: 0,
    },
    profile: {
      name: "Demo Football Fan",
      phoneNumber: "+90 555 010 2024",
      bio: "Tracking European football squads and match timelines.",
      favoriteTeam: "Turkey",
      favoritePlayer: "Kylian Mbappe",
      favoriteMatch: "France 3 - 2 Italy",
      newEmail: "",
      newPassword: "",
    },
    authMessage: null, // { type: 'error'|'success', text: string }
    profileMessage: null,
    inspectorTab: "trace",
    selectedDatasetId: "matches",
    traces: [],
    selectedTraceIdx: 0,
  };
}

let state = createInitialState();

const phoneBody = document.getElementById("phoneBody");
const iosStatusbar = document.getElementById("iosStatusbar");
const homeIndicator = document.getElementById("homeIndicator");
const panelTrace = document.getElementById("panelTrace");
const panelData = document.getElementById("panelData");
const panelArch = document.getElementById("panelArch");
const srAnnouncer = document.getElementById("srAnnouncer");
const btnToggleAuth = document.getElementById("btnToggleAuth");

function announce(msg) {
  srAnnouncer.textContent = "";
  window.requestAnimationFrame(() => {
    srAnnouncer.textContent = msg;
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function recordTrace({ source, swiftView, operation, payload, note }) {
  state.traces.unshift({
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    source,
    swiftView,
    operation,
    payload,
    note,
  });
  if (state.traces.length > 14) state.traces.pop();
  state.selectedTraceIdx = 0;
}

function getFilteredPlayers() {
  return PLAYERS.filter((p) => {
    let posOk = false;
    if (state.filters.position === "All") posOk = true;
    else if (state.filters.position === "Center Midfielder") {
      posOk = p.position === "Center Midfielder" || p.position === "Central Midfielder";
    } else {
      posOk = p.position === state.filters.position;
    }
    const countryOk = state.filters.country === "All" || p.country === state.filters.country;
    const ratingOk = p.rating >= Number(state.filters.minRating);
    return posOk && countryOk && ratingOk;
  });
}

function navigate(screen, opts = {}) {
  state.screen = screen;
  state.authMessage = null;
  state.profileMessage = null;
  if (opts.segment !== undefined) state.analyzesSegment = opts.segment;
  if (opts.matchId !== undefined) state.selectedMatchId = opts.matchId;
  if (opts.teamId !== undefined) state.selectedTeamId = opts.teamId;

  if (screen === "landing") {
    recordTrace({
      source: "@AppStorage('isLoggedIn')",
      swiftView: state.isLoggedIn ? "MainView.swift" : "ContentView.swift",
      operation: state.isLoggedIn ? "Authenticated Home Shell" : "Unauthenticated Landing Shell",
      payload: { isLoggedIn: state.isLoggedIn, username: state.username || null },
      note: "Olympiastadion Berlin night photo (Tobi 87, CC BY 3.0) with 4 original SVG tiles. No plaintext password is stored in UserDefaults.",
    });
  } else if (screen === "login") {
    recordTrace({
      source: "FirebaseAuth (Simulated)",
      swiftView: "LoginView.swift",
      operation: "Auth.auth().signIn(withEmail:password:)",
      payload: { fields: ["Email", "Password"], decorativeLabels: ["Remember Me", "Forget Password?"] },
      note: "Simulates Firebase email/password sign-in locally. Phase A fixed the success alert title ('Error' → 'Success'). 'Remember Me' and 'Forget Password?' remain non-interactive labels in SwiftUI source.",
    });
  } else if (screen === "register") {
    recordTrace({
      source: "FirebaseAuth (Simulated)",
      swiftView: "RegisterView.swift",
      operation: "Auth.auth().createUser(withEmail:password:)",
      payload: { fields: ["Email", "Password"], redirectOnSuccess: "LoginView" },
      note: "Simulates Firebase account creation locally with zero live network calls.",
    });
  } else if (screen === "analyzes") {
    recordAnalyzesTrace();
  } else if (screen === "match-detail") {
    const m = MATCHES.find((x) => x.id === state.selectedMatchId) || MATCHES[0];
    const t1 = TEAMS_BY_ID[m.team1_id];
    const t2 = TEAMS_BY_ID[m.team2_id];
    recordTrace({
      source: 'Firestore collection("matches") [Simulated]',
      swiftView: "MatchDetailView .swift",
      operation: `Detail(${t1.name} ${m.team1_score} - ${m.team2_score} ${t2.name})`,
      payload: m,
      note: "Source-backed sample match from euro2024_matches.json (synthetic post-tournament sample, not an official UEFA Euro 2024 result). Goal/assist timeline sorted chronologically by minute.",
    });
  } else if (screen === "team-detail") {
    const team = TEAMS_BY_ID[state.selectedTeamId] || TEAMS[0];
    const squad = PLAYERS.filter((p) => p.team_id === team.team_id);
    recordTrace({
      source: 'Firestore collection("players") [Filtered]',
      swiftView: "TeamDetailView.swift",
      operation: `players.filter { $0.team_id == ${team.team_id} }`,
      payload: { team: team.name, rating: team.rating, squad_count: squad.length, sample: squad.slice(0, 3).map((p) => p.name) },
      note: `Displays all ${squad.length} players for ${team.name} from euro2024_players.json with verified CC portraits or team-colored initial avatars.`,
    });
  } else if (screen === "players-standalone") {
    const filtered = getFilteredPlayers();
    recordTrace({
      source: 'Firestore collection("players") [Simulated]',
      swiftView: "PlayerListView.swift",
      operation: "Client-side 3-filter LazyVGrid (220 players)",
      payload: { total_players: PLAYERS.length, matching: filtered.length, filters: { ...state.filters } },
      note: "Phase A normalized 'Center Midfielder' / 'Central Midfielder' so all 220 players are reachable via Position filtering.",
    });
  } else if (screen === "news") {
    recordTrace({
      source: "NewsViewModel.swift (Static Stub)",
      swiftView: "NewsView.swift",
      operation: "NewsViewModel.fetchNews() [2 hardcoded items]",
      payload: NEWS_ITEMS,
      note: "Preserves the exact 2 hardcoded sample items in NewsViewModel.swift without inventing a live news feed.",
    });
  } else if (screen === "profile") {
    recordTrace({
      source: 'Firestore collection("users").document(uid) [Simulated]',
      swiftView: "ProfileView.swift",
      operation: state.isLoggedIn ? "loadUserProfile() — Phase A Remediated" : "Auth Gate (isLoggedIn == false)",
      payload: state.isLoggedIn
        ? {
            name: state.profile.name,
            email: state.email,
            favoriteTeam: state.profile.favoriteTeam,
            favoritePlayer: state.profile.favoritePlayer,
            favoriteMatch: state.profile.favoriteMatch,
            userPasswordStoredInUserDefaults: false,
          }
        : { isLoggedIn: false, message: "Please log in to view your profile." },
      note: "Phase A removed @AppStorage('userPassword') so plaintext passwords are never persisted to UserDefaults.",
    });
  }

  render();
}

function recordAnalyzesTrace() {
  if (state.analyzesSegment === 0) {
    recordTrace({
      source: 'Firestore collection("matches") [Simulated]',
      swiftView: "MatchesTabView.swift → MatchesView.swift",
      operation: "MatchViewModel.fetchMatches() (5 sample matches)",
      payload: MATCHES.map((m) => ({
        id: m.id,
        fixture: `${TEAMS_BY_ID[m.team1_id].name} ${m.team1_score}-${m.team2_score} ${TEAMS_BY_ID[m.team2_id].name}`,
        date: m.date,
      })),
      note: "5 bundled sample matches from euro2024_matches.json over original neon polygon backdrop (matches bg3 aesthetic).",
    });
  } else if (state.analyzesSegment === 1) {
    const standings = computeStandings();
    recordTrace({
      source: "Combine (MatchViewModel + TeamViewModel)",
      swiftView: "LeagueStandingView.swift + LeagueStandingViewModel.swift",
      operation: "calculateStandings(matches: 5, teams: 20)",
      payload: standings.slice(0, 6).map(({ teamName, points, wins, draws, losses, goalsFor, goalsAgainst }) => ({
        teamName,
        points,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
      })),
      note: "Source computes a single unified 20-team league table (3 pts win, 1 draw, 0 loss) rather than 6 UEFA Euro groups.",
    });
  } else if (state.analyzesSegment === 2) {
    recordTrace({
      source: "TeamViewModel.swift (Hardcoded sampleTeams)",
      swiftView: "TeamsView.swift",
      operation: "TeamViewModel.fetchTeams() (20 teams)",
      payload: { count: TEAMS.length, sample: TEAMS.slice(0, 5).map(({ team_id, name, rating }) => ({ team_id, name, rating })) },
      note: "TeamViewModel uses 20 hardcoded teams with original geometric national-color SVG badges replacing copyrighted federation crests.",
    });
  } else {
    const filtered = getFilteredPlayers();
    recordTrace({
      source: 'Firestore collection("players") [Simulated]',
      swiftView: "MatchesTabView.swift → PlayerListView.swift",
      operation: "3-column Player Directory (220 real players)",
      payload: { total: PLAYERS.length, matching: filtered.length, filters: { ...state.filters } },
      note: "48 featured players show verified Wikimedia Commons CC portraits; remaining squad players display team-colored initial avatars.",
    });
  }
}

/* ==================== SWIFTUI SCREEN RENDERERS ==================== */

function renderLandingOrMain() {
  return `
    <div class="eu-home-screen">
      <div style="width:100%;display:flex;flex-direction:column;align-items:center">
        <h2 class="eu-app-title">Euro2024 App</h2>

        <div class="eu-tile-grid">
          <button class="eu-tile-btn" type="button" data-action="go-analyzes">
            <div class="eu-tile-img"><img src="assets/icons/analyzes.svg" alt="Analyzes" /></div>
            <span class="eu-tile-label">Analyzes</span>
          </button>

          <button class="eu-tile-btn" type="button" data-action="go-profile">
            <div class="eu-tile-img"><img src="assets/icons/profile.svg" alt="Profile" /></div>
            <span class="eu-tile-label">Profile</span>
          </button>

          <button class="eu-tile-btn" type="button" data-action="go-players">
            <div class="eu-tile-img"><img src="assets/icons/players.svg" alt="Players" /></div>
            <span class="eu-tile-label">Players</span>
          </button>

          <button class="eu-tile-btn" type="button" data-action="go-news">
            <div class="eu-tile-img"><img src="assets/icons/news.svg" alt="News" /></div>
            <span class="eu-tile-label">News</span>
          </button>
        </div>
      </div>

      ${
        state.isLoggedIn
          ? `
            <div class="eu-main-footer">
              <span class="eu-pill-badge">Welcome, ${escapeHtml(state.username)}</span>
              <button id="btnPhoneLogout" class="eu-pill-logout" type="button">Logout</button>
            </div>
          `
          : `
            <div class="eu-auth-stack">
              <button class="eu-btn-green-gray" type="button" data-nav="login">Login</button>
              <button class="eu-btn-green-gray" type="button" data-nav="register">Register</button>
            </div>
          `
      }
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="eu-auth-screen">
      <div style="width:100%;display:flex;flex-direction:column;align-items:center;margin-top:24px">
        <h2 class="eu-auth-heading">Login</h2>

        <form id="loginForm" class="eu-auth-form">
          ${
            state.authMessage
              ? `<div class="eu-alert ${state.authMessage.type}" role="alert">${escapeHtml(state.authMessage.text)}</div>`
              : ""
          }
          <input id="loginEmail" class="eu-custom-input" type="email" placeholder="Email" aria-label="Email" value="fan@euro2024demo.example" required />
          <input id="loginPassword" class="eu-custom-input" type="password" placeholder="Password" aria-label="Password" value="DemoPass2024" required />

          <div class="eu-auth-meta-row" title="Non-interactive placeholder labels preserved from LoginView.swift:39-44">
            <span>Remember Me</span>
            <span>Forget Password?</span>
          </div>

          <button class="eu-btn-green-dark" type="submit">Log in</button>
        </form>
      </div>

      <div class="eu-auth-links">
        <button class="eu-link-btn" type="button" data-nav="register">Don't have an account? Register</button>
        <button class="eu-link-btn" type="button" data-nav="landing">Euro2024App</button>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="eu-auth-screen">
      <div style="width:100%;display:flex;flex-direction:column;align-items:center;margin-top:24px">
        <h2 class="eu-auth-heading">Register</h2>

        <form id="registerForm" class="eu-auth-form">
          ${
            state.authMessage
              ? `<div class="eu-alert ${state.authMessage.type}" role="alert">${escapeHtml(state.authMessage.text)}</div>`
              : ""
          }
          <input id="regEmail" class="eu-custom-input" type="email" placeholder="Email" aria-label="Email" value="newfan@euro2024demo.example" required />
          <input id="regPassword" class="eu-custom-input" type="password" placeholder="Password" aria-label="Password" value="EuroPass2024" required />

          <button class="eu-btn-green-dark" type="submit">Register</button>
        </form>
      </div>

      <div class="eu-auth-links">
        <button class="eu-link-btn" type="button" data-nav="login">Already have an account? Log in</button>
        <button class="eu-link-btn" type="button" data-nav="landing">Euro2024App</button>
      </div>
    </div>
  `;
}

function renderMatchesList() {
  return `
    <div class="eu-card-stack">
      ${MATCHES.map((m) => {
        const t1 = TEAMS_BY_ID[m.team1_id];
        const t2 = TEAMS_BY_ID[m.team2_id];
        const dateStr = m.date.slice(0, 10);
        return `
          <button class="eu-dark-card" type="button" data-match="${escapeHtml(m.id)}">
            <div class="eu-match-row">
              <div class="eu-team-side">
                <img class="eu-badge-24" src="${escapeHtml(t1.logo)}" alt="${escapeHtml(t1.name)} badge" />
                <span>${escapeHtml(t1.name)}</span>
              </div>
              <span class="eu-vs">vs</span>
              <div class="eu-team-side right">
                <span>${escapeHtml(t2.name)}</span>
                <img class="eu-badge-24" src="${escapeHtml(t2.logo)}" alt="${escapeHtml(t2.name)} badge" />
              </div>
            </div>
            <div class="eu-match-score">Score: ${m.team1_score} - ${m.team2_score}</div>
            <div class="eu-match-sub">Sample Match (${dateStr}) · Tap for timeline ›</div>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderStandingsList() {
  const rows = computeStandings();
  return `
    <div class="eu-card-stack">
      ${rows
        .map(
          (s, idx) => `
          <div class="eu-dark-card static">
            <div class="eu-standing-row">
              <img class="eu-badge-40" src="${escapeHtml(s.teamLogo)}" alt="${escapeHtml(s.teamName)} badge" />
              <div style="min-width:0;flex:1">
                <div style="font-size:0.9rem;font-weight:700">${idx + 1}. ${escapeHtml(s.teamName)}</div>
                <div class="eu-standing-stats">${s.points} pts · W: ${s.wins} D: ${s.draws} L: ${s.losses} GF: ${s.goalsFor} GA: ${s.goalsAgainst}</div>
              </div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function renderTeamsList() {
  return `
    <div class="eu-card-stack">
      ${TEAMS.map(
        (t) => `
        <button class="eu-dark-card" type="button" data-team="${t.team_id}">
          <div class="eu-team-row">
            <img class="eu-badge-32" src="${escapeHtml(t.logo)}" alt="${escapeHtml(t.name)} badge" />
            <div style="flex:1">
              <div style="font-size:0.92rem;font-weight:700">${escapeHtml(t.name)}</div>
              <div class="eu-team-rating">Rating: ${t.rating}</div>
            </div>
            <span style="color:#94a3b8;font-size:1rem" aria-hidden="true">›</span>
          </div>
        </button>
      `
      ).join("")}
    </div>
  `;
}

function renderPlayersSection() {
  const filtered = getFilteredPlayers();
  return `
    <div class="eu-filter-box" aria-label="Player filters">
      <div class="eu-filter-selects">
        <select id="fPos" class="eu-select" aria-label="Filter by Position">
          ${POSITIONS.map((pos) => `<option value="${escapeHtml(pos)}" ${state.filters.position === pos ? "selected" : ""}>${escapeHtml(pos)}</option>`).join("")}
        </select>
        <select id="fCountry" class="eu-select" aria-label="Filter by Country">
          ${COUNTRIES.map((c) => `<option value="${escapeHtml(c)}" ${state.filters.country === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
        </select>
      </div>
      <label class="eu-slider-row">
        <span>Min Rating: ${state.filters.minRating}</span>
        <input id="fMinRating" type="range" min="0" max="100" step="1" value="${state.filters.minRating}" aria-label="Minimum Rating" />
        <span style="color:#94a3b8">${filtered.length}/${PLAYERS.length}</span>
      </label>
    </div>

    ${
      filtered.length
        ? `<div class="eu-players-grid">
            ${filtered
              .map(
                (p) => `
              <button class="eu-player-card" type="button" data-inspect-player="${p.player_id}">
                ${renderPlayerAvatar(p, "eu-avatar-60")}
                <div class="eu-p-name">${escapeHtml(p.name)}</div>
                <div class="eu-p-meta">${escapeHtml(p.position)}</div>
                <div class="eu-p-meta">${escapeHtml(p.country)}</div>
                <div class="eu-p-meta" style="color:#86efac;font-weight:700">Rating: ${p.rating}</div>
              </button>
            `
              )
              .join("")}
          </div>`
        : `<div class="eu-dark-card static" style="text-align:center;padding:22px 14px">
             No players match the current filters.<br/>
             <button id="btnResetFilters" class="btn" type="button" style="margin-top:10px">Reset Filters</button>
           </div>`
    }
  `;
}

function renderAnalyzesHub() {
  const segTitles = ["Matches", "League Standing", "Teams", "Players"];
  let content = "";
  if (state.analyzesSegment === 0) content = renderMatchesList();
  else if (state.analyzesSegment === 1) content = renderStandingsList();
  else if (state.analyzesSegment === 2) content = renderTeamsList();
  else content = renderPlayersSection();

  return `
    <div class="eu-neon-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-nav="landing">‹ Euro2024 App</button>
        <span class="eu-nav-title">Matches</span>
        <span style="width:70px"></span>
      </div>

      <div class="eu-segmented" role="tablist" aria-label="Analyzes segments">
        ${segTitles
          .map(
            (lbl, i) => `
          <button class="eu-seg-btn ${state.analyzesSegment === i ? "active" : ""}" role="tab" aria-selected="${state.analyzesSegment === i}" type="button" data-seg="${i}">
            ${escapeHtml(lbl)}
          </button>
        `
          )
          .join("")}
      </div>

      ${content}
    </div>
  `;
}

function renderMatchDetail() {
  const m = MATCHES.find((x) => x.id === state.selectedMatchId) || MATCHES[0];
  const t1 = TEAMS_BY_ID[m.team1_id];
  const t2 = TEAMS_BY_ID[m.team2_id];

  const timeline = [
    ...m.team1_goals.map((g) => ({ type: "goal", minute: g.minute, playerID: g.player_id, assistID: g.assist_player_id, teamID: m.team1_id })),
    ...m.team2_goals.map((g) => ({ type: "goal", minute: g.minute, playerID: g.player_id, assistID: g.assist_player_id, teamID: m.team2_id })),
    ...m.team1_yellow_cards.map((c) => ({ type: "yellow", minute: c.minute, playerID: c.player_id, assistID: null, teamID: m.team1_id })),
    ...m.team2_yellow_cards.map((c) => ({ type: "yellow", minute: c.minute, playerID: c.player_id, assistID: null, teamID: m.team2_id })),
    ...m.team1_red_cards.map((c) => ({ type: "red", minute: c.minute, playerID: c.player_id, assistID: null, teamID: m.team1_id })),
    ...m.team2_red_cards.map((c) => ({ type: "red", minute: c.minute, playerID: c.player_id, assistID: null, teamID: m.team2_id })),
  ].sort((a, b) => a.minute - b.minute);

  return `
    <div class="eu-neon-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-action="back-matches">‹ Matches</button>
        <span class="eu-nav-title">Match Detail</span>
        <span style="width:58px"></span>
      </div>

      <div class="eu-match-row" style="padding:6px 4px">
        <div class="eu-team-side">
          <img class="eu-badge-24" src="${escapeHtml(t1.logo)}" alt="${escapeHtml(t1.name)} badge" />
          <span>${escapeHtml(t1.name)}</span>
        </div>
        <span class="eu-vs">vs</span>
        <div class="eu-team-side right">
          <span>${escapeHtml(t2.name)}</span>
          <img class="eu-badge-24" src="${escapeHtml(t2.logo)}" alt="${escapeHtml(t2.name)} badge" />
        </div>
      </div>

      <div class="eu-detail-score">Score: ${m.team1_score} - ${m.team2_score}</div>
      <div class="eu-detail-poss">Possession: ${m.possession_team1}% - ${m.possession_team2}%</div>

      <div class="eu-dark-card static">
        ${timeline
          .map((ev) => {
            const p = PLAYERS_BY_ID[ev.playerID];
            const ast = ev.assistID ? PLAYERS_BY_ID[ev.assistID] : null;
            const team = TEAMS_BY_ID[ev.teamID];
            const icon = ev.type === "goal" ? "⚽" : ev.type === "yellow" ? "🟨" : "🟥";
            const verb = ev.type === "goal" ? "scored for" : ev.type === "yellow" ? "got a yellow card for" : "got a red card for";
            return `
              <div class="eu-event-row">
                <span aria-hidden="true" style="font-size:0.9rem;margin-top:2px">${icon}</span>
                ${renderPlayerAvatar(p, "eu-avatar-24")}
                <div style="flex:1;min-width:0">
                  <div style="font-size:0.74rem;line-height:1.35">Minute ${ev.minute}: <strong>${escapeHtml(p ? p.name : "Unknown")}</strong> ${verb} ${escapeHtml(team.name)}</div>
                  ${
                    ast
                      ? `<div class="eu-assist-row">
                           <span style="color:#4ade80" aria-hidden="true">➜</span>
                           ${renderPlayerAvatar(ast, "eu-avatar-24")}
                           <span>Assist: ${escapeHtml(ast.name)}</span>
                         </div>`
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderTeamDetail() {
  const team = TEAMS_BY_ID[state.selectedTeamId] || TEAMS[0];
  const squad = PLAYERS.filter((p) => p.team_id === team.team_id);
  return `
    <div class="eu-neon-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-action="back-teams">‹ Teams</button>
        <span class="eu-nav-title">${escapeHtml(team.name)} Players</span>
        <span style="width:46px"></span>
      </div>

      <div class="eu-card-stack">
        ${squad
          .map(
            (p) => `
          <button class="eu-dark-card" type="button" data-inspect-player="${p.player_id}">
            <div class="eu-team-row">
              ${renderPlayerAvatar(p, "eu-avatar-50")}
              <div style="flex:1">
                <div style="font-size:0.92rem;font-weight:700">${escapeHtml(p.name)}</div>
                <div style="font-size:0.76rem;color:#cbd5e1">${escapeHtml(p.position)}</div>
                <div style="font-size:0.76rem;color:#86efac;font-weight:600">Rating: ${p.rating}</div>
              </div>
            </div>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderStandalonePlayers() {
  return `
    <div class="eu-neon-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-nav="landing">‹ Euro2024 App</button>
        <span class="eu-nav-title">Players</span>
        <span style="width:70px"></span>
      </div>
      ${renderPlayersSection()}
    </div>
  `;
}

function renderNews() {
  return `
    <div class="eu-news-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-nav="landing" style="color:#007aff">‹ Euro2024 App</button>
        <span style="font-size:0.72rem;color:#6b7280;font-weight:600">Static Stub (2 items)</span>
      </div>
      <h2 class="eu-news-title">News</h2>
      <div class="eu-news-list">
        ${NEWS_ITEMS.map(
          (n) => `
          <article class="eu-news-item">
            <h3>${escapeHtml(n.title)}</h3>
            <p>${escapeHtml(n.content)}</p>
            <div class="eu-news-date">${escapeHtml(n.date)}</div>
          </article>
        `
        ).join("")}
      </div>
    </div>
  `;
}

function renderProfile() {
  const matchLabels = MATCHES.map((m) => `${TEAMS_BY_ID[m.team1_id].name} ${m.team1_score} - ${m.team2_score} ${TEAMS_BY_ID[m.team2_id].name}`);
  return `
    <div class="eu-profile-screen">
      <div class="eu-nav-row">
        <button class="eu-back-btn" type="button" data-nav="landing">‹ Euro2024 App</button>
        <span class="eu-nav-title">Profile</span>
        <span style="width:70px"></span>
      </div>

      ${
        state.isLoggedIn
          ? `
            <form id="profileForm" class="eu-profile-card">
              <div class="eu-profile-avatar-wrap">
                <div class="eu-profile-avatar">${escapeHtml(getInitials(state.profile.name || state.username || "EU"))}</div>
                <span class="eu-cam-badge" aria-hidden="true">📷</span>
              </div>

              ${
                state.profileMessage
                  ? `<div class="eu-alert success" role="status" style="width:100%">${escapeHtml(state.profileMessage)}</div>`
                  : ""
              }

              <div>
                <label class="eu-prof-label" for="profName">Name</label>
                <input id="profName" class="eu-prof-input" type="text" value="${escapeHtml(state.profile.name)}" />
              </div>
              <div>
                <label class="eu-prof-label" for="profEmail">Email (Firebase Auth)</label>
                <input id="profEmail" class="eu-prof-input" type="email" value="${escapeHtml(state.email)}" disabled />
              </div>
              <div>
                <label class="eu-prof-label" for="profNewEmail">New Email</label>
                <input id="profNewEmail" class="eu-prof-input" type="email" placeholder="Verification email required" value="${escapeHtml(state.profile.newEmail)}" />
              </div>
              <div>
                <label class="eu-prof-label" for="profNewPw">New Password (never saved to UserDefaults)</label>
                <input id="profNewPw" class="eu-prof-input" type="password" placeholder="Transient Firebase password update" value="" />
              </div>
              <div>
                <label class="eu-prof-label" for="profPhone">Phone Number</label>
                <input id="profPhone" class="eu-prof-input" type="text" value="${escapeHtml(state.profile.phoneNumber)}" />
              </div>
              <div>
                <label class="eu-prof-label" for="profBio">Bio</label>
                <textarea id="profBio" class="eu-prof-textarea">${escapeHtml(state.profile.bio)}</textarea>
              </div>
              <div>
                <label class="eu-prof-label" for="profTeam">Favorite Team</label>
                <select id="profTeam" class="eu-prof-select">
                  ${TEAMS.map((t) => `<option value="${escapeHtml(t.name)}" ${state.profile.favoriteTeam === t.name ? "selected" : ""}>${escapeHtml(t.name)}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="eu-prof-label" for="profPlayer">Favorite Player</label>
                <select id="profPlayer" class="eu-prof-select">
                  ${PLAYERS.map((p) => `<option value="${escapeHtml(p.name)}" ${state.profile.favoritePlayer === p.name ? "selected" : ""}>${escapeHtml(p.name)} (${escapeHtml(p.country)})</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="eu-prof-label" for="profMatch">Favorite Match</label>
                <select id="profMatch" class="eu-prof-select">
                  ${matchLabels.map((ml) => `<option value="${escapeHtml(ml)}" ${state.profile.favoriteMatch === ml ? "selected" : ""}>${escapeHtml(ml)}</option>`).join("")}
                </select>
              </div>

              <button class="eu-btn-blue" type="submit">Update Profile</button>
            </form>
          `
          : `
            <div class="eu-profile-locked">
              <div style="font-size:1.15rem;font-weight:700;margin-bottom:14px">Please log in to view your profile.</div>
              <button class="eu-btn-green-gray" type="button" data-nav="login" style="max-width:210px">Go to Login</button>
            </div>
          `
      }
    </div>
  `;
}

/* ==================== TECHNICAL INSPECTOR ==================== */

function renderTracePanel() {
  if (!state.traces.length) {
    return `
      <p style="font-size:0.84rem;color:var(--text-muted);margin-top:0">
        Interact with any screen inside the iPhone frame (or pick a Guided Tour step above) to inspect the matching SwiftUI source file, Firebase/local data origin, and source-grounded JSON payload.
      </p>
      <div class="meta-tile">
        <div class="meta-k">Media Licensing &amp; Data Provenance</div>
        <div style="font-size:0.82rem;color:var(--text-muted);line-height:1.55">
          All 48 featured footballer portraits and the Olympiastadion Berlin stadium backdrop use verified Creative Commons photographs from Wikimedia Commons (<a href="notices.html">full credits &amp; licenses</a>); the 20 national team badges, 4 Home icons, and neon polygon backdrop are original SVGs. Runs 100% statically with zero live Firebase requests.
        </div>
      </div>
    `;
  }
  const active = state.traces[state.selectedTraceIdx] || state.traces[0];
  return `
    <div class="inspector-meta-grid">
      <div class="meta-tile">
        <div class="meta-k">SwiftUI Source</div>
        <div class="meta-v">${escapeHtml(active.swiftView)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Data Source (Simulated)</div>
        <div class="meta-v"><span class="badge-sim">SIM</span>${escapeHtml(active.source)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Operation</div>
        <div class="meta-v">${escapeHtml(active.operation)}</div>
      </div>
    </div>

    <p style="font-size:0.82rem;color:var(--text-muted);margin:0 0 10px;line-height:1.5">${escapeHtml(active.note)}</p>

    <div class="code-label">Source-Matched Payload (Browser Simulation)</div>
    <pre class="code-block">${escapeHtml(JSON.stringify(active.payload, null, 2))}</pre>

    <div class="code-label">Recent Session Trace (${state.traces.length})</div>
    <div class="history-list">
      ${state.traces
        .map(
          (tr, i) => `
        <button class="history-item ${i === state.selectedTraceIdx ? "active" : ""}" type="button" data-trace-idx="${i}">
          <span>${escapeHtml(tr.swiftView)} · ${escapeHtml(tr.operation)}</span>
          <span style="color:#86efac">${formatTime(tr.timestamp)}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;
}

function renderDataPanel() {
  const ds = DATASET_FILES.find((x) => x.id === state.selectedDatasetId) || DATASET_FILES[0];
  return `
    <div class="info-banner" role="note">
      <strong>Honest Data Provenance:</strong> The repository's <code>euro2024_data/*.json</code> bundle contains 20 teams (including Sweden, Russia, Wales), 220 Euro 2020-era player profiles, and 5 synthetic demonstration matches dated 2024-07-22 to 2024-07-26. They are preserved faithfully as the app's original dataset and are <strong>not</strong> presented as official historical UEFA Euro 2024 match results.
    </div>

    <div class="step-pills" role="group" aria-label="Dataset files">
      ${DATASET_FILES.map(
        (d) => `<button class="step-pill ${d.id === ds.id ? "active" : ""}" type="button" data-ds="${d.id}">${escapeHtml(d.title)}</button>`
      ).join("")}
    </div>

    <div class="inspector-meta-grid" style="grid-template-columns:1fr 1fr">
      <div class="meta-tile">
        <div class="meta-k">Repository File</div>
        <div class="meta-v">${escapeHtml(ds.path)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Runtime Ingestion</div>
        <div class="meta-v">${escapeHtml(ds.firestore)}</div>
      </div>
    </div>

    <p style="font-size:0.82rem;color:var(--text-muted);margin:0 0 10px;line-height:1.5">${escapeHtml(ds.summary)}</p>

    <div class="code-label">Actual Bundled Schema Sample</div>
    <pre class="code-block">${escapeHtml(JSON.stringify(ds.sample, null, 2))}</pre>
  `;
}

function renderArchPanel() {
  return `
    <div class="arch-grid">
      <div class="arch-card">
        <h3>Phase A Security &amp; Correctness Remediation</h3>
        <ul>
          <li><strong>Plaintext password removal (<code>ProfileView.swift</code>):</strong> Removed <code>@AppStorage("userPassword")</code>, scrubbed legacy <code>UserDefaults</code> keys on profile load and logout, and stopped persisting unverified <code>newEmail</code> values to Firestore before email verification completes.</li>
          <li><strong>Logout &amp; login alert fixes:</strong> <code>MainView.logout()</code> now clears <code>username</code>, <code>userEmail</code>, and legacy <code>userPassword</code>; <code>LoginView</code> displays <code>"Success"</code> instead of <code>"Error"</code> on successful sign-in.</li>
          <li><strong>Player filter bugfix:</strong> <code>PlayerListView</code> now matches both <code>"Center Midfielder"</code> (13) and <code>"Central Midfielder"</code> (15) so all 220 players are reachable, and shows the numeric slider value.</li>
          <li><strong>Repo hygiene &amp; tests:</strong> Untracked <code>5</code> <code>.DS_Store</code> and <code>3</code> <code>xcuserdata</code> files (removing 217 tracked macOS paths from <code>HEAD</code>) and added 7 deterministic Python data-integrity &amp; security regression tests.</li>
        </ul>
      </div>
      <div class="arch-card">
        <h3>Public Media Licensing &amp; Attribution</h3>
        <ul>
          <li><strong>49 Verified Wikimedia Commons photographs:</strong> Olympiastadion Berlin at night (<code>CC BY 3.0</code>) + 48 real footballer portraits (covering 35/36 match participants + every national team) documented with clickable license &amp; source links in <a href="notices.html">Third-Party Notices</a>.</li>
          <li><strong>25 Original SVGs:</strong> 20 geometric national-color team badges, 4 Home tile icons (replacing watermarked Adobe Stock files and missing <code>profile button</code>), and original neon polygon backdrop.</li>
          <li><strong>Original Xcode assets untouched:</strong> <code>Assets.xcassets/</code> remains preserved locally without rewriting Git history.</li>
        </ul>
      </div>
      <div class="arch-card">
        <h3>Honest Scope &amp; Limitations</h3>
        <ul>
          <li><strong>Zero live Firebase calls:</strong> Authentication, Firestore reads/writes, and profile edits are simulated client-side in the browser.</li>
          <li><strong>Unwired source elements:</strong> <code>LoginView</code>'s <code>"Remember Me"</code> and <code>"Forget Password?"</code> labels are non-interactive in SwiftUI; <code>NewsView</code> has 2 static stub entries; <code>LeagueStandingView</code> computes a unified 20-team table rather than 6 Euro groups.</li>
          <li><strong>Build note:</strong> Full iOS/Firebase compilation requires Xcode 15+ (iOS 17.5, SwiftPM) with a local <code>GoogleService-Info.plist</code>.</li>
        </ul>
      </div>
    </div>
  `;
}

/* ==================== MASTER RENDER & EVENTS ==================== */

function render() {
  const isLight = state.screen === "news";
  iosStatusbar.classList.toggle("light-text-dark", isLight);
  homeIndicator.classList.toggle("dark", isLight);
  btnToggleAuth.textContent = state.isLoggedIn ? "Sign Out Demo" : "Quick Demo Sign-In";

  switch (state.screen) {
    case "landing": phoneBody.innerHTML = renderLandingOrMain(); break;
    case "login": phoneBody.innerHTML = renderLogin(); break;
    case "register": phoneBody.innerHTML = renderRegister(); break;
    case "analyzes": phoneBody.innerHTML = renderAnalyzesHub(); break;
    case "match-detail": phoneBody.innerHTML = renderMatchDetail(); break;
    case "team-detail": phoneBody.innerHTML = renderTeamDetail(); break;
    case "players-standalone": phoneBody.innerHTML = renderStandalonePlayers(); break;
    case "news": phoneBody.innerHTML = renderNews(); break;
    case "profile": phoneBody.innerHTML = renderProfile(); break;
  }

  panelTrace.innerHTML = renderTracePanel();
  panelData.innerHTML = renderDataPanel();
  panelArch.innerHTML = renderArchPanel();

  panelTrace.hidden = state.inspectorTab !== "trace";
  panelData.hidden = state.inspectorTab !== "data";
  panelArch.hidden = state.inspectorTab !== "arch";
  document.querySelectorAll(".inspector-tab").forEach((t) => {
    t.setAttribute("aria-selected", String(t.dataset.inspector === state.inspectorTab));
  });

  document.querySelectorAll(".tour-pill").forEach((pill) => {
    const k = pill.dataset.tour;
    const active =
      (k === "landing" && state.screen === "landing") ||
      (k === "login" && (state.screen === "login" || state.screen === "register")) ||
      (k === "matches" && state.screen === "analyzes" && state.analyzesSegment === 0) ||
      (k === "match-detail" && state.screen === "match-detail") ||
      (k === "standings" && state.screen === "analyzes" && state.analyzesSegment === 1) ||
      (k === "teams" && ((state.screen === "analyzes" && state.analyzesSegment === 2) || state.screen === "team-detail")) ||
      (k === "players" && ((state.screen === "analyzes" && state.analyzesSegment === 3) || state.screen === "players-standalone")) ||
      (k === "news" && state.screen === "news") ||
      (k === "profile" && state.screen === "profile");
    pill.classList.toggle("active", active);
  });

  bindEvents();
}

function bindEvents() {
  phoneBody.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  phoneBody.querySelector('[data-action="go-analyzes"]')?.addEventListener("click", () => navigate("analyzes", { segment: 0 }));
  phoneBody.querySelector('[data-action="go-profile"]')?.addEventListener("click", () => navigate("profile"));
  phoneBody.querySelector('[data-action="go-players"]')?.addEventListener("click", () => navigate("players-standalone"));
  phoneBody.querySelector('[data-action="go-news"]')?.addEventListener("click", () => navigate("news"));
  phoneBody.querySelector('[data-action="back-matches"]')?.addEventListener("click", () => navigate("analyzes", { segment: 0 }));
  phoneBody.querySelector('[data-action="back-teams"]')?.addEventListener("click", () => navigate("analyzes", { segment: 2 }));

  phoneBody.querySelectorAll("[data-seg]").forEach((el) => {
    el.addEventListener("click", () => navigate("analyzes", { segment: Number(el.dataset.seg) }));
  });

  phoneBody.querySelectorAll("[data-match]").forEach((el) => {
    el.addEventListener("click", () => navigate("match-detail", { matchId: el.dataset.match }));
  });

  phoneBody.querySelectorAll("[data-team]").forEach((el) => {
    el.addEventListener("click", () => navigate("team-detail", { teamId: Number(el.dataset.team) }));
  });

  phoneBody.querySelectorAll("[data-inspect-player]").forEach((el) => {
    el.addEventListener("click", () => {
      const p = PLAYERS_BY_ID[Number(el.dataset.inspectPlayer)];
      if (!p) return;
      state.inspectorTab = "trace";
      recordTrace({
        source: 'Firestore collection("players") [Document]',
        swiftView: "PlayerCardView (PlayerListView.swift)",
        operation: `Inspect Player #${p.player_id} (${p.name})`,
        payload: {
          player_id: p.player_id,
          name: p.name,
          position: p.position,
          country: p.country,
          rating: p.rating,
          team_id: p.team_id,
          portraitSource: p.photoCredit || "Original team-colored circular initials avatar",
        },
        note: `${p.photoCredit ? `${p.photoCredit}. ` : "Rendered with team-colored initial avatar. "}Original SwiftUI app displays players inside PlayerListView/TeamDetailView without a separate PlayerDetailView screen.`,
      });
      announce(`Inspected ${p.name}, ${p.position}, ${p.country}, rating ${p.rating}.`);
      render();
    });
  });

  const onFilter = (e) => {
    const activeId = e?.target?.id || null;
    state.filters.position = document.getElementById("fPos").value;
    state.filters.country = document.getElementById("fCountry").value;
    state.filters.minRating = Number(document.getElementById("fMinRating").value);
    const filtered = getFilteredPlayers();
    recordTrace({
      source: "PlayerListView.filteredPlayers",
      swiftView: "PlayerListView.swift (FilterMenuView)",
      operation: `Filter → ${filtered.length} / ${PLAYERS.length} players`,
      payload: { filters: { ...state.filters }, matching_count: filtered.length, sample: filtered.slice(0, 3).map((p) => p.name) },
      note: "Instant client-side filtering across all 220 real players with normalized Center/Central Midfielder matching.",
    });
    render();
    if (activeId) document.getElementById(activeId)?.focus();
  };

  ["fPos", "fCountry", "fMinRating"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", onFilter);
  });

  document.getElementById("btnResetFilters")?.addEventListener("click", () => {
    state.filters = { position: "All", country: "All", minRating: 0 };
    render();
  });

  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pw = document.getElementById("loginPassword").value;
    if (!email || !pw) {
      state.authMessage = { type: "error", text: "Please fill in all fields" };
      render();
      return;
    }
    state.isLoggedIn = true;
    state.username = email.split("@")[0] || email;
    state.email = email;
    recordTrace({
      source: "FirebaseAuth (Simulated)",
      swiftView: "LoginView.swift → MainView.swift",
      operation: "Login Successful (Zero password stored)",
      payload: { email, isLoggedIn: true, storedPasswordInUserDefaults: false },
      note: "Simulated Firebase Auth sign-in succeeded. Password is never written to local storage.",
    });
    announce(`Signed in as ${state.username}.`);
    navigate("landing");
  });

  document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const pw = document.getElementById("regPassword").value;
    if (!email || pw.length < 6) {
      state.authMessage = { type: "error", text: "Provide a valid email and a password of at least 6 characters." };
      render();
      return;
    }
    state.authMessage = { type: "success", text: "Registration Successful (simulated) — redirecting to Login." };
    recordTrace({
      source: "FirebaseAuth (Simulated)",
      swiftView: "RegisterView.swift",
      operation: "createUser(withEmail:password:) → OK",
      payload: { email, status: "simulated_created" },
      note: "Mirrors RegisterView.swift redirecting to LoginView after successful registration.",
    });
    state.screen = "login";
    render();
  });

  document.getElementById("btnPhoneLogout")?.addEventListener("click", () => {
    state.isLoggedIn = false;
    state.username = "";
    state.email = "";
    recordTrace({
      source: "FirebaseAuth (Simulated)",
      swiftView: "MainView.swift → logout()",
      operation: "Auth.auth().signOut() + AppStorage cleanup",
      payload: { isLoggedIn: false, username: "", userEmail: "", legacyUserPasswordRemoved: true },
      note: "Phase A clears username, userEmail, and any legacy userPassword key on logout.",
    });
    announce("Signed out of demo session.");
    render();
  });

  document.getElementById("profileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.profile.name = document.getElementById("profName").value.trim();
    state.profile.newEmail = document.getElementById("profNewEmail").value.trim();
    const newPw = document.getElementById("profNewPw").value;
    state.profile.phoneNumber = document.getElementById("profPhone").value.trim();
    state.profile.bio = document.getElementById("profBio").value.trim();
    state.profile.favoriteTeam = document.getElementById("profTeam").value;
    state.profile.favoritePlayer = document.getElementById("profPlayer").value;
    state.profile.favoriteMatch = document.getElementById("profMatch").value;
    state.profileMessage = state.profile.newEmail
      ? `Profile saved (simulated). Verification email would be sent to ${state.profile.newEmail} before updating email.`
      : newPw
      ? "Profile and password updated (simulated; password kept transient in memory)."
      : "Profile updated in simulated Firestore users/{uid}.";
    recordTrace({
      source: 'Firestore users/{uid} (Simulated)',
      swiftView: "ProfileView.swift → updateProfile()",
      operation: "setData(userData, merge: true)",
      payload: {
        name: state.profile.name,
        email: state.email,
        pendingVerificationEmail: state.profile.newEmail || null,
        passwordUpdatedInMemoryOnly: Boolean(newPw),
        phoneNumber: state.profile.phoneNumber,
        bio: state.profile.bio,
        favoriteTeam: state.profile.favoriteTeam,
        favoritePlayer: state.profile.favoritePlayer,
        favoriteMatch: state.profile.favoriteMatch,
      },
      note: "Phase A fix: unverified newEmail is NOT overwritten into Firestore before verification, and passwords are never written to UserDefaults.",
    });
    announce("Profile updated in demo session.");
    render();
  });

  panelTrace.querySelectorAll("[data-trace-idx]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedTraceIdx = Number(el.dataset.traceIdx);
      render();
    });
  });

  panelData.querySelectorAll("[data-ds]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedDatasetId = el.dataset.ds;
      render();
    });
  });
}

/* ==================== OPTIONAL GUIDED WATCH TUTORIAL ==================== */

const TUTORIAL_STAGES = [
  {
    id: "landing",
    title: "Euro2024App Home & Stadium Shell",
    tourKey: "landing",
    durationMs: 3600,
    narration: "Euro2024App pairs a SwiftUI iOS companion with simulated Firebase state. Start from the Olympiastadion Berlin home shell and four original navigation tiles.",
    enter() {
      state.inspectorTab = "trace";
      state.isLoggedIn = false;
      state.username = "";
      state.email = "";
      state.filters = { position: "All", country: "All", minRating: 0 };
      navigate("landing");
    },
  },
  {
    id: "auth",
    title: "Simulated Firebase Sign-In",
    tourKey: "login",
    durationMs: 3900,
    subDelayMs: 1400,
    narration: "LoginView simulates Firebase email/password authentication locally with zero network requests and zero plaintext passwords stored in UserDefaults.",
    enter() {
      state.inspectorTab = "trace";
      navigate("login");
    },
    subAction() {
      state.isLoggedIn = true;
      state.username = "eurofan";
      state.email = "fan@euro2024demo.example";
      recordTrace({
        source: "FirebaseAuth (Simulated)",
        swiftView: "LoginView.swift → MainView.swift",
        operation: "Login Successful (Zero password stored)",
        payload: { email: state.email, isLoggedIn: true, storedPasswordInUserDefaults: false },
        note: "Guided tutorial signed into the local demo account without any live Firebase call.",
      });
      navigate("landing");
    },
  },
  {
    id: "matches-timeline",
    title: "Sample Fixtures & Match Event Timeline",
    tourKey: "matches",
    durationMs: 4200,
    subDelayMs: 1600,
    narration: "MatchesTabView lists the 5 bundled sample fixtures, then opens France 3 – 2 Italy to inspect chronologically sorted goal and assist events.",
    enter() {
      state.inspectorTab = "trace";
      navigate("analyzes", { segment: 0 });
    },
    subAction() {
      navigate("match-detail", { matchId: MATCHES[0].id });
    },
  },
  {
    id: "standings",
    title: "Unified 20-Team Standings Table",
    tourKey: "standings",
    durationMs: 3600,
    narration: "LeagueStandingView computes live points (3 win / 1 draw / 0 loss) and goal difference across all 20 national teams from the bundled fixtures.",
    enter() {
      state.inspectorTab = "trace";
      navigate("analyzes", { segment: 1 });
    },
  },
  {
    id: "teams-squad",
    title: "20 National Teams & Squad Drill-Down",
    tourKey: "teams",
    durationMs: 4300,
    subDelayMs: 1600,
    narration: "TeamsView displays all 20 national teams with original geometric monogram badges, then drills into France's 11-player squad in TeamDetailView.",
    enter() {
      state.inspectorTab = "trace";
      navigate("analyzes", { segment: 2 });
    },
    subAction() {
      navigate("team-detail", { teamId: TEAMS[1].team_id });
    },
  },
  {
    id: "players-filter",
    title: "220-Player Directory & Normalized Filtering",
    tourKey: "players",
    durationMs: 4400,
    subDelayMs: 1600,
    narration: "PlayerListView loads all 220 real player identities and applies normalized Center/Central Midfielder + 85+ rating filtering with instant trace updates.",
    enter() {
      state.inspectorTab = "trace";
      state.filters = { position: "All", country: "All", minRating: 0 };
      navigate("analyzes", { segment: 3 });
    },
    subAction() {
      state.filters = { position: "Center Midfielder", country: "All", minRating: 85 };
      const filtered = getFilteredPlayers();
      recordTrace({
        source: "PlayerListView.filteredPlayers",
        swiftView: "PlayerListView.swift (FilterMenuView)",
        operation: `Filter → ${filtered.length} / ${PLAYERS.length} players`,
        payload: { filters: { ...state.filters }, matching_count: filtered.length, sample: filtered.slice(0, 3).map((p) => p.name) },
        note: "Guided tutorial applied normalized Center/Central Midfielder + 85+ rating filter across all 220 players.",
      });
      render();
    },
  },
  {
    id: "news-profile",
    title: "News Stub & Authenticated Profile",
    tourKey: "profile",
    durationMs: 4400,
    subDelayMs: 1600,
    narration: "NewsView preserves the app's 2 static stub entries honestly, then ProfileView shows authenticated preference editing with Phase A password remediation.",
    enter() {
      state.inspectorTab = "trace";
      if (!state.isLoggedIn) {
        state.isLoggedIn = true;
        state.username = "eurofan";
        state.email = "fan@euro2024demo.example";
      }
      navigate("news");
    },
    subAction() {
      navigate("profile");
    },
  },
  {
    id: "inspector",
    title: "Firebase Data Inspector & Provenance",
    tourKey: "matches",
    durationMs: 4400,
    subDelayMs: 1800,
    narration: "The right-hand inspector records simulated Firestore traces and documents exact bundled dataset provenance (not live or official UEFA Euro 2024 data).",
    enter() {
      state.inspectorTab = "trace";
      render();
    },
    subAction() {
      state.inspectorTab = "data";
      render();
    },
  },
  {
    id: "finish",
    title: "Walkthrough Complete — Explore Manually",
    tourKey: "landing",
    durationMs: 0,
    narration: "Guided walkthrough complete. Replay anytime, or exit to explore every match timeline, team squad, 220-player filter, and Firebase trace manually.",
    enter() {
      state.inspectorTab = "trace";
      state.filters = { position: "All", country: "All", minRating: 0 };
      navigate("landing");
    },
  },
];

const MIN_TUTORIAL_PHONE_SCALE = 0.68;

const tutorial = {
  active: false,
  playing: false,
  completed: false,
  stageIndex: 0,
  subActionDone: false,
  runId: 0,
  stageTimer: null,
  subTimer: null,
  userScrolledAway: false,
  lastGuidedScrollY: null,
  scrollStartY: null,
  programmaticScrollUntil: 0,
  resizeIgnoreScrollUntil: 0,
  lastViewportW: null,
  lastViewportH: null,
  resizeRafId: null,
  resizeSettleTimer: null,
  phoneScale: 1,
};

const topbarEl = document.querySelector?.(".topbar") || null;
const phoneStageEl = document.querySelector?.(".phone-stage") || null;
const phoneBezelEl = document.querySelector?.(".phone-bezel") || null;
const inspectorShellEl = document.querySelector?.(".inspector-shell") || null;
const tutorialControlsEl = document.querySelector?.(".tutorial-controls") || null;

const btnWatchTutorial = document.getElementById("btnWatchTutorial");
const tutorialDock = document.getElementById("tutorialDock");
const tutorialStepBadge = document.getElementById("tutorialStepBadge");
const tutorialStateBadge = document.getElementById("tutorialStateBadge");
const tutorialStageTitle = document.getElementById("tutorialStageTitle");
const tutorialProgress = document.getElementById("tutorialProgress");
const tutorialProgressFill = document.getElementById("tutorialProgressFill");
const tutorialNarration = document.getElementById("tutorialNarration");
const btnTutPrev = document.getElementById("btnTutPrev");
const btnTutPlayPause = document.getElementById("btnTutPlayPause");
const btnTutNext = document.getElementById("btnTutNext");
const btnTutRestart = document.getElementById("btnTutRestart");
const btnTutExit = document.getElementById("btnTutExit");

function getCurrentScrollY() {
  return Number(window.scrollY ?? window.pageYOffset ?? 0);
}

function getViewportWidth() {
  return Number(window.innerWidth || document.documentElement?.clientWidth || 0);
}

function getViewportHeight() {
  return Number(window.innerHeight || document.documentElement?.clientHeight || 0);
}

function cancelPendingResizeFrame() {
  if (tutorial.resizeRafId !== null && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(tutorial.resizeRafId);
  }
  tutorial.resizeRafId = null;
  if (tutorial.resizeSettleTimer !== null) {
    window.clearTimeout(tutorial.resizeSettleTimer);
    tutorial.resizeSettleTimer = null;
  }
}

function getStickyHeaderClearance() {
  const defaultPad = (window.innerWidth || 1200) <= 640 ? 10 : 12;
  if (!topbarEl || typeof topbarEl.getBoundingClientRect !== "function") {
    return defaultPad;
  }
  const rect = topbarEl.getBoundingClientRect();
  if (getCurrentScrollY() > 4) {
    return rect.top >= -2 && rect.bottom > 0 ? Math.ceil(rect.bottom) + 10 : defaultPad;
  }
  if (typeof window.getComputedStyle === "function") {
    const pos = window.getComputedStyle(topbarEl).position;
    if (pos === "fixed") return Math.ceil(rect.height) + 10;
    if (pos === "sticky") {
      const htmlOverflowX = document.documentElement ? window.getComputedStyle(document.documentElement).overflowX : "";
      const bodyOverflowX = document.body ? window.getComputedStyle(document.body).overflowX : "";
      if (htmlOverflowX !== "hidden" && bodyOverflowX !== "hidden") {
        return Math.ceil(rect.height) + 10;
      }
    }
  }
  return defaultPad;
}

function resetTutorialPhoneScale() {
  tutorial.phoneScale = 1;
  if (phoneStageEl?.style) {
    if (typeof phoneStageEl.style.removeProperty === "function") {
      phoneStageEl.style.removeProperty("--phone-scale");
      phoneStageEl.style.removeProperty("--phone-fit-h");
    } else {
      delete phoneStageEl.style["--phone-scale"];
      delete phoneStageEl.style["--phone-fit-h"];
    }
  }
  if (phoneStageEl?.dataset) {
    delete phoneStageEl.dataset.tutorialScaled;
  }
}

function updateTutorialPhoneScale() {
  if (!tutorial.active) {
    resetTutorialPhoneScale();
    return 1;
  }
  if (!phoneStageEl || !phoneBezelEl || !tutorialDock) return 1;

  const vh = getViewportHeight();
  if (vh <= 0) return 1;

  const vw = getViewportWidth() || 1200;
  const safeTop = getStickyHeaderClearance();
  const dockHeight = typeof tutorialDock.getBoundingClientRect === "function"
    ? tutorialDock.getBoundingClientRect().height
    : 0;
  let dockGap = vw <= 640 ? 14 : 20;
  if (typeof window.getComputedStyle === "function") {
    const parsedMargin = Number.parseFloat(window.getComputedStyle(tutorialDock).marginBottom);
    if (Number.isFinite(parsedMargin) && parsedMargin >= 0) {
      dockGap = parsedMargin;
    }
  }
  const bottomReserve = vw <= 640 ? 12 : 16;

  // Measure untransformed layout height (offsetHeight) so repeated calls never compound scaling.
  const baseH = Number(phoneBezelEl.offsetHeight) || (vw <= 520 ? 728 : 774);
  if (baseH <= 0) return 1;

  const availableForPhoneH = vh - safeTop - dockHeight - dockGap - bottomReserve;
  const rawScale = availableForPhoneH / baseH;
  const clampedScale = Math.max(MIN_TUTORIAL_PHONE_SCALE, Math.min(1, Number(rawScale.toFixed(4))));

  tutorial.phoneScale = clampedScale;
  if (phoneStageEl.style) {
    const fitH = `${Math.ceil(baseH * clampedScale)}px`;
    if (typeof phoneStageEl.style.setProperty === "function") {
      phoneStageEl.style.setProperty("--phone-scale", String(clampedScale));
      phoneStageEl.style.setProperty("--phone-fit-h", fitH);
    } else {
      phoneStageEl.style["--phone-scale"] = String(clampedScale);
      phoneStageEl.style["--phone-fit-h"] = fitH;
    }
  }
  if (phoneStageEl.dataset) {
    phoneStageEl.dataset.tutorialScaled = clampedScale < 0.999 ? "true" : "false";
  }
  return clampedScale;
}

function getVisibleFraction(el, safeTop, vh) {
  if (!el || typeof el.getBoundingClientRect !== "function" || vh <= 0) return 1;
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return 1;
  const visiblePx = Math.max(0, Math.min(vh, rect.bottom) - Math.max(safeTop, rect.top));
  return visiblePx / rect.height;
}

function performGuidedScroll(targetY, { instant = false } = {}) {
  if (typeof window.scrollTo !== "function") return;
  const vh = getViewportHeight();
  const docScrollHeight = Number(document.documentElement?.scrollHeight || 0);
  const maxScrollY = docScrollHeight > vh && vh > 0 ? Math.max(0, docScrollHeight - vh) : Infinity;
  const clampedTarget = Math.max(0, Math.min(maxScrollY, Math.round(targetY)));
  const currentY = getCurrentScrollY();
  tutorial.lastViewportW = getViewportWidth();
  tutorial.lastViewportH = vh;
  if (Math.abs(clampedTarget - currentY) < 4) {
    tutorial.lastGuidedScrollY = Math.round(currentY);
    return;
  }
  const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const useInstant = reduceMotion || instant;
  tutorial.scrollStartY = currentY;
  tutorial.lastGuidedScrollY = clampedTarget;
  tutorial.programmaticScrollUntil = Date.now() + (useInstant ? 80 : 750);
  window.scrollTo({
    top: clampedTarget,
    behavior: useInstant ? "auto" : "smooth",
  });
  if (Math.abs(getCurrentScrollY() - clampedTarget) <= 4) {
    tutorial.programmaticScrollUntil = 0;
  }
}

function ensureTutorialViewportVisible({ reason = "auto", stage = null } = {}) {
  if (!tutorial.active) return;
  if (typeof window.scrollTo !== "function") return;
  if ((reason === "auto" || reason === "resize") && tutorial.userScrolledAway) return;

  const vh = getViewportHeight();
  if (vh <= 0) return;
  const safeTop = getStickyHeaderClearance();
  const scrollY = getCurrentScrollY();
  const instant = reason === "resize";

  if (stage?.id === "inspector" && inspectorShellEl && typeof inspectorShellEl.getBoundingClientRect === "function") {
    const inspRect = inspectorShellEl.getBoundingClientRect();
    const inspVis = getVisibleFraction(inspectorShellEl, safeTop, vh);
    if (inspRect.top >= safeTop - 4 && inspVis >= 0.7) {
      return;
    }
    performGuidedScroll(scrollY + inspRect.top - safeTop, { instant });
    return;
  }

  if (!tutorialDock || typeof tutorialDock.getBoundingClientRect !== "function") return;
  const dockRect = tutorialDock.getBoundingClientRect();
  const phoneRect = phoneBezelEl && typeof phoneBezelEl.getBoundingClientRect === "function"
    ? phoneBezelEl.getBoundingClientRect()
    : null;

  const combinedHeight = phoneRect ? Math.max(dockRect.height, phoneRect.bottom - dockRect.top) : dockRect.height;
  const canFitBoth = combinedHeight <= vh - safeTop + 2;
  const dockFullyVisible = dockRect.top >= safeTop - 2 && dockRect.bottom <= vh + 1;
  const phoneFullyVisible = phoneRect ? (phoneRect.top >= safeTop - 2 && phoneRect.bottom <= vh + 1) : true;

  if (reason !== "start" && canFitBoth && dockFullyVisible && phoneFullyVisible) {
    return;
  }

  let targetY = Math.max(0, scrollY + dockRect.top - safeTop);

  if (!canFitBoth && phoneRect && phoneRect.height > 0) {
    const projectedPhoneTop = scrollY + phoneRect.top - targetY;
    const projectedVisible = Math.max(
      0,
      Math.min(vh, projectedPhoneTop + phoneRect.height) - Math.max(safeTop, projectedPhoneTop),
    );
    if (projectedVisible / phoneRect.height < 0.55) {
      const controlsRect = tutorialControlsEl?.getBoundingClientRect();
      const anchorTop = controlsRect && controlsRect.height < vh - safeTop
        ? Math.min(controlsRect.top, phoneRect.top)
        : phoneRect.top;
      targetY = Math.max(0, scrollY + anchorTop - safeTop);
    }
  }

  performGuidedScroll(targetY, { instant });
}

if (typeof window.addEventListener === "function") {
  const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
  const markManualScrollIntent = (e) => {
    if (!tutorial.active) return;
    if (phoneBody && typeof phoneBody.contains === "function" && e?.target && phoneBody.contains(e.target)) {
      return;
    }
    tutorial.programmaticScrollUntil = 0;
    tutorial.resizeIgnoreScrollUntil = 0;
  };
  window.addEventListener("wheel", markManualScrollIntent, { passive: true });
  window.addEventListener("touchmove", markManualScrollIntent, { passive: true });
  window.addEventListener(
    "keydown",
    (e) => {
      if (e && SCROLL_KEYS.has(e.key)) {
        markManualScrollIntent(e);
      }
    },
    { passive: true },
  );

  const handleTutorialResize = () => {
    if (!tutorial.active) return;
    tutorial.lastViewportW = getViewportWidth();
    tutorial.lastViewportH = getViewportHeight();
    tutorial.resizeIgnoreScrollUntil = Date.now() + 260;

    const applySettledResize = () => {
      tutorial.resizeRafId = null;
      if (!tutorial.active) return;
      tutorial.lastViewportW = getViewportWidth();
      tutorial.lastViewportH = getViewportHeight();
      tutorial.resizeIgnoreScrollUntil = Date.now() + 260;
      updateTutorialPhoneScale();
      if (!tutorial.userScrolledAway) {
        const stage = TUTORIAL_STAGES[tutorial.stageIndex];
        ensureTutorialViewportVisible({ reason: "resize", stage });
      }
    };

    cancelPendingResizeFrame();
    if (typeof window.requestAnimationFrame === "function") {
      tutorial.resizeRafId = window.requestAnimationFrame(applySettledResize);
    } else {
      applySettledResize();
    }
    tutorial.resizeSettleTimer = window.setTimeout(() => {
      tutorial.resizeSettleTimer = null;
      applySettledResize();
    }, 120);
  };
  window.addEventListener("resize", handleTutorialResize, { passive: true });
  window.visualViewport?.addEventListener?.("resize", handleTutorialResize, { passive: true });

  window.addEventListener(
    "scroll",
    () => {
      if (!tutorial.active || tutorial.lastGuidedScrollY === null) return;
      const curW = getViewportWidth();
      const curH = getViewportHeight();
      if (
        (tutorial.lastViewportW !== null && curW !== tutorial.lastViewportW) ||
        (tutorial.lastViewportH !== null && curH !== tutorial.lastViewportH)
      ) {
        return;
      }
      if (Date.now() < tutorial.resizeIgnoreScrollUntil) {
        return;
      }
      const curY = getCurrentScrollY();
      const dist = Math.abs(curY - tutorial.lastGuidedScrollY);
      if (Date.now() < tutorial.programmaticScrollUntil) {
        if (dist <= 4) {
          tutorial.programmaticScrollUntil = 0;
          return;
        }
        if (tutorial.scrollStartY !== null) {
          const intendedDelta = tutorial.lastGuidedScrollY - tutorial.scrollStartY;
          const movedWrongWay =
            (intendedDelta > 0 && curY < tutorial.scrollStartY - 24) ||
            (intendedDelta < 0 && curY > tutorial.scrollStartY + 24);
          const overshot =
            (intendedDelta > 0 && curY > tutorial.lastGuidedScrollY + 40) ||
            (intendedDelta < 0 && curY < tutorial.lastGuidedScrollY - 40);
          if (movedWrongWay || overshot) {
            tutorial.programmaticScrollUntil = 0;
            tutorial.userScrolledAway = true;
          }
        }
        return;
      }
      if (dist > 28) {
        tutorial.userScrolledAway = true;
      }
    },
    { passive: true },
  );
}

function clearTutorialTimers() {
  if (tutorial.stageTimer !== null) {
    window.clearTimeout(tutorial.stageTimer);
    tutorial.stageTimer = null;
  }
  if (tutorial.subTimer !== null) {
    window.clearTimeout(tutorial.subTimer);
    tutorial.subTimer = null;
  }
}

function updateTutorialUI() {
  if (!tutorialDock) return;
  tutorialDock.hidden = !tutorial.active;
  if (btnWatchTutorial) {
    btnWatchTutorial.setAttribute("aria-expanded", String(tutorial.active));
  }
  if (!tutorial.active) return;

  const total = TUTORIAL_STAGES.length;
  const stage = TUTORIAL_STAGES[tutorial.stageIndex];
  const stepNum = tutorial.stageIndex + 1;
  const pct = Math.round((stepNum / total) * 100);

  tutorialStepBadge.textContent = `Stage ${stepNum} / ${total}`;
  tutorialStageTitle.textContent = stage.title;
  tutorialNarration.textContent = stage.narration;

  if (tutorial.completed) {
    tutorialStateBadge.textContent = "Complete";
    tutorialStateBadge.dataset.state = "complete";
    btnTutPlayPause.textContent = "Replay";
    btnTutPlayPause.setAttribute("aria-pressed", "false");
  } else if (tutorial.playing) {
    tutorialStateBadge.textContent = "Playing";
    tutorialStateBadge.dataset.state = "playing";
    btnTutPlayPause.textContent = "Pause";
    btnTutPlayPause.setAttribute("aria-pressed", "true");
  } else {
    tutorialStateBadge.textContent = "Paused";
    tutorialStateBadge.dataset.state = "paused";
    btnTutPlayPause.textContent = "Play";
    btnTutPlayPause.setAttribute("aria-pressed", "false");
  }

  tutorialProgress.setAttribute("aria-valuenow", String(stepNum));
  tutorialProgress.setAttribute("aria-valuemax", String(total));
  tutorialProgressFill.style.width = `${pct}%`;

  btnTutPrev.disabled = tutorial.stageIndex === 0;
  btnTutNext.disabled = tutorial.stageIndex === total - 1;
}

function scheduleCurrentStage(runId) {
  if (!tutorial.active || !tutorial.playing) return;
  const stage = TUTORIAL_STAGES[tutorial.stageIndex];
  const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

  if (typeof stage.subAction === "function" && !tutorial.subActionDone) {
    const subWait = reduceMotion ? 220 : (stage.subDelayMs || 1500);
    tutorial.subTimer = window.setTimeout(() => {
      tutorial.subTimer = null;
      if (!tutorial.active || !tutorial.playing || tutorial.runId !== runId || tutorial.subActionDone) return;
      tutorial.subActionDone = true;
      stage.subAction();
    }, subWait);
  }

  if (tutorial.stageIndex < TUTORIAL_STAGES.length - 1) {
    const waitMs = reduceMotion ? Math.max(1800, Math.round(stage.durationMs * 0.7)) : stage.durationMs;
    tutorial.stageTimer = window.setTimeout(() => {
      tutorial.stageTimer = null;
      if (!tutorial.active || !tutorial.playing || tutorial.runId !== runId) return;
      goToTutorialStage(tutorial.stageIndex + 1, { autoPlay: true });
    }, waitMs);
  }
}

function goToTutorialStage(index, { autoPlay = tutorial.playing, scrollReason = "auto" } = {}) {
  clearTutorialTimers();
  tutorial.runId += 1;
  const currentRunId = tutorial.runId;

  const clamped = Math.max(0, Math.min(TUTORIAL_STAGES.length - 1, index));
  const isLast = clamped === TUTORIAL_STAGES.length - 1;

  tutorial.active = true;
  tutorial.stageIndex = clamped;
  tutorial.subActionDone = false;
  tutorial.completed = isLast;
  tutorial.playing = isLast ? false : Boolean(autoPlay);

  const stage = TUTORIAL_STAGES[clamped];
  stage.enter();
  updateTutorialUI();
  updateTutorialPhoneScale();
  ensureTutorialViewportVisible({ reason: scrollReason, stage });
  announce(`Tutorial stage ${clamped + 1} of ${TUTORIAL_STAGES.length}: ${stage.title}.`);

  if (!isLast && tutorial.playing) {
    scheduleCurrentStage(currentRunId);
  }
}

function startTutorial() {
  clearTutorialTimers();
  cancelPendingResizeFrame();
  tutorial.userScrolledAway = false;
  tutorial.lastGuidedScrollY = null;
  tutorial.scrollStartY = null;
  tutorial.programmaticScrollUntil = 0;
  tutorial.resizeIgnoreScrollUntil = 0;
  tutorial.lastViewportW = getViewportWidth();
  tutorial.lastViewportH = getViewportHeight();
  state = createInitialState();
  goToTutorialStage(0, { autoPlay: true, scrollReason: "start" });
}

function pauseTutorial({ silent = false } = {}) {
  if (!tutorial.active || !tutorial.playing) return;
  clearTutorialTimers();
  tutorial.runId += 1;
  tutorial.playing = false;
  updateTutorialUI();
  if (!silent) announce("Tutorial paused.");
}

function resumeTutorial() {
  if (!tutorial.active || tutorial.completed || tutorial.stageIndex >= TUTORIAL_STAGES.length - 1) {
    startTutorial();
    return;
  }
  if (tutorial.playing) return;
  clearTutorialTimers();
  tutorial.runId += 1;
  tutorial.playing = true;
  updateTutorialUI();
  announce("Tutorial resumed.");
  scheduleCurrentStage(tutorial.runId);
}

function exitTutorial({ silent = false } = {}) {
  if (!tutorial.active && tutorial.stageTimer === null && tutorial.subTimer === null) return;
  if (Date.now() < tutorial.programmaticScrollUntil && typeof window.scrollTo === "function") {
    window.scrollTo({ top: getCurrentScrollY(), behavior: "instant" });
  }
  clearTutorialTimers();
  cancelPendingResizeFrame();
  tutorial.runId += 1;
  tutorial.active = false;
  tutorial.playing = false;
  tutorial.subActionDone = false;
  tutorial.completed = false;
  tutorial.userScrolledAway = false;
  tutorial.lastGuidedScrollY = null;
  tutorial.scrollStartY = null;
  tutorial.programmaticScrollUntil = 0;
  tutorial.resizeIgnoreScrollUntil = 0;
  tutorial.lastViewportW = null;
  tutorial.lastViewportH = null;
  resetTutorialPhoneScale();
  updateTutorialUI();
  if (!silent) {
    announce("Exited guided tutorial. Exploring manually.");
    btnWatchTutorial?.focus({ preventScroll: true });
  }
}

// Persistent Topbar, Tutorial, Tour & Inspector Tab wiring
btnWatchTutorial?.addEventListener("click", () => {
  startTutorial();
  btnTutPlayPause?.focus({ preventScroll: true });
});

btnTutPlayPause?.addEventListener("click", () => {
  if (tutorial.completed) {
    startTutorial();
  } else if (tutorial.playing) {
    pauseTutorial();
  } else {
    resumeTutorial();
  }
});

btnTutPrev?.addEventListener("click", () => {
  if (!tutorial.active || tutorial.stageIndex <= 0) return;
  goToTutorialStage(tutorial.stageIndex - 1, { autoPlay: false, scrollReason: "step" });
});

btnTutNext?.addEventListener("click", () => {
  if (!tutorial.active || tutorial.stageIndex >= TUTORIAL_STAGES.length - 1) return;
  goToTutorialStage(tutorial.stageIndex + 1, { autoPlay: false, scrollReason: "step" });
});

btnTutRestart?.addEventListener("click", () => {
  startTutorial();
});

btnTutExit?.addEventListener("click", () => {
  exitTutorial();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && tutorial.active) {
    exitTutorial();
  }
});

// Pause auto-advance safely if user interacts directly inside the phone frame
phoneBody?.addEventListener("pointerdown", () => {
  if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
});

document.querySelectorAll(".tour-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    if (tutorial.active) exitTutorial({ silent: true });
    const t = pill.dataset.tour;
    state.inspectorTab = "trace";
    if (t === "landing") navigate("landing");
    else if (t === "login") navigate("login");
    else if (t === "matches") navigate("analyzes", { segment: 0 });
    else if (t === "match-detail") navigate("match-detail", { matchId: MATCHES[0].id });
    else if (t === "standings") navigate("analyzes", { segment: 1 });
    else if (t === "teams") navigate("analyzes", { segment: 2 });
    else if (t === "players") navigate("analyzes", { segment: 3 });
    else if (t === "news") navigate("news");
    else if (t === "profile") {
      if (!state.isLoggedIn) {
        state.isLoggedIn = true;
        state.username = "eurofan";
        state.email = "fan@euro2024demo.example";
      }
      navigate("profile");
    }
  });
});

const inspectorTabs = Array.from(document.querySelectorAll(".inspector-tab"));
inspectorTabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => {
    if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
    state.inspectorTab = tab.dataset.inspector;
    render();
  });
  tab.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
      const next = e.key === "ArrowRight" ? (idx + 1) % inspectorTabs.length : (idx - 1 + inspectorTabs.length) % inspectorTabs.length;
      state.inspectorTab = inspectorTabs[next].dataset.inspector;
      render();
      inspectorTabs[next].focus();
    }
  });
});

btnToggleAuth.addEventListener("click", () => {
  if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
  if (state.isLoggedIn) {
    state.isLoggedIn = false;
    state.username = "";
    state.email = "";
    announce("Signed out of demo session.");
  } else {
    state.isLoggedIn = true;
    state.username = "eurofan";
    state.email = "fan@euro2024demo.example";
    announce("Signed in to demo session as eurofan.");
  }
  navigate("landing");
});

document.getElementById("btnResetDemo").addEventListener("click", () => {
  if (tutorial.active) exitTutorial({ silent: true });
  clearTutorialTimers();
  cancelPendingResizeFrame();
  state = createInitialState();
  announce("Demo session reset to initial state.");
  navigate("landing");
});

// Deterministic read-only inspection handle for automated verification
window.__EURO_TUTORIAL__ = {
  getState: () => ({
    active: tutorial.active,
    playing: tutorial.playing,
    completed: tutorial.completed,
    stageIndex: tutorial.stageIndex,
    stageId: TUTORIAL_STAGES[tutorial.stageIndex]?.id || null,
    subActionDone: tutorial.subActionDone,
    userScrolledAway: tutorial.userScrolledAway,
    lastGuidedScrollY: tutorial.lastGuidedScrollY,
    phoneScale: tutorial.phoneScale,
    totalStages: TUTORIAL_STAGES.length,
    hasPendingTimers: tutorial.stageTimer !== null || tutorial.subTimer !== null || tutorial.resizeSettleTimer !== null,
    screen: state.screen,
    analyzesSegment: state.analyzesSegment,
    isLoggedIn: state.isLoggedIn,
    selectedMatchId: state.selectedMatchId,
    selectedTeamId: state.selectedTeamId,
    inspectorTab: state.inspectorTab,
    filters: { ...state.filters },
    filteredPlayersCount: getFilteredPlayers().length,
  }),
  stages: TUTORIAL_STAGES.map((s, idx) => ({ index: idx, id: s.id, title: s.title, tourKey: s.tourKey })),
};

navigate("landing");
