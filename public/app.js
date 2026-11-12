/* ============================================================
   Ablauf: Start (Hinweis + Testauswahl) → Fragen → Ergebnis
   Alles läuft lokal im Browser; es wird nichts gespeichert
   (ausser Sprache und Farbschema im localStorage).
   ============================================================ */

const app = document.getElementById("app");
const state = { screen: "start", consent: false, test: null, order: [], optOrder: {}, idx: 0, answers: {} };

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const optionsOf = q => tr(q.options || SCALES[q.scale]);
// Kurze Stufenskalen (Nie – Manchmal – Häufig – Immer usw.) stehen nebeneinander
const ROW_SCALES = ["freq5", "adc", "dysFreq", "dysEase", "agree4", "phq"];
const minutes = n => Math.max(2, Math.round(n * 0.2));

/* ---------------- Kopf, Fuss, Sprache, Farbschema ---------------- */
const ICON_MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 14.5A9 9 0 0 1 9.5 3a.6.6 0 0 0-.8-.7A10 10 0 1 0 21.7 15.3a.6.6 0 0 0-.7-.8z"/></svg>';
const ICON_SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>';

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};

function renderChrome() {
  document.documentElement.lang = LANG;
  document.title = L("Neurospicy – Selbsttests zur Neurodiversität", "Neurospicy – Neurodiversity self-tests");
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = L("Wissenschaftlich fundierte Selbsttests zu ADHS, Autismus, Dyslexie, Dyspraxie und Tics. Kein Ersatz für eine Diagnose.",
    "Research-based self-tests for ADHD, autism, dyslexia, dyspraxia and tics. Not a substitute for a diagnosis.");
  document.getElementById("brand").setAttribute("aria-label", L("Neurospicy – zur Übersicht", "Neurospicy – back to overview"));
  document.getElementById("topNote").textContent = L("Anonym · Nichts wird gespeichert", "Anonymous · Nothing is stored");
  document.getElementById("srcLink").textContent = L("Quellen", "Sources");
  const lang = document.getElementById("langBtn");
  lang.textContent = LANG === "de" ? "EN" : "DE";
  lang.setAttribute("aria-label", L("Switch to English", "Auf Deutsch wechseln"));
  lang.setAttribute("lang", LANG === "de" ? "en" : "de");
  const dark = isDark();
  const theme = document.getElementById("themeBtn");
  theme.innerHTML = dark ? ICON_SUN : ICON_MOON;
  theme.setAttribute("aria-label", dark ? L("Helles Design", "Light mode") : L("Dunkles Design", "Dark mode"));
  theme.title = theme.getAttribute("aria-label");
  document.getElementById("footNote").innerHTML = L(
    "<strong>Wichtig:</strong> Diese Selbsttests sind Orientierungshilfen und keine Diagnose. Sie ersetzen weder eine ärztliche noch eine psychologische Abklärung.",
    "<strong>Important:</strong> These self-tests are for orientation only and are not a diagnosis. They do not replace a medical or psychological assessment.");
  document.getElementById("footCrisis").textContent = L(
    "Wenn es dir gerade sehr schlecht geht: Schweiz 143 (Die Dargebotene Hand) · Deutschland 0800 111 0 111 (Telefonseelsorge) · Österreich 142 · Notfall 112",
    "If you are in crisis right now: Switzerland 143 (Die Dargebotene Hand) · Germany 0800 111 0 111 (Telefonseelsorge) · Austria 142 · UK 116 123 (Samaritans) · US 988 · Emergency 112 / 911");
}

document.getElementById("langBtn").addEventListener("click", () => {
  LANG = LANG === "de" ? "en" : "de";
  store("lang", LANG);
  renderChrome();
  render();                     // Antworten bleiben erhalten, da sie als Index gespeichert sind
});
document.getElementById("themeBtn").addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  store("theme", next);
  renderChrome();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderChrome);

/* ---------------- Navigation ---------------- */
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
    if (Q[qid].type === "multi") state.optOrder[qid] = shuffle(Q[qid].options.de.map((_, i) => i));
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
        <span class="test-title">${esc(tr(t.title))}</span>
        <span class="test-desc">${esc(tr(t.desc))}</span>
        <span class="test-meta">${t.questions.length} ${L("Fragen", "questions")} · ${L("ca.", "approx.")} ${minutes(t.questions.length)} ${L("Min.", "min")} · ${esc(tr(t.basis))}</span>
      </span>
      <span class="test-go" aria-hidden="true">→</span>
    </button>`).join("");

  const sources = TESTS.map(t => `
    <div class="src-group">
      <h3><span aria-hidden="true">${t.icon}</span> ${esc(tr(t.title))}</h3>
      <p class="src-basis">${esc(tr(t.basis))}</p>
      <ul>${t.sources.map(k => `<li><a href="${esc(SOURCES[k].url)}" target="_blank" rel="noopener noreferrer">${esc(tr(SOURCES[k].label))}</a></li>`).join("")}</ul>
    </div>`).join("");

  app.innerHTML = L(`
    <section class="hero">
      <p class="eyebrow">Selbsttests zur Neurodiversität</p>
      <h1>Dich selbst besser zu verstehen, ist ein guter Anfang.</h1>
      <p class="lead">Anders zu denken, zu fühlen oder zu lernen, ist kein Fehler. Diese Tests helfen dir einzuordnen, was du erlebst – in deinem Tempo und ganz für dich.</p>
    </section>`, `
    <section class="hero">
      <p class="eyebrow">Neurodiversity self-tests</p>
      <h1>Understanding yourself better is a good place to start.</h1>
      <p class="lead">Thinking, feeling or learning differently is not a flaw. These tests help you make sense of what you experience – at your own pace and just for you.</p>
    </section>`) + `

    <section class="card disclaimer" id="consentBox" aria-labelledby="discTitle">
      <h2 id="discTitle">${L("Bitte zuerst lesen", "Please read first")}</h2>
      <ul>${L(`
        <li><strong>Keine Diagnose.</strong> Die Ergebnisse zeigen nur, ob Anzeichen vorliegen könnten. Eine Diagnose kann ausschliesslich eine qualifizierte Fachperson nach einer persönlichen Abklärung stellen.</li>
        <li><strong>Kein medizinischer Rat.</strong> Dieser Test ersetzt keine ärztliche, psychologische oder therapeutische Beratung. Triff auf Grundlage der Ergebnisse keine Entscheidungen über Behandlungen oder Medikamente.</li>
        <li><strong>Beides ist möglich.</strong> Ein auffälliges Ergebnis bedeutet nicht, dass eine Störung vorliegt – ein unauffälliges schliesst sie nicht aus. Stress, Schlafmangel, Stimmung und andere Ursachen können die Werte beeinflussen.</li>
        <li><strong>Für Erwachsene.</strong> Die verwendeten Fragebögen wurden für Personen ab etwa 16 Jahren entwickelt.</li>
        <li><strong>Ohne Gewähr.</strong> Die Inhalte dienen der allgemeinen Information. Die Nutzung erfolgt auf eigene Verantwortung; eine Haftung für Entscheidungen, die auf den Ergebnissen beruhen, ist ausgeschlossen.</li>
        <li><strong>Privat.</strong> Deine Antworten bleiben in deinem Browser. Es wird nichts gespeichert oder übertragen.</li>`, `
        <li><strong>Not a diagnosis.</strong> The results only show whether signs might be present. Only a qualified professional can make a diagnosis after a personal assessment.</li>
        <li><strong>Not medical advice.</strong> This test does not replace medical, psychological or therapeutic advice. Do not make decisions about treatment or medication based on the results.</li>
        <li><strong>Either way is possible.</strong> A notable result does not mean a condition is present – an unremarkable one does not rule it out. Stress, lack of sleep, mood and other causes can affect the scores.</li>
        <li><strong>For adults.</strong> The questionnaires used were developed for people aged about 16 and over.</li>
        <li><strong>No warranty.</strong> The content is for general information. Use is at your own risk; no liability is accepted for decisions based on the results.</li>
        <li><strong>Private.</strong> Your answers stay in your browser. Nothing is stored or transmitted.</li>`)}
      </ul>
      <label class="consent">
        <input type="checkbox" id="consent" ${state.consent ? "checked" : ""}>
        <span>${L("Ich habe verstanden, dass dieser Test nur eine Orientierung bietet und keine Diagnose ist.", "I understand that this test only offers orientation and is not a diagnosis.")}</span>
      </label>
    </section>

    <section aria-labelledby="pickTitle">
      <h2 id="pickTitle" class="section-title">${L("Wähle deinen Test", "Choose your test")}</h2>
      <div class="tests ${state.consent ? "" : "locked"}">${cards}</div>
      <p class="hint">${L("Die Fragen erscheinen in zufälliger Reihenfolge. Antworte spontan – es gibt keine richtigen oder falschen Antworten.", "Questions appear in random order. Answer spontaneously – there are no right or wrong answers.")}</p>
    </section>

    <section class="card sources" id="quellen" aria-labelledby="srcTitle">
      <h2 id="srcTitle">${L("Wissenschaftliche Quellen", "Scientific sources")}</h2>
      <p>${L("Alle Tests beruhen auf veröffentlichten, in Studien geprüften Screening-Fragebögen. Fragen, Punktwerte und Schwellen wurden mit den verlinkten Originalbögen und Studien abgeglichen. Die deutschen Formulierungen sind sinngemässe Übertragungen und keine offiziell validierten Übersetzungen. Für Dyskalkulie gibt es derzeit keinen validierten Selbsttest für Erwachsene; sie ist deshalb nicht enthalten.",
             "All tests are based on published screening questionnaires that have been evaluated in studies. Questions, item scores and thresholds were checked against the linked original forms and studies. The English questions follow the original wording; a few are phrased as “How often …” so that they fit their answer scale. There is currently no validated self-test for dyscalculia in adults, so it is not included.")}</p>
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
  [0.9, { de: "Fast geschafft – nur noch wenige Fragen.", en: "Almost done – just a few questions left." }],
  [0.75, { de: "Du bist auf der Zielgeraden.", en: "You're on the home stretch." }],
  [0.5, { de: "Die Hälfte liegt hinter dir. Schön, dass du dir die Zeit nimmst.", en: "Halfway there. Thank you for taking the time." }],
  [0.25, { de: "Ein guter Start. Antworte einfach so, wie es sich für dich anfühlt.", en: "A good start. Just answer the way it feels to you." }],
  [0, { de: "Nimm dir Zeit. Es gibt keine richtigen oder falschen Antworten.", en: "Take your time. There are no right or wrong answers." }]
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
  const cheer = tr(CHEERS.find(c => progress >= c[0])[1]);
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
        <span>${esc(tr(q.none))}</span>
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
        <div class="progress-info"><span>${esc(tr(state.test.title))}</span><span>${L("Frage", "Question")} ${state.idx + 1} ${L("von", "of")} ${total}</span></div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.idx}">
          <span style="width:${Math.round(progress * 100)}%"></span>
        </div>
      </div>
      <div class="card question" key="${q.id}">
        <p class="frame">${esc(tr(q.frame))}</p>
        <h2 class="qtext">${esc(tr(q.text))}</h2>
        <div class="opts ${q.type === "multi" ? "multi" : ""} ${opts.length > 5 ? "dense" : ""} ${ROW_SCALES.includes(q.scale) ? "row" : ""}" style="--n:${opts.length}">${body}</div>
        ${q.type === "multi" ? `<p class="multi-hint">${L("Du kannst mehrere Antworten auswählen.", "You can choose more than one answer.")}</p>` : ""}
      </div>
      <div class="nav">
        <button type="button" class="btn ghost" id="back">${state.idx === 0 ? L("Abbrechen", "Cancel") : L("← Zurück", "← Back")}</button>
        <button type="button" class="btn primary" id="next" ${isAnswered(q) ? "" : "disabled"}>${state.idx === total - 1 ? L("Auswertung ansehen", "See results") : L("Weiter →", "Next →")}</button>
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
  low: { label: { de: "Unauffällig", en: "Unremarkable" }, cls: "low" },
  mid: { label: { de: "Leichte Hinweise", en: "Mild signs" }, cls: "mid" },
  high: { label: { de: "Deutliche Hinweise", en: "Clear signs" }, cls: "high" },
  info: { label: { de: "Profil", en: "Profile" }, cls: "info" }
};

function bar(b, cls) {
  const min = b.min || 0;
  const pct = Math.max(0, Math.min(100, ((b.score - min) / (b.max - min)) * 100));
  const mark = b.mark !== undefined ? `<i class="mark" style="left:${((b.mark - min) / (b.max - min)) * 100}%" title="${L("Schwelle", "Threshold")}: ${b.mark}"></i>` : "";
  return `<div class="bar ${cls || ""}"><span style="width:${pct}%"></span>${mark}</div>`;
}

function resultCard(c) {
  const Lv = LEVELS[c.level];
  const main = c.score !== undefined ? `
    <div class="score-row"><span class="score">${c.score}</span><span class="of">${L("von", "of")} ${c.max} ${L("Punkten", "points")}</span>
      ${c.mark !== undefined ? `<span class="thr">${L("Schwelle", "Threshold")}: ${c.mark}</span>` : ""}</div>
    ${bar(c, Lv.cls)}` : "";
  const bars = (c.bars || []).map(b => `
    <div class="sub"><div class="sub-label"><span>${esc(b.label)}</span><span>${b.score} / ${b.max}</span></div>${bar(b, "soft")}</div>`).join("");
  const facts = (c.facts || []).map(f => `<li>${esc(f)}</li>`).join("");
  const src = (c.sources || []).map(k => `<a href="${esc(SOURCES[k].url)}" target="_blank" rel="noopener noreferrer">${esc(tr(SOURCES[k].short))}</a>`).join(" · ");
  const next = c.next ? `<button type="button" class="btn small" data-test="${c.next}">${L("Ausführlichen Test starten →", "Start the full test →")}</button>` : "";
  const care = c.care ? `<p class="care">${L("Wenn dich diese Gefühle schon länger begleiten, sprich bitte mit deiner Hausärztin, deinem Hausarzt oder einer psychologischen Fachperson darüber. Du musst das nicht allein tragen.",
    "If these feelings have been with you for a while, please talk to your GP or a mental health professional about them. You don't have to carry this alone.")}</p>` : "";
  return `
    <article class="card result ${Lv.cls}">
      <div class="result-head"><h3>${esc(c.title)}</h3><span class="pill ${Lv.cls}">${tr(Lv.label)}</span></div>
      <p class="headline">${esc(c.headline)}</p>
      ${main}${bars ? `<div class="subs">${bars}</div>` : ""}
      <p class="rtext">${esc(c.text)}</p>
      ${care}
      ${facts ? `<ul class="facts">${facts}</ul>` : ""}
      ${next}
      ${src ? `<p class="src">${L("Quelle", "Source")}: ${src}</p>` : ""}
    </article>`;
}

function renderResult() {
  const cards = evaluate(state.test.id, state.answers);
  const scored = cards.filter(c => c.level !== "info");
  const top = scored.some(c => c.level === "high") ? "high" : scored.some(c => c.level === "mid") ? "mid" : "low";
  const intro = {
    high: [L("Deine Antworten zeigen in mindestens einem Bereich deutliche Hinweise.", "Your answers show clear signs in at least one area."),
           L("Das ist keine Diagnose – aber ein guter Grund, dem nachzugehen. Viele Menschen erleben eine Abklärung als Erleichterung: Endlich gibt es eine Erklärung und passende Unterstützung.",
             "This is not a diagnosis – but a good reason to look into it. Many people experience an assessment as a relief: finally there is an explanation and the right support.")],
    mid: [L("Deine Antworten zeigen einzelne Hinweise, ohne klares Muster.", "Your answers show some signs, without a clear pattern."),
          L("Wenn dich die Themen im Alltag belasten, kann ein Gespräch mit einer Fachperson trotzdem hilfreich sein. Dein Erleben zählt – unabhängig von Punktwerten.",
            "If these topics weigh on you in daily life, talking to a professional can still help. Your experience matters – regardless of scores.")],
    low: [L("Deine Antworten zeigen in diesem Test kein auffälliges Muster.", "Your answers show no notable pattern in this test."),
          L("Wenn du dich trotzdem nicht verstanden fühlst oder im Alltag leidest, ist das Grund genug, mit einer Fachperson zu sprechen. Ein Fragebogen erfasst nie den ganzen Menschen.",
            "If you still feel misunderstood or are struggling in daily life, that is reason enough to talk to a professional. A questionnaire never captures the whole person.")]
  }[top];

  app.innerHTML = `
    <section class="hero small">
      <p class="eyebrow">${L("Deine Auswertung", "Your results")} · ${esc(tr(state.test.title))}</p>
      <h1>${esc(intro[0])}</h1>
      <p class="lead">${esc(intro[1])}</p>
    </section>

    <div class="card notice">${L("<strong>Zur Erinnerung:</strong> Dies ist eine Orientierung und keine Diagnose. Die Werte zeigen Wahrscheinlichkeiten, keine Gewissheiten. Nur eine qualifizierte Fachperson kann nach einer persönlichen Abklärung eine Diagnose stellen.",
      "<strong>As a reminder:</strong> This is orientation, not a diagnosis. The scores show probabilities, not certainties. Only a qualified professional can make a diagnosis after a personal assessment.")}</div>

    <div class="results">${cards.map(resultCard).join("")}</div>

    <section class="card steps">
      <h2>${L("Wie es weitergehen kann", "Where to go from here")}</h2>
      <ol>${L(`
        <li><strong>Ergebnis sichern.</strong> Drucke diese Seite aus oder speichere sie als PDF. Sie ist eine gute Gesprächsgrundlage.</li>
        <li><strong>Beispiele sammeln.</strong> Notiere konkrete Situationen aus deinem Alltag und – wenn möglich – aus deiner Kindheit. Alte Schulzeugnisse können helfen.</li>
        <li><strong>Erste Anlaufstelle.</strong> Sprich mit deiner Hausärztin oder deinem Hausarzt. Von dort aus geht es zu einer Fachperson für Psychiatrie, Psychologie oder Neurologie – oder zu einer spezialisierten Sprechstunde für ADHS oder Autismus im Erwachsenenalter.</li>
        <li><strong>Geduldig mit dir sein.</strong> Was auch immer herauskommt: Du bist nicht falsch. Viele Schwierigkeiten lassen sich mit dem richtigen Verständnis und passender Unterstützung deutlich erleichtern.</li>`, `
        <li><strong>Keep your results.</strong> Print this page or save it as a PDF. It is a good basis for a conversation.</li>
        <li><strong>Collect examples.</strong> Write down concrete situations from your daily life and – if possible – from your childhood. Old school reports can help.</li>
        <li><strong>First point of contact.</strong> Talk to your GP. From there you can be referred to a psychiatrist, psychologist or neurologist – or to a specialist clinic for adult ADHD or autism.</li>
        <li><strong>Be patient with yourself.</strong> Whatever the outcome: there is nothing wrong with you. Many difficulties become much easier with the right understanding and support.</li>`)}
      </ol>
      <div class="actions">
        <button type="button" class="btn primary" id="print">${L("Drucken / als PDF speichern", "Print / save as PDF")}</button>
        <button type="button" class="btn ghost" id="again">${L("Zur Testübersicht", "Back to all tests")}</button>
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

const confirmLeave = () => !(state.screen === "quiz" && Object.keys(state.answers).length) ||
  confirm(L("Test abbrechen? Deine bisherigen Antworten gehen verloren.", "Cancel the test? Your answers so far will be lost."));

document.getElementById("srcLink").addEventListener("click", () => {
  if (!confirmLeave()) return;
  if (state.screen !== "start") { state.screen = "start"; render(); }
  document.getElementById("quellen").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("brand").addEventListener("click", () => {
  if (!confirmLeave()) return;
  go("start");
});
window.addEventListener("beforeunload", e => {
  if (state.screen === "quiz" && Object.keys(state.answers).length) { e.preventDefault(); e.returnValue = ""; }
});

renderChrome();
render();
