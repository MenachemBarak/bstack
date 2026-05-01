# Vercel Observability Dashboard

**Plans:** All (Hobby, Pro, Enterprise)  
**URL:** `vercel.com/<team>/<project>/observability`  
**Docs:** https://vercel.com/docs/observability/observability-dashboard

---

## What It Is

Built-in, zero-config request/function monitoring. No instrumentation needed — Vercel collects data automatically from every deployment including preview and production.

---

## Retention by Plan

| Plan | Free Retention |
|---|---|
| Hobby | 12 hours |
| Pro | 1 day |
| Enterprise | 3 days |
| Observability Plus (add-on) | 30 days |

---

## 14 Insight Sections

Each section shows request count, error rate, latency, and top errors.

| Section | What It Monitors |
|---|---|
| **Vercel Functions** | Serverless function invocations, duration, cold starts |
| **External APIs** | Outbound fetch calls from your functions |
| **Edge Requests** | Edge function invocations and latency |
| **Middleware** | Next.js/Vercel middleware execution |
| **Fast Data Transfer** | CDN-served static assets, cache hit ratio |
| **Image Optimization** | `/api/image` transforms — format, size, cache |
| **ISR (Incremental Static Regeneration)** | Revalidation requests, stale-while-revalidate hits |
| **Blob** | Vercel Blob storage reads/writes |
| **Build Diagnostics** | Build time, bundle size trends |
| **AI Gateway** | Model calls routed through AI Gateway |
| **Queues** | Vercel Queue message processing |
| **External Rewrites** | Proxy rewrites to upstream origins |
| **Microfrontends** | Multi-zone federation request routing |
| **Cron Jobs** | Scheduled function execution status |

---

## Filtering

- Time range: 30m / 1h / 6h / 24h / 7d (within retention window)
- Environment: Production, Preview, All
- Deployment: specific deployment
- Region: any Vercel edge region
- Path: URL prefix or exact path

---

## Observability Plus (Add-On)

**Price:** $10/month base + $1.20 per million events  
**Availability:** Pro and Enterprise

Additional capabilities over the free dashboard:

| Feature | Description |
|---|---|
| **30-day retention** | Full month of query history |
| **Query editor** | SQL-like query interface for custom analysis |
| **Notebooks** | Collaborative analysis documents mixing queries + prose |
| **Full latency data** | Raw per-request timing breakdown |
| **p75 breakdowns** | Per-path 75th-percentile latency heatmaps |
| **Trace correlation** | Link dashboard metrics → individual trace spans |
| **Export** | Download query results as CSV |

---

## Key Metrics Exposed

- **Request volume** — RPS, total requests per time bucket
- **Error rate** — 4xx / 5xx broken out separately
- **Latency** — p50, p75, p90, p95, p99
- **Function duration** — wall-clock execution time
- **Cold start rate** — % of invocations with cold start
- **Cache hit ratio** — CDN cache effectiveness
- **Data transferred** — bytes in/out per category

---

## Environments Covered

All three environments are tracked:
- **Production** — live traffic
- **Preview** — every PR/branch deployment
- **Development** — local `vercel dev` (limited)

---

## Integration with Alerts

Observability dashboard metrics feed directly into the Alerts system. When a metric exceeds threshold (e.g., error rate spike), an alert fires and optionally triggers AI Investigation using the same dashboard data.
