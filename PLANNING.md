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
- ✅ Activities-Datenmodell mit ServiceNow APM-ID
- ✅ Kostengruppen RUN / INVESTMENTS mit Unterkategorien (RUN, NEW_RUN, CARRY_OVER, LTO, BC, TECH)
- ✅ Kostentypen 3rd Party (Licences, MSP/Service Contracts) und LABOUR (Internal FTE, External FTE, Contractors)
- ✅ Toggle-Ansicht "Nach Kategorie" / "Nach Kostentyp" auf der Finanzenseite
- ✅ Collapsible Activity-Tabelle mit APM-ID, Kategorie und allen Kostenspalten (sortiert nach Gesamtkosten)
- ✅ 22 realistische Dummy-Activities (~4,6 Mio. EUR Gesamtvolumen)

### Offen — Deine Wünsche hier eintragen

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
- ✅ Kostenaufschlüsselung-Widget: RUN vs. INVESTMENTS und 3rd Party vs. LABOUR (mit Prozent-Splits und Balken)

### Offen — Deine Wünsche hier eintragen

---

## 6. Neue Datenbereiche

### Umgesetzt
- ✅ Site Pages Datenmodell (data/site-pages.json)
- ✅ Standorte-Übersichtsseite (/standorte) mit Kacheln pro Standort
- ✅ Standort-Detailseite (/standorte/[id]) mit 5 Sektionen: Beschreibung ITOT, In Scope, Roadmap, Systeme in Fokus, Projekte in Scope
- ✅ Dummy-Seite für Standort "Philadelphia" (USA)
- ✅ Sidebar-Link "Standorte" mit Globe-Icon

### Offen — Deine Wünsche hier eintragen
<!-- Mögliche Ideen:
- 💡 Tickets / Incidents (SLA, Kategorien, Eskalationen)
- 💡 SLA-Übersicht
- 💡 Risikomanagement
- 💡 Vendor Management
-->

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
