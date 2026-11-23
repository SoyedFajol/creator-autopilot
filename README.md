# Creator Autopilot 🚀

> **All-in-one faceless brand command center and autonomous video pipeline for US audiences.**

Built specifically for single-creator operations. Designed for high reliability, zero bloat, enterprise-grade security, and sustainable unit economics (measured by **revenue minus cost**, not views).

---

## 📁 Project Structure (TypeScript Monorepo)

```
creator-autopilot/
├── packages/
│   ├── core/           # Shared domain models, Drizzle ORM schema, platform adapters, encryption & AI services
│   └── video/          # Remotion compositions (16:9 & 9:16), motion graphics templates, subtitle burn-in, SVG thumbnail generator
├── apps/
│   ├── web/            # Next.js 15 dashboard (Phone-friendly review queue, manual export page, daily report, settings)
│   └── workers/        # Production pipeline, publishing dispatcher, nightly analytics collector & encrypted backup runner
└── .github/
    └── workflows/      # GitHub Actions: daily-production.yml, publish.yml, nightly-analytics.yml, ci.yml
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **pnpm**: v10+ (`npm install -g pnpm`)

### 2. Install & Build All Packages
```bash
# In the root creator-autopilot directory:
pnpm install
pnpm run build
```

### 3. Run Automated Tests
```bash
pnpm run test
```
*All 13 automated tests across Core, Video, and Workers will execute and verify end-to-end functionality.*

### 4. Start the Dashboard
```bash
pnpm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser or phone.

---

## 📱 Navigation & Features

| Route | Purpose | Key Capabilities |
|---|---|---|
| `/` | **Daily Performance & Revenue Report** | Single-screen verdict, revenue minus costs, cross-platform totals, performance vs brand median, 3 actions for tomorrow. |
| `/queue` | **Phone-friendly Review Queue** | Video preview, platform caption editor, designed thumbnail picker (Option A/B), verified claim audit, Approve/Reject. |
| `/manual-export` | **Fast Phone Export Page** | One-tap MP4 & cover downloads, one-tap copy for captions & hashtags, platform policy reminders, "Mark Posted" URL tracker. |
| `/comments` | **Engagement Queue** | Gathers comments, drafts AI replies, **requires manual approval** before posting. |
| `/brands` | **Brands & Niches** | Stack Simple & Worth the Upgrade active; 4 YMYL brands ready to activate at day 60 with one click. |
| `/brief` | **Morning Brief** | 08:00 AM Dhaka review: override video format, force specific topic, or allow saved defaults after cutoff. |
| `/analytics` | **Normalized Analytics** | Time-series retention, completion rate, pillar breakdown, and A/B hook/template experiments. |
| `/revenue` | **Revenue & Funnel Tracking** | Tracked link builder, affiliate click metrics, monthly server spend vs \$50 budget meter. |
| `/settings` | **Settings & Security** | **One-Click Emergency Stop**, secret rotation steps, encrypted backup status & test restore button, audit logs. |

---

## 🔒 Security Review & OWASP Top 10 Compliance

| OWASP / Security Area | Implementation in Creator Autopilot | Status |
|---|---|---|
| **A01: Broken Access Control** | Authenticated middleware on all dashboard routes; strict single-admin allowlist; worker endpoints require signed short-lived JWT tokens (`role: workflow_worker`). | ✅ PASS |
| **A02: Cryptographic Failures** | Platform tokens and sensitive keys encrypted at rest with authenticated **AES-256-GCM** with random IVs and integrity tags. Passwords never stored. | ✅ PASS |
| **A03: Injection** | Parameterized queries only via Drizzle ORM; AI output sanitized and validated through strict Zod schemas before entering the pipeline. | ✅ PASS |
| **A04: Insecure Design** | One-click emergency stop; destructive actions require second confirmation; human-in-the-loop approval on all posts and comment replies. | ✅ PASS |
| **A05: Security Misconfiguration** | Strict Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. Postgres bound only to localhost. | ✅ PASS |
| **A06: Vulnerable Components** | All dependencies pinned to fixed versions; CI pipeline tests dependencies; GitHub Dependabot enabled. | ✅ PASS |
| **A07: Identification & Auth** | Google OAuth via trusted identity provider; session cookies set to `HttpOnly`, `Secure`, and `SameSite=Strict`. | ✅ PASS |
| **A08: Software & Data Integrity** | GitHub Actions workflows use pinned hashes and protected deployment environments; published content verified against database approvals. | ✅ PASS |
| **A09: Security Logging & Monitoring** | Central `AuditLogger` tracks sign-ins, approvals, rejections, manual exports, and emergency stops with IP address and actor. | ✅ PASS |
| **A10: Server-Side Request Forgery** | External media downloads restricted to verified domains (Pexels, Backblaze B2); no unvalidated user URLs executed by workers. | ✅ PASS |

---

## 🚀 Deployment Instructions

### Option A: Railway (Recommended for Beginners — Fully Managed)
1. Fork or push this repository to your private GitHub account.
2. Sign in to [Railway.app](https://railway.app) using your GitHub account.
3. Click **New Project** → **Deploy from GitHub repo** → select `creator-autopilot`.
4. Add a **PostgreSQL** database service in the Railway canvas.
5. In the `web` service settings:
   - Root directory: `apps/web`
   - Build command: `pnpm --filter @creator-autopilot/* run build`
   - Start command: `pnpm --filter @creator-autopilot/web run start`
   - Set environment variables from `.env.example`.
6. Railway automatically handles HTTPS, deployment, and daily database backups.

### Option B: Hetzner Cloud VPS + Coolify
1. Provision a Hetzner Cloud CX23 VPS (~€6/month) running Ubuntu 24.04 LTS.
2. Install Coolify via official one-line command:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
3. Open Coolify web interface, connect your private GitHub repo.
4. Set build pack to Nixpacks/Node.js, set port `3000`, configure production environment variables.
5. Point your custom domain's DNS A-record to your VPS IP address; Caddy auto-issues SSL.
