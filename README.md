# 🌍 LocalLens — Hyperlocal AI Community Alert Platform

![LocalLens Banner](https://img.shields.io/badge/LocalLens-AI%20Powered-06B6D4?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Deployed-336791?style=for-the-badge&logo=postgresql)
![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%203.3%2070B-purple?style=for-the-badge)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render)

---

## 🚀 Live Demo

The application is fully deployed and operational on Render!

### 👉 [Click Here to Open LocalLens Live](https://locallens-nccs.onrender.com)

> ⚠️ **Note:** First load may take 30–50 seconds (Render free tier spins down after inactivity). Please wait — it will load!

---

## 🧠 What is LocalLens?

**LocalLens** is a real-time, AI-powered hyperlocal community alert platform built for **every city, town, and village in India**. It empowers citizens to **report, verify, and stay informed** about local issues — power cuts, water disruptions, traffic, floods, emergencies, and community events — happening right in their neighborhood.

Unlike WhatsApp groups (unverified, chaotic) or news channels (city-level only), LocalLens brings **street-level intelligence** with a multi-layered trust system combining:

- 🤖 **AI credibility detection** (Groq LLaMA 3.3 70B)
- 👥 **Community crowd verification** (Confirm/Deny voting)
- 🔁 **Automatic duplicate merging** (multiple reporters = more credibility)
- 💬 **Comment sentiment analysis** (Supports / Disputes / Neutral)

---

## 🔥 Core Features

### 🤖 1. Groq AI Intelligence Engine
LocalLens uses **Groq AI (LLaMA 3.3 70B — free tier)** for four distinct AI features:

- **AI Area Summary** — reads all real posts from the database and generates a 2–3 sentence natural language summary of what's happening in the community right now
- **Fake News Detection** — every post is automatically rated as ✅ Verified Likely / ⚠️ Less Likely / 🚩 Suspicious based on content analysis
- **Severity Scoring** — every post is rated 🔴 High / 🟡 Medium / 🟢 Low priority based on urgency
- **Comment Sentiment Analysis** — every comment is analyzed as Supports / Disputes / Neutral relative to the post it's on

---

### 🛡️ 2. Multi-Layer Community Verification System

No single source of truth — LocalLens combines AI + community + comments:

```
Post Created
    │
    ▼
┌─────────────────────────────────────────────┐
│          AI Layer (Groq LLaMA 3.3 70B)      │
│  Credibility: Likely Real / Suspicious       │
│  Severity:    High / Medium / Low            │
└───────────────────────┬─────────────────────┘
                        ▼
┌─────────────────────────────────────────────┐
│        Community Verification Layer          │
│  👍 Confirmed by X locals                   │
│  👎 Denied by Y locals                      │
│  (One vote per user — enforced in DB)        │
└───────────────────────┬─────────────────────┘
                        ▼
┌─────────────────────────────────────────────┐
│         Comment Sentiment Layer              │
│  ✅ Supports (5 comments agree)              │
│  ❌ Disputes (2 comments disagree)           │
│  → "More Likely Happened" / "Less Likely"   │
└─────────────────────────────────────────────┘
                        ▼
              FINAL TRUST VERDICT
```

---

### 🔁 3. Intelligent Duplicate Report Merging

When **multiple citizens report the same incident** (same area + category + content within 24 hours), LocalLens automatically merges them into ONE post card showing:

```
🚨 Emergency — Kukatpally
Power cut since morning!

👥 Reported by: shekar@gmail.com, vaishu@gmail.com, ravi@gmail.com
🔁 3 people reported this — very likely happening!
👍 Confirmed (12)   👎 Denied (1)   ✅ More Likely Happened
```

This eliminates clutter and **increases perceived credibility** when multiple people independently verify the same event.

---

### 🎙️ 4. Voice Post with Auto-Translation

Citizens can speak their update in **any Indian language** — LocalLens converts it to English automatically:

```
User speaks in Telugu → Web Speech API captures text →
MyMemory API translates to English → Post submitted in English
```

Supports: English, Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi

---

### 🌐 5. 22 Indian Language Support

The entire platform is translatable into all **22 official Indian languages** via Google Translate widget. Every page — feed, post create, home, dashboard — can be read in the user's native language.

---

### 🏛️ 6. Government Analytics Dashboard

A dedicated municipal-level dashboard at `/dashboard`:

```
📊 Total Reports Today: 47
🚨 Active Emergencies: 3
✅ AI Verified: 89%

🎯 Most Affected Area: Kukatpally (12 reports)

Category Breakdown:
⚡ Power Cut    ████████████ 32
💧 Water        ████████     18
🚧 Traffic      ██████       14
🚨 Emergency    ████          9

Area Rankings:
#1 Kukatpally      ████████████ 12
#2 Madhapur        ██████████   9
#3 Hitech City     ████████     7
```

---

### 📍 7. Real Indian Place Search

Area input uses **OpenStreetMap Nominatim** (free, no API key) for real place autocomplete:

- Type "Jagath" → suggests "Jagathgirigutta, Kukatpally mandal, Medchal–Malkajgiri, Telangana"
- Works for any city, town, village, or neighborhood across India
- Full address hierarchy stored for precise location context

---

### 🚨 8. Emergency Mode

One tap activates Emergency Mode — feed instantly filters to **only Emergency and Flood posts** with a pulsing red banner. Critical for disaster response situations.

---

### 🛡️ 9. Trust Score System

Every user has a Trust Score: `min(100, posts × 5 + upvotes × 2)`

| Score | Badge |
|-------|-------|
| 80+ | 🏆 Trusted Reporter |
| 50+ | ⭐ Active Contributor |
| 20+ | 🌱 Growing Member |
| 0–19 | 🆕 New Member |

---

## 🧬 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React.js Frontend                  │
│         (Tailwind CSS · React Router · jsPDF)        │
│              Deployed: Render Static Site            │
└─────────────────────┬───────────────────────────────┘
                      │ REST API (JSON)
                      ▼
┌─────────────────────────────────────────────────────┐
│              Spring Boot Backend (Java)              │
│    Spring Security · JWT Auth · JPA · Mail SMTP      │
│              Deployed: Render Web Service            │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐   ┌──────────────────────────────┐
│   PostgreSQL DB   │   │        External APIs          │
│  Render Managed  │   │  🤖 Groq AI (LLaMA 3.3 70B)  │
│  (Free Tier)     │   │  🌍 OpenStreetMap Nominatim   │
└──────────────────┘   │  📧 Gmail SMTP                │
                       │  🌐 MyMemory Translation       │
                       └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | Core UI framework |
| Tailwind CSS | Glassmorphism dark theme UI |
| React Router DOM v6 | Client-side routing |
| Recharts v2 | Bar charts for Trends page |
| jsPDF | PDF report generation |
| Web Speech API | Voice-to-text (browser built-in, free) |
| MyMemory API | Voice post language translation (free) |
| OpenStreetMap Nominatim | Real Indian place search (free) |
| Google Translate Widget | 22 Indian language support |
| PWA Manifest | Mobile home screen installable |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.5 | REST API framework |
| Spring Security | Stateless JWT authentication |
| Spring Data JPA | Database ORM (Hibernate) |
| Spring Boot Mail | Real email via Gmail SMTP |
| JWT (io.jsonwebtoken) | 90-day auth tokens |
| BCrypt | Password hashing |
| Lombok | Boilerplate reduction |
| RestTemplate | Groq AI API HTTP calls |
| Maven | Build & dependency management |

### Database & Deployment
| Technology | Purpose |
|---|---|
| PostgreSQL | Production persistent database |
| Render PostgreSQL | Free managed cloud database |
| Render Web Service | Backend hosting |
| Render Static Site | Frontend hosting |
| GitHub | Version control + CI/CD |

---

## 📊 Database Schema

```
posts              users               comments            post_verifications
──────────         ──────────          ──────────          ──────────────────
id (PK)            id (PK)             id (PK)             id (PK)
area               name                post_id (FK)        post_id
category           email (UNIQUE)      text                user_email
content            password (BCrypt)   commented_by        action
emoji              city                ai_verdict          (confirm/deny/upvote)
color              created_at          created_at
posted_by
credibility (AI)
severity (AI)
confirmed_count
denied_count
upvotes
image_url
created_at
```

---

## 🌐 REST API Reference

### Authentication
```
POST /api/auth/register    — Register (sends welcome email)
POST /api/auth/login       — Login (returns JWT token)
```

### Posts
```
GET  /api/posts/merged     — All posts (duplicates merged)
GET  /api/posts/stats      — Total posts, emergencies, areas
GET  /api/posts/summary    — AI-generated area summary (Groq)
GET  /api/posts/trust-score — Logged-in user's trust score
GET  /api/posts/notifications — Emergency count for user's city
POST /api/posts            — Create post (AI auto-rates it)
PUT  /api/posts/{id}       — Edit post (owner only)
DELETE /api/posts/{id}     — Delete post
PUT  /api/posts/{id}/upvote   — Upvote (one per user)
PUT  /api/posts/{id}/confirm  — Community confirm (one per user)
PUT  /api/posts/{id}/deny     — Community deny (one per user)
POST /api/posts/{id}/image    — Upload proof photo
```

### Comments
```
GET  /api/comments/post/{id}  — Comments + likelihood verdict
POST /api/comments/post/{id}  — Add comment (AI sentiment analysis)
DELETE /api/comments/{id}     — Delete comment
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- PostgreSQL (or use H2 for local dev)
- Groq API key (free at console.groq.com)
- Gmail App Password (free)

### Backend Setup

```bash
cd backend
```

Update `src/main/resources/application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/locallens
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
groq.api.key=your_groq_api_key
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_gmail@gmail.com
spring.mail.password=your_gmail_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

```bash
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

### Frontend Setup

```bash
cd locallens
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## ✨ Feature List

| # | Feature | Status |
|---|---------|--------|
| 1 | Real-time community feed | ✅ Live |
| 2 | AI area summary (Groq LLaMA) | ✅ Live |
| 3 | AI fake news / credibility detection | ✅ Live |
| 4 | AI severity scoring | ✅ Live |
| 5 | Community confirm/deny verification | ✅ Live |
| 6 | Duplicate report merging | ✅ Live |
| 7 | Comment sentiment analysis (AI) | ✅ Live |
| 8 | Voice post (10 Indian languages) | ✅ Live |
| 9 | Auto voice-to-English translation | ✅ Live |
| 10 | Real Indian place search (OpenStreetMap) | ✅ Live |
| 11 | Emergency mode (red alert filter) | ✅ Live |
| 12 | Trust score system | ✅ Live |
| 13 | Government analytics dashboard | ✅ Live |
| 14 | Trends page (bar charts) | ✅ Live |
| 15 | Profile with photo upload | ✅ Live |
| 16 | Edit & delete posts | ✅ Live |
| 17 | Proof photo upload | ✅ Live |
| 18 | PDF report export | ✅ Live |
| 19 | 22 Indian language support | ✅ Live |
| 20 | Real email notifications (Gmail SMTP) | ✅ Live |
| 21 | PWA (installable on mobile) | ✅ Live |
| 22 | One-time voting enforcement (DB tracked) | ✅ Live |
| 23 | Pagination (Load More) | ✅ Live |
| 24 | Category & area filters | ✅ Live |

---

## 👩‍💻 Developer

**Shalini Aligeti**
B.Tech Computer Science Engineering (2023–2027)
DRK College of Engineering & Technology, Hyderabad (JNTUH R22)

- 🔗 GitHub: [github.com/shalini67258](https://github.com/shalini67258)
- 💼 LinkedIn: [linkedin.com/in/shalini-aligeti-2151292b4](https://linkedin.com/in/shalini-aligeti-2151292b4)
- 📧 Email: shalinialigetip@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**🌍 LocalLens — Built for Every Indian City, Powered by AI**

[Live Demo](https://locallens-nccs.onrender.com) · [GitHub](https://github.com/shalini67258) · [LinkedIn](https://linkedin.com/in/shalini-aligeti-2151292b4)

</div>
