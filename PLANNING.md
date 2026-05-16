# Planungsdokument — IT Support Assistant

Dieses Dokument dient als gemeinsame Arbeitsgrundlage. Trage deine Wünsche und Ideen unter den jeweiligen Themen ein. Claude arbeitet die Requirements der Reihe nach ab und aktualisiert den Status.

---

## Status-Legende

| Symbol | Bedeutung |
|--------|-----------|
| 💡 | Idee / noch nicht bewertet |
| 📋 | Geplant / bereit zur Umsetzung |
| 🔄 | In Bearbeitung |
| ✅ | Umgesetzt |
| ⏸ | Zurückgestellt |

---

## 1. Organigramm

### Umgesetzt
- ✅ Globale Standortstruktur mit 9 Standorten
- ✅ ITOT Sitehead pro Standort
- ✅ Teams mit Teamlead und Mitgliedern
- ✅ Stabsstellen direkt am Sitehead
- ✅ Weltkarte mit interaktiven Pins
- ✅ Standort-Detailansicht (Klick auf Karte)
- ✅ Globale & regionale Matrix-Teams
- ✅ Mitarbeitersuche über alle Standorte

### Offen — Deine Wünsche hier eintragen
<!-- Beispiel:
- 💡 Foto-Upload für Mitarbeiter
- 💡 Export als PDF / PowerPoint
-->


---

## 2. Projektportfolio

### Umgesetzt
- ✅ Projektliste mit Status, Priorität, Tags
- ✅ Filter nach Status (Aktiv / Planung / Abgeschlossen / On Hold)
- ✅ Fortschrittsanzeige und Budget-Auslastung pro Projekt
- ✅ Projektverantwortlicher und Laufzeit

### Offen — Deine Wünsche hier eintragen


---

## 3. Finanzen & Budget

### Umgesetzt
- ✅ Gesamtbudget, Ausgaben YTD, Prognose
- ✅ Abteilungs-Budget-Tabelle
- ✅ Kostenkategorien mit Balkendiagramm
- ✅ Monatliches Ausgaben-Diagramm (Ist vs. Prognose)

### Offen — Deine Wünsche hier eintragen
- Alle ACTIVITIES sind verschiedenen Kostenkategorien zugeordnet.
- Die Kostenkatogiren sind wie folgt aufgeteilt. Im Groben gibt es RUN und INVESTMENTS. RUN beinhaltet die Services des daily business und sind unterteilt in RUN und NEW RUN. NEW RUN ist das Ergebnis eines Investments was erstmalig zu einem RUN wird.
- INVESTMENTS sind kategoriert in CARRY OVER (ein Investment welches aus dem letzten Jahr weitergeführt wird), LTO (licence to operate - muss aus regulatorischen oder ähnlich wichtigen Gründen umgesetzt werden bspw CyberSecurity), BC (Business Capability - wird zu verbesserung der Business Capabilities umgesetzt) und Tech (Technology driven - Verbesserung aus technologischen Gründen, neue Systeme oder Hardware)
- alle ACTIVITIES haben verschiedene Kosten Typen. Das sind 3rd Party Kosten (LICENCES und MSPs/ Service Contracts) sowie LABOUR (Interne FTE, Externe FTE und Contractors). Die Summe der Kosten Typen ergibt die Gesamtkosten einer ACTIVITY
- Als entsprechendes System wird ServiceNow verwendet. Aktuell bitte Dummy Daten verwenden aber zukünftig wird ServiceNow direkt angebunden oder über einen gSheet / Excel importiert. Bitte eine ServiceNow APM ID für jede Activity vorsehen

---

## 4. KI-Chat Assistent

### Umgesetzt
- ✅ Streaming-Chat mit Claude API
- ✅ Vollständiger Org/Projekt/Finanz-Kontext im System-Prompt
- ✅ Floating-Button + Seitenleiste

### Offen — Deine Wünsche hier eintragen


---

## 5. Dashboard

### Umgesetzt
- ✅ KPI-Karten (Budget, Projekte, Mitarbeiter, Standorte)
- ✅ Projekt-Status-Übersicht
- ✅ Budget-Übersicht pro Abteilung
- ✅ Schnellzugriff auf alle Bereiche
- ✅ Aktive Projekte (Übersicht)

### Offen — Deine Wünsche hier eintragen
- Aufschlüsselbar nach Kosten Kategorie und Kosten Typ. 

---

## 6. Neue Datenbereiche

### Umgesetzt
*(noch keine neuen Bereiche)*

### Offen — Deine Wünsche hier eintragen
<!-- Mögliche Ideen:
- 💡 Tickets / Incidents (SLA, Kategorien, Eskalationen)
- 💡 SLA-Übersicht
- 💡 Risikomanagement
- 💡 Vendor Management
-->
- Bitte siehe für jede Site einen eigenen Bereich vor in dem eine Site verschiedene Informationen über sich teilen kann.
- Dies können die aktuellen Produkte, Services und Projekte sein.
- Bitte lege als Dummy eine Seite für eine Site "Philadelphia" an.
- hier werden die Bereiche "Beschreibung ITOT", "In Scope", "Roadmap", "Systeme in Fokus", "Projekte in Scope" als Start benötigt.

---

## 7. Technische Infrastruktur & Deployment

### Umgesetzt
- ✅ Next.js 14 mit TypeScript und Tailwind CSS
- ✅ JSON-Pseudodaten (einfach ersetzbar)
- ✅ API-Routen für alle Datenbereiche
- ✅ CLAUDE.md mit Architektur-Dokumentation

### Offen — Deine Wünsche hier eintragen
<!-- Mögliche Ideen:
- 💡 Deployment auf Vercel
- 💡 Authentifizierung / Login
- 💡 Datenbankanbindung (statt JSON)
- 💡 Anbindung echter Datenquellen (ServiceNow, SAP, etc.)
-->


---

## 8. Sonstiges / Übergreifend

### Umgesetzt
*(noch keine übergreifenden Features)*

### Offen — Deine Wünsche hier eintragen


---

*Letzte Aktualisierung: 16.05.2026*
