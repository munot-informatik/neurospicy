/* ============================================================
   Auswertung. Jede Funktion erhält die Antworten (id → Index bzw.
   Index-Liste) und liefert eine Ergebniskarte:
   { title, level: "low"|"mid"|"high"|"info", score, max, mark,
     headline, text, facts[], sources[] }
   ============================================================ */

const sum = (ids, f) => ids.reduce((s, id) => s + f(id), 0);
const picked = (A, id) => (Array.isArray(A[id]) ? A[id] : []);

/* ASRS v1.1 – Schwelle je Item: «Manchmal» (2) oder «Oft» (3) */
const ASRS_THR = { 1: 2, 2: 2, 3: 2, 9: 2, 12: 2, 16: 2, 18: 2 };
const asrsHit = (A, n) => A["a" + n] >= (ASRS_THR[n] || 3);
const ASRS_INATT = [1, 2, 3, 4, 7, 8, 9, 10, 11];
const ASRS_HYPER = [5, 6, 12, 13, 14, 15, 16, 17, 18];

function contextNotes(A, kind) {
  const notes = [];
  const on = A.xOnset;
  if (kind === "adhd" && on !== undefined) {
    if (on === 0) notes.push("Du berichtest Schwierigkeiten seit der Kindheit – das passt zum Kriterium eines Beginns vor dem 12. Lebensjahr.");
    if (on === 2 || on === 3) notes.push("Du berichtest einen späteren Beginn. Für eine ADHS-Diagnose müssen Anzeichen bereits vor dem 12. Lebensjahr bestanden haben; bei spätem Beginn lohnt sich der Blick auf andere Ursachen wie Stress, Schlaf oder Stimmung.");
  }
  const ar = picked(A, "xAreas").filter(i => i >= 0);
  if (A.xAreas !== undefined) {
    if (ar.length >= 2) notes.push("Du fühlst dich in " + ar.length + " Lebensbereichen eingeschränkt. Eine Beeinträchtigung in mehreren Bereichen ist für Fachpersonen ein wichtiges Kriterium.");
    else if (ar.length === 0) notes.push("Du gibst keine spürbare Einschränkung im Alltag an. Ohne Leidensdruck besteht meist kein Abklärungsbedarf – auch bei erhöhten Werten.");
  }
  return notes;
}

function scoreAsrsA(A) {
  const n = [1, 2, 3, 4, 5, 6].filter(i => asrsHit(A, i)).length;
  const level = n >= 4 ? "high" : n === 3 ? "mid" : "low";
  return {
    title: "ADHS-Screener (ASRS v1.1, Teil A)", level, score: n, max: 6, mark: 4,
    headline: n >= 4 ? "Deine Antworten passen zu einem ADHS-typischen Muster" : n === 3 ? "Knapp unter der Schwelle" : "Kein auffälliges Muster",
    text: n >= 4
      ? "Ab 4 von 6 auffälligen Antworten gilt der Screener als positiv. Das heisst: Eine fachliche Abklärung ist sinnvoll – nicht, dass ADHS feststeht."
      : "Der Screener gilt ab 4 von 6 auffälligen Antworten als positiv. Ein Wert darunter schliesst ADHS nicht aus, macht es aber weniger wahrscheinlich.",
    facts: ["Schwelle: 4 von 6 (Kessler et al., 2005). Bei den ersten drei Fragen zählt bereits «Manchmal», bei den übrigen erst «Oft»."],
    sources: ["asrs", "asrsDe"]
  };
}

function scoreAsrs5(A) {
  const s = sum([9, 12, 14, 16, 19, 20], n => A["a" + n]);
  const level = s >= 14 ? "high" : s >= 10 ? "mid" : "low";
  return {
    title: "ADHS nach DSM-5 (ASRS-5)", level, score: s, max: 24, mark: 14,
    headline: s >= 14 ? "Über der Schwelle des DSM-5-Screeners" : s >= 10 ? "Erhöht, aber unter der Schwelle" : "Unter der Schwelle",
    text: "Sechs Fragen, je 0–4 Punkte. Ab 14 Punkten gilt das Ergebnis als positiv. In einer deutschen Studie in Hausarztpraxen (mit der gewichteten Originalwertung) erkannte der Test rund 96 % der Betroffenen, schlug aber auch bei etwa 28 % der Personen ohne ADHS an. Ein positives Ergebnis ist deshalb ein Anlass zur Abklärung, kein Befund.",
    facts: [
      "Schwelle: 14 von 24. Ausgewertet wird die einfache Summe, wie sie heute gebräuchlich ist.",
      "Die Originalstudie (Ustun et al., 2017) verwendete eine gewichtete Wertung, deren genaue Punktwerte nicht frei veröffentlicht sind. Ihre Kennzahlen (Sensitivität 91 %, Spezifität 96 %) gelten für diese gewichtete Fassung."
    ],
    sources: ["asrs5", "asrs5De"]
  };
}

function scoreAsrsProfile(A) {
  const i = ASRS_INATT.filter(n => asrsHit(A, n)).length;
  const h = ASRS_HYPER.filter(n => asrsHit(A, n)).length;
  let lean = "Beide Bereiche sind ähnlich ausgeprägt.";
  if (i - h >= 2) lean = "Der Schwerpunkt liegt bei der Aufmerksamkeit und Organisation.";
  if (h - i >= 2) lean = "Der Schwerpunkt liegt bei Unruhe und Impulsivität.";
  return {
    title: "Dein Profil (ASRS v1.1, alle 18 Fragen)", level: "info",
    headline: lean,
    text: "Dieses Profil hat keine eigene Diagnoseschwelle. Es hilft dir und einer Fachperson zu sehen, wo deine Schwierigkeiten liegen.",
    bars: [
      { label: "Unaufmerksamkeit", score: i, max: 9 },
      { label: "Hyperaktivität / Impulsivität", score: h, max: 9 }
    ],
    facts: contextNotes(A, "adhd"),
    sources: ["asrs"]
  };
}

function scoreAq10(A) {
  const agree = [1, 7, 8, 10];
  let s = 0;
  for (let n = 1; n <= 10; n++) {
    const v = A["q" + n];
    if (agree.includes(n) ? v <= 1 : v >= 2) s++;
  }
  const level = s >= 6 ? "high" : s >= 4 ? "mid" : "low";
  return {
    title: "Autismus-Screener (AQ-10)", level, score: s, max: 10, mark: 6,
    headline: s >= 6 ? "Deutliche autistische Züge" : s >= 4 ? "Einige autistische Züge" : "Wenige autistische Züge",
    text: s >= 6
      ? "Ab 6 von 10 Punkten wird eine spezialisierte Abklärung empfohlen. In der Originalstudie lag die Sensitivität bei 88 % und die Spezifität bei 91 %."
      : "Die Schwelle für eine empfohlene Abklärung liegt bei 6 von 10. Ein tieferer Wert schliesst Autismus nicht aus – besonders, wenn du stark maskierst.",
    facts: ["Schwelle: 6 von 10 (Allison et al., 2012)"],
    sources: ["aq10", "aq10Form", "aq10cut"]
  };
}

function scoreRaads(A) {
  const pts = n => { const p = 3 - A["r" + n]; return n === 6 ? 3 - p : p; };
  const all = Array.from({ length: 14 }, (_, i) => i + 1);
  const s = sum(all, pts);
  const level = s >= 14 ? "high" : s >= 10 ? "mid" : "low";
  return {
    title: "Autismus-Screener (RAADS-14)", level, score: s, max: 42, mark: 14,
    headline: s >= 14 ? "Über der Schwelle" : s >= 10 ? "Erhöht, aber unter der Schwelle" : "Unter der Schwelle",
    text: "Ab 14 Punkten gilt der Test als positiv. Er ist sehr empfindlich (97 %), aber wenig trennscharf: Auch Menschen mit ADHS oder Angststörungen erreichen häufig Werte über 14. Zum Vergleich die Mittelwerte der Studie: Autismus 32, ADHS 15, ohne Diagnose 3.",
    bars: [
      { label: "Soziales Verstehen", score: sum([1, 4, 9, 11, 12, 13, 14], pts), max: 21 },
      { label: "Soziale Unsicherheit", score: sum([3, 5, 6, 8], pts), max: 12 },
      { label: "Sinnesempfindlichkeit", score: sum([2, 7, 10], pts), max: 9 }
    ],
    facts: ["Schwelle: 14 von 42 (Eriksson et al., 2013)"],
    sources: ["raads14"]
  };
}

/* AQ (50): 1 Punkt für Zustimmung bei AQ_AGREE, sonst 1 Punkt für Ablehnung.
   Frage 1 zählt bei Ablehnung (korrigierter Schlüssel; in der Originalarbeit steht sie irrtümlich bei «Zustimmung»). */
const AQ_AGREE = [2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41, 42, 43, 45, 46];
const AQ_SUB = [
  ["Soziale Fähigkeiten", [1, 11, 13, 15, 22, 36, 44, 45, 47, 48]],
  ["Aufmerksamkeitswechsel", [2, 4, 10, 16, 25, 32, 34, 37, 43, 46]],
  ["Aufmerksamkeit für Details", [5, 6, 9, 12, 19, 23, 28, 29, 30, 49]],
  ["Kommunikation", [7, 17, 18, 26, 27, 31, 33, 35, 38, 39]],
  ["Vorstellungskraft", [3, 8, 14, 20, 21, 24, 40, 41, 42, 50]]
];
function scoreAq50(A) {
  const pt = n => { const v = A["aq" + n]; return (AQ_AGREE.includes(n) ? v <= 1 : v >= 2) ? 1 : 0; };
  const s = sum(Array.from({ length: 50 }, (_, i) => i + 1), pt);
  const level = s >= 32 ? "high" : s >= 26 ? "mid" : "low";
  return {
    title: "Autismus-Spektrum-Quotient (AQ, 50 Fragen)", level, score: s, max: 50, mark: 32,
    headline: s >= 32 ? "Deutlich ausgeprägte autistische Züge" : s >= 26 ? "Erhöhte autistische Züge" : "Autistische Züge im üblichen Bereich",
    text: "Ab 32 Punkten sprechen die Autoren von klinisch bedeutsam ausgeprägten autistischen Zügen: 80 % der autistischen Erwachsenen der Originalstudie lagen darüber, aber nur 2 % der Vergleichsgruppe. Zum Vergleich die Mittelwerte: autistische Erwachsene 35,8, Vergleichsgruppe 16,4. Ein hoher Wert allein ist keine Diagnose; entscheidend ist, ob du im Alltag darunter leidest.",
    bars: AQ_SUB.map(x => ({ label: x[0], score: sum(x[1], pt), max: 10 })),
    facts: [
      "Schwelle: 32 von 50 (Baron-Cohen et al., 2001)",
      "Werte ab 26 werden in späteren Arbeiten als Schwelle für eine weitere Abklärung verwendet (Woodbury-Smith et al., 2005)."
    ],
    sources: ["aq50"]
  };
}

/* RAADS-R (80): 3/2/1/0 Punkte; bei den 17 «normativen» Fragen umgekehrt. */
const RR_REV = [1, 6, 11, 18, 23, 26, 33, 37, 43, 47, 48, 53, 58, 62, 68, 72, 77];
const RR_SUB = [
  ["Soziale Bezogenheit", [1, 3, 5, 6, 8, 11, 12, 14, 17, 18, 20, 21, 22, 23, 25, 26, 28, 31, 37, 38, 39, 43, 44, 45, 47, 48, 53, 54, 55, 60, 61, 64, 68, 69, 72, 76, 77, 79, 80], 31],
  ["Eingegrenzte Interessen", [9, 13, 24, 30, 32, 40, 41, 50, 52, 56, 63, 70, 75, 78], 15],
  ["Sprache", [2, 7, 15, 27, 35, 58, 66], 4],
  ["Sinneswahrnehmung und Motorik", [4, 10, 16, 19, 29, 33, 34, 36, 42, 46, 49, 51, 57, 59, 62, 65, 67, 71, 73, 74], 16]
];
function scoreRaadsR(A) {
  const pt = n => { const p = 3 - A["rr" + n]; return RR_REV.includes(n) ? 3 - p : p; };
  const s = sum(Array.from({ length: 80 }, (_, i) => i + 1), pt);
  const level = s >= 106 ? "high" : s >= 65 ? "mid" : "low";
  return {
    title: "RAADS-R (80 Fragen)", level, score: s, max: 240, mark: 65,
    headline: s >= 140 ? "Sehr deutlich ausgeprägte autistische Merkmale"
      : s >= 106 ? "Das Antwortmuster passt zu Autismus"
      : s >= 65 ? "Über der Originalschwelle: einige autistische Merkmale"
      : "Unter der Schwelle",
    text: "In der Originalstudie lagen alle Personen ohne Autismus unter 65 Punkten, 97 % der autistischen Erwachsenen darüber. Mittelwerte: autistische Erwachsene 134, Vergleichsgruppen 26. Neuere Auswertungen unterscheiden feiner: 65–105 einige autistische Merkmale, 106–139 passend zu Autismus, ab 140 sehr deutlich. Der RAADS-R wurde für die Anwendung zusammen mit einer Fachperson entwickelt. Online und allein ausgefüllt fallen die Werte oft höher aus, vor allem bei ADHS, Angst oder Depression.",
    bars: RR_SUB.map(x => ({ label: x[0] + " (Schwelle " + x[2] + ")", score: sum(x[1], pt), max: x[1].length * 3, mark: x[2] })),
    facts: [
      "Schwelle: 65 von 240 (Ritvo et al., 2011); Teilskalen-Schwellen aus derselben Arbeit",
      "Bereiche 65–105 · 106–139 · ab 140 nach neueren Normen (NovoPsych, 2025)"
    ],
    sources: ["raadsr", "raadsrNorm"]
  };
}

function scoreCatq(A) {
  const pts = id => { const p = A[id] + 1; return Q[id].rev ? 8 - p : p; };
  const ids = Object.keys(Q).filter(k => /^c\d+$/.test(k));
  const sub = k => ids.filter(id => Q[id].sub === k);
  const s = sum(ids, pts);
  const level = s >= 100 ? "high" : s >= 88 ? "mid" : "low";
  return {
    title: "Soziales Maskieren (CAT-Q)", level, score: s, max: 175, min: 25, mark: 100,
    headline: s >= 100 ? "Du maskierst überdurchschnittlich stark" : s >= 88 ? "Du maskierst etwas mehr als der Durchschnitt" : "Du maskierst wenig",
    text: "Der CAT-Q misst, wie sehr du dich im Kontakt mit anderen anpasst oder verstellst. Er stellt keine Diagnose. Zum Vergleich: In der Entwicklungsstudie lag der Mittelwert autistischer Erwachsener bei etwa 120, jener nicht-autistischer bei etwa 87. Starkes Maskieren ist anstrengend und kann Screening-Werte für Autismus nach unten verzerren.",
    bars: [
      { label: "Kompensation (soziales Lernen, Skripte)", score: sum(sub("C"), pts), max: 63, min: 9 },
      { label: "Maskieren (Mimik und Wirkung kontrollieren)", score: sum(sub("M"), pts), max: 56, min: 8 },
      { label: "Assimilation (sich einfügen, Rolle spielen)", score: sum(sub("A"), pts), max: 56, min: 8 }
    ],
    facts: [
      "Die Autoren nennen keine Schwelle. 100 von 175 ist ein verbreiteter, inoffizieller Orientierungswert.",
      "Vergleichswerte aus Hull et al. (2019): Mittelwert pro Frage 4,79 (autistisch) und 3,48 (nicht autistisch), hochgerechnet auf 25 Fragen etwa 120 und 87."
    ],
    sources: ["catq"]
  };
}

function scoreDys(A) {
  const ids = Array.from({ length: 15 }, (_, i) => "d" + (i + 1));
  const s = sum(ids, id => Q[id].w * (A[id] + 1));
  const level = s > 60 ? "high" : s >= 40 ? "mid" : "low";
  return {
    title: "Dyslexie-Checkliste", level, score: s, max: 88, min: 22, mark: 45,
    headline: s > 60 ? "Anzeichen für eine mittlere bis ausgeprägte Dyslexie"
      : s >= 45 ? "Anzeichen, die zu einer leichten Dyslexie passen"
      : s >= 40 ? "Grenzbereich: knapp unter der ursprünglichen Schwelle"
      : "Wenig Anzeichen für Dyslexie",
    text: "Die Fragen sind unterschiedlich gewichtet. Nach den Autoren ist unter 45 Punkten eine Dyslexie unwahrscheinlich, 45–60 passt zu einer leichten, über 60 zu einer mittleren bis ausgeprägten Form. Eine Überprüfung von 2025 mit 400 Personen empfiehlt, die untere Schwelle auf 40 zu senken. Die Checkliste wurde für Englisch entwickelt; im Deutschen mit seiner regelmässigeren Schreibweise sind die Werte vorsichtiger zu lesen.",
    facts: [
      "Bereiche nach Smythe & Everatt (2001): unter 45 · 45–60 · über 60",
      "Empfohlene untere Schwelle nach Stark et al. (2025): 40"
    ],
    sources: ["dys", "dysVal"]
  };
}

function scoreAdc(A) {
  const a = sum(Array.from({ length: 10 }, (_, i) => "pA" + (i + 1)), id => A[id]);
  const b = sum(Array.from({ length: 10 }, (_, i) => "pB" + (i + 1)), id => A[id]);
  const c = sum(Array.from({ length: 20 }, (_, i) => "pC" + (i + 1)), id => A[id]);
  const s = a + b + c;
  const level = s >= 65 ? "high" : s >= 56 ? "mid" : "low";
  const facts = ["Wertung 0–3 pro Frage. Schwellen: 56 = erhöhtes Risiko, 65 = wahrscheinliche DCD (Kirby et al., 2010). Andere Sprachfassungen verwenden abweichende Schwellen."];
  facts.push(a >= 17
    ? "Dein Kindheitswert (" + a + " von 30) liegt über dem Richtwert von 17. Dyspraxie beginnt in der Kindheit – das stützt das Ergebnis."
    : "Dein Kindheitswert (" + a + " von 30) liegt unter dem Richtwert von 17. Ohne frühe motorische Schwierigkeiten ist eine DCD weniger wahrscheinlich.");
  return {
    title: "Dyspraxie-Checkliste (ADC)", level, score: s, max: 120, mark: 56,
    headline: s >= 65 ? "Deutliche Hinweise auf eine Koordinationsstörung" : s >= 56 ? "Erhöhtes Risiko für eine Koordinationsstörung" : "Wenig Hinweise auf eine Koordinationsstörung",
    text: "Die ADC erfasst motorische und organisatorische Schwierigkeiten in der Kindheit und heute. Sie überschneidet sich inhaltlich mit ADHS – erhöhte Werte können auch von dort stammen.",
    bars: [
      { label: "Kindheit", score: a, max: 30 },
      { label: "Heute: Motorik und Handschrift", score: b, max: 30 },
      { label: "Heute: Alltag und Organisation", score: c, max: 60 }
    ],
    facts, sources: ["adc", "adcDe", "adcScore"]
  };
}

function scoreAdcChild(A) {
  const a = sum(Array.from({ length: 10 }, (_, i) => "pA" + (i + 1)), id => A[id]);
  const level = a >= 17 ? "mid" : "low";
  return {
    title: "Motorik und Koordination (ADC, Kindheitsteil)", level, score: a, max: 30, mark: 17,
    headline: a >= 17 ? "Motorische Schwierigkeiten in der Kindheit" : "Keine auffälligen motorischen Schwierigkeiten in der Kindheit",
    text: a >= 17
      ? "Dein Wert liegt über dem Richtwert von 17. Der vollständige Dyspraxie-Test zeigt dir, ob diese Schwierigkeiten bis heute anhalten."
      : "Dyspraxie beginnt in der Kindheit. Ein unauffälliger Kindheitswert macht sie unwahrscheinlich.",
    facts: ["Richtwert Kindheit: 17 von 30 (Kirby et al., 2010)"],
    sources: ["adc"], next: a >= 17 ? "dcd" : null
  };
}

function scoreTics(A, brief) {
  const m = picked(A, "tm").filter(i => i >= 0).length;
  const v = picked(A, "tv").filter(i => i >= 0).length;
  const longer = A.td === 0;
  const early = A.to === 0;
  const facts = ["Motorische Tics: " + m + " · Vokale Tics: " + v];
  let level = "low", headline = "Keine Hinweise auf eine Tic-Störung", text;
  if (m + v === 0) {
    text = "Du hast keine unwillkürlichen Bewegungen oder Laute angegeben.";
  } else if (!longer) {
    level = "mid"; headline = "Einzelne Tics, aber (noch) kein anhaltendes Muster";
    text = "Vorübergehende Tics sind häufig und oft harmlos, besonders bei Stress oder Müdigkeit. Wenn sie länger als ein Jahr bestehen oder dich belasten, lohnt sich eine Abklärung.";
  } else if (m >= 2 && v >= 1 && !brief && early) {
    level = "high"; headline = "Das Muster passt zu den Kriterien eines Tourette-Syndroms";
    text = "Mehrere motorische und mindestens ein vokaler Tic über mehr als ein Jahr mit Beginn vor dem 18. Lebensjahr entsprechen dem Kriterienmuster nach DSM-5. Ob es tatsächlich Tics sind, kann nur eine neurologische oder psychiatrische Fachperson beurteilen.";
  } else {
    level = "high"; headline = "Das Muster passt zu einer anhaltenden Tic-Störung";
    text = "Tics, die länger als ein Jahr bestehen, gelten als chronisch. Eine neurologische oder psychiatrische Abklärung kann klären, was dahintersteckt und ob Unterstützung sinnvoll ist.";
  }
  if (!brief && A.tf !== undefined && m + v > 0) {
    const sev = Math.max(A.tf, 1) + Math.max(A.ti, 1);
    facts.push("Ausprägung (Häufigkeit + Stärke): " + sev + " von 7");
  }
  if (!brief && A.to === 1 && m + v > 0) facts.push("Tics, die erst im Erwachsenenalter beginnen, sollten neurologisch abgeklärt werden, da sie andere Ursachen haben können.");
  facts.push("Für Tic-Fragebögen gibt es keine validierte Diagnoseschwelle; die Einordnung folgt den DSM-5-Kriterien.");
  return {
    title: "Tics", level, headline, text, facts, sources: ["atq"],
    next: brief && level !== "low" ? "tic" : null
  };
}

function scorePhq4(A) {
  const dep = A.m1 + A.m2, anx = A.m3 + A.m4, s = dep + anx;
  const level = dep >= 3 || anx >= 3 ? "high" : s >= 3 ? "mid" : "low";
  const parts = [];
  if (dep >= 3) parts.push("gedrückte Stimmung");
  if (anx >= 3) parts.push("Angst und Anspannung");
  return {
    title: "Stimmung und Anspannung (PHQ-4)", level, score: s, max: 12, mark: 6,
    headline: parts.length ? "Erhöhte Belastung: " + parts.join(" sowie ") : level === "mid" ? "Leichte Belastung" : "Keine erhöhte Belastung",
    text: "Depressive Verstimmung und Angst können Konzentration, Antrieb und sozialen Rückzug stark beeinflussen – und so Ergebnisse in anderen Bereichen erhöhen. Sie treten auch häufig gemeinsam mit Neurodivergenz auf. Deshalb gehört dieser Kurztest zur Einordnung dazu.",
    bars: [
      { label: "Stimmung (Schwelle 3)", score: dep, max: 6 },
      { label: "Angst und Anspannung (Schwelle 3)", score: anx, max: 6 }
    ],
    facts: ["Schwelle je Teilskala: 3 von 6 (Kroenke et al., 2009; Löwe et al., 2010)"],
    sources: ["phq4", "phq4De"], care: level === "high"
  };
}

function evaluate(testId, A) {
  switch (testId) {
    case "adhd": return [scoreAsrsA(A), scoreAsrs5(A), scoreAsrsProfile(A)];
    case "asd": {
      const cards = [scoreAq50(A), scoreRaadsR(A)];
      const n = contextNotes(A, "asd");
      if (n.length) cards[0].facts = cards[0].facts.concat(n);
      return cards;
    }
    case "mask": return [scoreCatq(A)];
    case "dys": return [scoreDys(A)];
    case "dcd": return [scoreAdc(A)];
    case "tic": {
      const c = scoreTics(A, false);
      c.facts = c.facts.concat(contextNotes(A, "tic"));
      return [c];
    }
    case "general": {
      const adhd = scoreAsrsA(A); adhd.next = adhd.level !== "low" ? "adhd" : null;
      adhd.facts = adhd.facts.concat(contextNotes(A, "adhd"));
      const asd = scoreAq10(A); asd.next = asd.level !== "low" ? "asd" : null;
      const dys = scoreDys(A);
      return [adhd, asd, dys, scoreAdcChild(A), scoreTics(A, true), scorePhq4(A)];
    }
  }
  return [];
}
