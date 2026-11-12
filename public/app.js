/* ============================================================
   Ablauf: Start (Hinweis + Testauswahl) → Fragen → Ergebnis
   Alles läuft lokal im Browser; es wird nichts gespeichert.
   ============================================================ */

const app = document.getElementById("app");
const state = { screen: "start", consent: false, test: null, order: [], optOrder: {}, idx: 0, answers: {} };

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const optionsOf = q => q.options || SCALES[q.scale];
const minutes = n => Math.max(2, Math.round(n * 0.2));

function go(screen) {
  state.screen = screen;
  render();
  window.scrollTo({ top: 0 });
  app.focus({ preventScroll: true });
}

function startTest(id) {
  if (!state.consent) {
    const box = document.getElementById("consentBox");
    if (box) { box.classList.remove("nudge"); void box.offsetWidth; box.classList.add("nudge"); box.scrollIntoView({ behavior: "smooth", block: "center" }); }
    return;
  }
  const t = TESTS.find(x => x.id === id);
  state.test = t;
  state.order = shuffle(t.questions);          // zufällige Reihenfolge bei jedem Durchgang
  state.optOrder = {};
  t.questions.forEach(qid => {                 // Listen bei Mehrfachauswahl ebenfalls mischen
    if (Q[qid].type === "multi") state.optOrder[qid] = shuffle(Q[qid].options.map((_, i) => i));
  });
  state.idx = 0;
  state.answers = {};
  go("quiz");
}

/* ---------------- Start ---------------- */
function renderStart() {
  const cards = TESTS.map(t => `
    <button class="test-card ${t.featured ? "featured" : ""}" data-test="${t.id}" type="button">
      <span class="test-icon" aria-hidden="true">${t.icon}</span>
      <span class="test-body">
        <span class="test-title">${esc(t.title)}</span>
        <span class="test-desc">${esc(t.desc)}</span>
        <span class="test-meta">${t.questions.length} Fragen · ca. ${minutes(t.questions.length)} Min. · ${esc(t.basis)}</span>
      </span>
      <span class="test-go" aria-hidden="true">→</span>
    </button>`).join("");

  const sources = TESTS.map(t => `
    <div class="src-group">
      <h3><span aria-hidden="true">${t.icon}</span> ${esc(t.title)}</h3>
      <p class="src-basis">${esc(t.basis)}</p>
      <ul>${t.sources.map(k => `<li><a href="${esc(SOURCES[k].url)}" target="_blank" rel="noopener noreferrer">${esc(SOURCES[k].label)}</a></li>`).join("")}</ul>
    </div>`).join("");

  app.innerHTML = `
    <section class="hero">
      <p class="eyebrow">Selbsttests zur Neurodiversität</p>
      <h1>Dich selbst besser zu verstehen, ist ein guter Anfang.</h1>
      <p class="lead">Anders zu denken, zu fühlen oder zu lernen, ist kein Fehler. Diese Tests helfen dir einzuordnen, was du erlebst – in deinem Tempo und ganz für dich.</p>
    </section>

    <section class="card disclaimer" id="consentBox" aria-labelledby="discTitle">
      <h2 id="discTitle">Bitte zuerst lesen</h2>
      <ul>
        <li><strong>Keine Diagnose.</strong> Die Ergebnisse zeigen nur, ob Anzeichen vorliegen könnten. Eine Diagnose kann ausschliesslich eine qualifizierte Fachperson nach einer persönlichen Abklärung stellen.</li>
        <li><strong>Kein medizinischer Rat.</strong> Dieser Test ersetzt keine ärztliche, psychologische oder therapeutische Beratung. Triff auf Grundlage der Ergebnisse keine Entscheidungen über Behandlungen oder Medikamente.</li>
        <li><strong>Beides ist möglich.</strong> Ein auffälliges Ergebnis bedeutet nicht, dass eine Störung vorliegt – ein unauffälliges schliesst sie nicht aus. Stress, Schlafmangel, Stimmung und andere Ursachen können die Werte beeinflussen.</li>
        <li><strong>Für Erwachsene.</strong> Die verwendeten Fragebögen wurden für Personen ab etwa 16 Jahren entwickelt.</li>
        <li><strong>Ohne Gewähr.</strong> Die Inhalte dienen der allgemeinen Information. Die Nutzung erfolgt auf eigene Verantwortung; eine Haftung für Entscheidungen, die auf den Ergebnissen beruhen, ist ausgeschlossen.</li>
        <li><strong>Privat.</strong> Deine Antworten bleiben in deinem Browser. Es wird nichts gespeichert oder übertragen.</li>
      </ul>
      <label class="consent">
        <input type="checkbox" id="consent" ${state.consent ? "checked" : ""}>
        <span>Ich habe verstanden, dass dieser Test nur eine Orientierung bietet und keine Diagnose ist.</span>
      </label>
    </section>

    <section aria-labelledby="pickTitle">
      <h2 id="pickTitle" class="section-title">Wähle deinen Test</h2>
      <div class="tests ${state.consent ? "" : "locked"}">${cards}</div>
      <p class="hint">Die Fragen erscheinen in zufälliger Reihenfolge. Antworte spontan – es gibt keine richtigen oder falschen Antworten.</p>
    </section>

    <section class="card sources" id="quellen" aria-labelledby="srcTitle">
      <h2 id="srcTitle">Wissenschaftliche Quellen</h2>
      <p>Alle Tests beruhen auf veröffentlichten, in Studien geprüften Screening-Fragebögen. Fragen, Punktwerte und Schwellen wurden mit den verlinkten Originalbögen und Studien abgeglichen. Die deutschen Formulierungen sind sinngemässe Übertragungen und keine offiziell validierten Übersetzungen. Für Dyskalkulie gibt es derzeit keinen validierten Selbsttest für Erwachsene; sie ist deshalb nicht enthalten.</p>
      ${sources}
    </section>`;

  document.getElementById("consent").addEventListener("change", e => {
    state.consent = e.target.checked;
    document.querySelector(".tests").classList.toggle("locked", !state.consent);
  });
  app.querySelectorAll("[data-test]").forEach(b => b.addEventListener("click", () => startTest(b.dataset.test)));
}

/* ---------------- Fragen ---------------- */
const CHEERS = [
  [0.9, "Fast geschafft – nur noch wenige Fragen."],
  [0.75, "Du bist auf der Zielgeraden."],
  [0.5, "Die Hälfte liegt hinter dir. Schön, dass du dir die Zeit nimmst."],
  [0.25, "Ein guter Start. Antworte einfach so, wie es sich für dich anfühlt."],
  [0, "Nimm dir Zeit. Es gibt keine richtigen oder falschen Antworten."]
];

function isAnswered(q) {
  const a = state.answers[q.id];
  return q.type === "multi" ? Array.isArray(a) && a.length > 0 : a !== undefined;
}

function renderQuiz() {
  const total = state.order.length;
  const q = Q[state.order[state.idx]];
  const a = state.answers[q.id];
  const progress = state.idx / total;
  const cheer = CHEERS.find(c => progress >= c[0])[1];
  const opts = optionsOf(q);
  let body;

  if (q.type === "multi") {
    const sel = Array.isArray(a) ? a : [];
    const order = state.optOrder[q.id] || opts.map((_, i) => i);
    body = order.map(i => `
      <label class="opt check ${sel.includes(i) ? "on" : ""}">
        <input type="checkbox" data-i="${i}" ${sel.includes(i) ? "checked" : ""}>
        <span>${esc(opts[i])}</span>
      </label>`).join("") + `
      <label class="opt check none ${sel.includes(-1) ? "on" : ""}">
        <input type="checkbox" data-i="-1" ${sel.includes(-1) ? "checked" : ""}>
        <span>${esc(q.none)}</span>
      </label>`;
  } else {
    body = opts.map((o, i) => `
      <button type="button" class="opt ${a === i ? "on" : ""}" data-i="${i}" aria-pressed="${a === i}">
        <span class="key" aria-hidden="true">${i + 1}</span><span>${esc(o)}</span>
      </button>`).join("");
  }

  app.innerHTML = `
    <section class="quiz">
      <div class="progress-wrap">
        <div class="progress-info"><span>${esc(state.test.title)}</span><span>Frage ${state.idx + 1} von ${total}</span></div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.idx}">
          <span style="width:${Math.round(progress * 100)}%"></span>
        </div>
      </div>
      <div class="card question" key="${q.id}">
        <p class="frame">${esc(q.frame)}</p>
        <h2 class="qtext">${esc(q.text)}</h2>
        <div class="opts ${q.type === "multi" ? "multi" : ""} ${opts.length > 5 ? "dense" : ""}">${body}</div>
        ${q.type === "multi" ? '<p class="multi-hint">Du kannst mehrere Antworten auswählen.</p>' : ""}
      </div>
      <div class="nav">
        <button type="button" class="btn ghost" id="back">${state.idx === 0 ? "Abbrechen" : "← Zurück"}</button>
        <button type="button" class="btn primary" id="next" ${isAnswered(q) ? "" : "disabled"}>${state.idx === total - 1 ? "Auswertung ansehen" : "Weiter →"}</button>
      </div>
      <p class="cheer">${esc(cheer)}</p>
    </section>`;

  const next = () => {
    if (!isAnswered(q)) return;
    if (state.idx < total - 1) { state.idx++; go("quiz"); } else go("result");
  };

  if (q.type === "multi") {
    app.querySelectorAll(".opt input").forEach(inp => inp.addEventListener("change", () => {
      const i = Number(inp.dataset.i);
      let sel = Array.isArray(state.answers[q.id]) ? state.answers[q.id].slice() : [];
      if (i === -1) sel = inp.checked ? [-1] : [];
      else {
        sel = sel.filter(x => x !== -1 && x !== i);
        if (inp.checked) sel.push(i);
      }
      state.answers[q.id] = sel;
      app.querySelectorAll(".opt input").forEach(o => {
        o.checked = sel.includes(Number(o.dataset.i));
        o.parentElement.classList.toggle("on", o.checked);
      });
      document.getElementById("next").disabled = sel.length === 0;
    }));
  } else {
    app.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      state.answers[q.id] = Number(b.dataset.i);
      app.querySelectorAll(".opt").forEach(o => o.classList.toggle("on", o === b));
      document.getElementById("next").disabled = false;
      setTimeout(next, 260);
    }));
  }
  document.getElementById("next").addEventListener("click", next);
  document.getElementById("back").addEventListener("click", () => {
    if (state.idx === 0) go("start"); else { state.idx--; go("quiz"); }
  });
}

document.addEventListener("keydown", e => {
  if (state.screen !== "quiz" || e.ctrlKey || e.metaKey || e.altKey) return;
  const q = Q[state.order[state.idx]];
  if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") { document.getElementById("next").click(); return; }
  if (q.type !== "single") return;
  const n = Number(e.key);
  if (n >= 1 && n <= optionsOf(q).length) app.querySelectorAll(".opt")[n - 1].click();
});

/* ---------------- Ergebnis ---------------- */
const LEVELS = {
  low: { label: "Unauffällig", cls: "low" },
  mid: { label: "Leichte Hinweise", cls: "mid" },
  high: { label: "Deutliche Hinweise", cls: "high" },
  info: { label: "Profil", cls: "info" }
};

function bar(b, cls) {
  const min = b.min || 0;
  const pct = Math.max(0, Math.min(100, ((b.score - min) / (b.max - min)) * 100));
  const mark = b.mark !== undefined ? `<i class="mark" style="left:${((b.mark - min) / (b.max - min)) * 100}%" title="Schwelle: ${b.mark}"></i>` : "";
  return `<div class="bar ${cls || ""}"><span style="width:${pct}%"></span>${mark}</div>`;
}

function resultCard(c) {
  const L = LEVELS[c.level];
  const main = c.score !== undefined ? `
    <div class="score-row"><span class="score">${c.score}</span><span class="of">von ${c.max} Punkten</span>
      ${c.mark !== undefined ? `<span class="thr">Schwelle: ${c.mark}</span>` : ""}</div>
    ${bar(c, L.cls)}` : "";
  const bars = (c.bars || []).map(b => `
    <div class="sub"><div class="sub-label"><span>${esc(b.label)}</span><span>${b.score} / ${b.max}</span></div>${bar(b, "soft")}</div>`).join("");
  const facts = (c.facts || []).map(f => `<li>${esc(f)}</li>`).join("");
  const src = (c.sources || []).map(k => `<a href="${esc(SOURCES[k].url)}" target="_blank" rel="noopener noreferrer">${esc(SOURCES[k].short)}</a>`).join(" · ");
  const next = c.next ? `<button type="button" class="btn small" data-test="${c.next}">Ausführlichen Test starten →</button>` : "";
  const care = c.care ? `<p class="care">Wenn dich diese Gefühle schon länger begleiten, sprich bitte mit deiner Hausärztin, deinem Hausarzt oder einer psychologischen Fachperson darüber. Du musst das nicht allein tragen.</p>` : "";
  return `
    <article class="card result ${L.cls}">
      <div class="result-head"><h3>${esc(c.title)}</h3><span class="pill ${L.cls}">${L.label}</span></div>
      <p class="headline">${esc(c.headline)}</p>
      ${main}${bars ? `<div class="subs">${bars}</div>` : ""}
      <p class="rtext">${esc(c.text)}</p>
      ${care}
      ${facts ? `<ul class="facts">${facts}</ul>` : ""}
      ${next}
      ${src ? `<p class="src">Quelle: ${src}</p>` : ""}
    </article>`;
}

function renderResult() {
  const cards = evaluate(state.test.id, state.answers);
  const scored = cards.filter(c => c.level !== "info");
  const top = scored.some(c => c.level === "high") ? "high" : scored.some(c => c.level === "mid") ? "mid" : "low";
  const intro = {
    high: ["Deine Antworten zeigen in mindestens einem Bereich deutliche Hinweise.", "Das ist keine Diagnose – aber ein guter Grund, dem nachzugehen. Viele Menschen erleben eine Abklärung als Erleichterung: Endlich gibt es eine Erklärung und passende Unterstützung."],
    mid: ["Deine Antworten zeigen einzelne Hinweise, ohne klares Muster.", "Wenn dich die Themen im Alltag belasten, kann ein Gespräch mit einer Fachperson trotzdem hilfreich sein. Dein Erleben zählt – unabhängig von Punktwerten."],
    low: ["Deine Antworten zeigen in diesem Test kein auffälliges Muster.", "Wenn du dich trotzdem nicht verstanden fühlst oder im Alltag leidest, ist das Grund genug, mit einer Fachperson zu sprechen. Ein Fragebogen erfasst nie den ganzen Menschen."]
  }[top];

  app.innerHTML = `
    <section class="hero small">
      <p class="eyebrow">Deine Auswertung · ${esc(state.test.title)}</p>
      <h1>${esc(intro[0])}</h1>
      <p class="lead">${esc(intro[1])}</p>
    </section>

    <div class="card notice"><strong>Zur Erinnerung:</strong> Dies ist eine Orientierung und keine Diagnose. Die Werte zeigen Wahrscheinlichkeiten, keine Gewissheiten. Nur eine qualifizierte Fachperson kann nach einer persönlichen Abklärung eine Diagnose stellen.</div>

    <div class="results">${cards.map(resultCard).join("")}</div>

    <section class="card steps">
      <h2>Wie es weitergehen kann</h2>
      <ol>
        <li><strong>Ergebnis sichern.</strong> Drucke diese Seite aus oder speichere sie als PDF. Sie ist eine gute Gesprächsgrundlage.</li>
        <li><strong>Beispiele sammeln.</strong> Notiere konkrete Situationen aus deinem Alltag und – wenn möglich – aus deiner Kindheit. Alte Schulzeugnisse können helfen.</li>
        <li><strong>Erste Anlaufstelle.</strong> Sprich mit deiner Hausärztin oder deinem Hausarzt. Von dort aus geht es zu einer Fachperson für Psychiatrie, Psychologie oder Neurologie – oder zu einer spezialisierten Sprechstunde für ADHS oder Autismus im Erwachsenenalter.</li>
        <li><strong>Geduldig mit dir sein.</strong> Was auch immer herauskommt: Du bist nicht falsch. Viele Schwierigkeiten lassen sich mit dem richtigen Verständnis und passender Unterstützung deutlich erleichtern.</li>
      </ol>
      <div class="actions">
        <button type="button" class="btn primary" id="print">Drucken / als PDF speichern</button>
        <button type="button" class="btn ghost" id="again">Zur Testübersicht</button>
      </div>
    </section>`;

  document.getElementById("print").addEventListener("click", () => window.print());
  document.getElementById("again").addEventListener("click", () => go("start"));
  app.querySelectorAll("[data-test]").forEach(b => b.addEventListener("click", () => startTest(b.dataset.test)));
}

function render() {
  if (state.screen === "quiz") renderQuiz();
  else if (state.screen === "result") renderResult();
  else renderStart();
}

document.getElementById("srcLink").addEventListener("click", () => {
  if (state.screen === "quiz" && Object.keys(state.answers).length && !confirm("Test abbrechen? Deine bisherigen Antworten gehen verloren.")) return;
  if (state.screen !== "start") { state.screen = "start"; render(); }
  document.getElementById("quellen").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("brand").addEventListener("click", () => {
  if (state.screen === "quiz" && Object.keys(state.answers).length && !confirm("Test abbrechen? Deine bisherigen Antworten gehen verloren.")) return;
  go("start");
});
window.addEventListener("beforeunload", e => {
  if (state.screen === "quiz" && Object.keys(state.answers).length) { e.preventDefault(); e.returnValue = ""; }
});

render();
