/* ============================================================
   Auswertung. Jede Funktion erhält die Antworten (id → Index bzw.
   Index-Liste) und liefert eine Ergebniskarte:
   { title, level: "low"|"mid"|"high"|"info", score, max, mark,
     headline, text, facts[], sources[] }
   Texte werden über L(de, en) in der aktuellen Sprache erzeugt.
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
    if (on === 0) notes.push(L(
      "Du berichtest Schwierigkeiten seit der Kindheit – das passt zum Kriterium eines Beginns vor dem 12. Lebensjahr.",
      "You report difficulties since childhood – this fits the criterion of onset before age 12."));
    if (on === 2 || on === 3) notes.push(L(
      "Du berichtest einen späteren Beginn. Für eine ADHS-Diagnose müssen Anzeichen bereits vor dem 12. Lebensjahr bestanden haben; bei spätem Beginn lohnt sich der Blick auf andere Ursachen wie Stress, Schlaf oder Stimmung.",
      "You report a later onset. An ADHD diagnosis requires signs before age 12; with a late onset it is worth looking at other causes such as stress, sleep or mood."));
  }
  const ar = picked(A, "xAreas").filter(i => i >= 0);
  if (A.xAreas !== undefined) {
    if (ar.length >= 2) notes.push(L(
      "Du fühlst dich in " + ar.length + " Lebensbereichen eingeschränkt. Eine Beeinträchtigung in mehreren Bereichen ist für Fachpersonen ein wichtiges Kriterium.",
      "You feel held back in " + ar.length + " areas of life. Impairment in several areas is an important criterion for clinicians."));
    else if (ar.length === 0) notes.push(L(
      "Du gibst keine spürbare Einschränkung im Alltag an. Ohne Leidensdruck besteht meist kein Abklärungsbedarf – auch bei erhöhten Werten.",
      "You report no noticeable impairment in daily life. Without distress there is usually no need for an assessment – even with raised scores."));
  }
  return notes;
}

function scoreAsrsA(A) {
  const n = [1, 2, 3, 4, 5, 6].filter(i => asrsHit(A, i)).length;
  const level = n >= 4 ? "high" : n === 3 ? "mid" : "low";
  return {
    title: L("ADHS-Screener (ASRS v1.1, Teil A)", "ADHD screener (ASRS v1.1, Part A)"), level, score: n, max: 6, mark: 4,
    headline: n >= 4 ? L("Deine Antworten passen zu einem ADHS-typischen Muster", "Your answers fit a pattern typical of ADHD")
      : n === 3 ? L("Knapp unter der Schwelle", "Just below the threshold")
      : L("Kein auffälliges Muster", "No notable pattern"),
    text: n >= 4
      ? L("Ab 4 von 6 auffälligen Antworten gilt der Screener als positiv. Das heisst: Eine fachliche Abklärung ist sinnvoll – nicht, dass ADHS feststeht.",
          "The screener counts as positive from 4 of 6 notable answers. This means a professional assessment makes sense – not that ADHD is certain.")
      : L("Der Screener gilt ab 4 von 6 auffälligen Antworten als positiv. Ein Wert darunter schliesst ADHS nicht aus, macht es aber weniger wahrscheinlich.",
          "The screener counts as positive from 4 of 6 notable answers. A lower score does not rule out ADHD, but makes it less likely."),
    facts: [L("Schwelle: 4 von 6 (Kessler et al., 2005). Bei den ersten drei Fragen zählt bereits «Manchmal», bei den übrigen erst «Oft».",
              "Threshold: 4 of 6 (Kessler et al., 2005). For the first three questions “Sometimes” already counts, for the others only “Often”.")],
    sources: ["asrs", "asrsDe"]
  };
}

function scoreAsrs5(A) {
  const s = sum([9, 12, 14, 16, 19, 20], n => A["a" + n]);
  const level = s >= 14 ? "high" : s >= 10 ? "mid" : "low";
  return {
    title: L("ADHS nach DSM-5 (ASRS-5)", "ADHD according to DSM-5 (ASRS-5)"), level, score: s, max: 24, mark: 14,
    headline: s >= 14 ? L("Über der Schwelle des DSM-5-Screeners", "Above the threshold of the DSM-5 screener")
      : s >= 10 ? L("Erhöht, aber unter der Schwelle", "Raised, but below the threshold")
      : L("Unter der Schwelle", "Below the threshold"),
    text: L("Sechs Fragen, je 0–4 Punkte. Ab 14 Punkten gilt das Ergebnis als positiv. In einer deutschen Studie in Hausarztpraxen (mit der gewichteten Originalwertung) erkannte der Test rund 96 % der Betroffenen, schlug aber auch bei etwa 28 % der Personen ohne ADHS an. Ein positives Ergebnis ist deshalb ein Anlass zur Abklärung, kein Befund.",
            "Six questions, 0–4 points each. From 14 points the result counts as positive. In a German primary-care study (using the original weighted scoring) the test identified about 96 % of people with ADHD, but was also positive for about 28 % of people without ADHD. A positive result is therefore a reason for an assessment, not a finding."),
    facts: [
      L("Schwelle: 14 von 24. Ausgewertet wird die einfache Summe, wie sie heute gebräuchlich ist.",
        "Threshold: 14 of 24. The simple sum is used, as is common today."),
      L("Die Originalstudie (Ustun et al., 2017) verwendete eine gewichtete Wertung, deren genaue Punktwerte nicht frei veröffentlicht sind. Ihre Kennzahlen (Sensitivität 91 %, Spezifität 96 %) gelten für diese gewichtete Fassung.",
        "The original study (Ustun et al., 2017) used a weighted scoring whose exact weights are not freely published. Its figures (sensitivity 91 %, specificity 96 %) apply to that weighted version.")
    ],
    sources: ["asrs5", "asrs5De"]
  };
}

function scoreAsrsProfile(A) {
  const i = ASRS_INATT.filter(n => asrsHit(A, n)).length;
  const h = ASRS_HYPER.filter(n => asrsHit(A, n)).length;
  let lean = L("Beide Bereiche sind ähnlich ausgeprägt.", "Both areas are similarly pronounced.");
  if (i - h >= 2) lean = L("Der Schwerpunkt liegt bei der Aufmerksamkeit und Organisation.", "The focus is on attention and organisation.");
  if (h - i >= 2) lean = L("Der Schwerpunkt liegt bei Unruhe und Impulsivität.", "The focus is on restlessness and impulsivity.");
  return {
    title: L("Dein Profil (ASRS v1.1, alle 18 Fragen)", "Your profile (ASRS v1.1, all 18 questions)"), level: "info",
    headline: lean,
    text: L("Dieses Profil hat keine eigene Diagnoseschwelle. Es hilft dir und einer Fachperson zu sehen, wo deine Schwierigkeiten liegen.",
            "This profile has no diagnostic threshold of its own. It helps you and a clinician see where your difficulties lie."),
    bars: [
      { label: L("Unaufmerksamkeit", "Inattention"), score: i, max: 9 },
      { label: L("Hyperaktivität / Impulsivität", "Hyperactivity / impulsivity"), score: h, max: 9 }
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
    title: L("Autismus-Screener (AQ-10)", "Autism screener (AQ-10)"), level, score: s, max: 10, mark: 6,
    headline: s >= 6 ? L("Deutliche autistische Züge", "Marked autistic traits")
      : s >= 4 ? L("Einige autistische Züge", "Some autistic traits")
      : L("Wenige autistische Züge", "Few autistic traits"),
    text: s >= 6
      ? L("Ab 6 von 10 Punkten wird eine spezialisierte Abklärung empfohlen. In der Originalstudie lag die Sensitivität bei 88 % und die Spezifität bei 91 %.",
          "From 6 of 10 points a specialist assessment is recommended. In the original study sensitivity was 88 % and specificity 91 %.")
      : L("Die Schwelle für eine empfohlene Abklärung liegt bei 6 von 10. Ein tieferer Wert schliesst Autismus nicht aus – besonders, wenn du stark maskierst.",
          "The threshold for a recommended assessment is 6 of 10. A lower score does not rule out autism – especially if you mask a lot."),
    facts: [L("Schwelle: 6 von 10 (Allison et al., 2012)", "Threshold: 6 of 10 (Allison et al., 2012)")],
    sources: ["aq10", "aq10Form", "aq10cut"]
  };
}

function scoreRaads(A) {
  const pts = n => { const p = 3 - A["r" + n]; return n === 6 ? 3 - p : p; };
  const all = Array.from({ length: 14 }, (_, i) => i + 1);
  const s = sum(all, pts);
  const level = s >= 14 ? "high" : s >= 10 ? "mid" : "low";
  return {
    title: L("Autismus-Screener (RAADS-14)", "Autism screener (RAADS-14)"), level, score: s, max: 42, mark: 14,
    headline: s >= 14 ? L("Über der Schwelle", "Above the threshold") : s >= 10 ? L("Erhöht, aber unter der Schwelle", "Raised, but below the threshold") : L("Unter der Schwelle", "Below the threshold"),
    text: L("Ab 14 Punkten gilt der Test als positiv. Er ist sehr empfindlich (97 %), aber wenig trennscharf: Auch Menschen mit ADHS oder Angststörungen erreichen häufig Werte über 14. Zum Vergleich die Mittelwerte der Studie: Autismus 32, ADHS 15, ohne Diagnose 3.",
            "From 14 points the test counts as positive. It is very sensitive (97 %) but not very specific: people with ADHD or anxiety disorders also often score above 14. Study means for comparison: autism 32, ADHD 15, no diagnosis 3."),
    bars: [
      { label: L("Soziales Verstehen", "Social understanding"), score: sum([1, 4, 9, 11, 12, 13, 14], pts), max: 21 },
      { label: L("Soziale Unsicherheit", "Social anxiety"), score: sum([3, 5, 6, 8], pts), max: 12 },
      { label: L("Sinnesempfindlichkeit", "Sensory sensitivity"), score: sum([2, 7, 10], pts), max: 9 }
    ],
    facts: [L("Schwelle: 14 von 42 (Eriksson et al., 2013)", "Threshold: 14 of 42 (Eriksson et al., 2013)")],
    sources: ["raads14"]
  };
}

/* AQ (50): 1 Punkt für Zustimmung bei AQ_AGREE, sonst 1 Punkt für Ablehnung.
   Frage 1 zählt bei Ablehnung (korrigierter Schlüssel; in der Originalarbeit steht sie irrtümlich bei «Zustimmung»).
   Fragen aus AQ_FROM_RR werden aus der inhaltsgleichen RAADS-R-Antwort abgeleitet. */
const AQ_AGREE = [2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41, 42, 43, 45, 46];
const AQ_SUB = [
  [{ de: "Soziale Fähigkeiten", en: "Social skills" }, [1, 11, 13, 15, 22, 36, 44, 45, 47, 48]],
  [{ de: "Aufmerksamkeitswechsel", en: "Attention switching" }, [2, 4, 10, 16, 25, 32, 34, 37, 43, 46]],
  [{ de: "Aufmerksamkeit für Details", en: "Attention to detail" }, [5, 6, 9, 12, 19, 23, 28, 29, 30, 49]],
  [{ de: "Kommunikation", en: "Communication" }, [7, 17, 18, 26, 27, 31, 33, 35, 38, 39]],
  [{ de: "Vorstellungskraft", en: "Imagination" }, [3, 8, 14, 20, 21, 24, 40, 41, 42, 50]]
];
function aqAgrees(A, n) {
  const v = A["aq" + n];
  if (v !== undefined) return v <= 1;
  const link = AQ_FROM_RR[n];
  if (!link) return false;
  const nowTrue = A["rr" + link[0]] <= 1;   // «Trifft heute zu …» oder «Trifft nur heute zu»
  return link[1] ? !nowTrue : nowTrue;
}
function scoreAq50(A) {
  const pt = n => ((AQ_AGREE.includes(n) ? aqAgrees(A, n) : !aqAgrees(A, n)) ? 1 : 0);
  const s = sum(Array.from({ length: 50 }, (_, i) => i + 1), pt);
  const level = s >= 32 ? "high" : s >= 26 ? "mid" : "low";
  const linked = Object.keys(AQ_FROM_RR).length;
  return {
    title: L("Autismus-Spektrum-Quotient (AQ, 50 Fragen)", "Autism-Spectrum Quotient (AQ, 50 items)"), level, score: s, max: 50, mark: 32,
    headline: s >= 32 ? L("Deutlich ausgeprägte autistische Züge", "Clearly pronounced autistic traits")
      : s >= 26 ? L("Erhöhte autistische Züge", "Raised autistic traits")
      : L("Autistische Züge im üblichen Bereich", "Autistic traits in the typical range"),
    text: L("Ab 32 Punkten sprechen die Autoren von klinisch bedeutsam ausgeprägten autistischen Zügen: 80 % der autistischen Erwachsenen der Originalstudie lagen darüber, aber nur 2 % der Vergleichsgruppe. Zum Vergleich die Mittelwerte: autistische Erwachsene 35,8, Vergleichsgruppe 16,4. Ein hoher Wert allein ist keine Diagnose; entscheidend ist, ob du im Alltag darunter leidest.",
            "From 32 points the authors speak of clinically significant autistic traits: 80 % of autistic adults in the original study scored above this, but only 2 % of the comparison group. Means for comparison: autistic adults 35.8, comparison group 16.4. A high score alone is not a diagnosis; what matters is whether you struggle in daily life."),
    bars: AQ_SUB.map(x => ({ label: tr(x[0]), score: sum(x[1], pt), max: 10 })),
    facts: [
      L("Schwelle: 32 von 50 (Baron-Cohen et al., 2001)", "Threshold: 32 of 50 (Baron-Cohen et al., 2001)"),
      L("Werte ab 26 werden in späteren Arbeiten als Schwelle für eine weitere Abklärung verwendet (Woodbury-Smith et al., 2005).",
        "Later work uses 26 as a threshold for further assessment (Woodbury-Smith et al., 2005)."),
      L(linked + " AQ-Fragen decken sich inhaltlich mit einer RAADS-R-Frage und wurden nur einmal gestellt. Für den AQ zählt dort, ob die Aussage heute auf dich zutrifft.",
        linked + " AQ items match a RAADS-R item in content and were asked only once. For the AQ, what counts there is whether the statement is true for you now.")
    ],
    sources: ["aq50"]
  };
}

/* RAADS-R (80): 3/2/1/0 Punkte; bei den 17 «normativen» Fragen umgekehrt. */
const RR_REV = [1, 6, 11, 18, 23, 26, 33, 37, 43, 47, 48, 53, 58, 62, 68, 72, 77];
const RR_SUB = [
  [{ de: "Soziale Bezogenheit", en: "Social relatedness" }, [1, 3, 5, 6, 8, 11, 12, 14, 17, 18, 20, 21, 22, 23, 25, 26, 28, 31, 37, 38, 39, 43, 44, 45, 47, 48, 53, 54, 55, 60, 61, 64, 68, 69, 72, 76, 77, 79, 80], 31],
  [{ de: "Eingegrenzte Interessen", en: "Circumscribed interests" }, [9, 13, 24, 30, 32, 40, 41, 50, 52, 56, 63, 70, 75, 78], 15],
  [{ de: "Sprache", en: "Language" }, [2, 7, 15, 27, 35, 58, 66], 4],
  [{ de: "Sinneswahrnehmung und Motorik", en: "Sensory-motor" }, [4, 10, 16, 19, 29, 33, 34, 36, 42, 46, 49, 51, 57, 59, 62, 65, 67, 71, 73, 74], 16]
];
function scoreRaadsR(A) {
  const pt = n => { const p = 3 - A["rr" + n]; return RR_REV.includes(n) ? 3 - p : p; };
  const s = sum(Array.from({ length: 80 }, (_, i) => i + 1), pt);
  const level = s >= 106 ? "high" : s >= 65 ? "mid" : "low";
  return {
    title: L("RAADS-R (80 Fragen)", "RAADS-R (80 items)"), level, score: s, max: 240, mark: 65,
    headline: s >= 140 ? L("Sehr deutlich ausgeprägte autistische Merkmale", "Very clearly pronounced autistic traits")
      : s >= 106 ? L("Das Antwortmuster passt zu Autismus", "The answer pattern fits autism")
      : s >= 65 ? L("Über der Originalschwelle: einige autistische Merkmale", "Above the original threshold: some autistic traits")
      : L("Unter der Schwelle", "Below the threshold"),
    text: L("In der Originalstudie lagen alle Personen ohne Autismus unter 65 Punkten, 97 % der autistischen Erwachsenen darüber. Mittelwerte: autistische Erwachsene 134, Vergleichsgruppen 26. Neuere Auswertungen unterscheiden feiner: 65–105 einige autistische Merkmale, 106–139 passend zu Autismus, ab 140 sehr deutlich. Der RAADS-R wurde für die Anwendung zusammen mit einer Fachperson entwickelt. Online und allein ausgefüllt fallen die Werte oft höher aus, vor allem bei ADHS, Angst oder Depression.",
            "In the original study everyone without autism scored below 65 and 97 % of autistic adults scored above. Means: autistic adults 134, comparison groups 26. Newer norms distinguish further: 65–105 some autistic traits, 106–139 consistent with autism, 140 and above very clear. The RAADS-R was designed to be used together with a clinician. Completed alone online, scores are often higher, especially with ADHD, anxiety or depression."),
    bars: RR_SUB.map(x => ({ label: tr(x[0]) + L(" (Schwelle ", " (threshold ") + x[2] + ")", score: sum(x[1], pt), max: x[1].length * 3, mark: x[2] })),
    facts: [
      L("Schwelle: 65 von 240 (Ritvo et al., 2011); Teilskalen-Schwellen aus derselben Arbeit",
        "Threshold: 65 of 240 (Ritvo et al., 2011); subscale thresholds from the same paper"),
      L("Bereiche 65–105 · 106–139 · ab 140 nach neueren Normen (NovoPsych, 2025)",
        "Ranges 65–105 · 106–139 · 140+ from newer norms (NovoPsych, 2025)"),
      L("Einige Fragen klingen ähnlich (z. B. mitfühlend – verständnisvoll – von anderen als mitfühlend erlebt). Das ist im Original so angelegt: Ähnliche und gegenteilig formulierte Fragen prüfen, ob die Antworten stimmig sind.",
        "Some items sound similar (e.g. sympathetic – understanding – considered compassionate by others). This is by design in the original: similar and reverse-worded items check that answers are consistent.")
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
    title: L("Soziales Maskieren (CAT-Q)", "Social camouflaging (CAT-Q)"), level, score: s, max: 175, min: 25, mark: 100,
    headline: s >= 100 ? L("Du maskierst überdurchschnittlich stark", "You camouflage more than average")
      : s >= 88 ? L("Du maskierst etwas mehr als der Durchschnitt", "You camouflage a little more than average")
      : L("Du maskierst wenig", "You camouflage little"),
    text: L("Der CAT-Q misst, wie sehr du dich im Kontakt mit anderen anpasst oder verstellst. Er stellt keine Diagnose. Zum Vergleich: In der Entwicklungsstudie lag der Mittelwert autistischer Erwachsener bei etwa 120, jener nicht-autistischer bei etwa 87. Starkes Maskieren ist anstrengend und kann Screening-Werte für Autismus nach unten verzerren.",
            "The CAT-Q measures how much you adapt or hide yourself when dealing with others. It does not give a diagnosis. For comparison: in the development study the mean for autistic adults was about 120 and for non-autistic adults about 87. Heavy camouflaging is exhausting and can push autism screening scores down."),
    bars: [
      { label: L("Kompensation (soziales Lernen, Skripte)", "Compensation (social learning, scripts)"), score: sum(sub("C"), pts), max: 63, min: 9 },
      { label: L("Maskieren (Mimik und Wirkung kontrollieren)", "Masking (controlling expressions and impression)"), score: sum(sub("M"), pts), max: 56, min: 8 },
      { label: L("Assimilation (sich einfügen, Rolle spielen)", "Assimilation (fitting in, putting on an act)"), score: sum(sub("A"), pts), max: 56, min: 8 }
    ],
    facts: [
      L("Die Autoren nennen keine Schwelle. 100 von 175 ist ein verbreiteter, inoffizieller Orientierungswert.",
        "The authors give no threshold. 100 of 175 is a common, unofficial reference value."),
      L("Vergleichswerte aus Hull et al. (2019): Mittelwert pro Frage 4,79 (autistisch) und 3,48 (nicht autistisch), hochgerechnet auf 25 Fragen etwa 120 und 87.",
        "Reference values from Hull et al. (2019): mean per item 4.79 (autistic) and 3.48 (non-autistic), about 120 and 87 across 25 items."),
      L("Einige Fragen sind absichtlich ähnlich: Das Original unterscheidet etwa zwischen «im Auge behalten» und «bewusst verändern» der eigenen Mimik.",
        "Some items are deliberately similar: the original distinguishes, for example, between monitoring and adjusting your own expressions.")
    ],
    sources: ["catq"]
  };
}

function scoreDys(A) {
  const ids = Array.from({ length: 15 }, (_, i) => "d" + (i + 1));
  const s = sum(ids, id => Q[id].w * (A[id] + 1));
  const level = s > 60 ? "high" : s >= 40 ? "mid" : "low";
  return {
    title: L("Dyslexie-Checkliste", "Dyslexia checklist"), level, score: s, max: 88, min: 22, mark: 45,
    headline: s > 60 ? L("Anzeichen für eine mittlere bis ausgeprägte Dyslexie", "Signs of moderate to severe dyslexia")
      : s >= 45 ? L("Anzeichen, die zu einer leichten Dyslexie passen", "Signs consistent with mild dyslexia")
      : s >= 40 ? L("Grenzbereich: knapp unter der ursprünglichen Schwelle", "Borderline: just below the original threshold")
      : L("Wenig Anzeichen für Dyslexie", "Few signs of dyslexia"),
    text: L("Die Fragen sind unterschiedlich gewichtet. Nach den Autoren ist unter 45 Punkten eine Dyslexie unwahrscheinlich, 45–60 passt zu einer leichten, über 60 zu einer mittleren bis ausgeprägten Form. Eine Überprüfung von 2025 mit 400 Personen empfiehlt, die untere Schwelle auf 40 zu senken. Die Checkliste wurde für Englisch entwickelt; im Deutschen mit seiner regelmässigeren Schreibweise sind die Werte vorsichtiger zu lesen.",
            "The questions are weighted differently. According to the authors, dyslexia is unlikely below 45 points; 45–60 fits a mild form and above 60 a moderate to severe form. A 2025 review with 400 people recommends lowering the lower threshold to 40."),
    facts: [
      L("Bereiche nach Smythe & Everatt (2001): unter 45 · 45–60 · über 60", "Ranges per Smythe & Everatt (2001): below 45 · 45–60 · above 60"),
      L("Empfohlene untere Schwelle nach Stark et al. (2025): 40", "Recommended lower threshold per Stark et al. (2025): 40")
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
  const facts = [L("Wertung 0–3 pro Frage. Schwellen: 56 = erhöhtes Risiko, 65 = wahrscheinliche DCD (Kirby et al., 2010). Andere Sprachfassungen verwenden abweichende Schwellen.",
                   "Scoring 0–3 per question. Thresholds: 56 = increased risk, 65 = probable DCD (Kirby et al., 2010). Other language versions use different thresholds.")];
  facts.push(a >= 17
    ? L("Dein Kindheitswert (" + a + " von 30) liegt über dem Richtwert von 17. Dyspraxie beginnt in der Kindheit – das stützt das Ergebnis.",
        "Your childhood score (" + a + " of 30) is above the reference value of 17. Dyspraxia begins in childhood – this supports the result.")
    : L("Dein Kindheitswert (" + a + " von 30) liegt unter dem Richtwert von 17. Ohne frühe motorische Schwierigkeiten ist eine DCD weniger wahrscheinlich.",
        "Your childhood score (" + a + " of 30) is below the reference value of 17. Without early motor difficulties DCD is less likely."));
  facts.push(L("Einige Themen kommen zweimal vor, etwa die Handschrift als Kind und heute. Das ist im Original so angelegt, weil DCD in der Kindheit beginnen und bis heute anhalten muss.",
               "Some topics appear twice, such as handwriting as a child and today. This is by design in the original, because DCD must begin in childhood and persist."));
  return {
    title: L("Dyspraxie-Checkliste (ADC)", "Dyspraxia checklist (ADC)"), level, score: s, max: 120, mark: 56,
    headline: s >= 65 ? L("Deutliche Hinweise auf eine Koordinationsstörung", "Clear signs of a coordination disorder")
      : s >= 56 ? L("Erhöhtes Risiko für eine Koordinationsstörung", "Increased risk of a coordination disorder")
      : L("Wenig Hinweise auf eine Koordinationsstörung", "Few signs of a coordination disorder"),
    text: L("Die ADC erfasst motorische und organisatorische Schwierigkeiten in der Kindheit und heute. Sie überschneidet sich inhaltlich mit ADHS – erhöhte Werte können auch von dort stammen.",
            "The ADC covers motor and organisational difficulties in childhood and today. It overlaps in content with ADHD – raised scores can also come from there."),
    bars: [
      { label: L("Kindheit", "Childhood"), score: a, max: 30 },
      { label: L("Heute: Motorik und Handschrift", "Today: motor skills and handwriting"), score: b, max: 30 },
      { label: L("Heute: Alltag und Organisation", "Today: daily life and organisation"), score: c, max: 60 }
    ],
    facts, sources: ["adc", "adcDe", "adcScore"]
  };
}

function scoreAdcChild(A) {
  const a = sum(Array.from({ length: 10 }, (_, i) => "pA" + (i + 1)), id => A[id]);
  const level = a >= 17 ? "mid" : "low";
  return {
    title: L("Motorik und Koordination (ADC, Kindheitsteil)", "Motor skills and coordination (ADC, childhood part)"), level, score: a, max: 30, mark: 17,
    headline: a >= 17 ? L("Motorische Schwierigkeiten in der Kindheit", "Motor difficulties in childhood") : L("Keine auffälligen motorischen Schwierigkeiten in der Kindheit", "No notable motor difficulties in childhood"),
    text: a >= 17
      ? L("Dein Wert liegt über dem Richtwert von 17. Der vollständige Dyspraxie-Test zeigt dir, ob diese Schwierigkeiten bis heute anhalten.",
          "Your score is above the reference value of 17. The full dyspraxia test shows whether these difficulties continue today.")
      : L("Dyspraxie beginnt in der Kindheit. Ein unauffälliger Kindheitswert macht sie unwahrscheinlich.",
          "Dyspraxia begins in childhood. An unremarkable childhood score makes it unlikely."),
    facts: [L("Richtwert Kindheit: 17 von 30 (Kirby et al., 2010)", "Childhood reference value: 17 of 30 (Kirby et al., 2010)")],
    sources: ["adc"], next: a >= 17 ? "dcd" : null
  };
}

function scoreTics(A, brief) {
  const m = picked(A, "tm").filter(i => i >= 0).length;
  const v = picked(A, "tv").filter(i => i >= 0).length;
  const longer = A.td === 0;
  const early = A.to === 0;
  const facts = [L("Motorische Tics: " + m + " · Vokale Tics: " + v, "Motor tics: " + m + " · Vocal tics: " + v)];
  let level = "low", headline = L("Keine Hinweise auf eine Tic-Störung", "No signs of a tic disorder"), text;
  if (m + v === 0) {
    text = L("Du hast keine unwillkürlichen Bewegungen oder Laute angegeben.", "You did not report any involuntary movements or sounds.");
  } else if (!longer) {
    level = "mid"; headline = L("Einzelne Tics, aber (noch) kein anhaltendes Muster", "Some tics, but no persistent pattern (yet)");
    text = L("Vorübergehende Tics sind häufig und oft harmlos, besonders bei Stress oder Müdigkeit. Wenn sie länger als ein Jahr bestehen oder dich belasten, lohnt sich eine Abklärung.",
             "Temporary tics are common and often harmless, especially with stress or tiredness. If they last longer than a year or bother you, an assessment is worthwhile.");
  } else if (m >= 2 && v >= 1 && !brief && early) {
    level = "high"; headline = L("Das Muster passt zu den Kriterien eines Tourette-Syndroms", "The pattern fits the criteria for Tourette syndrome");
    text = L("Mehrere motorische und mindestens ein vokaler Tic über mehr als ein Jahr mit Beginn vor dem 18. Lebensjahr entsprechen dem Kriterienmuster nach DSM-5. Ob es tatsächlich Tics sind, kann nur eine neurologische oder psychiatrische Fachperson beurteilen.",
             "Several motor tics and at least one vocal tic for more than a year, starting before age 18, match the DSM-5 criteria pattern. Only a neurologist or psychiatrist can judge whether these really are tics.");
  } else {
    level = "high"; headline = L("Das Muster passt zu einer anhaltenden Tic-Störung", "The pattern fits a persistent tic disorder");
    text = L("Tics, die länger als ein Jahr bestehen, gelten als chronisch. Eine neurologische oder psychiatrische Abklärung kann klären, was dahintersteckt und ob Unterstützung sinnvoll ist.",
             "Tics lasting longer than a year are considered chronic. A neurological or psychiatric assessment can clarify what lies behind them and whether support makes sense.");
  }
  if (!brief && A.tf !== undefined && m + v > 0) {
    const sev = Math.max(A.tf, 1) + Math.max(A.ti, 1);
    facts.push(L("Ausprägung (Häufigkeit + Stärke): " + sev + " von 7", "Severity (frequency + intensity): " + sev + " of 7"));
  }
  if (!brief && A.to === 1 && m + v > 0) facts.push(L(
    "Tics, die erst im Erwachsenenalter beginnen, sollten neurologisch abgeklärt werden, da sie andere Ursachen haben können.",
    "Tics that only begin in adulthood should be assessed by a neurologist, as they can have other causes."));
  facts.push(L("Für Tic-Fragebögen gibt es keine validierte Diagnoseschwelle; die Einordnung folgt den DSM-5-Kriterien.",
               "There is no validated diagnostic threshold for tic questionnaires; the classification follows the DSM-5 criteria."));
  return {
    title: L("Tics", "Tics"), level, headline, text, facts, sources: ["atq"],
    next: brief && level !== "low" ? "tic" : null
  };
}

function scorePhq4(A) {
  const dep = A.m1 + A.m2, anx = A.m3 + A.m4, s = dep + anx;
  const level = dep >= 3 || anx >= 3 ? "high" : s >= 3 ? "mid" : "low";
  const parts = [];
  if (dep >= 3) parts.push(L("gedrückte Stimmung", "low mood"));
  if (anx >= 3) parts.push(L("Angst und Anspannung", "anxiety and tension"));
  return {
    title: L("Stimmung und Anspannung (PHQ-4)", "Mood and tension (PHQ-4)"), level, score: s, max: 12, mark: 6,
    headline: parts.length ? L("Erhöhte Belastung: ", "Increased strain: ") + parts.join(L(" sowie ", " and "))
      : level === "mid" ? L("Leichte Belastung", "Mild strain") : L("Keine erhöhte Belastung", "No increased strain"),
    text: L("Depressive Verstimmung und Angst können Konzentration, Antrieb und sozialen Rückzug stark beeinflussen – und so Ergebnisse in anderen Bereichen erhöhen. Sie treten auch häufig gemeinsam mit Neurodivergenz auf. Deshalb gehört dieser Kurztest zur Einordnung dazu.",
            "Low mood and anxiety can strongly affect concentration, drive and social withdrawal – and so raise results in other areas. They also often occur together with neurodivergence. That is why this short test is part of the picture."),
    bars: [
      { label: L("Stimmung (Schwelle 3)", "Mood (threshold 3)"), score: dep, max: 6 },
      { label: L("Angst und Anspannung (Schwelle 3)", "Anxiety and tension (threshold 3)"), score: anx, max: 6 }
    ],
    facts: [L("Schwelle je Teilskala: 3 von 6 (Kroenke et al., 2009; Löwe et al., 2010)", "Threshold per subscale: 3 of 6 (Kroenke et al., 2009; Löwe et al., 2010)")],
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
