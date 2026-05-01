# Vercel Built-in Observability & Monitoring

Complete reference for every observability and monitoring capability available on Vercel — built-in, add-ons, drains, and marketplace integrations.

## Directory

| File | Coverage |
|---|---|
| [observability-dashboard.md](observability-dashboard.md) | Built-in Observability dashboard + Observability Plus |
| [logs.md](logs.md) | Build, Runtime, Activity, Audit logs + Log Drains |
| [speed-insights.md](speed-insights.md) | Core Web Vitals tracking |
| [web-analytics.md](web-analytics.md) | Privacy-first page analytics |
| [alerts.md](alerts.md) | Error & Usage anomaly alerts |
| [drains.md](drains.md) | Logs/Traces/Speed/Analytics drains |
| [ai-gateway.md](ai-gateway.md) | AI Gateway observability |
| [marketplace-integrations.md](marketplace-integrations.md) | Sentry, Datadog, Checkly, New Relic, and more |

## Quick Coverage Map

```
Vercel Project
├── Functions / Edge / Middleware  → Observability Dashboard (all plans)
├── Core Web Vitals                → Speed Insights (all plans)
├── Page traffic                   → Web Analytics (all plans)
├── Error spikes / usage anomalies → Alerts (all plans)
├── Full log stream                → Log Drains → any HTTP endpoint (Pro+)
├── Distributed traces             → Trace Drains (OTel) (Pro+)
├── AI model calls                 → AI Gateway Observability
└── Third-party APM                → Marketplace integrations
```

## Plan Tiers

| Feature | Hobby | Pro | Enterprise |
|---|---|---|---|
| Observability Dashboard | ✓ (12hr) | ✓ (1day) | ✓ (3days) |
| Observability Plus | — | $10/mo add-on | Available |
| Speed Insights | ✓ | ✓ | ✓ |
| Web Analytics | ✓ | ✓ | ✓ |
| Alerts | ✓ | ✓ | ✓ |
| Log Drains | — | ✓ ($0.50/drain) | ✓ |
| Audit Logs | — | — | ✓ (90-day export) |
