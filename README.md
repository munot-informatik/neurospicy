# 🌶️ Neurospicy

Selbsttests zur Neurodiversität – freundlich, anonym und auf Grundlage veröffentlichter Screening-Fragebögen.

**Live:** https://spicy.munot-informatik.ch

> **Wichtig:** Neurospicy stellt keine Diagnose und ist kein Medizinprodukt. Die Tests zeigen nur, ob Anzeichen vorliegen könnten. Eine Diagnose kann ausschliesslich eine qualifizierte Fachperson nach einer persönlichen Abklärung stellen.

## Was das Tool macht

Neurospicy ist eine kleine Web-App ohne Server-Logik. Sie führt durch sieben Selbsttests, wertet die Antworten nach den Regeln der Originalarbeiten aus und erklärt das Ergebnis in ruhiger, verständlicher Sprache.

| Test | Grundlage | Fragen |
|---|---|---|
| Allgemeiner Orientierungstest | ASRS-Screener, AQ-10, Dyslexie-Checkliste, ADC (Kindheit), Tic-Liste, PHQ-4 | 50 |
| ADHS | ASRS v1.1, ASRS-5 | 22 |
| Autismus-Spektrum (Langfassung) | AQ (50 Fragen), RAADS-R (80 Fragen); 11 inhaltsgleiche Fragen nur einmal gestellt | 120 |
| Masking & Anpassung | CAT-Q | 25 |
| Dyslexie (Legasthenie) | Adult Dyslexia Checklist | 15 |
| Dyspraxie (DCD) | ADC | 40 |
| Tics & Tourette | Tic-Liste nach ATQ, DSM-5-Kriterien | 7 |

Eigenschaften:

- **Zufällige Reihenfolge.** Die Fragen werden bei jedem Durchgang neu gemischt. Es ist nicht sichtbar, zu welchem Fragebogen eine Frage gehört oder wie stark sie zählt.
- **Einfach- und Mehrfachauswahl.** Die meisten Fragen haben eine Antwortskala; Tic-Listen und Lebensbereiche erlauben mehrere Antworten.
- **Hinweis vor dem Start.** Ohne Bestätigung, dass der Test keine Diagnose ist, lässt sich kein Test starten.
- **Nachvollziehbare Auswertung.** Jede Ergebniskarte zeigt Punktwert, Schwelle, Einordnung und die Quelle.
- **Deutsch und Englisch.** Die Sprache lässt sich oben rechts jederzeit umschalten, auch mitten im Test.
- **Helles und dunkles Design.** Folgt der Systemeinstellung und lässt sich oben rechts umschalten.
- **Privat.** Alle Antworten bleiben im Browser. Es gibt keine Datenbank, keine Cookies, kein Tracking. Nur Sprache und Design werden lokal im Browser gemerkt.

## Lokal starten

Voraussetzung ist Node.js. Es gibt keine Abhängigkeiten und keinen Build-Schritt.

```bash
node server.js
```

Danach http://localhost:5173 öffnen. Die App besteht nur aus den statischen Dateien im Ordner `public/` und läuft auf jedem Webspace.

## Veröffentlichen

Die Live-Seite läuft als Cloudflare Worker, der den Ordner `public/` ausliefert:

```bash
npx wrangler deploy
```

| Datei | Inhalt |
|---|---|
| `public/index.html`, `public/styles.css` | Seite und Gestaltung |
| `public/data.js` | Fragen, Antwortskalen, Quellen, Testzusammenstellung |
| `public/scoring.js` | Auswertung und Ergebnistexte |
| `public/app.js` | Ablauf: Start, Fragen, Ergebnis |
| `server.js` | Kleiner lokaler Server zum Ausprobieren |
| `wrangler.jsonc` | Konfiguration für Cloudflare Workers |

## FAQ

### Ist das eine Diagnose?

Nein. Screening-Fragebögen zeigen, ob eine Abklärung sinnvoll sein könnte. Ein auffälliges Ergebnis bedeutet nicht, dass eine Störung vorliegt, und ein unauffälliges schliesst sie nicht aus.

### Wie genau sind die Tests?

So genau wie die zugrunde liegenden Fragebögen, mit drei Einschränkungen:

1. Die deutschen Fragen sind sinngemässe Übertragungen und keine offiziell validierten Übersetzungen.
2. Die Originalbögen haben eine feste Reihenfolge; hier wird gemischt.
3. Die Stufe «Leichte Hinweise» ist bei den meisten Tests eine Ergänzung dieser App und stammt nicht aus den Studien.

Screening-Tests schlagen ausserdem bewusst lieber einmal zu oft an als einmal zu wenig. Der RAADS-14 etwa erkennt 97 % der autistischen Erwachsenen, ist aber auch bei vielen Menschen mit ADHS positiv.

### Sind mehr Fragen genauer?

Teilweise. Längere Fragebögen messen stabiler und zeigen ein Profil über mehrere Bereiche; deshalb verwendet der Autismus-Test die Langfassungen AQ und RAADS-R. Die Trefferquote steigt aber nicht beliebig: Auch 130 Fragen bleiben eine Selbsteinschätzung und ersetzen weder Beobachtung noch Gespräch.

### Warum klingen manche Fragen fast gleich?

Innerhalb eines Fragebogens ist das gewollt. RAADS-R, CAT-Q und ADC fragen ähnliche Dinge absichtlich mehrmals, teils gegenteilig formuliert oder einmal für die Kindheit und einmal für heute. So lässt sich prüfen, ob die Antworten stimmig sind; die Schwellen gelten nur mit allen Fragen.

Zwischen zwei Fragebögen ist es nicht nötig. Der Autismus-Test kombiniert AQ und RAADS-R. 11 AQ-Fragen entsprechen inhaltlich einer RAADS-R-Frage und werden deshalb nur einmal gestellt. Für den AQ zählt dann, ob die Aussage heute zutrifft. Der AQ wird ohnehin nur nach Zustimmung oder Ablehnung gewertet, die Zuordnung ist deshalb eindeutig.

### Woher stammen Fragen und Schwellen?

Aus den veröffentlichten Originalbögen und Studien. Sie sind in der App unter «Quellen» pro Test verlinkt und in [`public/data.js`](public/data.js) hinterlegt.

### Was wurde nicht an der Primärquelle geprüft?

- **ASRS-5:** Die Originalstudie verwendet eine gewichtete Wertung, deren Punktwerte nicht frei veröffentlicht sind. Die App rechnet mit der einfachen Summe (0–4 pro Frage, Schwelle 14).
- **ADC (Dyspraxie):** Wertung 0–3 und die Schwellen 56/65 sind über spätere Studien belegt, nicht über die Originalarbeit. Andere Sprachfassungen verwenden abweichende Schwellen.
- **RAADS-R:** Die Fragen und Punktwerte stammen aus einem Auswertungsbogen von NovoPsych, weil der Fragebogen in der Originalarbeit nur als Bild vorliegt. Die Autoren haben ihn für die Anwendung zusammen mit einer Fachperson entwickelt; online und allein ausgefüllt fallen die Werte oft höher aus.
- **AQ (50 Fragen):** Frage 1 wird bei Ablehnung gewertet. In der Originalarbeit steht sie irrtümlich in der Liste «Zustimmung».
- **CAT-Q:** Die Autoren nennen keine Schwelle. 100 von 175 ist ein verbreiteter, inoffizieller Orientierungswert.
- **Tics:** Für Tic-Fragebögen gibt es keine validierte Diagnoseschwelle. Die Einordnung folgt den DSM-5-Kriterien.

### Warum fehlt Dyskalkulie?

Für Erwachsene gibt es derzeit keinen validierten Selbsttest.

### Werden meine Antworten gespeichert?

Nein. Die Auswertung läuft vollständig im Browser. Beim Schliessen oder Neuladen der Seite sind die Antworten weg.

### Warum erscheinen Fragen zu Stimmung und Angst?

Depressive Verstimmung und Angst können Konzentration, Antrieb und sozialen Rückzug stark beeinflussen und so andere Ergebnisse erhöhen. Der Kurztest PHQ-4 hilft, das einzuordnen.

### Für wen sind die Tests gedacht?

Für Erwachsene. Die verwendeten Fragebögen wurden für Personen ab etwa 16 Jahren entwickelt.

### Was mache ich mit einem auffälligen Ergebnis?

Ergebnis ausdrucken oder als PDF speichern, konkrete Alltagsbeispiele notieren und mit der Hausärztin, dem Hausarzt oder einer psychologischen oder psychiatrischen Fachperson besprechen.

### Darf ich den Code verwenden?

Ja, der Code steht unter der MIT-Lizenz. Für die Fragebögen selbst gilt das nicht, siehe nächster Abschnitt.

## Lizenz und Rechte an den Fragebögen

Der **Code** dieses Projekts steht unter der [MIT-Lizenz](LICENSE).

Die **Fragebögen** gehören ihren jeweiligen Rechteinhabern und sind von der MIT-Lizenz ausgenommen. Die Fragen in `public/data.js` sind eigene deutsche Übertragungen dieser Instrumente. Wer das Projekt weiterverwendet oder kommerziell einsetzt, muss die Nutzungsrechte selbst klären. Details stehen in [NOTICE.md](NOTICE.md).

## Hilfe in Krisen

Schweiz 143 (Die Dargebotene Hand) · Deutschland 0800 111 0 111 (Telefonseelsorge) · Österreich 142 · Notfall 112
