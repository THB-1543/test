# 🏢 CRM Pro — KI-gestütztes Customer Relationship Management

Ein modernes, KI-gestütztes CRM-System mit Predictive Lead Scoring, Sentiment-Analyse, Omnichannel-Kommunikation und einer 360°-Kundensicht.

![Dashboard Screenshot](https://github.com/user-attachments/assets/b2a486a6-77e4-4a8e-b8c4-36a4d610f22a)

## ✨ Features

### 1. KI-gestützte Automatisierung und Intelligenz

- **Predictive Lead Scoring** — Automatische Bewertung von Leads basierend auf Verhaltensdaten (E-Mail-Öffnungen, Website-Besuche, Downloads)
- **Sentiment-Analyse** — Automatische Erkennung der Stimmung in Kunden-Nachrichten (DE + EN), mit Auto-Eskalation bei negativem Sentiment
- **Next Best Action** — KI-Empfehlungen für den nächsten Schritt (z.B. "Kontaktiere Kunde X, da sein Vertrag ausläuft")
- **Generative KI für E-Mails** — Personalisierte E-Mail-Entwürfe (Follow-up, Vorstellung, Support) in verschiedenen Tonalitäten
- **Conversation Intelligence** — Analyse von Verkaufsgesprächen mit Feedback zu Redeanteil, Schlüsselwörtern und Tonalität
- **KI-Zusammenfassungen** — Automatische Zusammenfassung von E-Mail-Verläufen und Support-Tickets

### 2. 360°-Kundensicht & Hyper-Personalisierung

- **Unified Customer Profile** — Zusammenführung aller Datenpunkte (Leads, Deals, Tickets, Aktivitäten, Konversationen) in einer Ansicht
- **Health Score** — Automatische Berechnung der Kundengesundheit
- **Dynamische Segmentierung** — Echtzeit-Segmentierung basierend auf Verhalten und Regeln
- **Customer Journey Tracking** — Vollständige Nachverfolgung aller Kundeninteraktionen

### 3. Omnichannel-Kommunikation

- **Integrierte Kanäle** — E-Mail, Telefon, SMS, WhatsApp, Chat und Social Media in einer Inbox
- **KI-Chatbot** — Intelligenter Bot mit Zugriff auf CRM-Daten (z.B. Bestellstatus)
- **Nahtlose Übergabe** — Automatische Eskalation vom Bot an menschliche Mitarbeiter

### 4. Benutzerfreundlichkeit

- **Intuitive Oberfläche** — Modernes, responsives Design mit anpassbaren Dashboards
- **No-Code Workflows** — Visueller Workflow-Builder für automatisierte Kampagnen
- **Mobile-Ready** — Responsive Design für alle Geräte

### 5. Integration & API

- **Marketplace** — Vorgefertigte Integrationen: HubSpot, Mailchimp, SAP, Oracle, Shopify, Magento, Slack, Microsoft Teams, Google Workspace, Microsoft 365, LinkedIn, WhatsApp Business
- **REST API** — Vollständig dokumentierte API für eigene Integrationen

## 🏗 Architektur

```
├── backend/             # Express.js + TypeScript API
│   ├── src/
│   │   ├── database/    # SQLite-Datenbank mit better-sqlite3
│   │   ├── services/    # Business-Logik & KI-Services
│   │   ├── routes/      # REST API-Endpunkte
│   │   └── types/       # TypeScript-Typdefinitionen
│   └── package.json
├── frontend/            # React + TypeScript UI
│   ├── src/
│   │   ├── components/  # UI-Komponenten (Dashboard, Kontakte, Leads, etc.)
│   │   ├── services/    # API-Client
│   │   └── types/       # Shared Types
│   └── package.json
└── README.md
```

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- npm 9+

### Backend starten

```bash
cd backend
npm install
npm run dev
# API läuft auf http://localhost:3001
```

### Frontend starten

```bash
cd frontend
npm install
npm start
# UI läuft auf http://localhost:3000
```

### Tests ausführen

```bash
# Backend-Tests (43 Tests)
cd backend && npm test

# Frontend-Tests
cd frontend && npm test
```

## 📡 API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/health` | Health Check |
| **Kontakte** | | |
| `GET` | `/api/contacts` | Kontakte auflisten |
| `POST` | `/api/contacts` | Kontakt erstellen |
| `GET` | `/api/contacts/:id` | Kontakt abrufen |
| `PUT` | `/api/contacts/:id` | Kontakt aktualisieren |
| `DELETE` | `/api/contacts/:id` | Kontakt löschen |
| `GET` | `/api/contacts/search?q=` | Kontakte suchen |
| `GET` | `/api/contacts/:id/profile` | 360°-Kundenprofil |
| **Leads** | | |
| `GET` | `/api/leads` | Leads auflisten (sortiert nach Score) |
| `POST` | `/api/leads` | Lead erstellen (mit Auto-Scoring) |
| `PATCH` | `/api/leads/:id/status` | Lead-Status ändern |
| `POST` | `/api/leads/rescore` | Alle Leads neu bewerten |
| **Opportunities** | | |
| `GET` | `/api/opportunities` | Opportunities auflisten |
| `POST` | `/api/opportunities` | Opportunity erstellen |
| `GET` | `/api/opportunities/pipeline` | Pipeline-Übersicht |
| `PATCH` | `/api/opportunities/:id/stage` | Pipeline-Stage ändern |
| **Tickets** | | |
| `GET` | `/api/tickets` | Tickets auflisten |
| `POST` | `/api/tickets` | Ticket erstellen (mit Auto-Sentiment) |
| `PATCH` | `/api/tickets/:id/status` | Ticket-Status ändern |
| **Konversationen** | | |
| `POST` | `/api/conversations` | Konversation starten |
| `GET` | `/api/conversations/:id` | Konversation abrufen |
| `POST` | `/api/conversations/:id/messages` | Nachricht senden |
| `GET` | `/api/conversations/:id/summary` | KI-Zusammenfassung |
| **KI-Services** | | |
| `POST` | `/api/ai/sentiment` | Sentiment-Analyse |
| `POST` | `/api/ai/lead-score` | Lead-Scoring berechnen |
| `POST` | `/api/ai/email-draft` | E-Mail generieren |
| `POST` | `/api/ai/analyze-call` | Gesprächsanalyse |
| **Konfiguration** | | |
| `GET/POST` | `/api/segments` | Segmente verwalten |
| `GET/POST` | `/api/workflows` | Workflows verwalten |
| `GET/POST` | `/api/integrations` | Integrationen verwalten |
| `GET` | `/api/integrations/marketplace` | Verfügbare Integrationen |

## 🧪 Test-Abdeckung

- **43 Backend-Tests** — Services (AI, CRM) und API-Endpunkte
- **2 Frontend-Tests** — Rendering und Navigation
- Testbereiche: Lead Scoring, Sentiment-Analyse, CRUD-Operationen, 360°-Profil, Omnichannel, Workflows, Integrationen
