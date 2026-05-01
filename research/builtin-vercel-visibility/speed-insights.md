# Vercel Speed Insights

**Plans:** All (free tier included)  
**Docs:** https://vercel.com/docs/speed-insights  
**Dashboard:** Project → Speed Insights tab

---

## What It Is

Real User Monitoring (RUM) for Core Web Vitals. Tracks actual visitor performance across all environments including preview deployments.

---

## Setup

```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx (Next.js App Router)
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Framework-specific packages:
- `@vercel/speed-insights/next` — Next.js
- `@vercel/speed-insights/react` — React (Vite, CRA)
- `@vercel/speed-insights/vue` — Vue
- `@vercel/speed-insights/sveltekit` — SvelteKit
- `@vercel/speed-insights/nuxt` — Nuxt
- `@vercel/speed-insights/astro` — Astro
- `@vercel/speed-insights` — vanilla JS

---

## Metrics Tracked

All 6 Google Core Web Vitals:

| Metric | Name | Good | Needs Improvement | Poor |
|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | ≤2.5s | 2.5–4s | >4s |
| **FCP** | First Contentful Paint | ≤1.8s | 1.8–3s | >3s |
| **CLS** | Cumulative Layout Shift | ≤0.1 | 0.1–0.25 | >0.25 |
| **INP** | Interaction to Next Paint | ≤200ms | 200–500ms | >500ms |
| **TTFB** | Time to First Byte | ≤800ms | 800ms–1.8s | >1.8s |
| **FID** | First Input Delay (legacy) | ≤100ms | 100–300ms | >300ms |

---

## Dashboard Features

- **Score card** — p75 composite score per page (0–100)
- **Per-page breakdown** — which routes are slow
- **Percentile selector** — p50, p75, p90, p95, p99
- **Time range** — 24h, 7d, 30d, 90d
- **Environment filter** — Production + Preview + all preview deployments
- **Geographic map** — median score by country/region
- **Device type filter** — Desktop vs Mobile vs Tablet
- **Connection filter** — 4G, 3G, slow-2G
- **Comparison** — current deployment vs previous

---

## Preview Deployment Support

Speed Insights works in preview deployments automatically — great for catching performance regressions in PRs before merge.

---

## Data Sampling

| Plan | Events/month |
|---|---|
| Hobby | 2,500 |
| Pro | 25,000 |
| Enterprise | Custom |

Additional events: $0.0001 per event above limit (Pro/Enterprise).

---

## Privacy

- No cookies
- No cross-site tracking
- Collects only performance timing data — no user identifiers
- GDPR-compliant by design

---

## API Access

```bash
# Get Speed Insights data via REST API
GET /v1/speed-insights/deployments/{deploymentId}/metrics
```

Available in Vercel REST API with project token.
