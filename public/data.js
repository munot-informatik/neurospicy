/* ============================================================
   Fragenkatalog, Skalen, Quellen
   Die Auswertungsregeln (Punktwerte, Schwellen) folgen den
   jeweils zitierten Originalarbeiten. Die deutschen Formulierungen
   sind eigene, inhaltsnahe Übertragungen – keine offiziellen
   lizenzierten Übersetzungen.
   ============================================================ */

const SCALES = {
  // ASRS: 0–4
  freq5: ["Nie", "Selten", "Manchmal", "Oft", "Sehr oft"],
  // AQ-10: Index 0–1 = Zustimmung, 2–3 = Ablehnung
  agree4: ["Stimme voll zu", "Stimme eher zu", "Stimme eher nicht zu", "Stimme gar nicht zu"],
  // RAADS-14: Index 0→3 Punkte, 1→2, 2→1, 3→0
  raads: [
    "Trifft jetzt zu und traf zu, als ich jung war",
    "Trifft nur jetzt zu",
    "Traf nur zu, als ich jünger als 16 war",
    "Traf nie zu"
  ],
  // CAT-Q: 1–7
  agree7: [
    "Stimme überhaupt nicht zu", "Stimme nicht zu", "Stimme eher nicht zu",
    "Weder noch", "Stimme eher zu", "Stimme zu", "Stimme voll und ganz zu"
  ],
  // Dyslexie-Checkliste: Gewicht × (Index + 1)
  dysFreq: ["Selten", "Gelegentlich", "Oft", "Meistens"],
  dysEase: ["Leicht", "Herausfordernd", "Schwierig", "Sehr schwierig"],
  // ADC: 0–3
  adc: ["Nie", "Manchmal", "Häufig", "Immer"],
  // PHQ-4: 0–3
  phq: ["Überhaupt nicht", "An einzelnen Tagen", "An mehr als der Hälfte der Tage", "Beinahe jeden Tag"]
};

const F6 = "Bezogen auf die letzten 6 Monate";
const FNOW = "Bezogen auf dich im Allgemeinen";
const FKID = "Bezogen auf deine Kindheit";
const FCUR = "Bezogen auf heute";
const F2W = "Bezogen auf die letzten 2 Wochen";
const F1W = "Bezogen auf die letzte Woche";

const Q = {};
function add(id, text, frame, scale, extra) {
  Q[id] = Object.assign({ id, text, frame, scale, type: "single" }, extra || {});
}

/* ---------- ADHS: ASRS v1.1 (1–18) + Zusatzitems ASRS-5 (19–20) ---------- */
[
  "Wie oft fällt es dir schwer, die letzten Feinheiten eines Projekts abzuschliessen, wenn die anspruchsvollen Teile schon erledigt sind?",
  "Wie oft hast du Mühe, Ordnung in eine Aufgabe zu bringen, die Organisation erfordert?",
  "Wie oft vergisst du Termine oder Verpflichtungen?",
  "Wie oft vermeidest oder verschiebst du den Beginn einer Aufgabe, die viel Nachdenken verlangt?",
  "Wie oft zappelst du mit Händen oder Füssen oder rutschst herum, wenn du lange sitzen musst?",
  "Wie oft fühlst du dich übermässig aktiv und zum Handeln gedrängt – wie von einem Motor angetrieben?",
  "Wie oft unterlaufen dir Flüchtigkeitsfehler, wenn du an etwas Langweiligem oder Schwierigem arbeitest?",
  "Wie oft fällt es dir schwer, bei langweiligen oder sich wiederholenden Arbeiten aufmerksam zu bleiben?",
  "Wie oft fällt es dir schwer, dich auf das zu konzentrieren, was jemand sagt – selbst wenn die Person direkt mit dir spricht?",
  "Wie oft verlegst du Dinge oder hast Mühe, sie zu Hause oder bei der Arbeit wiederzufinden?",
  "Wie oft lässt du dich von Geräuschen oder Aktivitäten um dich herum ablenken?",
  "Wie oft stehst du in Besprechungen oder ähnlichen Situationen auf, in denen erwartet wird, dass man sitzen bleibt?",
  "Wie oft fühlst du dich unruhig oder zappelig?",
  "Wie oft fällt es dir schwer, abzuschalten und dich zu entspannen, wenn du Zeit für dich hast?",
  "Wie oft merkst du, dass du in geselliger Runde zu viel redest?",
  "Wie oft beendest du im Gespräch die Sätze anderer, bevor sie selbst ausreden können?",
  "Wie oft fällt es dir schwer zu warten, bis du an der Reihe bist?",
  "Wie oft unterbrichst du andere, wenn sie gerade beschäftigt sind?",
  "Wie oft schiebst du Dinge bis zur letzten Minute auf?",
  "Wie oft bist du auf andere angewiesen, damit dein Alltag geordnet bleibt und Details nicht untergehen?"
].forEach((t, i) => add("a" + (i + 1), t, F6, "freq5"));

/* ---------- Autismus: AQ-10 ---------- */
[
  "Ich bemerke oft leise Geräusche, die anderen nicht auffallen.",
  "Ich achte meist mehr auf das grosse Ganze als auf kleine Details.",
  "Es fällt mir leicht, mehrere Dinge gleichzeitig zu tun.",
  "Nach einer Unterbrechung finde ich sehr schnell zu dem zurück, was ich gerade getan habe.",
  "Es fällt mir leicht, «zwischen den Zeilen zu lesen», wenn jemand mit mir spricht.",
  "Ich merke, wenn jemand, der mir zuhört, sich zu langweilen beginnt.",
  "Wenn ich eine Geschichte lese, fällt es mir schwer, die Absichten der Figuren zu erkennen.",
  "Ich sammle gern Informationen über Kategorien von Dingen (z. B. Autotypen, Vogelarten, Zugtypen, Pflanzenarten).",
  "Ich erkenne leicht am Gesicht einer Person, was sie denkt oder fühlt.",
  "Es fällt mir schwer, die Absichten anderer Menschen zu erkennen."
].forEach((t, i) => add("q" + (i + 1), t, FNOW, "agree4"));

/* ---------- Autismus: RAADS-14 Screen ---------- */
[
  "Im Gespräch fällt es mir schwer zu verstehen, wie sich andere Menschen fühlen.",
  "Manche gewöhnlichen Materialien, die andere nicht stören, fühlen sich auf meiner Haut sehr unangenehm an.",
  "Es fällt mir sehr schwer, in Gruppen zu arbeiten und zurechtzukommen.",
  "Es ist schwierig für mich herauszufinden, was andere von mir erwarten.",
  "Ich weiss oft nicht, wie ich mich in sozialen Situationen verhalten soll.",
  "Ich kann mit Menschen plaudern und Small Talk führen.",
  "Wenn mich Sinneseindrücke überfordern, muss ich mich zurückziehen, um sie auszublenden.",
  "Wie man Freundschaften schliesst und Kontakte pflegt, ist mir ein Rätsel.",
  "Im Gespräch fällt es mir schwer zu erkennen, wann ich reden und wann ich zuhören soll.",
  "Manchmal muss ich mir die Ohren zuhalten, um schmerzhafte Geräusche abzuschirmen (z. B. Staubsauger oder zu lautes Reden).",
  "Es kann sehr schwer sein, im Gespräch Gesicht, Hand- und Körperbewegungen des Gegenübers zu deuten.",
  "Ich konzentriere mich eher auf Details als auf die Gesamtidee.",
  "Ich nehme Dinge zu wörtlich und verpasse deshalb oft, was andere eigentlich sagen wollen.",
  "Es bringt mich extrem aus der Fassung, wenn die Art, wie ich Dinge gern tue, plötzlich geändert wird."
].forEach((t, i) => add("r" + (i + 1), t, "Bezogen auf heute und deine Kindheit/Jugend", "raads"));

/* ---------- Masking: CAT-Q (25 Items) ---------- */
// sub: C = Kompensation, M = Maskieren, A = Assimilation; rev = umgekehrt gepolt
const CATQ = [
  ["C", 0, "Wenn ich mit jemandem zu tun habe, ahme ich bewusst dessen Körpersprache oder Gesichtsausdruck nach."],
  ["C", 0, "Wie Menschen Körper und Gesicht im Umgang einsetzen, lerne ich aus Filmen, Serien oder Büchern."],
  ["C", 0, "Ich habe versucht, mein Verständnis sozialer Fähigkeiten zu verbessern, indem ich andere beobachte."],
  ["C", 0, "Ich wiederhole Formulierungen, die ich von anderen gehört habe, genau so, wie ich sie zuerst gehört habe."],
  ["C", 0, "Ich übe meine Mimik und Körpersprache, damit sie natürlich wirken."],
  ["C", 0, "Ich habe Zeit damit verbracht, soziale Fähigkeiten aus Serien und Filmen zu lernen, und versuche, sie anzuwenden."],
  ["C", 0, "In meinen eigenen Begegnungen verwende ich Verhaltensweisen, die ich bei anderen abgeschaut habe."],
  ["C", 0, "Ich habe mich gezielt über die Regeln des sozialen Miteinanders informiert (z. B. über Psychologie oder Bücher), um meine sozialen Fähigkeiten zu verbessern."],
  ["C", 0, "Ich habe mir ein Skript für soziale Situationen zurechtgelegt (z. B. eine Liste von Fragen oder Gesprächsthemen)."],
  ["M", 0, "Ich kontrolliere meine Körpersprache oder Mimik, damit ich entspannt wirke."],
  ["M", 0, "Ich passe meine Körpersprache oder Mimik an, damit ich entspannt wirke."],
  ["M", 0, "Ich kontrolliere meine Körpersprache oder Mimik, damit ich an meinem Gegenüber interessiert wirke."],
  ["M", 0, "Ich passe meine Körpersprache oder Mimik an, damit ich an meinem Gegenüber interessiert wirke."],
  ["M", 1, "Ich habe nicht das Bedürfnis, Blickkontakt zu halten, wenn ich es nicht möchte."],
  ["M", 1, "Im Umgang mit anderen achte ich nicht darauf, was mein Gesicht oder mein Körper gerade tun."],
  ["M", 0, "Ich denke ständig darüber nach, welchen Eindruck ich auf andere mache."],
  ["M", 0, "Mir ist ständig bewusst, welchen Eindruck ich auf andere mache."],
  ["A", 1, "Ich habe selten das Bedürfnis, eine Rolle zu spielen, um eine soziale Situation zu überstehen."],
  ["A", 1, "Wenn ich mit anderen rede, habe ich das Gefühl, dass das Gespräch ganz natürlich fliesst."],
  ["A", 0, "In sozialen Situationen suche ich nach Wegen, den Kontakt mit anderen zu vermeiden."],
  ["A", 0, "In sozialen Situationen habe ich das Gefühl, eher etwas «aufzuführen», als ich selbst zu sein."],
  ["A", 0, "In sozialen Situationen muss ich mich zwingen, auf Menschen zuzugehen."],
  ["A", 0, "In sozialen Situationen habe ich das Gefühl, nur so zu tun, als wäre ich «normal»."],
  ["A", 0, "Ich brauche die Unterstützung anderer Menschen, um unter Leute zu gehen."],
  ["A", 1, "Ich fühle mich frei, ich selbst zu sein, wenn ich mit anderen zusammen bin."]
];
CATQ.forEach((c, i) => add("c" + (i + 1), c[2], FNOW, "agree7", { sub: c[0], rev: !!c[1] }));

/* ---------- Dyslexie: Adult Dyslexia Checklist (15 Items, gewichtet) ---------- */
[
  [3, "dysFreq", "Wie oft verwechselst du ähnlich aussehende Wörter (z. B. «Hand» und «Hund»)?"],
  [2, "dysFreq", "Wie oft verlierst du beim Lesen die Zeile oder überspringst Zeilen?"],
  [1, "dysFreq", "Wie oft verwechselst du die Namen von Gegenständen (sagst z. B. «Tisch» statt «Stuhl»)?"],
  [1, "dysFreq", "Wie oft hast du Mühe, links und rechts zu unterscheiden?"],
  [1, "dysFreq", "Wie oft verwirrt dich das Kartenlesen oder die Orientierung an einem fremden Ort?"],
  [1, "dysFreq", "Wie oft musst du Absätze mehrmals lesen, um sie zu verstehen?"],
  [1, "dysFreq", "Wie oft kommst du durcheinander, wenn du mehrere Anweisungen auf einmal erhältst?"],
  [1, "dysFreq", "Wie oft machst du Fehler, wenn du telefonische Nachrichten notierst?"],
  [1, "dysFreq", "Wie oft fällt es dir schwer, das richtige Wort zu finden?"],
  [1, "dysFreq", "Wie oft fallen dir kreative Lösungen für Probleme ein?"],
  [3, "dysEase", "Wie leicht fällt es dir, lange Wörter in Silben auszusprechen (z. B. E-le-fant)?"],
  [2, "dysEase", "Wie leicht fällt es dir, beim Schreiben deine Gedanken zu Papier zu bringen und zu ordnen?"],
  [2, "dysEase", "Wie leicht fiel es dir, das Einmaleins zu lernen?"],
  [1, "dysEase", "Wie leicht fällt es dir, das Alphabet aufzusagen?"],
  [1, "dysEase", "Wie leicht fällt es dir, laut vorzulesen?"]
].forEach((d, i) => add("d" + (i + 1), d[2], FNOW, d[1], { w: d[0] }));

/* ---------- Dyspraxie/DCD: ADC (40 Items) ---------- */
[
  "Hattest du als Kind Mühe mit Dingen wie Schuhe binden, Knöpfe oder Reissverschlüsse schliessen?",
  "Hattest du als Kind Mühe, zu essen, ohne dich zu bekleckern?",
  "Hattest du als Kind – verglichen mit Gleichaltrigen – Mühe, Velofahren zu lernen?",
  "Hattest du als Kind Mühe bei Mannschaftsspielen wie Fussball oder beim genauen Fangen und Werfen von Bällen?",
  "Hattest du als Kind Mühe, so ordentlich zu schreiben, dass andere es lesen konnten?",
  "Hattest du als Kind Mühe, so schnell zu schreiben wie Gleichaltrige?",
  "Bist du als Kind häufiger als andere an Dinge oder Menschen gestossen oder über etwas gestolpert?",
  "Hattest du als Kind Mühe, ein Musikinstrument zu spielen (z. B. Geige oder Blockflöte)?",
  "Hattest du als Kind Mühe, deine Sachen im Zimmer zu ordnen oder wiederzufinden?",
  "Haben andere in deiner Kindheit deine Koordination bemängelt oder dich ungeschickt genannt?"
].forEach((t, i) => add("pA" + (i + 1), t, FKID, "adc"));
[
  "Hast du Schwierigkeiten bei der Körperpflege, etwa beim Rasieren oder Schminken?",
  "Hast du Schwierigkeiten beim Essen mit Messer und Gabel oder Löffel?",
  "Hast du Schwierigkeiten mit Hobbys, die gute Koordination verlangen?",
  "Hast du Schwierigkeiten, leserlich zu schreiben, wenn es schnell gehen muss?",
  "Hast du Schwierigkeiten, so schnell zu schreiben wie andere?",
  "Hast du Schwierigkeiten, deine eigene Handschrift zu lesen?",
  "Hast du Schwierigkeiten, etwas fehlerfrei abzuschreiben?",
  "Hast du Schwierigkeiten, deine Sachen im Zimmer zu ordnen oder wiederzufinden?",
  "Hast du Schwierigkeiten, dich in neuen Gebäuden oder an neuen Orten zurechtzufinden?",
  "Haben andere dich schon als unorganisiert bezeichnet?"
].forEach((t, i) => add("pB" + (i + 1), t, FCUR, "adc"));
[
  "Fällt es dir schwer, still zu sitzen, oder wirkst du zappelig?",
  "Verlierst du Dinge oder lässt du sie irgendwo liegen?",
  "Stösst du an Dinge, verschüttest etwas oder machst Sachen kaputt?",
  "Brauchst du morgens länger als andere, um aufzustehen und zur Arbeit oder Ausbildung zu kommen?",
  "Hast du länger gebraucht als andere, um Autofahren zu lernen? (Falls du nie gefahren bist: «Nie»)",
  "Fällt es anderen schwer, deine Handschrift zu lesen?",
  "Vermeidest du Hobbys, die gute Koordination verlangen?",
  "Verbringst du deine Freizeit eher allein als mit anderen?",
  "Vermeidest du Mannschaftsspiele oder Mannschaftssport?",
  "Wenn du Sport treibst: eher allein (z. B. im Fitnessstudio) als mit anderen?",
  "Hast du es – als Teenager, in deinen Zwanzigern oder heute – eher vermieden, in Clubs oder tanzen zu gehen?",
  "Hast du Schwierigkeiten beim Parkieren eines Autos? (Falls du nicht fährst: «Nie»)",
  "Fällt es dir schwer, eine Mahlzeit von Grund auf zuzubereiten?",
  "Fällt es dir schwer, einen Koffer für eine Reise zu packen?",
  "Fällt es dir schwer, Kleider ordentlich zusammenzulegen und zu versorgen?",
  "Fällt es dir schwer, mit Geld umzugehen und es einzuteilen?",
  "Fällt es dir schwer, zwei Dinge gleichzeitig zu tun (z. B. Auto fahren und zuhören)?",
  "Fällt es dir schwer, Distanzen einzuschätzen (z. B. beim Parkieren oder beim Durchgehen zwischen Gegenständen)?",
  "Fällt es dir schwer, vorauszuplanen?",
  "Hast du das Gefühl, in verschiedenen Situationen die Aufmerksamkeit zu verlieren?"
].forEach((t, i) => add("pC" + (i + 1), t, FCUR, "adc"));

/* ---------- Stimmung & Angst: PHQ-4 ---------- */
[
  "Wie oft hast du dich durch wenig Interesse oder Freude an deinen Tätigkeiten beeinträchtigt gefühlt?",
  "Wie oft hast du dich durch Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit beeinträchtigt gefühlt?",
  "Wie oft hast du dich durch Nervosität, Ängstlichkeit oder Anspannung beeinträchtigt gefühlt?",
  "Wie oft warst du nicht in der Lage, Sorgen zu stoppen oder zu kontrollieren?"
].forEach((t, i) => add("m" + (i + 1), t, F2W, "phq"));

/* ---------- Tics: Liste nach dem Adult Tic Questionnaire (Mehrfachauswahl) ---------- */
Q.tm = {
  id: "tm", type: "multi", frame: F1W,
  text: "Welche dieser unwillkürlichen Bewegungen hast du bei dir bemerkt? (Mehrere Antworten möglich)",
  options: [
    "Augenblinzeln", "Augenrollen oder schnelle Blickbewegungen", "Ruckartige Kopfbewegungen",
    "Grimassieren", "Mund- oder Zungenbewegungen", "Schulterzucken",
    "Anspannen von Brust oder Bauch", "Anspannen im Beckenbereich", "Bein- oder Fussbewegungen",
    "Arm- oder Handbewegungen", "Unwillkürliches Nachahmen von Bewegungen anderer",
    "Unwillkürliche Gesten, die als unpassend gelten"
  ],
  none: "Nichts davon"
};
Q.tv = {
  id: "tv", type: "multi", frame: F1W,
  text: "Welche dieser unwillkürlichen Laute oder Äusserungen hast du bei dir bemerkt? (Mehrere Antworten möglich)",
  options: [
    "Grunzen oder Brummen", "Schniefen", "Schnauben", "Hüsteln oder Räuspern",
    "Tiergeräusche", "Einzelne Silben", "Einzelne Wörter", "Ganze Sätze oder Satzteile",
    "Unwillkürliches Wiederholen von Gehörtem", "Unwillkürliche Ausdrücke, die als unpassend gelten",
    "Blockieren oder Stocken beim Sprechen"
  ],
  none: "Nichts davon"
};
Q.tf = {
  id: "tf", type: "single", frame: F1W,
  text: "Wie häufig treten solche unwillkürlichen Bewegungen oder Laute bei dir insgesamt auf?",
  options: ["Gar nicht", "Ein paar Mal pro Woche oder seltener", "Täglich, mehrmals am Tag", "Etwa stündlich", "Fast ständig, beinahe den ganzen Tag"]
};
Q.ti = {
  id: "ti", type: "single", frame: F1W,
  text: "Wie stark sind diese unwillkürlichen Bewegungen oder Laute?",
  options: ["Ich habe keine", "Sehr leicht – andere bemerken sie kaum", "Für andere deutlich bemerkbar", "Heftig, sehr auffällig oder manchmal schmerzhaft"]
};
Q.td = {
  id: "td", type: "single", frame: "Bezogen auf dein bisheriges Leben",
  text: "Bestehen unwillkürliche Bewegungen oder Laute bei dir – mit Unterbrüchen – schon länger als ein Jahr?",
  options: ["Ja", "Nein, kürzer", "Ich bin nicht sicher", "Ich habe keine"]
};
Q.to = {
  id: "to", type: "single", frame: "Bezogen auf dein bisheriges Leben",
  text: "Haben unwillkürliche Bewegungen oder Laute bei dir vor dem 18. Lebensjahr begonnen?",
  options: ["Ja", "Nein, später", "Ich bin nicht sicher", "Ich habe keine"]
};

/* ---------- Kontextfragen (fliessen in die Einordnung ein, nicht in die Punktwerte) ---------- */
Q.xOnset = {
  id: "xOnset", type: "single", frame: "Bezogen auf dein bisheriges Leben",
  text: "Seit wann kennst du die Schwierigkeiten, die dich zu diesem Test geführt haben?",
  options: ["Schon als Kind (vor etwa 12 Jahren)", "Seit der Jugend", "Erst seit dem Erwachsenenalter", "Erst seit Kurzem (Wochen oder Monate)", "Ich bin nicht sicher"]
};
Q.xAreas = {
  id: "xAreas", type: "multi", frame: FCUR,
  text: "In welchen Lebensbereichen fühlst du dich durch diese Schwierigkeiten spürbar eingeschränkt? (Mehrere Antworten möglich)",
  options: ["Arbeit, Studium oder Ausbildung", "Partnerschaft oder Familie", "Freundschaften und soziale Kontakte", "Haushalt und Alltagsorganisation", "Finanzen und Administratives", "Schlaf und Gesundheit", "Freizeit und Erholung"],
  none: "In keinem Bereich"
};

/* ---------- Quellen (an den Originaldokumenten geprüft) ---------- */
const SOURCES = {
  asrs: {
    short: "Kessler et al., 2005",
    label: "Kessler RC, Adler L, Ames M, et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine, 35(2), 245–256.",
    url: "https://doi.org/10.1017/S0033291704002892"
  },
  asrsDe: {
    short: "ASRS v1.1, deutsche Fassung",
    label: "ASRS v1.1 Symptom-Checkliste, offizielle deutsche Übersetzung im Auftrag der WHO (© New York University und R. C. Kessler).",
    url: "https://adhdinadults.com/wp-content/uploads/2024/02/18Q_German_final.pdf"
  },
  asrs5: {
    short: "Ustun et al., 2017",
    label: "Ustun B, Adler LA, Rudin C, et al. (2017). The World Health Organization Adult Attention-Deficit/Hyperactivity Disorder Self-Report Screening Scale for DSM-5. JAMA Psychiatry, 74(5), 520–526.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5470397/"
  },
  asrs5De: {
    short: "Ballmann et al., 2022",
    label: "Ballmann C, Kölle MA, Bekavac-Günther I, et al. (2022). Evaluation of the German Version of the Adult ADHD Self-Report Screening Scale for DSM-5 as a Screening Tool for Adult ADHD in Primary Care. Frontiers in Psychology, 13, 858147.",
    url: "https://doi.org/10.3389/fpsyg.2022.858147"
  },
  aq10: {
    short: "Allison et al., 2012",
    label: "Allison C, Auyeung B, Baron-Cohen S (2012). Toward brief «Red Flags» for autism screening: the short Autism Spectrum Quotient and the short Quantitative Checklist in 1,000 cases and 3,000 controls. Journal of the American Academy of Child & Adolescent Psychiatry, 51(2), 202–212.",
    url: "https://docs.autismresearchcentre.com/papers/2012_Allisonetal_JAACAP_RedFlags.pdf"
  },
  aq10Form: {
    short: "AQ-10, Originalbogen",
    label: "AQ-10 (Adult) – Originalbogen mit Auswertungsregel, Autism Research Centre, University of Cambridge; empfohlen in der NICE-Leitlinie CG142.",
    url: "https://bhh.psychiatry.ufl.edu/wordpress/files/2024/03/AQ10-Adult.pdf"
  },
  aq10cut: {
    short: "AQ-10-Schwelle, 2025",
    label: "The importance of using an optimal cutoff value for the 10-item Autism-Spectrum Quotient (AQ10) (2025). PubMed-ID 39964454.",
    url: "https://pubmed.ncbi.nlm.nih.gov/39964454/"
  },
  raads14: {
    short: "Eriksson et al., 2013",
    label: "Eriksson JM, Andersen LMJ, Bejerot S (2013). RAADS-14 Screen: validity of a screening tool for autism spectrum disorder in an adult psychiatric population. Molecular Autism, 4, 49.",
    url: "https://doi.org/10.1186/2040-2392-4-49"
  },
  catq: {
    short: "Hull et al., 2019",
    label: "Hull L, Mandy W, Lai M-C, et al. (2019). Development and Validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q). Journal of Autism and Developmental Disorders, 49(3), 819–833.",
    url: "https://doi.org/10.1007/s10803-018-3792-6"
  },
  dys: {
    short: "Smythe & Everatt, 2001",
    label: "Smythe I, Everatt J (2001). Adult Dyslexia Checklist. British Dyslexia Association – Originalbogen mit Punktwerten.",
    url: "https://www.staffs.ac.uk/students/docs/pdf/access-ability/adult-checklist.pdf"
  },
  dysVal: {
    short: "Stark et al., 2025",
    label: "Stark Z, Johnson A, et al. (2025). Validation and Reliability of the Dyslexia Adult Checklist in Screening for Dyslexia. Dyslexia.",
    url: "https://doi.org/10.1002/dys.1797"
  },
  adc: {
    short: "Kirby et al., 2010",
    label: "Kirby A, Edwards L, Sugden D, Rosenblum S (2010). The development and standardization of the Adult Developmental Co-ordination Disorders/Dyspraxia Checklist (ADC). Research in Developmental Disabilities, 31(1), 131–139.",
    url: "https://pure.southwales.ac.uk/en/publications/the-development-and-standardization-of-the-adult-developmental-co/"
  },
  adcForm: {
    short: "ADC, Originalbogen",
    label: "ADC – Originalbogen mit allen 40 Fragen (University of Haifa, CHAP Lab).",
    url: "https://chap.haifa.ac.il/wp-content/uploads/2023/09/ADC_NewEnglish.pdf"
  },
  adcDe: {
    short: "Meachon et al., 2022",
    label: "Meachon EJ, Beitz C, Zemp M, Wilmut K, Alpers GW (2022). The adult developmental coordination disorders/dyspraxia checklist – German: Adapted factor structure for the differentiation of DCD and ADHD. Research in Developmental Disabilities, 126, 104254.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0891422222000841"
  },
  adcScore: {
    short: "Saidmamatov et al., 2023",
    label: "Saidmamatov O, Jammatov J, Sousa C, et al. (2023). Translation and Adaptation of the Adult Developmental Coordination Disorder/Dyspraxia Checklist (ADC) into Asian Uzbekistan. Sports, 11(7), 135. (Beschreibt Wertung 0–3 und Schwellen 56/65.)",
    url: "https://doi.org/10.3390/sports11070135"
  },
  atq: {
    short: "Abramovitch et al., 2015",
    label: "Abramovitch A, Reese H, Woods DW, et al. (2015). Psychometric Properties of a Self-Report Instrument for the Assessment of Tic Severity in Adults With Tic Disorders. Behavior Therapy, 46(6), 786–796.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5716633/"
  },
  phq4: {
    short: "Kroenke et al., 2009",
    label: "Kroenke K, Spitzer RL, Williams JBW, Löwe B (2009). An ultra-brief screening scale for anxiety and depression: the PHQ-4. Psychosomatics, 50(6), 613–621.",
    url: "https://fis.uke.de/portal/en/publications/an-ultrabrief-screening-scale-for-anxiety-and-depression-the-phq4(3969b34b-29e4-403d-ba80-11112c46edcb).html"
  },
  phq4De: {
    short: "Löwe et al., 2010",
    label: "Löwe B, Wahl I, Rose M, et al. (2010). A 4-item measure of depression and anxiety: validation and standardization of the PHQ-4 in the general population (deutsche Normstichprobe). Journal of Affective Disorders, 122(1–2), 86–95.",
    url: "https://doi.org/10.1016/j.jad.2009.06.019"
  },
  n4: {
    short: "Apperly et al., 2024",
    label: "Apperly IA, Lee R, van der Kleij SW, Devine RT (2024). A transdiagnostic approach to neurodiversity in a representative population sample: The N+4 model. JCPP Advances, 4(2), e12219.",
    url: "https://doi.org/10.1002/jcv2.12219"
  }
};

const range = (p, n) => Array.from({ length: n }, (_, i) => p + (i + 1));

/* ---------- Tests ---------- */
const TESTS = [
  {
    id: "general", icon: "🧭", featured: true,
    sources: ["asrs","aq10","dys","adc","atq","phq4","phq4De","n4"],
    title: "Allgemeiner Orientierungstest",
    desc: "Du weisst nicht, wo du anfangen sollst? Dieser Test prüft mehrere Bereiche gleichzeitig und zeigt dir, wo sich ein genauerer Blick lohnt.",
    basis: "ASRS-Screener · AQ-10 · Dyslexie-Checkliste · ADC (Kindheit) · Tic-Liste · PHQ-4",
    questions: [].concat(range("a", 6), range("q", 10), range("d", 15), range("pA", 10), range("m", 4), ["tm", "tv", "td", "xOnset", "xAreas"])
  },
  {
    id: "adhd", icon: "⚡",
    sources: ["asrs","asrsDe","asrs5","asrs5De"],
    title: "ADHS",
    desc: "Aufmerksamkeit, innere Unruhe und Impulsivität im Erwachsenenalter.",
    basis: "ASRS v1.1 (WHO) · ASRS-5 (DSM-5)",
    questions: [].concat(range("a", 20), ["xOnset", "xAreas"])
  },
  {
    id: "asd", icon: "🧩",
    sources: ["aq10","aq10Form","aq10cut","raads14"],
    title: "Autismus-Spektrum",
    desc: "Soziale Wahrnehmung, Detailfokus, Routinen und Sinnesempfindlichkeit.",
    basis: "AQ-10 · RAADS-14 Screen",
    questions: [].concat(range("q", 10), range("r", 14), ["xAreas"])
  },
  {
    id: "mask", icon: "🎭",
    sources: ["catq"],
    title: "Masking & Anpassung",
    desc: "Wie stark du dich im sozialen Alltag verstellst oder anpasst – oft der Grund, warum Autismus lange unentdeckt bleibt.",
    basis: "CAT-Q",
    questions: range("c", 25)
  },
  {
    id: "dys", icon: "📖",
    sources: ["dys","dysVal"],
    title: "Dyslexie (Legasthenie)",
    desc: "Lesen, Schreiben, Wortfindung und Orientierung.",
    basis: "Adult Dyslexia Checklist",
    questions: range("d", 15)
  },
  {
    id: "dcd", icon: "🤸",
    sources: ["adc","adcForm","adcDe","adcScore"],
    title: "Dyspraxie (DCD)",
    desc: "Bewegungskoordination, Handschrift und Alltagsorganisation – früher und heute.",
    basis: "ADC",
    questions: [].concat(range("pA", 10), range("pB", 10), range("pC", 20))
  },
  {
    id: "tic", icon: "🌊",
    sources: ["atq"],
    title: "Tics & Tourette",
    desc: "Unwillkürliche Bewegungen und Laute, ihre Häufigkeit und Dauer.",
    basis: "Tic-Liste nach ATQ · DSM-5-Kriterien",
    questions: ["tm", "tv", "tf", "ti", "td", "to", "xAreas"]
  }
];
