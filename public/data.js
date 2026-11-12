/* ============================================================
   Fragenkatalog, Skalen, Quellen – zweisprachig (de/en)
   Die Auswertungsregeln (Punktwerte, Schwellen) folgen den
   jeweils zitierten Originalarbeiten. Die deutschen Formulierungen
   sind eigene, inhaltsnahe Übertragungen – keine offiziellen
   lizenzierten Übersetzungen. Die englischen folgen dem Wortlaut
   der Originalbögen; wo eine Frage nicht zur Antwortskala passte,
   ist sie als «How often …» formuliert.
   ============================================================ */

/* ---------- Sprache ---------- */
let LANG = (() => {
  try { const s = localStorage.getItem("lang"); if (s === "de" || s === "en") return s; } catch (e) {}
  return (navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en";
})();
const L = (de, en) => (LANG === "en" ? en : de);
// Text in der aktuellen Sprache: {de, en} → String; Strings und Listen bleiben unverändert
const tr = x => (x && typeof x === "object" && !Array.isArray(x) && "de" in x ? (LANG === "en" ? x.en : x.de) : x);
const bi = p => ({ de: p[0], en: p[1] });

const SCALES = {
  // ASRS: 0–4
  freq5: { de: ["Nie", "Selten", "Manchmal", "Oft", "Sehr oft"], en: ["Never", "Rarely", "Sometimes", "Often", "Very often"] },
  // AQ: Index 0–1 = Zustimmung, 2–3 = Ablehnung
  agree4: {
    de: ["Stimme voll zu", "Stimme eher zu", "Stimme eher nicht zu", "Stimme gar nicht zu"],
    en: ["Definitely agree", "Slightly agree", "Slightly disagree", "Definitely disagree"]
  },
  // RAADS: Index 0→3 Punkte, 1→2, 2→1, 3→0
  raads: {
    de: ["Trifft heute zu und traf auch früher zu", "Trifft nur heute zu", "Traf nur früher zu (vor 16)", "Traf nie zu"],
    en: ["True now and when I was young", "True only now", "True only when I was younger than 16", "Never true"]
  },
  // CAT-Q: 1–7
  agree7: {
    de: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Stimme eher nicht zu", "Weder noch", "Stimme eher zu", "Stimme zu", "Stimme voll und ganz zu"],
    en: ["Strongly disagree", "Disagree", "Somewhat disagree", "Neither agree nor disagree", "Somewhat agree", "Agree", "Strongly agree"]
  },
  // Dyslexie-Checkliste: Gewicht × (Index + 1)
  dysFreq: { de: ["Selten", "Gelegentlich", "Oft", "Meistens"], en: ["Rarely", "Occasionally", "Often", "Most of the time"] },
  dysEase: { de: ["Leicht", "Etwas schwierig", "Schwierig", "Sehr schwierig"], en: ["Easy", "Challenging", "Difficult", "Very difficult"] },
  // ADC: 0–3
  adc: { de: ["Nie", "Manchmal", "Häufig", "Immer"], en: ["Never", "Sometimes", "Frequently", "Always"] },
  // PHQ-4: 0–3
  phq: {
    de: ["Überhaupt nicht", "An einzelnen Tagen", "An mehr als der Hälfte der Tage", "Beinahe jeden Tag"],
    en: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  }
};

const F6 = { de: "Bezogen auf die letzten 6 Monate", en: "Over the past 6 months" };
const FNOW = { de: "Bezogen auf dich im Allgemeinen", en: "About you in general" };
const FKID = { de: "Bezogen auf deine Kindheit", en: "About your childhood" };
const FCUR = { de: "Bezogen auf heute", en: "About you today" };
const F2W = { de: "Bezogen auf die letzten 2 Wochen", en: "Over the past 2 weeks" };
const F1W = { de: "Bezogen auf die letzte Woche", en: "Over the past week" };
const FLIFE = { de: "Bezogen auf dein bisheriges Leben", en: "Over your life so far" };
const FRAADS = { de: "Bezogen auf heute und deine Kindheit/Jugend", en: "About you now and when you were young" };

const Q = {};
function add(id, text, frame, scale, extra) {
  Q[id] = Object.assign({ id, text, frame, scale, type: "single" }, extra || {});
}

/* ---------- ADHS: ASRS v1.1 (1–18) + Zusatzitems ASRS-5 (19–20) ---------- */
[
  ["Wie oft fällt es dir schwer, die letzten Feinheiten eines Projekts abzuschliessen, wenn die anspruchsvollen Teile schon erledigt sind?",
   "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?"],
  ["Wie oft hast du Mühe, Ordnung in eine Aufgabe zu bringen, die Organisation erfordert?",
   "How often do you have difficulty getting things in order when you have to do a task that requires organisation?"],
  ["Wie oft vergisst du Termine oder Verpflichtungen?",
   "How often do you have problems remembering appointments or obligations?"],
  ["Wie oft vermeidest oder verschiebst du den Beginn einer Aufgabe, die viel Nachdenken verlangt?",
   "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?"],
  ["Wie oft zappelst du mit Händen oder Füssen oder rutschst herum, wenn du lange sitzen musst?",
   "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?"],
  ["Wie oft fühlst du dich übermässig aktiv und zum Handeln gedrängt – wie von einem Motor angetrieben?",
   "How often do you feel overly active and compelled to do things, like you were driven by a motor?"],
  ["Wie oft unterlaufen dir Flüchtigkeitsfehler, wenn du an etwas Langweiligem oder Schwierigem arbeitest?",
   "How often do you make careless mistakes when you have to work on a boring or difficult project?"],
  ["Wie oft fällt es dir schwer, bei langweiligen oder sich wiederholenden Arbeiten aufmerksam zu bleiben?",
   "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?"],
  ["Wie oft fällt es dir schwer, dich auf das zu konzentrieren, was jemand sagt – selbst wenn die Person direkt mit dir spricht?",
   "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?"],
  ["Wie oft verlegst du Dinge oder hast Mühe, sie zu Hause oder bei der Arbeit wiederzufinden?",
   "How often do you misplace or have difficulty finding things at home or at work?"],
  ["Wie oft lässt du dich von Geräuschen oder Aktivitäten um dich herum ablenken?",
   "How often are you distracted by activity or noise around you?"],
  ["Wie oft stehst du in Besprechungen oder ähnlichen Situationen auf, in denen erwartet wird, dass man sitzen bleibt?",
   "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?"],
  ["Wie oft fühlst du dich innerlich unruhig oder rastlos?",
   "How often do you feel restless or fidgety?"],
  ["Wie oft fällt es dir schwer, abzuschalten und dich zu entspannen, wenn du Zeit für dich hast?",
   "How often do you have difficulty unwinding and relaxing when you have time to yourself?"],
  ["Wie oft merkst du, dass du in geselliger Runde zu viel redest?",
   "How often do you find yourself talking too much when you are in social situations?"],
  ["Wie oft beendest du im Gespräch die Sätze anderer, bevor sie selbst ausreden können?",
   "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?"],
  ["Wie oft fällt es dir schwer zu warten, bis du an der Reihe bist?",
   "How often do you have difficulty waiting your turn in situations when turn taking is required?"],
  ["Wie oft unterbrichst du andere, wenn sie gerade beschäftigt sind?",
   "How often do you interrupt others when they are busy?"],
  ["Wie oft schiebst du Dinge bis zur letzten Minute auf?",
   "How often do you put things off until the last minute?"],
  ["Wie oft bist du auf andere angewiesen, damit dein Alltag geordnet bleibt und Details nicht untergehen?",
   "How often do you depend on others to keep your life in order and attend to details?"]
].forEach((t, i) => add("a" + (i + 1), bi(t), F6, "freq5"));

/* ---------- Autismus: AQ-10 ---------- */
[
  ["Ich bemerke oft leise Geräusche, die anderen nicht auffallen.", "I often notice small sounds when others do not."],
  ["Ich achte meist mehr auf das grosse Ganze als auf kleine Details.", "I usually concentrate more on the whole picture, rather than the small details."],
  ["Es fällt mir leicht, mehrere Dinge gleichzeitig zu tun.", "I find it easy to do more than one thing at once."],
  ["Nach einer Unterbrechung finde ich sehr schnell zu dem zurück, was ich gerade getan habe.", "If there is an interruption, I can switch back to what I was doing very quickly."],
  ["Es fällt mir leicht, «zwischen den Zeilen zu lesen», wenn jemand mit mir spricht.", "I find it easy to “read between the lines” when someone is talking to me."],
  ["Ich merke, wenn jemand, der mir zuhört, sich zu langweilen beginnt.", "I know how to tell if someone listening to me is getting bored."],
  ["Wenn ich eine Geschichte lese, fällt es mir schwer, die Absichten der Figuren zu erkennen.", "When I'm reading a story, I find it difficult to work out the characters' intentions."],
  ["Ich sammle gern Informationen über Kategorien von Dingen (z. B. Autotypen, Vogelarten, Zugtypen, Pflanzenarten).", "I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant)."],
  ["Ich erkenne leicht am Gesicht einer Person, was sie denkt oder fühlt.", "I find it easy to work out what someone is thinking or feeling just by looking at their face."],
  ["Es fällt mir schwer, die Absichten anderer Menschen zu erkennen.", "I find it difficult to work out people's intentions."]
].forEach((t, i) => add("q" + (i + 1), bi(t), FNOW, "agree4"));

/* ---------- Autismus: RAADS-14 Screen ---------- */
[
  ["Im Gespräch fällt es mir schwer zu verstehen, wie sich andere Menschen fühlen.", "It is difficult for me to understand how other people are feeling when we are talking."],
  ["Manche alltäglichen Stoffe oder Oberflächen, die andere nicht stören, fühlen sich auf meiner Haut sehr unangenehm an.", "Some ordinary textures that do not bother others feel very offensive when they touch my skin."],
  ["Es fällt mir sehr schwer, in Gruppen zu arbeiten und zurechtzukommen.", "It is very difficult for me to work and function in groups."],
  ["Es ist schwierig für mich herauszufinden, was andere von mir erwarten.", "It is difficult to figure out what other people expect of me."],
  ["Ich weiss oft nicht, wie ich mich in sozialen Situationen verhalten soll.", "I often don't know how to act in social situations."],
  ["Ich kann mit Menschen plaudern und Small Talk führen.", "I can chat and make small talk with people."],
  ["Wenn mich Sinneseindrücke überfordern, muss ich mich zurückziehen, um sie auszublenden.", "When I feel overwhelmed by my senses, I have to isolate myself to shut them down."],
  ["Wie man Freundschaften schliesst und Kontakte pflegt, ist mir ein Rätsel.", "How to make friends and socialise is a mystery to me."],
  ["Im Gespräch fällt es mir schwer zu erkennen, wann ich reden und wann ich zuhören soll.", "When talking to someone, I have a hard time telling when it is my turn to talk or to listen."],
  ["Manchmal muss ich mir die Ohren zuhalten, um schmerzhafte Geräusche abzuschirmen (z. B. Staubsauger oder zu lautes Reden).", "Sometimes I have to cover my ears to block out painful noises (like vacuum cleaners or people talking too much or too loudly)."],
  ["Es kann sehr schwer sein, im Gespräch Gesicht, Hand- und Körperbewegungen des Gegenübers zu deuten.", "It can be very hard to read someone's face, hand, and body movements when we are talking."],
  ["Ich konzentriere mich eher auf Details als auf die Gesamtidee.", "I focus on details rather than the overall idea."],
  ["Ich nehme Dinge zu wörtlich und verpasse deshalb oft, was andere eigentlich sagen wollen.", "I take things too literally, so I often miss what people are trying to say."],
  ["Es bringt mich extrem aus der Fassung, wenn die Art, wie ich Dinge gern tue, plötzlich geändert wird.", "I get extremely upset when the way I like to do things is suddenly changed."]
].forEach((t, i) => add("r" + (i + 1), bi(t), FRAADS, "raads"));

/* ---------- Autismus: AQ (50 Fragen, Langfassung) ----------
   Zahl = Übernahme der gleichlautenden Frage aus dem AQ-10 (q1–q10). */
[
  ["Ich unternehme Dinge lieber mit anderen als allein.", "I prefer to do things with others rather than on my own."],
  ["Ich mache Dinge am liebsten immer wieder auf dieselbe Art.", "I prefer to do things the same way over and over again."],
  ["Wenn ich mir etwas vorstellen will, entsteht in meinem Kopf sehr leicht ein Bild davon.", "If I try to imagine something, I find it very easy to create a picture in my mind."],
  ["Ich vertiefe mich oft so sehr in eine Sache, dass ich alles andere aus den Augen verliere.", "I frequently get so strongly absorbed in one thing that I lose sight of other things."],
  1,
  ["Mir fallen meist Autonummern oder ähnliche Zahlen- und Buchstabenfolgen auf.", "I usually notice car number plates or similar strings of information."],
  ["Andere sagen mir häufig, dass etwas, das ich gesagt habe, unhöflich war – obwohl ich es für höflich halte.", "Other people frequently tell me that what I've said is impolite, even though I think it is polite."],
  ["Wenn ich eine Geschichte lese, kann ich mir leicht vorstellen, wie die Figuren aussehen.", "When I'm reading a story, I can easily imagine what the characters might look like."],
  ["Kalenderdaten faszinieren mich.", "I am fascinated by dates."],
  ["In einer Gruppe kann ich problemlos den Gesprächen mehrerer Personen gleichzeitig folgen.", "In a social group, I can easily keep track of several different people's conversations."],
  ["Soziale Situationen fallen mir leicht.", "I find social situations easy."],
  ["Ich bemerke oft Kleinigkeiten, die anderen entgehen.", "I tend to notice details that others do not."],
  ["Ich würde lieber in eine Bibliothek gehen als auf eine Party.", "I would rather go to a library than a party."],
  ["Es fällt mir leicht, Geschichten zu erfinden.", "I find making up stories easy."],
  ["Menschen interessieren mich mehr als Dinge.", "I find myself drawn more strongly to people than to things."],
  ["Ich habe meist sehr starke Interessen und rege mich auf, wenn ich ihnen nicht nachgehen kann.", "I tend to have very strong interests, which I get upset about if I can't pursue."],
  ["Ich plaudere gern über Alltägliches (Small Talk).", "I enjoy social chit-chat."],
  ["Wenn ich rede, kommen andere nicht immer leicht zu Wort.", "When I talk, it isn't always easy for others to get a word in edgeways."],
  ["Zahlen faszinieren mich.", "I am fascinated by numbers."],
  7,
  ["Ich lese nicht besonders gern Romane oder erfundene Geschichten.", "I don't particularly enjoy reading fiction."],
  ["Es fällt mir schwer, neue Freundschaften zu schliessen.", "I find it hard to make new friends."],
  ["Mir fallen ständig Muster in Dingen auf.", "I notice patterns in things all the time."],
  ["Ich würde lieber ins Theater gehen als in ein Museum.", "I would rather go to the theatre than a museum."],
  ["Es stört mich nicht, wenn mein Tagesablauf durcheinandergerät.", "It does not upset me if my daily routine is disturbed."],
  ["Ich merke häufig, dass ich nicht weiss, wie ich ein Gespräch in Gang halten soll.", "I frequently find that I don't know how to keep a conversation going."],
  5,
  2,
  ["Ich kann mir Telefonnummern nicht besonders gut merken.", "I am not very good at remembering phone numbers."],
  ["Kleine Veränderungen in einer Situation oder am Aussehen einer Person fallen mir meist nicht auf.", "I don't usually notice small changes in a situation, or a person's appearance."],
  6,
  3,
  ["Beim Telefonieren bin ich unsicher, wann ich mit Sprechen an der Reihe bin.", "When I talk on the phone, I'm not sure when it's my turn to speak."],
  ["Ich mache gern Dinge spontan.", "I enjoy doing things spontaneously."],
  ["Ich bin oft die letzte Person, die die Pointe eines Witzes versteht.", "I am often the last to understand the point of a joke."],
  9,
  4,
  ["Ich bin gut im Small Talk.", "I am good at social chit-chat."],
  ["Andere sagen mir oft, dass ich immer wieder auf demselben Thema herumreite.", "People often tell me that I keep going on and on about the same thing."],
  ["Als Kind habe ich gern mit anderen Kindern Fantasiespiele gespielt, bei denen man so tut als ob.", "When I was young, I used to enjoy playing games involving pretending with other children."],
  8,
  ["Es fällt mir schwer, mir vorzustellen, wie es wäre, jemand anderes zu sein.", "I find it difficult to imagine what it would be like to be someone else."],
  ["Ich plane Aktivitäten, an denen ich teilnehme, gern sorgfältig im Voraus.", "I like to plan any activities I participate in carefully."],
  ["Ich geniesse gesellige Anlässe.", "I enjoy social occasions."],
  10,
  ["Neue Situationen machen mich nervös.", "New situations make me anxious."],
  ["Ich freue mich darauf, neue Leute kennenzulernen.", "I enjoy meeting new people."],
  ["Ich kann gut diplomatisch sein.", "I am a good diplomat."],
  ["Ich kann mir Geburtsdaten von Menschen nicht besonders gut merken.", "I am not very good at remembering people's date of birth."],
  ["Heute fällt es mir sehr leicht, mit Kindern Fantasiespiele zu spielen, bei denen man so tut als ob.", "I find it very easy to play games with children that involve pretending."]
].forEach((t, i) => add("aq" + (i + 1), typeof t === "number" ? Q["q" + t].text : bi(t), FNOW, "agree4"));

/* ---------- Autismus: RAADS-R (80 Fragen, Langfassung) ----------
   Zahl = Übernahme der gleichlautenden Frage aus dem RAADS-14 (r1–r14). */
[
  ["Ich bin ein mitfühlender Mensch.", "I am a sympathetic person."],
  ["Ich verwende in Gesprächen oft Wörter und Sätze aus Filmen und dem Fernsehen.", "I often use words and phrases from movies and television in conversations."],
  ["Ich bin oft überrascht, wenn andere mir sagen, ich sei unhöflich gewesen.", "I am often surprised when others tell me I have been rude."],
  ["Manchmal spreche ich zu laut oder zu leise, ohne es zu merken.", "Sometimes I talk too loudly or too softly, and I am not aware of it."],
  5,
  ["Ich kann mich in andere Menschen hineinversetzen.", "I can “put myself in other people's shoes”."],
  ["Es fällt mir schwer zu verstehen, was manche Redewendungen bedeuten, etwa «Du bist mein Augenstern».", "I have a hard time figuring out what some phrases mean, like “you are the apple of my eye”."],
  ["Ich rede nur gern mit Menschen, die meine Spezialinteressen teilen.", "I only like to talk to people who share my special interests."],
  12,
  ["Ich achte immer darauf, wie sich Essen im Mund anfühlt. Das ist mir wichtiger als der Geschmack.", "I always notice how food feels in my mouth. This is more important to me than how it tastes."],
  ["Ich vermisse meine besten Freunde oder meine Familie, wenn wir lange getrennt sind.", "I miss my best friends or family when we are apart for a long time."],
  ["Manchmal verletze ich andere, indem ich sage, was ich denke – auch wenn ich es nicht so meine.", "Sometimes I offend others by saying what I am thinking, even if I don't mean to."],
  ["Ich denke und rede nur gern über einige wenige Dinge, die mich interessieren.", "I only like to think and talk about a few things that interest me."],
  ["Ich gehe lieber allein in ein Restaurant als mit jemandem, den ich kenne.", "I'd rather go out to eat in a restaurant by myself than with someone I know."],
  ["Ich kann mir nicht vorstellen, wie es wäre, jemand anderes zu sein.", "I cannot imagine what being someone else would be like."],
  ["Man hat mir gesagt, ich sei ungeschickt oder unkoordiniert.", "I have been told that I am clumsy or uncoordinated."],
  ["Andere halten mich für seltsam oder anders.", "Others consider me odd or different."],
  ["Ich merke, wenn Freunde Trost brauchen.", "I understand when friends need to be comforted."],
  ["Ich bin sehr empfindlich dafür, wie sich meine Kleidung anfühlt. Das ist mir wichtiger als ihr Aussehen.", "I am very sensitive to the way my clothes feel when I touch them. How they feel is more important to me than how they look."],
  ["Ich ahme gern nach, wie bestimmte Menschen sprechen und sich verhalten. Das hilft mir, normaler zu wirken.", "I like to copy the way certain people speak and act. It helps me appear more normal."],
  ["Es kann sehr einschüchternd für mich sein, mit mehr als einer Person gleichzeitig zu sprechen.", "It can be very intimidating for me to talk to more than one person at the same time."],
  ["Ich muss mich «normal verhalten», damit andere zufrieden sind und mich mögen.", "I have to “act normal” to please other people and make them like me."],
  ["Es fällt mir meist leicht, neue Leute kennenzulernen.", "Meeting new people is usually easy for me."],
  ["Es bringt mich völlig durcheinander, wenn mich jemand unterbricht, während ich über etwas spreche, das mich sehr interessiert.", "I get highly confused when someone interrupts me when I am talking about something I am very interested in."],
  1,
  ["Ich unterhalte mich gern mit mehreren Menschen, etwa am Esstisch, in der Schule oder bei der Arbeit.", "I like having a conversation with several people, for instance around a dinner table, at school or at work."],
  13,
  ["Es fällt mir sehr schwer zu erkennen, wenn jemand verlegen oder eifersüchtig ist.", "It is very difficult for me to understand when someone is embarrassed or jealous."],
  2,
  14,
  ["Ich wollte oder brauchte nie das, was andere eine «intime Beziehung» nennen.", "I have never wanted or needed to have what other people call an “intimate relationship”."],
  ["Es fällt mir schwer, ein Gespräch zu beginnen und zu beenden. Ich muss weiterreden, bis ich fertig bin.", "It is difficult for me to start and stop a conversation. I need to keep going until I am finished."],
  ["Ich spreche in einem normalen Rhythmus.", "I speak with a normal rhythm."],
  ["Ein und dasselbe Geräusch, dieselbe Farbe oder Oberfläche kann für mich plötzlich von sehr intensiv zu kaum spürbar wechseln.", "The same sound, colour or texture can suddenly change from very sensitive to very dull."],
  ["Die Redewendung «Du gehst mir unter die Haut» ist mir unangenehm.", "The phrase “I've got you under my skin” makes me uncomfortable."],
  ["Manchmal schmerzt der Klang eines Wortes oder ein hoher Ton in meinen Ohren.", "Sometimes the sound of a word or a high-pitched noise can be painful to my ears."],
  ["Ich bin ein verständnisvoller Mensch.", "I am an understanding type of person."],
  ["Ich finde keinen Zugang zu Filmfiguren und kann nicht fühlen, was sie fühlen.", "I do not connect with characters in movies and cannot feel what they feel."],
  ["Ich merke nicht, wenn jemand mit mir flirtet.", "I cannot tell when someone is flirting with me."],
  ["Dinge, die mich interessieren, sehe ich in allen Einzelheiten vor meinem inneren Auge.", "I can see in my mind in exact detail things that I am interested in."],
  ["Ich führe Listen über Dinge, die mich interessieren, auch wenn sie keinen praktischen Nutzen haben (z. B. Sportstatistiken, Fahrpläne, Kalenderdaten, historische Fakten).", "I keep lists of things that interest me, even when they have no practical use (for example sports statistics, train schedules, calendar dates, historical facts and dates)."],
  7,
  ["Ich bespreche Dinge gern mit meinen Freunden.", "I like to talk things over with my friends."],
  ["Ich kann nicht erkennen, ob sich jemand für das interessiert, was ich sage, oder sich langweilt.", "I cannot tell if someone is interested or bored with what I am saying."],
  11,
  ["Dieselbe Sache (z. B. Kleidung oder Temperatur) kann sich für mich zu verschiedenen Zeiten ganz unterschiedlich anfühlen.", "The same thing (like clothes or temperatures) can feel very different to me at different times."],
  ["Ich fühle mich bei Verabredungen und in geselligen Situationen sehr wohl.", "I feel very comfortable with dating or being in social situations with others."],
  ["Ich versuche, so hilfreich wie möglich zu sein, wenn andere mir von ihren persönlichen Problemen erzählen.", "I try to be as helpful as I can when other people tell me their personal problems."],
  ["Man hat mir gesagt, ich hätte eine ungewöhnliche Stimme (z. B. flach, monoton, kindlich oder hoch).", "I have been told that I have an unusual voice (for example flat, monotone, childish, or high-pitched)."],
  ["Manchmal setzt sich ein Gedanke oder ein Thema in meinem Kopf fest, und ich muss darüber reden, auch wenn es niemanden interessiert.", "Sometimes a thought or a subject gets stuck in my mind and I have to talk about it even if no one is interested."],
  ["Ich mache bestimmte Dinge mit meinen Händen immer wieder (z. B. flattern, Stöckchen oder Schnüre drehen, Dinge vor den Augen bewegen).", "I do certain things with my hands over and over again (like flapping, twirling sticks or strings, waving things by my eyes)."],
  ["Ich habe mich nie für das interessiert, was die meisten Menschen in meinem Umfeld interessant finden.", "I have never been interested in what most of the people I know consider interesting."],
  ["Andere halten mich für einen mitfühlenden Menschen.", "I am considered a compassionate type of person."],
  ["Ich komme mit anderen zurecht, indem ich bestimmte Regeln befolge, die mir helfen, normal zu wirken.", "I get along with other people by following a set of specific rules that help me look normal."],
  3,
  ["Wenn ich mit jemandem spreche, fällt es mir schwer, das Thema zu wechseln. Tut es die andere Person, kann mich das sehr aufregen und verwirren.", "When I am talking to someone, it is hard to change the subject. If the other person does so, I can get very upset and confused."],
  10,
  6,
  ["Manchmal tut etwas nicht weh, das eigentlich wehtun müsste (z. B. wenn ich mich verletze oder mir die Hand am Herd verbrenne).", "Sometimes things that should feel painful are not (for instance when I hurt myself or burn my hand on the stove)."],
  9,
  ["Die Menschen, die mich am besten kennen, halten mich für eine Einzelgängerin oder einen Einzelgänger.", "I am considered a loner by those who know me best."],
  ["Ich spreche gewöhnlich in einem normalen Tonfall.", "I usually speak in a normal tone."],
  ["Ich mag es, wenn alles Tag für Tag genau gleich ist; schon kleine Änderungen meiner Routinen bringen mich aus der Fassung.", "I like things to be exactly the same day after day and even small changes in my routines upset me."],
  8,
  ["Es beruhigt mich, mich im Kreis zu drehen oder auf einem Stuhl zu schaukeln, wenn ich gestresst bin.", "It calms me to spin around or to rock in a chair when I'm feeling stressed."],
  ["Die Redewendung «Er trägt das Herz auf der Zunge» ergibt für mich keinen Sinn.", "The phrase “He wears his heart on his sleeve” does not make sense to me."],
  ["An Orten mit vielen Gerüchen, Oberflächen, Geräuschen oder hellen Lichtern werde ich unruhig oder bekomme Angst.", "If I am in a place where there are many smells, textures to feel, noises or bright lights, I feel anxious or frightened."],
  ["Ich merke, wenn jemand das eine sagt, aber etwas anderes meint.", "I can tell when someone says one thing but means something else."],
  ["Ich bin so oft wie möglich gern für mich allein.", "I like to be by myself as much as I can."],
  ["Ich bewahre meine Gedanken im Gedächtnis auf wie auf Karteikarten und suche mir die passende heraus, indem ich den Stapel durchgehe (oder auf eine andere, eigene Weise).", "I keep my thoughts stacked in my memory like they are on filing cards, and I pick out the ones I need by looking through the stack and finding the right one (or another unique way)."],
  ["Dasselbe Geräusch wirkt manchmal sehr laut und manchmal sehr leise, obwohl ich weiss, dass es sich nicht verändert hat.", "The same sound sometimes seems very loud or very soft, even though I know it has not changed."],
  ["Ich verbringe gern Zeit beim Essen und Reden mit Familie und Freunden.", "I enjoy spending time eating and talking with my family and friends."],
  ["Ich ertrage Dinge nicht, die ich nicht mag (z. B. Gerüche, Oberflächen, Geräusche oder Farben).", "I can't tolerate things I dislike (like smells, textures, sounds or colours)."],
  ["Ich mag es nicht, umarmt oder gehalten zu werden.", "I don't like to be hugged or held."],
  ["Wenn ich irgendwohin gehe, muss ich einem vertrauten Weg folgen, sonst kann ich sehr durcheinander und aufgewühlt werden.", "When I go somewhere, I have to follow a familiar route or I can get very confused and upset."],
  4,
  ["Ich habe gern enge Freunde.", "I like to have close friends."],
  ["Andere sagen mir, dass ich zu sehr ins Detail gehe.", "People tell me that I give too much detail."],
  ["Man sagt mir oft, dass ich peinliche Fragen stelle.", "I am often told that I ask embarrassing questions."],
  ["Ich neige dazu, andere auf ihre Fehler hinzuweisen.", "I tend to point out other people's mistakes."]
].forEach((t, i) => add("rr" + (i + 1), typeof t === "number" ? Q["r" + t].text : bi(t), FRAADS, "raads"));

/* AQ-Fragen, die inhaltlich einer RAADS-R-Frage entsprechen, werden im Autismus-Test
   nur einmal (als RAADS-R-Frage) gestellt. Für den AQ zählt, ob die Aussage heute
   zutrifft («Trifft heute zu …» oder «Trifft nur heute zu»). inv = gegenteilige Aussage.
   AQ-Nr.: [RAADS-R-Nr., inv] */
const AQ_FROM_RR = {
  7: [3, false],   // unhöflich, obwohl höflich gemeint ↔ überrascht, wenn man mich unhöflich nennt
  22: [64, false], // Mühe, Freundschaften zu schliessen ↔ Freundschaften sind ein Rätsel
  25: [30, true],  // Routinestörung stört nicht ↔ Änderungen bringen mich aus der Fassung
  28: [9, true],   // grosses Ganzes ↔ Details statt Gesamtidee
  31: [44, true],  // merke Langeweile ↔ merke nicht, ob jemand interessiert ist
  33: [60, false], // weiss nicht, wann ich dran bin (Telefon) ↔ (Gespräch)
  36: [45, true],  // lese Gefühle am Gesicht ↔ Gesicht und Körper schwer zu deuten
  38: [58, false], // gut im Small Talk ↔ kann Small Talk führen
  42: [15, false], // jemand anderes sein
  44: [47, false], // gesellige Anlässe ↔ wohl in geselligen Situationen
  47: [23, false]  // neue Leute kennenlernen
};

/* ---------- Masking: CAT-Q (25 Items) ---------- */
// sub: C = Kompensation, M = Maskieren, A = Assimilation; rev = umgekehrt gepolt
const CATQ = [
  ["C", 0, "Wenn ich mit jemandem zu tun habe, ahme ich bewusst dessen Körpersprache oder Gesichtsausdruck nach.", "When I am interacting with someone, I deliberately copy their body language or facial expressions."],
  ["C", 0, "Wie Menschen Körper und Gesicht im Umgang einsetzen, beobachte ich in Filmen, Serien oder Büchern.", "I learn how people use their bodies and faces to interact by watching television or films, or by reading fiction."],
  ["C", 0, "Ich habe versucht, mein Verständnis sozialer Fähigkeiten zu verbessern, indem ich andere beobachte.", "I have tried to improve my understanding of social skills by watching other people."],
  ["C", 0, "Ich wiederhole Formulierungen, die ich von anderen gehört habe, genau so, wie ich sie zuerst gehört habe.", "I will repeat phrases that I have heard others say in the exact same way that I first heard them."],
  ["C", 0, "Ich übe meine Mimik und Körpersprache, damit sie natürlich wirken.", "I practice my facial expressions and body language to make sure they look natural."],
  ["C", 0, "Ich habe Zeit damit verbracht, soziale Fähigkeiten aus Serien und Filmen zu lernen, und wende sie im Umgang mit anderen an.", "I have spent time learning social skills from television shows and films, and try to use these in my interactions."],
  ["C", 0, "In meinen eigenen Begegnungen verwende ich Verhaltensweisen, die ich bei anderen abgeschaut habe.", "In my own social interactions, I use behaviours that I have learned from watching other people interacting."],
  ["C", 0, "Ich habe mich gezielt über die Regeln des sozialen Miteinanders informiert (z. B. über Psychologie oder Bücher), um meine sozialen Fähigkeiten zu verbessern.", "I have researched the rules of social interactions (for example, by studying psychology or reading books on human behaviour) to improve my own social skills."],
  ["C", 0, "Ich habe mir ein Skript für soziale Situationen zurechtgelegt (z. B. eine Liste von Fragen oder Gesprächsthemen).", "I have developed a script to follow in social situations (for example, a list of questions or topics of conversation)."],
  ["M", 0, "Ich behalte meine Körpersprache und Mimik im Auge, damit ich entspannt wirke.", "I monitor my body language or facial expressions so that I appear relaxed."],
  ["M", 0, "Ich verändere bewusst meine Körpersprache oder Mimik, damit ich entspannt wirke.", "I adjust my body language or facial expressions so that I appear relaxed."],
  ["M", 0, "Ich behalte meine Körpersprache und Mimik im Auge, damit ich an meinem Gegenüber interessiert wirke.", "I monitor my body language or facial expressions so that I appear interested by the person I am interacting with."],
  ["M", 0, "Ich verändere bewusst meine Körpersprache oder Mimik, damit ich an meinem Gegenüber interessiert wirke.", "I adjust my body language or facial expressions so that I appear interested by the person I am interacting with."],
  ["M", 1, "Ich habe nicht das Bedürfnis, Blickkontakt zu halten, wenn ich es nicht möchte.", "I don't feel the need to make eye contact with other people if I don't want to."],
  ["M", 1, "Im Umgang mit anderen achte ich nicht darauf, was mein Gesicht oder mein Körper gerade tun.", "In social interactions, I do not pay attention to what my face or body are doing."],
  ["M", 0, "Ich denke ständig darüber nach, welchen Eindruck ich auf andere mache.", "I always think about the impression I make on other people."],
  ["M", 0, "Mir ist in jedem Moment bewusst, wie ich auf andere wirke.", "I am always aware of the impression I make on other people."],
  ["A", 1, "Ich habe selten das Bedürfnis, eine Rolle zu spielen, um eine soziale Situation zu überstehen.", "I rarely feel the need to put on an act in order to get through a social situation."],
  ["A", 1, "Wenn ich mit anderen rede, habe ich das Gefühl, dass das Gespräch ganz natürlich fliesst.", "When talking to other people, I feel like the conversation flows naturally."],
  ["A", 0, "In sozialen Situationen suche ich nach Wegen, den Kontakt mit anderen zu vermeiden.", "When in social situations, I try to find ways to avoid interacting with others."],
  ["A", 0, "In sozialen Situationen habe ich das Gefühl, eher etwas «aufzuführen», als ich selbst zu sein.", "In social situations, I feel like I'm “performing” rather than being myself."],
  ["A", 0, "In sozialen Situationen muss ich mich zwingen, auf Menschen zuzugehen.", "I have to force myself to interact with people when I am in social situations."],
  ["A", 0, "In sozialen Situationen habe ich das Gefühl, nur so zu tun, als wäre ich «normal».", "In social situations, I feel like I am pretending to be “normal”."],
  ["A", 0, "Ich brauche die Unterstützung anderer Menschen, um unter Leute zu gehen.", "I need the support of other people in order to socialise."],
  ["A", 1, "Ich fühle mich frei, ich selbst zu sein, wenn ich mit anderen zusammen bin.", "I feel free to be myself when I am with other people."]
];
CATQ.forEach((c, i) => add("c" + (i + 1), { de: c[2], en: c[3] }, FNOW, "agree7", { sub: c[0], rev: !!c[1] }));

/* ---------- Dyslexie: Adult Dyslexia Checklist (15 Items, gewichtet) ---------- */
[
  [3, "dysFreq", "Wie oft verwechselst du ähnlich aussehende Wörter (z. B. «Hand» und «Hund»)?", "How often do you confuse visually similar words such as “cat” and “cot”?"],
  [2, "dysFreq", "Wie oft verlierst du beim Lesen die Zeile oder überspringst Zeilen?", "How often do you lose your place or miss out lines when reading?"],
  [1, "dysFreq", "Wie oft verwechselst du die Namen von Gegenständen (sagst z. B. «Tisch» statt «Stuhl»)?", "How often do you confuse the names of objects, for example “table” for “chair”?"],
  [1, "dysFreq", "Wie oft hast du Mühe, links und rechts zu unterscheiden?", "How often do you have trouble telling left from right?"],
  [1, "dysFreq", "Wie oft verwirrt dich das Kartenlesen oder die Orientierung an einem fremden Ort?", "How often do you find map reading or finding your way to a strange place confusing?"],
  [1, "dysFreq", "Wie oft musst du Absätze mehrmals lesen, um sie zu verstehen?", "How often do you re-read paragraphs to understand them?"],
  [1, "dysFreq", "Wie oft kommst du durcheinander, wenn du mehrere Anweisungen auf einmal erhältst?", "How often do you get confused when given several instructions at once?"],
  [1, "dysFreq", "Wie oft machst du Fehler, wenn du telefonische Nachrichten notierst?", "How often do you make mistakes when taking down telephone messages?"],
  [1, "dysFreq", "Wie oft fällt es dir schwer, das richtige Wort zu finden?", "How often do you find it difficult to find the right word to say?"],
  [1, "dysFreq", "Wie oft fallen dir kreative Lösungen für Probleme ein?", "How often do you think of creative solutions to problems?"],
  [3, "dysEase", "Wie leicht fällt es dir, ein langes Wort Silbe für Silbe zu erlesen (z. B. E-le-fant)?", "How easy do you find it to sound out words such as e-le-phant?"],
  [2, "dysEase", "Wie leicht fällt es dir, beim Schreiben deine Gedanken zu ordnen und zu Papier zu bringen?", "When writing, how easy do you find it to organise your thoughts on paper?"],
  [2, "dysEase", "Wie leicht fiel es dir, das Einmaleins zu lernen?", "How easy was it for you to learn your multiplication tables?"],
  [1, "dysEase", "Wie leicht fällt es dir, das Alphabet aufzusagen?", "How easy do you find it to recite the alphabet?"],
  [1, "dysEase", "Wie leicht fällt es dir, laut vorzulesen?", "How easy do you find it to read aloud?"]
].forEach((d, i) => add("d" + (i + 1), { de: d[2], en: d[3] }, FNOW, d[1], { w: d[0] }));

/* ---------- Dyspraxie/DCD: ADC (40 Items) ----------
   Originalskala: Nie / Manchmal / Häufig / Immer (0–3). Alle Fragen sind als
   «Wie oft …» formuliert, damit Frage und Antwort zusammenpassen. Bei einmaligen
   Lernvorgängen (Velo, Autofahren) passt eine Häufigkeit sprachlich nicht; dort
   stehen vier gleich gewertete Stufen der Ausprägung.
   Teil A fragt nach der Kindheit, Teil B und C nach heute. Einige Themen kommen
   deshalb absichtlich zweimal vor (z. B. Handschrift damals und heute). */
const opt = (de, en) => ({ options: { de, en } });
[
  ["Wie oft hattest du als Kind Mühe mit Dingen wie Schuhe binden, Knöpfe oder Reissverschlüsse schliessen?",
   "As a child, how often did you have difficulty with self-care tasks such as tying shoelaces, doing up buttons or zips?"],
  ["Wie oft hattest du als Kind Mühe, zu essen, ohne dich zu bekleckern?",
   "As a child, how often did you have difficulty eating without spilling?"],
  ["Hattest du als Kind – verglichen mit Gleichaltrigen – Mühe, Velofahren zu lernen?",
   "Compared with other children your age, did you have difficulty learning to ride a bicycle?",
   opt(["Nein, gar nicht", "Ein wenig", "Deutlich", "Sehr grosse Mühe"], ["No, not at all", "A little", "Clearly", "A great deal"])],
  ["Wie oft hattest du als Kind Mühe bei Mannschaftsspielen wie Fussball oder beim genauen Fangen und Werfen von Bällen?",
   "As a child, how often did you have difficulty with team games such as football, or with catching and throwing balls accurately?"],
  ["Wie oft hattest du als Kind Mühe, so ordentlich zu schreiben, dass andere es lesen konnten?",
   "As a child, how often did you have difficulty writing neatly enough for others to read?"],
  ["Wie oft hattest du als Kind Mühe, so schnell zu schreiben wie Gleichaltrige?",
   "As a child, how often did you have difficulty writing as quickly as other children?"],
  ["Wie oft bist du als Kind – häufiger als andere – an Dinge oder Menschen gestossen oder über etwas gestolpert?",
   "As a child, how often did you bump into things or people, or trip over, more than others did?"],
  ["Wie oft hattest du als Kind Mühe, ein Musikinstrument zu spielen (z. B. Blockflöte oder Geige)? Falls du keines gespielt hast: «Nie».",
   "As a child, how often did you have difficulty playing a musical instrument (e.g. recorder or violin)? If you never played one: “Never”."],
  ["Wie oft hattest du als Kind Mühe, dein Zimmer in Ordnung zu halten?",
   "As a child, how often did you have difficulty keeping your room organised?"],
  ["Wie oft haben andere in deiner Kindheit deine Koordination bemängelt oder dich ungeschickt genannt?",
   "As a child, how often did others comment on your coordination or call you clumsy?"]
].forEach((t, i) => add("pA" + (i + 1), bi(t), FKID, "adc", t[2]));
[
  ["Wie oft hast du heute Schwierigkeiten bei der Körperpflege, etwa beim Rasieren oder Schminken?",
   "How often do you currently have difficulty with self-care tasks such as shaving or applying make-up?"],
  ["Wie oft hast du heute Schwierigkeiten beim Essen mit Messer und Gabel oder Löffel?",
   "How often do you currently have difficulty eating with a knife and fork or spoon?"],
  ["Wie oft hast du heute Schwierigkeiten bei Hobbys, die gute Koordination verlangen (z. B. Sport, Tanz, Handwerk)?",
   "How often do you currently have difficulty with hobbies that require good coordination (e.g. sports, dance, crafts)?"],
  ["Wie oft fällt es dir heute schwer, leserlich zu schreiben, wenn es schnell gehen muss?",
   "How often do you currently find it hard to write legibly when you have to write quickly?"],
  ["Wie oft fällt es dir heute schwer, so schnell zu schreiben wie andere?",
   "How often do you currently find it hard to write as quickly as others?"],
  ["Wie oft fällt es dir schwer, deine eigene Handschrift wieder zu lesen?",
   "How often do you find it hard to read your own handwriting?"],
  ["Wie oft fällt es dir schwer, einen Text fehlerfrei abzuschreiben?",
   "How often do you find it hard to copy text down accurately?"],
  ["Wie oft fällt es dir heute schwer, Ordnung in deinem Zimmer oder deiner Wohnung zu halten?",
   "How often do you currently find it hard to keep your room or home organised?"],
  ["Wie oft fällt es dir schwer, dich in neuen Gebäuden oder an neuen Orten zurechtzufinden?",
   "How often do you find it hard to find your way around new buildings or places?"],
  ["Wie oft haben andere dich als unorganisiert bezeichnet?",
   "How often have others described you as disorganised?"]
].forEach((t, i) => add("pB" + (i + 1), bi(t), FCUR, "adc"));
[
  ["Wie oft fällt es dir schwer, still zu sitzen, oder wirkst du zappelig?",
   "How often do you find it hard to sit still, or appear fidgety?"],
  ["Wie oft verlierst du Dinge oder lässt sie irgendwo liegen?",
   "How often do you lose things or leave them behind?"],
  ["Wie oft stösst du an Dinge, verschüttest etwas oder machst Sachen kaputt?",
   "How often do you bump into things, spill things or break things?"],
  ["Wie oft brauchst du morgens länger als andere, um aufzustehen und zur Arbeit oder Ausbildung zu kommen?",
   "How often do you take longer than others to get up and get to work or study in the morning?"],
  ["Hast du länger gebraucht als andere, um Autofahren zu lernen?",
   "Did you take longer than others to learn to drive a car?",
   opt(["Nein (oder nie gelernt)", "Etwas länger", "Deutlich länger", "Sehr viel länger"], ["No (or never learned)", "A little longer", "Clearly longer", "Much longer"])],
  ["Wie oft sagen andere, dass sie deine Handschrift kaum lesen können?",
   "How often do others say they find your handwriting hard to read?"],
  ["Wie oft verzichtest du bewusst auf Hobbys, die gute Koordination verlangen?",
   "How often do you deliberately avoid hobbies that require good coordination?"],
  ["Wie oft verbringst du deine Freizeit lieber allein als mit anderen?",
   "How often do you prefer to spend your free time on your own rather than with others?"],
  ["Wie oft meidest du Mannschaftsspiele oder Mannschaftssport?",
   "How often do you avoid team games or team sports?"],
  ["Wenn du Sport treibst: Wie oft wählst du eine Sportart, die man allein ausübt (z. B. Joggen, Fitness), statt einer mit anderen?",
   "If you do sport: how often do you choose an individual activity (e.g. running, the gym) rather than one with others?"],
  ["Wie oft hast du es – als Teenager, in deinen Zwanzigern oder heute – vermieden, in Clubs oder tanzen zu gehen?",
   "How often have you avoided going to clubs or dancing – as a teenager, in your twenties or today?"],
  ["Wie oft hast du Schwierigkeiten beim Parkieren eines Autos? Falls du nicht Auto fährst: «Nie».",
   "How often do you have difficulty parking a car? If you don't drive: “Never”."],
  ["Wie oft fällt es dir schwer, eine Mahlzeit von Grund auf zuzubereiten?",
   "How often do you find it hard to cook a meal from scratch?"],
  ["Wie oft fällt es dir schwer, einen Koffer für eine Reise zu packen?",
   "How often do you find it hard to pack a suitcase for a trip?"],
  ["Wie oft fällt es dir schwer, Kleider ordentlich zusammenzulegen und zu versorgen?",
   "How often do you find it hard to fold clothes neatly and put them away?"],
  ["Wie oft fällt es dir schwer, mit Geld umzugehen und es einzuteilen?",
   "How often do you find it hard to manage and budget your money?"],
  ["Wie oft fällt es dir schwer, zwei Dinge gleichzeitig zu tun (z. B. Auto fahren und zuhören)?",
   "How often do you find it hard to do two things at once (e.g. driving and listening)?"],
  ["Wie oft fällt es dir schwer, Abstände einzuschätzen (z. B. wenn du zwischen Möbeln hindurchgehst oder etwas abstellst)?",
   "How often do you find it hard to judge distances (e.g. when walking between furniture or putting something down)?"],
  ["Wie oft fällt es dir schwer, vorauszuplanen?",
   "How often do you find it hard to plan ahead?"],
  ["Wie oft hast du das Gefühl, in verschiedenen Situationen die Aufmerksamkeit zu verlieren?",
   "How often do you feel you lose attention in different situations?"]
].forEach((t, i) => add("pC" + (i + 1), bi(t), FCUR, "adc", t[2]));

/* ---------- Stimmung & Angst: PHQ-4 ---------- */
[
  ["Wie oft hast du dich durch wenig Interesse oder Freude an deinen Tätigkeiten beeinträchtigt gefühlt?", "How often have you been bothered by little interest or pleasure in doing things?"],
  ["Wie oft hast du dich durch Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit beeinträchtigt gefühlt?", "How often have you been bothered by feeling down, depressed or hopeless?"],
  ["Wie oft hast du dich durch Nervosität, Ängstlichkeit oder Anspannung beeinträchtigt gefühlt?", "How often have you been bothered by feeling nervous, anxious or on edge?"],
  ["Wie oft warst du nicht in der Lage, Sorgen zu stoppen oder zu kontrollieren?", "How often have you not been able to stop or control worrying?"]
].forEach((t, i) => add("m" + (i + 1), bi(t), F2W, "phq"));

/* ---------- Tics: Liste nach dem Adult Tic Questionnaire (Mehrfachauswahl) ---------- */
Q.tm = {
  id: "tm", type: "multi", frame: F1W,
  text: { de: "Welche dieser unwillkürlichen Bewegungen hast du bei dir bemerkt? (Mehrere Antworten möglich)", en: "Which of these involuntary movements have you noticed in yourself? (Choose all that apply)" },
  options: {
    de: ["Augenblinzeln", "Augenrollen oder schnelle Blickbewegungen", "Ruckartige Kopfbewegungen",
      "Grimassieren", "Mund- oder Zungenbewegungen", "Schulterzucken",
      "Anspannen von Brust oder Bauch", "Anspannen im Beckenbereich", "Bein- oder Fussbewegungen",
      "Arm- oder Handbewegungen", "Unwillkürliches Nachahmen von Bewegungen anderer",
      "Unwillkürliche Gesten, die als unpassend gelten"],
    en: ["Eye blinking", "Eye rolling or quick eye movements", "Head jerks",
      "Facial grimacing", "Mouth or tongue movements", "Shoulder shrugging",
      "Tensing of chest or stomach", "Tensing in the pelvic area", "Leg or foot movements",
      "Arm or hand movements", "Involuntarily copying other people's movements",
      "Involuntary gestures considered inappropriate"]
  },
  none: { de: "Nichts davon", en: "None of these" }
};
Q.tv = {
  id: "tv", type: "multi", frame: F1W,
  text: { de: "Welche dieser unwillkürlichen Laute oder Äusserungen hast du bei dir bemerkt? (Mehrere Antworten möglich)", en: "Which of these involuntary sounds or utterances have you noticed in yourself? (Choose all that apply)" },
  options: {
    de: ["Grunzen oder Brummen", "Schniefen", "Schnauben", "Hüsteln oder Räuspern",
      "Tiergeräusche", "Einzelne Silben", "Einzelne Wörter", "Ganze Sätze oder Satzteile",
      "Unwillkürliches Wiederholen von Gehörtem", "Unwillkürliche Ausdrücke, die als unpassend gelten",
      "Blockieren oder Stocken beim Sprechen"],
    en: ["Grunting or humming", "Sniffing", "Snorting", "Coughing or throat clearing",
      "Animal noises", "Single syllables", "Single words", "Whole sentences or phrases",
      "Involuntarily repeating what you hear", "Involuntary expressions considered inappropriate",
      "Blocking or getting stuck while speaking"]
  },
  none: { de: "Nichts davon", en: "None of these" }
};
Q.tf = {
  id: "tf", type: "single", frame: F1W,
  text: { de: "Wie häufig treten solche unwillkürlichen Bewegungen oder Laute bei dir insgesamt auf?", en: "Overall, how often do such involuntary movements or sounds occur?" },
  options: {
    de: ["Gar nicht", "Ein paar Mal pro Woche oder seltener", "Täglich, mehrmals am Tag", "Etwa stündlich", "Fast ständig, beinahe den ganzen Tag"],
    en: ["Not at all", "A few times a week or less", "Daily, several times a day", "About every hour", "Almost constantly, nearly all day"]
  }
};
Q.ti = {
  id: "ti", type: "single", frame: F1W,
  text: { de: "Wie stark sind diese unwillkürlichen Bewegungen oder Laute?", en: "How strong are these involuntary movements or sounds?" },
  options: {
    de: ["Ich habe keine", "Sehr leicht – andere bemerken sie kaum", "Für andere deutlich bemerkbar", "Heftig, sehr auffällig oder manchmal schmerzhaft"],
    en: ["I don't have any", "Very mild – others hardly notice them", "Clearly noticeable to others", "Forceful, very noticeable or sometimes painful"]
  }
};
Q.td = {
  id: "td", type: "single", frame: FLIFE,
  text: { de: "Bestehen unwillkürliche Bewegungen oder Laute bei dir – mit Unterbrüchen – schon länger als ein Jahr?", en: "Have you had involuntary movements or sounds – on and off – for more than a year?" },
  options: {
    de: ["Ja", "Nein, kürzer", "Ich bin nicht sicher", "Ich habe keine"],
    en: ["Yes", "No, for less time", "I'm not sure", "I don't have any"]
  }
};
Q.to = {
  id: "to", type: "single", frame: FLIFE,
  text: { de: "Haben unwillkürliche Bewegungen oder Laute bei dir vor dem 18. Lebensjahr begonnen?", en: "Did your involuntary movements or sounds start before the age of 18?" },
  options: {
    de: ["Ja", "Nein, später", "Ich bin nicht sicher", "Ich habe keine"],
    en: ["Yes", "No, later", "I'm not sure", "I don't have any"]
  }
};

/* ---------- Kontextfragen (fliessen in die Einordnung ein, nicht in die Punktwerte) ---------- */
Q.xOnset = {
  id: "xOnset", type: "single", frame: FLIFE,
  text: { de: "Seit wann kennst du die Schwierigkeiten, die dich zu diesem Test geführt haben?", en: "Since when have you experienced the difficulties that brought you to this test?" },
  options: {
    de: ["Schon als Kind (vor etwa 12 Jahren)", "Seit der Jugend", "Erst seit dem Erwachsenenalter", "Erst seit Kurzem (Wochen oder Monate)", "Ich bin nicht sicher"],
    en: ["Since childhood (before about age 12)", "Since my teens", "Only since adulthood", "Only recently (weeks or months)", "I'm not sure"]
  }
};
Q.xAreas = {
  id: "xAreas", type: "multi", frame: FCUR,
  text: { de: "In welchen Lebensbereichen fühlst du dich durch diese Schwierigkeiten spürbar eingeschränkt? (Mehrere Antworten möglich)", en: "In which areas of life do these difficulties noticeably hold you back? (Choose all that apply)" },
  options: {
    de: ["Arbeit, Studium oder Ausbildung", "Partnerschaft oder Familie", "Freundschaften und soziale Kontakte", "Haushalt und Alltagsorganisation", "Finanzen und Administratives", "Schlaf und Gesundheit", "Freizeit und Erholung"],
    en: ["Work, studies or training", "Relationship or family", "Friendships and social contacts", "Household and daily organisation", "Finances and paperwork", "Sleep and health", "Leisure and rest"]
  },
  none: { de: "In keinem Bereich", en: "In none of these" }
};

/* ---------- Quellen (an den Originaldokumenten geprüft) ---------- */
const SOURCES = {
  asrs: {
    short: "Kessler et al., 2005",
    label: "Kessler RC, Adler L, Ames M, et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine, 35(2), 245–256.",
    url: "https://doi.org/10.1017/S0033291704002892"
  },
  asrsDe: {
    short: { de: "ASRS v1.1, deutsche Fassung", en: "ASRS v1.1, German version" },
    label: { de: "ASRS v1.1 Symptom-Checkliste, offizielle deutsche Übersetzung im Auftrag der WHO (© New York University und R. C. Kessler).", en: "ASRS v1.1 Symptom Checklist, official German translation on behalf of the WHO (© New York University and R. C. Kessler)." },
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
    short: { de: "AQ-10, Originalbogen", en: "AQ-10, original form" },
    label: { de: "AQ-10 (Adult) – Originalbogen mit Auswertungsregel, Autism Research Centre, University of Cambridge; empfohlen in der NICE-Leitlinie CG142.", en: "AQ-10 (Adult) – original form with scoring key, Autism Research Centre, University of Cambridge; recommended in NICE guideline CG142." },
    url: "https://bhh.psychiatry.ufl.edu/wordpress/files/2024/03/AQ10-Adult.pdf"
  },
  aq10cut: {
    short: { de: "AQ-10-Schwelle, 2025", en: "AQ-10 cut-off, 2025" },
    label: "The importance of using an optimal cutoff value for the 10-item Autism-Spectrum Quotient (AQ10) (2025). PubMed ID 39964454.",
    url: "https://pubmed.ncbi.nlm.nih.gov/39964454/"
  },
  aq50: {
    short: "Baron-Cohen et al., 2001",
    label: "Baron-Cohen S, Wheelwright S, Skinner R, Martin J, Clubley E (2001). The Autism-Spectrum Quotient (AQ): Evidence from Asperger Syndrome/High-Functioning Autism, Males and Females, Scientists and Mathematicians. Journal of Autism and Developmental Disorders, 31(1), 5–17.",
    url: "https://docs.autismresearchcentre.com/papers/2001_BCetal_AQ.pdf"
  },
  raadsr: {
    short: "Ritvo et al., 2011",
    label: "Ritvo RA, Ritvo ER, Guthrie D, et al. (2011). The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R): A Scale to Assist the Diagnosis of Autism Spectrum Disorder in Adults. Journal of Autism and Developmental Disorders, 41(8), 1076–1089.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3134766/"
  },
  raadsrNorm: {
    short: { de: "RAADS-R, Auswertungsbogen", en: "RAADS-R, scoring sheet" },
    label: { de: "RAADS-R – Auswertungsbogen mit allen 80 Fragen, Punktwerten und neueren Bereichsgrenzen (NovoPsych, 2025).", en: "RAADS-R – scoring sheet with all 80 items, item scores and newer score ranges (NovoPsych, 2025)." },
    url: "https://novopsych.com/wp-content/uploads/2025/10/RAADS-R-scoring-online-cutoffs.pdf"
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
    label: { de: "Smythe I, Everatt J (2001). Adult Dyslexia Checklist. British Dyslexia Association – Originalbogen mit Punktwerten.", en: "Smythe I, Everatt J (2001). Adult Dyslexia Checklist. British Dyslexia Association – original form with item weights." },
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
    short: { de: "ADC, Originalbogen", en: "ADC, original form" },
    label: { de: "ADC – Originalbogen mit allen 40 Fragen (University of Haifa, CHAP Lab).", en: "ADC – original form with all 40 items (University of Haifa, CHAP Lab)." },
    url: "https://chap.haifa.ac.il/wp-content/uploads/2023/09/ADC_NewEnglish.pdf"
  },
  adcDe: {
    short: "Meachon et al., 2022",
    label: "Meachon EJ, Beitz C, Zemp M, Wilmut K, Alpers GW (2022). The adult developmental coordination disorders/dyspraxia checklist – German: Adapted factor structure for the differentiation of DCD and ADHD. Research in Developmental Disabilities, 126, 104254.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0891422222000841"
  },
  adcScore: {
    short: "Saidmamatov et al., 2023",
    label: {
      de: "Saidmamatov O, Jammatov J, Sousa C, et al. (2023). Translation and Adaptation of the Adult Developmental Coordination Disorder/Dyspraxia Checklist (ADC) into Asian Uzbekistan. Sports, 11(7), 135. (Beschreibt Wertung 0–3 und Schwellen 56/65.)",
      en: "Saidmamatov O, Jammatov J, Sousa C, et al. (2023). Translation and Adaptation of the Adult Developmental Coordination Disorder/Dyspraxia Checklist (ADC) into Asian Uzbekistan. Sports, 11(7), 135. (Describes 0–3 scoring and the 56/65 cut-offs.)"
    },
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
    label: {
      de: "Löwe B, Wahl I, Rose M, et al. (2010). A 4-item measure of depression and anxiety: validation and standardization of the PHQ-4 in the general population (deutsche Normstichprobe). Journal of Affective Disorders, 122(1–2), 86–95.",
      en: "Löwe B, Wahl I, Rose M, et al. (2010). A 4-item measure of depression and anxiety: validation and standardization of the PHQ-4 in the general population (German norm sample). Journal of Affective Disorders, 122(1–2), 86–95."
    },
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
    sources: ["asrs", "aq10", "dys", "adc", "atq", "phq4", "phq4De", "n4"],
    title: { de: "Allgemeiner Orientierungstest", en: "General orientation test" },
    desc: {
      de: "Du weisst nicht, wo du anfangen sollst? Dieser Test prüft mehrere Bereiche gleichzeitig und zeigt dir, wo sich ein genauerer Blick lohnt.",
      en: "Not sure where to start? This test looks at several areas at once and shows you where a closer look is worthwhile."
    },
    basis: { de: "ASRS-Screener · AQ-10 · Dyslexie-Checkliste · ADC (Kindheit) · Tic-Liste · PHQ-4", en: "ASRS screener · AQ-10 · Dyslexia Checklist · ADC (childhood) · tic list · PHQ-4" },
    questions: [].concat(range("a", 6), range("q", 10), range("d", 15), range("pA", 10), range("m", 4), ["tm", "tv", "td", "xOnset", "xAreas"])
  },
  {
    id: "adhd", icon: "⚡",
    sources: ["asrs", "asrsDe", "asrs5", "asrs5De"],
    title: { de: "ADHS", en: "ADHD" },
    desc: { de: "Aufmerksamkeit, innere Unruhe und Impulsivität im Erwachsenenalter.", en: "Attention, inner restlessness and impulsivity in adulthood." },
    basis: { de: "ASRS v1.1 (WHO) · ASRS-5 (DSM-5)", en: "ASRS v1.1 (WHO) · ASRS-5 (DSM-5)" },
    questions: [].concat(range("a", 20), ["xOnset", "xAreas"])
  },
  {
    id: "asd", icon: "🧩",
    sources: ["aq50", "raadsr", "raadsrNorm", "aq10", "raads14"],
    title: { de: "Autismus-Spektrum", en: "Autism spectrum" },
    desc: {
      de: "Ausführliche Fassung: soziale Wahrnehmung, Kommunikation, Interessen, Routinen und Sinnesempfindlichkeit.",
      en: "Full version: social perception, communication, interests, routines and sensory sensitivity."
    },
    basis: { de: "AQ (50 Fragen) · RAADS-R (80 Fragen) – Überschneidungen nur einmal gefragt", en: "AQ (50 items) · RAADS-R (80 items) – overlapping items asked once" },
    questions: [].concat(range("aq", 50).filter(id => !AQ_FROM_RR[id.slice(2)]), range("rr", 80), ["xAreas"])
  },
  {
    id: "mask", icon: "🎭",
    sources: ["catq"],
    title: { de: "Masking & Anpassung", en: "Masking & camouflaging" },
    desc: {
      de: "Wie stark du dich im sozialen Alltag verstellst oder anpasst – oft der Grund, warum Autismus lange unentdeckt bleibt.",
      en: "How much you adapt or hide yourself in everyday social life – often the reason autism goes unnoticed for a long time."
    },
    basis: { de: "CAT-Q", en: "CAT-Q" },
    questions: range("c", 25)
  },
  {
    id: "dys", icon: "📖",
    sources: ["dys", "dysVal"],
    title: { de: "Dyslexie (Legasthenie)", en: "Dyslexia" },
    desc: { de: "Lesen, Schreiben, Wortfindung und Orientierung.", en: "Reading, writing, word finding and orientation." },
    basis: { de: "Adult Dyslexia Checklist", en: "Adult Dyslexia Checklist" },
    questions: range("d", 15)
  },
  {
    id: "dcd", icon: "🤸",
    sources: ["adc", "adcForm", "adcDe", "adcScore"],
    title: { de: "Dyspraxie (DCD)", en: "Dyspraxia (DCD)" },
    desc: { de: "Bewegungskoordination, Handschrift und Alltagsorganisation – früher und heute.", en: "Movement coordination, handwriting and everyday organisation – then and now." },
    basis: { de: "ADC", en: "ADC" },
    questions: [].concat(range("pA", 10), range("pB", 10), range("pC", 20))
  },
  {
    id: "tic", icon: "🌊",
    sources: ["atq"],
    title: { de: "Tics & Tourette", en: "Tics & Tourette" },
    desc: { de: "Unwillkürliche Bewegungen und Laute, ihre Häufigkeit und Dauer.", en: "Involuntary movements and sounds, how often they occur and for how long." },
    basis: { de: "Tic-Liste nach ATQ · DSM-5-Kriterien", en: "Tic list based on the ATQ · DSM-5 criteria" },
    questions: ["tm", "tv", "tf", "ti", "td", "to", "xAreas"]
  }
];
