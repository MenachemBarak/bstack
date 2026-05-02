# 3rd-Party Vercel Visibility Research

Full-stack observability beyond Vercel's built-ins — real app architectures, OpenAI Symphony, and every 3rd-party tool that integrates with Vercel.

## Directory

| File | Coverage |
|---|---|
| [top-10-vercel-apps.md](top-10-vercel-apps.md) | Architecture + observability challenges for Stripe, Notion, Gamma, Leonardo, Washington Post, Morning Brew, Under Armour, Fanatics, PAIGE, Suno |
| [openai-symphony.md](openai-symphony.md) | What Symphony is, its observability spec, OpenAI Agents SDK tracing, Vercel AI SDK + OTel |
| [third-party-integrations.md](third-party-integrations.md) | Every 3rd-party tool: APM, logs, error tracking, uptime, DB, product analytics, AI/LLM, OTel collectors |

---

## Key Insights

### What the top 10 apps all have in common
1. All use **Preview Deployments** as primary safety net
2. All run **ISR or hybrid rendering** — not pure SSR or pure static
3. The hardest observability problem is always **split architecture** — Vercel covers the web/function layer, but AI inference / DB / commerce backends need external trace stitching

### The Full Visibility Stack

```
User Browser
├── Speed Insights (CWV: LCP, CLS, INP)
├── Web Analytics (pageviews, custom events)
└── Session Replay (FullStory, LogRocket, Highlight, PostHog)

Vercel Edge / Functions
├── Observability Dashboard (built-in, 14 insight sections)
├── Alerts (anomaly detection)
├── Log Drain → Axiom / Splunk / Better Stack / Datadog
├── Trace Drain (OTLP/HTTP) → Grafana / Datadog / Elastic / SigNoz
└── Speed + Analytics Drain → custom endpoint

AI Layer (OpenAI / Anthropic / Google)
├── Vercel AI SDK experimental_telemetry → OTel spans
├── OpenAI Agents SDK built-in tracing → platform.openai.com
└── LLM Observability → Braintrust / Langfuse / Arize / PostHog

Database Layer
├── Neon / Supabase / PlanetScale → own dashboards
└── Query-level tracing via OTel SDK instrumentation

Uptime / Synthetic
├── Checkly (Playwright on every deploy)
└── UptimeRobot (always-on HTTP checks)

Alerting / On-call
└── PagerDuty / OpsGenie ← receives from Datadog, Checkly, Sentry, UptimeRobot
```

### OpenAI Symphony in One Line
Symphony is an **agent orchestration spec** (not an observability product) that uses Elixir + Linear to autonomously dispatch Codex agents to write and ship PRs. Its built-in observability layer exposes `GET /api/v1/state`, per-issue debug endpoints, and configurable log sinks.

### Recommended Minimal Stack for a Production Vercel App

| Layer | Tool | Why |
|---|---|---|
| Errors | Sentry (Marketplace) | Auto source maps, release tracking |
| Logs | Axiom (Marketplace) | 100% data, zero sampling, instant setup |
| Traces | Datadog or Grafana Cloud | Full APM + OTel correlation |
| Uptime | Checkly (Marketplace) | E2E synthetic on every deploy |
| AI observability | Braintrust (Marketplace) | LLM evals + cost tracking |
| User analytics | PostHog (Marketplace) | Feature flags + session replay + analytics |
