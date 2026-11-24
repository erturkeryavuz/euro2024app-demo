"""Focused behavioral and responsive regression tests for the Watch Tutorial layer in euro2024app-demo.

Exercises real docs/app.js ESM execution against a deterministic in-memory DOM and fake timer clock
using Node.js (zero external dependencies), plus HTML/CSS contract assertions.
"""

import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

LIFECYCLE_HARNESS = r"""
import path from "node:path";
import { pathToFileURL } from "node:url";

const docsDir = process.argv[1];
const reduceMotionFlag = process.argv[2] === "reduce";

let nowMs = 0;
let nextTimerId = 1;
const timers = new Map();

globalThis.window = globalThis;
window.setTimeout = (fn, delay = 0) => {
  const id = nextTimerId++;
  timers.set(id, { id, fn, runAt: nowMs + Math.max(0, Number(delay) || 0) });
  return id;
};
window.clearTimeout = (id) => timers.delete(id);
window.requestAnimationFrame = (fn) => { fn(); return 1; };
window.cancelAnimationFrame = () => {};
window.matchMedia = (q) => ({
  matches: q.includes("prefers-reduced-motion") ? reduceMotionFlag : false,
  media: q,
});

function advanceTimers(ms) {
  const target = nowMs + ms;
  while (true) {
    let earliest = null;
    for (const t of timers.values()) {
      if (t.runAt <= target && (!earliest || t.runAt < earliest.runAt || (t.runAt === earliest.runAt && t.id < earliest.id))) {
        earliest = t;
      }
    }
    if (!earliest) break;
    timers.delete(earliest.id);
    nowMs = earliest.runAt;
    earliest.fn();
  }
  nowMs = target;
}

class FakeElement {
  constructor(tag, id = "", attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.attrs = { ...attrs };
    this.dataset = {};
    this.hidden = Boolean(attrs.hidden);
    this.disabled = false;
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.style = {};
    this.listeners = new Map();
    this._classes = new Set((attrs.class || "").split(/\s+/).filter(Boolean));
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("data-")) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[camel] = v;
      }
    }
    this.classList = {
      add: (c) => this._classes.add(c),
      remove: (c) => this._classes.delete(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains: (c) => this._classes.has(c),
    };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  click() {
    if (this.disabled) return;
    for (const fn of this.listeners.get("click") || []) fn({ target: this, preventDefault() {} });
  }
  dispatch(type, evt = {}) {
    for (const fn of this.listeners.get(type) || []) fn({ target: this, preventDefault() {}, ...evt });
  }
  focus() { document.activeElement = this; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

const byId = new Map();
function makeEl(tag, id, attrs = {}) {
  const el = new FakeElement(tag, id, attrs);
  if (id) byId.set(id, el);
  return el;
}

const tourKeys = ["landing", "login", "matches", "match-detail", "standings", "teams", "players", "news", "profile"];
const tourPills = tourKeys.map((k) => new FakeElement("button", "", { class: "tour-pill", "data-tour": k }));
const inspectorTabs = ["trace", "data", "arch"].map((k) =>
  new FakeElement("button", `tab_${k}`, { class: "inspector-tab", "data-inspector": k })
);

for (const [tag, id, attrs] of [
  ["div", "phoneBody", {}],
  ["div", "iosStatusbar", {}],
  ["div", "homeIndicator", {}],
  ["div", "panelTrace", {}],
  ["div", "panelData", { hidden: true }],
  ["div", "panelArch", { hidden: true }],
  ["div", "srAnnouncer", {}],
  ["button", "btnToggleAuth", {}],
  ["button", "btnResetDemo", {}],
  ["button", "btnWatchTutorial", {}],
  ["section", "tutorialDock", { hidden: true }],
  ["span", "tutorialStepBadge", {}],
  ["span", "tutorialStateBadge", {}],
  ["h2", "tutorialStageTitle", {}],
  ["div", "tutorialProgress", {}],
  ["div", "tutorialProgressFill", {}],
  ["p", "tutorialNarration", {}],
  ["button", "btnTutPrev", {}],
  ["button", "btnTutPlayPause", {}],
  ["button", "btnTutNext", {}],
  ["button", "btnTutRestart", {}],
  ["button", "btnTutExit", {}],
]) {
  makeEl(tag, id, attrs);
}

const docListeners = new Map();
globalThis.document = {
  activeElement: null,
  getElementById: (id) => byId.get(id) || null,
  querySelector: () => null,
  querySelectorAll: (sel) => {
    if (sel === ".tour-pill") return tourPills;
    if (sel === ".inspector-tab") return inspectorTabs;
    return [];
  },
  addEventListener: (type, fn) => {
    if (!docListeners.has(type)) docListeners.set(type, []);
    docListeners.get(type).push(fn);
  },
  dispatch: (type, evt) => {
    for (const fn of docListeners.get(type) || []) fn(evt);
  },
};

await import(pathToFileURL(path.join(docsDir, "app.js")).href);
const api = window.__EURO_TUTORIAL__;
const results = {};

// 1. Initial state (no autoplay)
results.initial = {
  state: api.getState(),
  dockHidden: byId.get("tutorialDock").hidden,
  activeTimers: timers.size,
  stageCount: api.stages.length,
  stageTourKeysValid: api.stages.every((s) => tourKeys.includes(s.tourKey)),
};

// 2. Start Watch Tutorial & advance through full 9-stage playback
byId.get("btnWatchTutorial").click();
results.afterStart = {
  state: api.getState(),
  dockHidden: byId.get("tutorialDock").hidden,
  prevDisabled: byId.get("btnTutPrev").disabled,
  nextDisabled: byId.get("btnTutNext").disabled,
  playPauseText: byId.get("btnTutPlayPause").textContent,
};

const seenStages = [api.getState().stageId];
const snapshots = {};
for (let i = 0; i < 80; i++) {
  advanceTimers(700);
  const st = api.getState();
  if (seenStages[seenStages.length - 1] !== st.stageId) {
    seenStages.push(st.stageId);
  }
  if (st.stageId === "auth" && st.isLoggedIn) snapshots.signedIn = true;
  if (st.stageId === "matches-timeline" && st.screen === "match-detail") snapshots.matchTimelineOpened = st.selectedMatchId;
  if (st.stageId === "teams-squad" && st.screen === "team-detail") snapshots.squadOpened = st.selectedTeamId;
  if (st.stageId === "players-filter" && st.filters.position === "Center Midfielder") {
    snapshots.playersFiltered = { ...st.filters, matching: st.filteredPlayersCount };
  }
  if (st.stageId === "news-profile" && st.screen === "profile") snapshots.profileOpened = true;
  if (st.stageId === "inspector" && st.inspectorTab === "data") snapshots.inspectorDataOpened = true;
  if (st.completed) break;
}
results.fullPlaythrough = {
  seenStages,
  snapshots,
  endState: api.getState(),
  activeTimersAtEnd: timers.size,
  nextDisabledAtEnd: byId.get("btnTutNext").disabled,
  playPauseTextAtEnd: byId.get("btnTutPlayPause").textContent,
};

// 3. Replay from finish, Next/Prev (verify paused stages NEVER fire sub-actions!), Resume, Pause
byId.get("btnTutPlayPause").click(); // Replay from completed state
const afterReplay = api.getState();
byId.get("btnTutNext").click(); // Stage 1 (auth, paused)
byId.get("btnTutNext").click(); // Stage 2 (matches-timeline, paused)
advanceTimers(10000);
const pausedTimeline = { state: api.getState(), timers: timers.size };
byId.get("btnTutPrev").click(); // back to Stage 1 (auth, paused)
advanceTimers(10000);
const pausedAuth = { state: api.getState(), timers: timers.size };
byId.get("btnTutPlayPause").click(); // Resume on auth
advanceTimers(1600); // > 1400ms subDelayMs
const resumedAuthSignedIn = api.getState();
byId.get("btnTutPlayPause").click(); // Pause
const pausedAfterResume = api.getState();
const timersWhilePaused = timers.size;
advanceTimers(30000);
const stayedPaused = api.getState().stageIndex === pausedAfterResume.stageIndex && !api.getState().playing;
results.controls = {
  afterReplay,
  pausedTimeline,
  pausedAuth,
  resumedAuthSignedIn,
  timersWhilePaused,
  stayedPaused,
};

// 4. Repeated Watch Tutorial clicks do not accumulate timers
byId.get("btnWatchTutorial").click();
byId.get("btnWatchTutorial").click();
byId.get("btnWatchTutorial").click();
results.repeatedStartTimers = timers.size;

// 5. Exit cleans up timers & hides dock; advancing clock changes nothing
byId.get("btnTutExit").click();
const afterExit = api.getState();
const timersAfterExit = timers.size;
const dockHiddenAfterExit = byId.get("tutorialDock").hidden;
advanceTimers(30000);
results.exit = {
  afterExit,
  timersAfterExit,
  dockHiddenAfterExit,
  noMutationsAfterExit: api.getState().screen === afterExit.screen && !api.getState().active,
};

// 6. Manual tour pills exit active tutorial cleanly & remain independent
byId.get("btnWatchTutorial").click();
tourPills[4].click(); // standings
const afterManualStandings = api.getState();
const timersAfterManual = timers.size;
tourPills[7].click(); // news
const afterManualNews = api.getState();
results.manualIndependence = {
  afterManualStandings,
  timersAfterManual,
  afterManualNews,
  newsPillActive: tourPills[7].classList.contains("active"),
};

// 7. Quick Demo Sign-In & Reset Session preserved
byId.get("btnWatchTutorial").click();
byId.get("btnToggleAuth").click();
const afterToggleAuth = api.getState();
byId.get("btnResetDemo").click();
results.sessionControls = {
  afterToggleAuth,
  afterReset: api.getState(),
  timersAfterReset: timers.size,
};

// 8. Escape key exits tutorial cleanly
byId.get("btnWatchTutorial").click();
document.dispatch("keydown", { key: "Escape" });
results.escapeExit = {
  active: api.getState().active,
  timers: timers.size,
};

console.log(JSON.stringify(results));
"""


class Euro2024TutorialTests(unittest.TestCase):
    def _run_lifecycle(self, reduce_motion=False):
        mode = "reduce" if reduce_motion else "normal"
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", LIFECYCLE_HARNESS, str(DOCS), mode],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 0, f"Lifecycle harness failed:\n{proc.stderr}")
        return json.loads(proc.stdout)

    def test_html_and_css_tutorial_contract_preserves_nine_manual_pills(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        css = (DOCS / "styles.css").read_text(encoding="utf-8")
        for required_id in [
            'id="btnWatchTutorial"',
            'id="tutorialDock"',
            'id="btnTutPrev"',
            'id="btnTutPlayPause"',
            'id="btnTutNext"',
            'id="btnTutRestart"',
            'id="btnTutExit"',
            'id="tutorialProgress"',
            'id="tutorialNarration"',
            'class="phone-scale-box"',
        ]:
            self.assertIn(required_id, html)
        for tour_key in ["landing", "login", "matches", "match-detail", "standings", "teams", "players", "news", "profile"]:
            self.assertIn(f'data-tour="{tour_key}"', html)
        self.assertIn("--phone-scale", css)
        self.assertIn("--phone-fit-h", css)
        self.assertIn("transform: scale(var(--phone-scale, 1))", css)

    def test_tutorial_lifecycle_playthrough_controls_and_cleanup(self):
        data = self._run_lifecycle(reduce_motion=False)

        # No autoplay on load
        self.assertFalse(data["initial"]["state"]["active"])
        self.assertFalse(data["initial"]["state"]["playing"])
        self.assertTrue(data["initial"]["dockHidden"])
        self.assertEqual(data["initial"]["activeTimers"], 0)
        self.assertEqual(data["initial"]["stageCount"], 9)
        self.assertTrue(data["initial"]["stageTourKeysValid"])

        # Starts cleanly on Watch Tutorial
        self.assertTrue(data["afterStart"]["state"]["active"])
        self.assertTrue(data["afterStart"]["state"]["playing"])
        self.assertFalse(data["afterStart"]["dockHidden"])
        self.assertTrue(data["afterStart"]["prevDisabled"])
        self.assertFalse(data["afterStart"]["nextDisabled"])
        self.assertEqual(data["afterStart"]["playPauseText"], "Pause")

        # Full 9-stage playthrough hits real Euro2024App sub-actions
        fp = data["fullPlaythrough"]
        self.assertEqual(
            fp["seenStages"],
            [
                "landing",
                "auth",
                "matches-timeline",
                "standings",
                "teams-squad",
                "players-filter",
                "news-profile",
                "inspector",
                "finish",
            ],
        )
        self.assertTrue(fp["snapshots"]["signedIn"])
        self.assertEqual(fp["snapshots"]["matchTimelineOpened"], "match_1")
        self.assertEqual(fp["snapshots"]["squadOpened"], 2)
        self.assertEqual(fp["snapshots"]["playersFiltered"]["position"], "Center Midfielder")
        self.assertEqual(fp["snapshots"]["playersFiltered"]["minRating"], 85)
        self.assertGreater(fp["snapshots"]["playersFiltered"]["matching"], 0)
        self.assertLess(fp["snapshots"]["playersFiltered"]["matching"], 220)
        self.assertTrue(fp["snapshots"]["profileOpened"])
        self.assertTrue(fp["snapshots"]["inspectorDataOpened"])
        self.assertTrue(fp["endState"]["completed"])
        self.assertFalse(fp["endState"]["playing"])
        self.assertEqual(fp["activeTimersAtEnd"], 0)
        self.assertTrue(fp["nextDisabledAtEnd"])
        self.assertEqual(fp["playPauseTextAtEnd"], "Replay")

        # Replay, paused Next/Prev (zero unintended sub-actions), Resume, Pause
        ctrl = data["controls"]
        self.assertEqual(ctrl["afterReplay"]["stageIndex"], 0)
        self.assertTrue(ctrl["afterReplay"]["playing"])
        self.assertEqual(ctrl["pausedTimeline"]["state"]["screen"], "analyzes")
        self.assertEqual(ctrl["pausedTimeline"]["timers"], 0)
        self.assertEqual(ctrl["pausedAuth"]["state"]["screen"], "login")
        self.assertFalse(ctrl["pausedAuth"]["state"]["isLoggedIn"])
        self.assertEqual(ctrl["pausedAuth"]["timers"], 0)
        self.assertTrue(ctrl["resumedAuthSignedIn"]["isLoggedIn"])
        self.assertEqual(ctrl["timersWhilePaused"], 0)
        self.assertTrue(ctrl["stayedPaused"])

        # Repeated start safety
        self.assertLessEqual(data["repeatedStartTimers"], 2)

        # Exit cleanup
        self.assertFalse(data["exit"]["afterExit"]["active"])
        self.assertEqual(data["exit"]["timersAfterExit"], 0)
        self.assertTrue(data["exit"]["dockHiddenAfterExit"])
        self.assertTrue(data["exit"]["noMutationsAfterExit"])

        # Manual tour pills independent
        man = data["manualIndependence"]
        self.assertFalse(man["afterManualStandings"]["active"])
        self.assertEqual(man["afterManualStandings"]["screen"], "analyzes")
        self.assertEqual(man["afterManualStandings"]["analyzesSegment"], 1)
        self.assertEqual(man["timersAfterManual"], 0)
        self.assertEqual(man["afterManualNews"]["screen"], "news")
        self.assertTrue(man["newsPillActive"])

        # Quick Demo Sign-In & Reset Session preserved
        sess = data["sessionControls"]
        self.assertTrue(sess["afterToggleAuth"]["isLoggedIn"])
        self.assertFalse(sess["afterToggleAuth"]["playing"])
        self.assertFalse(sess["afterReset"]["active"])
        self.assertFalse(sess["afterReset"]["isLoggedIn"])
        self.assertEqual(sess["timersAfterReset"], 0)

        # Escape exits cleanly
        self.assertFalse(data["escapeExit"]["active"])
        self.assertEqual(data["escapeExit"]["timers"], 0)

    def test_reduced_motion_mode_completes_cleanly(self):
        data = self._run_lifecycle(reduce_motion=True)
        fp = data["fullPlaythrough"]
        self.assertEqual(len(fp["seenStages"]), 9)
        self.assertTrue(fp["snapshots"]["signedIn"])
        self.assertEqual(fp["snapshots"]["matchTimelineOpened"], "match_1")
        self.assertTrue(fp["snapshots"]["inspectorDataOpened"])
        self.assertTrue(fp["endState"]["completed"])
        self.assertEqual(fp["activeTimersAtEnd"], 0)

    def test_proportional_scaling_resize_discrimination_and_full_fit(self):
        responsive_harness = r"""
import path from "node:path";
import { pathToFileURL } from "node:url";

const docsDir = process.argv[1];
const seq = [
  { name: "1366x768", w: 1366, h: 768, dockTop: 390, dockH: 110, dockGap: 20, phoneBaseH: 774, anchorShift: 0 },
  { name: "1280x768", w: 1280, h: 768, dockTop: 387, dockH: 110, dockGap: 20, phoneBaseH: 774, anchorShift: -3 },
  { name: "1024x768", w: 1024, h: 768, dockTop: 412, dockH: 130, dockGap: 20, phoneBaseH: 774, anchorShift: 25 },
  { name: "960x768",  w: 960,  h: 768, dockTop: 538, dockH: 168, dockGap: 20, phoneBaseH: 774, anchorShift: 126 },
  { name: "800x900",  w: 800,  h: 900, dockTop: 535, dockH: 168, dockGap: 20, phoneBaseH: 774, anchorShift: -3 },
  { name: "390x844",  w: 390,  h: 844, dockTop: 792, dockH: 215, dockGap: 14, phoneBaseH: 728, anchorShift: 32 },
  { name: "430x844",  w: 430,  h: 844, dockTop: 765, dockH: 202, dockGap: 14, phoneBaseH: 728, anchorShift: -26 },
  { name: "390x800",  w: 390,  h: 800, dockTop: 792, dockH: 215, dockGap: 14, phoneBaseH: 728, anchorShift: 26 },
  { name: "1366x768_ret", w: 1366, h: 768, dockTop: 390, dockH: 110, dockGap: 20, phoneBaseH: 774, anchorShift: -2 },
  { name: "1440x900", w: 1440, h: 900, dockTop: 390, dockH: 110, dockGap: 20, phoneBaseH: 774, anchorShift: 0 },
];
const shortCfg = { name: "320x480", w: 320, h: 480, dockTop: 880, dockH: 235, dockGap: 14, phoneBaseH: 728, anchorShift: 0 };
const tallCfg = { name: "1536x960", w: 1536, h: 960, dockTop: 390, dockH: 110, dockGap: 20, phoneBaseH: 774, anchorShift: 0 };

let activeCfg = seq[0];
const winListeners = new Map();
const vvListeners = new Map();
const scrollCalls = [];
const focusCalls = [];
const timers = new Map();
let nextTimerId = 1;
let rafQueue = [];
let nextRafId = 1;
let deferSmooth = false;

globalThis.window = globalThis;
window.scrollY = 0;
Object.defineProperty(window, "innerWidth", { get: () => activeCfg.w, configurable: true });
Object.defineProperty(window, "innerHeight", { get: () => activeCfg.h, configurable: true });
window.scrollTo = (opts) => {
  const top = typeof opts === "number" ? opts : Number(opts?.top || 0);
  const behavior = typeof opts === "object" && opts ? opts.behavior : "auto";
  scrollCalls.push({ top, behavior, fromY: window.scrollY });
  if (deferSmooth && behavior === "smooth") return;
  window.scrollY = Math.max(0, top);
  for (const fn of winListeners.get("scroll") || []) fn({});
};
window.addEventListener = (type, fn) => {
  if (!winListeners.has(type)) winListeners.set(type, []);
  winListeners.get(type).push(fn);
};
window.visualViewport = {
  addEventListener: (type, fn) => {
    if (!vvListeners.has(type)) vvListeners.set(type, []);
    vvListeners.get(type).push(fn);
  },
};
window.getComputedStyle = (el) => {
  if (el?.id === "tutorialDock") return { marginBottom: `${activeCfg.dockGap}px` };
  if (el?.selector === ".topbar") return { position: "sticky" };
  return { overflowX: "hidden" };
};
window.setTimeout = (fn) => {
  const id = nextTimerId++;
  timers.set(id, fn);
  return id;
};
window.clearTimeout = (id) => timers.delete(id);
window.requestAnimationFrame = (fn) => {
  const id = nextRafId++;
  rafQueue.push({ id, fn });
  return id;
};
window.cancelAnimationFrame = (id) => {
  rafQueue = rafQueue.filter((item) => item.id !== id);
};
function flushRaf() {
  while (rafQueue.length > 0) {
    const batch = rafQueue.splice(0, rafQueue.length);
    for (const item of batch) item.fn();
  }
}
window.matchMedia = () => ({ matches: false, media: "" });

class FakeEl {
  constructor(tag, id = "", attrs = {}, rectFn = null) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.selector = attrs.selector || "";
    this.attrs = { ...attrs };
    this.dataset = {};
    this.hidden = Boolean(attrs.hidden);
    this.disabled = false;
    this.textContent = "";
    this.innerHTML = "";
    this.listeners = new Map();
    this._rectFn = rectFn;
    this._props = new Map();
    this.style = {
      setProperty: (k, v) => this._props.set(k, String(v)),
      getPropertyValue: (k) => this._props.get(k) || "",
      removeProperty: (k) => this._props.delete(k),
    };
    this._classes = new Set((attrs.class || "").split(/\s+/).filter(Boolean));
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("data-")) {
        this.dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
      }
    }
    this.classList = {
      add: (c) => this._classes.add(c),
      remove: (c) => this._classes.delete(c),
      toggle: (c, f) => (f ? this._classes.add(c) : this._classes.delete(c)),
      contains: (c) => this._classes.has(c),
    };
  }
  get offsetHeight() { return this.selector === ".phone-bezel" ? activeCfg.phoneBaseH : 0; }
  getBoundingClientRect() {
    if (this._rectFn) return this._rectFn();
    return { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  click() {
    if (this.disabled) return;
    for (const fn of this.listeners.get("click") || []) fn({ target: this, preventDefault() {} });
  }
  focus(opts) {
    document.activeElement = this;
    focusCalls.push({ id: this.id, preventScroll: Boolean(opts?.preventScroll) });
  }
  contains() { return false; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

const byId = new Map();
const mk = (tag, id, attrs = {}, rectFn = null) => {
  const el = new FakeEl(tag, id, attrs, rectFn);
  if (id) byId.set(id, el);
  return el;
};

const phoneStage = new FakeEl("section", "", { selector: ".phone-stage" });
const topbar = new FakeEl("header", "", { selector: ".topbar" }, () => ({
  top: -window.scrollY,
  bottom: 66 - window.scrollY,
  height: 66,
}));
const phoneBezel = new FakeEl("div", "", { selector: ".phone-bezel" }, () => {
  const scale = Number(phoneStage.style.getPropertyValue("--phone-scale") || 1);
  const phoneDocTop = activeCfg.dockTop + activeCfg.dockH + activeCfg.dockGap;
  const top = phoneDocTop - window.scrollY;
  const scaledH = activeCfg.phoneBaseH * scale;
  return { top, bottom: top + scaledH, height: scaledH };
});
const inspectorShell = new FakeEl("section", "", { selector: ".inspector-shell" }, () => {
  const stacked = activeCfg.w <= 960;
  const inspDocTop = stacked ? activeCfg.dockTop + activeCfg.dockH + activeCfg.dockGap + activeCfg.phoneBaseH + 60 : activeCfg.dockTop + activeCfg.dockH + activeCfg.dockGap;
  return { top: inspDocTop - window.scrollY, bottom: inspDocTop + 320 - window.scrollY, height: 320 };
});
const tutorialControls = new FakeEl("div", "", { selector: ".tutorial-controls" }, () => {
  const top = activeCfg.dockTop + 56 - window.scrollY;
  return { top, bottom: top + 54, height: 54 };
});

mk("section", "tutorialDock", { hidden: true }, () => {
  const top = activeCfg.dockTop - window.scrollY;
  return { top, bottom: top + activeCfg.dockH, height: activeCfg.dockH };
});

for (const [tag, id, attrs] of [
  ["div", "phoneBody", {}],
  ["div", "iosStatusbar", {}],
  ["div", "homeIndicator", {}],
  ["div", "panelTrace", {}],
  ["div", "panelData", { hidden: true }],
  ["div", "panelArch", { hidden: true }],
  ["div", "srAnnouncer", {}],
  ["button", "btnToggleAuth", {}],
  ["button", "btnResetDemo", {}],
  ["button", "btnWatchTutorial", {}],
  ["span", "tutorialStepBadge", {}],
  ["span", "tutorialStateBadge", {}],
  ["h2", "tutorialStageTitle", {}],
  ["div", "tutorialProgress", {}],
  ["div", "tutorialProgressFill", {}],
  ["p", "tutorialNarration", {}],
  ["button", "btnTutPrev", {}],
  ["button", "btnTutPlayPause", {}],
  ["button", "btnTutNext", {}],
  ["button", "btnTutRestart", {}],
  ["button", "btnTutExit", {}],
]) {
  mk(tag, id, attrs);
}

const tourPills = ["landing", "login", "matches", "match-detail", "standings", "teams", "players", "news", "profile"].map(
  (k) => new FakeEl("button", "", { class: "tour-pill", "data-tour": k })
);
const inspectorTabs = ["trace", "data", "arch"].map(
  (k) => new FakeEl("button", `tab_${k}`, { class: "inspector-tab", "data-inspector": k })
);

globalThis.document = {
  activeElement: null,
  documentElement: {
    get clientHeight() { return activeCfg.h; },
    get clientWidth() { return activeCfg.w; },
    scrollHeight: 2800,
  },
  body: {},
  getElementById: (id) => byId.get(id) || null,
  querySelector: (sel) => {
    if (sel === ".topbar") return topbar;
    if (sel === ".phone-stage") return phoneStage;
    if (sel === ".phone-bezel") return phoneBezel;
    if (sel === ".inspector-shell") return inspectorShell;
    if (sel === ".tutorial-controls") return tutorialControls;
    return null;
  },
  querySelectorAll: (sel) => {
    if (sel === ".tour-pill") return tourPills;
    if (sel === ".inspector-tab") return inspectorTabs;
    return [];
  },
  addEventListener: () => {},
};

await import(pathToFileURL(path.join(docsDir, "app.js")).href);
const api = window.__EURO_TUTORIAL__;

// 1. Tall desktop 1536x960 stays scale=1.0, 0px clipped
activeCfg = tallCfg;
window.scrollY = 0;
byId.get("btnWatchTutorial").click();
flushRaf();
const tall1536 = {
  scale: api.getState().phoneScale,
  clipped: Math.max(0, phoneBezel.getBoundingClientRect().bottom - activeCfg.h),
  startFocus: focusCalls.at(-1),
};
byId.get("btnTutExit").click();

// 2. Sequential 10-step resize with pre/post browser scroll-anchoring shifts
activeCfg = seq[0];
window.scrollY = 0;
byId.get("btnWatchTutorial").click();
flushRaf();
const seqResults = [];
for (let i = 0; i < seq.length; i++) {
  if (i > 0) {
    activeCfg = seq[i];
    if (seq[i].anchorShift !== 0) {
      window.scrollY = Math.max(0, window.scrollY + seq[i].anchorShift);
      for (const fn of winListeners.get("scroll") || []) fn({});
    }
    for (const fn of winListeners.get("resize") || []) fn({});
    window.scrollY = Math.max(0, window.scrollY + 14);
    for (const fn of winListeners.get("scroll") || []) fn({});
    flushRaf();
  }
  const dockRect = byId.get("tutorialDock").getBoundingClientRect();
  const phoneRect = phoneBezel.getBoundingClientRect();
  seqResults.push({
    name: seq[i].name,
    scale: api.getState().phoneScale,
    userScrolledAway: api.getState().userScrolledAway,
    dockTop: dockRect.top,
    clipped: Math.max(0, phoneRect.bottom - seq[i].h),
  });
}

// 3. Partial-clipping recovery (~83% visible -> must still reposition to 0px clipped!)
activeCfg = seq[0];
byId.get("btnTutRestart").click();
flushRaf();
window.scrollY = Math.max(0, window.scrollY - 100);
const clippedBeforeStep = Math.max(0, phoneBezel.getBoundingClientRect().bottom - activeCfg.h);
byId.get("btnTutNext").click();
flushRaf();
const clippedAfterStep = Math.max(0, phoneBezel.getBoundingClientRect().bottom - activeCfg.h);

// 4. Genuine manual wheel opt-out preserved across resize
byId.get("btnTutRestart").click();
flushRaf();
for (const fn of winListeners.get("wheel") || []) fn({ target: null });
window.scrollY = 0;
for (const fn of winListeners.get("scroll") || []) fn({});
const wheelOptOut = api.getState().userScrolledAway;
activeCfg = seq[5]; // 390x844
for (const fn of winListeners.get("resize") || []) fn({});
flushRaf();
const afterResizeWithOptOut = {
  scrollY: window.scrollY,
  userScrolledAway: api.getState().userScrolledAway,
  scale: api.getState().phoneScale,
};

// 5. Short 320x480 minimum readable scale floor (0.68) & controls reachable
activeCfg = shortCfg;
window.scrollY = 0;
byId.get("btnTutRestart").click();
flushRaf();
const shortRes = {
  scale: api.getState().phoneScale,
  controlsTop: tutorialControls.getBoundingClientRect().top,
  controlsBottom: tutorialControls.getBoundingClientRect().bottom,
};

// 6. Manual pill exits & restores native unscaled height
tourPills[2].click(); // matches
const afterManualPill = {
  active: api.getState().active,
  scale: api.getState().phoneScale,
  cssScale: phoneStage.style.getPropertyValue("--phone-scale"),
  cssFitH: phoneStage.style.getPropertyValue("--phone-fit-h"),
};

// 7. Exit during in-flight smooth scroll cancels smoothly & restores preventScroll focus
activeCfg = seq[0];
window.scrollY = 0;
deferSmooth = true;
byId.get("btnWatchTutorial").click();
window.scrollY = 100;
byId.get("btnTutExit").click();
const interruptedScroll = scrollCalls.at(-1);
const exitFocus = focusCalls.at(-1);

console.log(JSON.stringify({
  tall1536,
  seqResults,
  clippedBeforeStep,
  clippedAfterStep,
  wheelOptOut,
  afterResizeWithOptOut,
  shortRes,
  afterManualPill,
  interruptedScroll,
  exitFocus,
}));
"""
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", responsive_harness, str(DOCS)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 0, f"Responsive harness failed:\n{proc.stderr}")
        res = json.loads(proc.stdout)

        # Tall desktop native 1.0 & preventScroll focus
        self.assertEqual(res["tall1536"]["scale"], 1)
        self.assertEqual(res["tall1536"]["clipped"], 0)
        self.assertEqual(res["tall1536"]["startFocus"], {"id": "btnTutPlayPause", "preventScroll": True})

        # All 10 sequential resize steps keep userScrolledAway=False and 0px clipping
        self.assertEqual(len(res["seqResults"]), 10)
        for step in res["seqResults"]:
            self.assertFalse(step["userScrolledAway"], f"False userScrolledAway at {step['name']}")
            self.assertGreaterEqual(step["scale"], 0.68)
            self.assertLessEqual(step["scale"], 1.0)
            self.assertGreaterEqual(step["dockTop"], 8)
            self.assertEqual(step["clipped"], 0, f"Phone clipped at {step['name']}: {step}")
        # Non-compounding check
        self.assertEqual(res["seqResults"][0]["scale"], res["seqResults"][8]["scale"])

        # Partial clipping recovery
        self.assertGreater(res["clippedBeforeStep"], 50)
        self.assertEqual(res["clippedAfterStep"], 0)

        # Genuine manual scroll opt-out preserved across resize
        self.assertTrue(res["wheelOptOut"])
        self.assertTrue(res["afterResizeWithOptOut"]["userScrolledAway"])
        self.assertEqual(res["afterResizeWithOptOut"]["scrollY"], 0)
        self.assertLess(res["afterResizeWithOptOut"]["scale"], 1.0)

        # Short 320x480 minimum scale floor & controls reachable
        self.assertEqual(res["shortRes"]["scale"], 0.68)
        self.assertGreaterEqual(res["shortRes"]["controlsTop"], 0)
        self.assertLessEqual(res["shortRes"]["controlsBottom"], 480)

        # Manual navigation restores native dimensions
        self.assertFalse(res["afterManualPill"]["active"])
        self.assertEqual(res["afterManualPill"]["scale"], 1)
        self.assertEqual(res["afterManualPill"]["cssScale"], "")
        self.assertEqual(res["afterManualPill"]["cssFitH"], "")

        # In-flight scroll interruption & exit focus
        self.assertEqual(res["interruptedScroll"], {"top": 100, "behavior": "instant", "fromY": 100})
        self.assertEqual(res["exitFocus"], {"id": "btnWatchTutorial", "preventScroll": True})


if __name__ == "__main__":
    unittest.main(verbosity=2)
