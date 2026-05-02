# 3rd-Party Visibility Integrations for Vercel

Every tool that can integrate with Vercel for full observability — categorized by integration method.

---

## Foundation: Vercel Drains

All export-based integrations flow through **Vercel Drains** (Pro $0.50/drain, Enterprise included).

| Data Type | Schema | Format |
|---|---|---|
| Logs | `log` v1 | JSON, NDJSON, Syslog |
| Traces | `trace` v1 | OTLP/HTTP JSON or Protobuf |
| Speed Insights | `speed_insights` v1 | JSON, NDJSON |
| Web Analytics | `analytics` v2 | JSON, NDJSON |

**Critical constraint:** Trace drains use OTLP/HTTP (port 4318). OTLP/gRPC is NOT supported.  
Traces include `traceId` + `spanId` — correlated with logs automatically.

---

## APM / Full-Stack Observability

### Datadog ★ Native Marketplace
- **Method:** Native Vercel Marketplace integration → auto-configures Log Drain + Trace Drain
- **Data:** Runtime logs, build logs, OTel traces → Datadog APM, metrics
- **LLM:** Datadog LLM Observability integrates with OpenAI Agents SDK — no code changes
- **Setup:** `serviceName` in `registerOTel` must match Vercel project name
- **Docs:** https://docs.datadoghq.com/integrations/vercel/

### Grafana Cloud — Custom OTLP Drain
- **Method:** Custom OTLP/HTTP drain → Grafana Cloud OTLP endpoint
- **Endpoint:** `https://otlp-gateway-<region>.grafana.net/otlp` with Bearer token
- **Receiver:** Traces → Grafana Tempo; Logs → Loki (via Grafana Alloy); Speed Insights → Prometheus
- **Also:** Grafana Vercel datasource plugin for querying Vercel data natively in Grafana dashboards
- **Docs:** https://grafana.com/docs/plugins/grafana-vercel-datasource/latest/

### Elastic APM — Custom OTLP Drain
- **Method:** Custom drain → Elastic APM Server (accepts OTLP/HTTP natively)
- **Endpoint:** `https://<apm-server>/v1/traces` with `Authorization: ApiKey <key>`
- **Log routing:** Log drain → Logstash/Elastic Agent

### Dynatrace — Custom OTLP Drain
- **Method:** Custom drain to Dynatrace OTLP ingest
- **Endpoint:** `https://<env>.live.dynatrace.com/api/v2/otlp/v1/traces`
- No native marketplace integration

### SigNoz — Custom OTLP Drain
- **Method:** Custom drain (OTel-native, self-hostable open-source)
- **Strong documented Vercel AI SDK + Next.js support**
- **Docs:** https://signoz.io/docs/vercel-ai-sdk-observability/

### AppDynamics — Custom Drain
- **Method:** Custom endpoint via AppDynamics OTel collector agent
- No native marketplace integration

---

## Log Aggregation

### Axiom ★ Native Marketplace
- **Method:** Native marketplace → drain auto-configured
- **Extra:** `next-axiom` package for Web Vitals + request logs from Next.js
- **Features:** 100% data (no sampling), pre-built Vercel dashboard, edge deployment support
- **Docs:** https://axiom.co/docs/apps/vercel

### Better Stack (Logtail) ★ Native Marketplace
- **Method:** Native marketplace → drains auto-created; or manual custom drain
- **Features:** Live tail, SQL-like query interface, real-time streaming
- **Docs:** https://betterstack.com/docs/logs/vercel/automatic-integration/

### Splunk — Custom Drain (HEC)
- **Method:** Custom drain → Splunk HTTP Event Collector
- **Endpoint:** `https://<splunk-host>:8088/services/collector` with `Authorization: Splunk <token>`
- **Add-on:** Splunkbase "Vercel Drains Add-on" for CIM-aligned field extractions (Logs + Speed Insights + Web Analytics)
- https://splunkbase.splunk.com/app/8423

### Sumo Logic — Custom Drain
- **Method:** Custom drain → Sumo Logic HTTP Source
- No native marketplace listing

### Logflare — External Integration
- **Method:** External/connectable account native integration
- **Features:** Search, charts, alerts on logs

### Baselime ★ Native Marketplace
- **Features:** Search, query, alert on Vercel logs

### Sematext ★ Native Marketplace
- Application logs for debugging

### Papertrail — Custom Drain
- Custom HTTP/syslog drain; no native marketplace integration

### LogDNA / Mezmo — External Integration
- Listed as external/connectable account integration; custom drain also works

---

## Error Tracking

### Sentry ★ Native Marketplace
- **Method:** Marketplace → auto-configures `SENTRY_DSN`/`SENTRY_ORG`/`SENTRY_PROJECT`, source map upload on every build, log/trace drains
- **Features:** Error grouping, stack traces, release tracking, performance tracing, session replay
- **LLM:** Vercel AI SDK spans via `@sentry/nextjs` integration
- **Note:** Large projects can exhaust memory during source map generation — monitor build resources

### Rollbar ★ Native Marketplace
- **Method:** Marketplace → real-time error detection linked to deployments
- **Docs:** https://docs.rollbar.com/docs/vercel

### HyperDX ★ Native Marketplace
- **Method:** Marketplace (open-source, ClickHouse + OTel)
- **Features:** Logs, metrics, traces, errors, session replays — unified

### Kubiks ★ Native Marketplace
- **Method:** Marketplace + Log Drains (required for full request correlation)
- **Features:** AI-powered — auto-traces API routes, DB queries, LLM calls via OTel with zero setup; auto-generates PR fixes

### Bugsnag — SDK Only
- No native drain. `@bugsnag/js` + `BUGSNAG_API_KEY` env var in Vercel settings

### Honeybadger — SDK
- Explicit Next.js/Vercel support including `honeybadger.edge.config.js` for Edge Functions
- **Docs:** https://docs.honeybadger.io/lib/javascript/integration/nextjs/

### Airbrake / Raygun — SDK Only
- No native Vercel Marketplace integration; JavaScript SDK with API key via Vercel env vars

---

## Uptime / Synthetic Monitoring

### Checkly ★ Native Marketplace
- **Method:** Marketplace → runs Playwright synthetic checks on every Vercel deployment
- **Features:** API + browser checks, multi-region, optional deployment promotion gate

### UptimeRobot ★ Native Marketplace
- **Method:** Marketplace → provision monitors directly from Vercel dashboard
- **Features:** Uptime, response times, alert contacts, public status pages

### Better Uptime / Better Stack ★ Native Marketplace
- Combined logs + uptime monitoring in one marketplace listing

### Pingdom — External
- No native Vercel integration. Point at your Vercel production URL manually. PagerDuty alerts supported.

### PagerDuty / OpsGenie — Indirect
- Not direct Vercel integrations. Receive alerts from tools above (UptimeRobot, Checkly, Sentry, Datadog) that are integrated with Vercel. UptimeRobot has a native PagerDuty connector.

---

## Database Observability

### Neon ★ Native Marketplace
- **Method:** Marketplace → auto-syncs env vars, provisions Neon Auth on preview branches
- **Observability:** Neon dashboard with query-level metrics (not exported to Vercel)

### Supabase ★ Native Marketplace
- **Method:** Marketplace → env vars auto-synced
- **Observability:** Supabase built-in dashboard (logs, metrics, usage); limited query-level observability

### PlanetScale ★ Native Marketplace
- **Method:** Marketplace integration
- **Observability:** PlanetScale Insights (query-level performance) inside PlanetScale dashboard

---

## Product / User Analytics

### PostHog ★ Native Marketplace
- **Method:** Marketplace → auto-injects `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST` for all environments
- **Features:** Analytics, session replay, feature flags (sync with Vercel Flags dashboard), experiments, error tracking, LLM analytics
- **LLM:** Official OpenAI Agents SDK trace processor
- **Docs:** https://posthog.com/docs/integrations/vercel-marketplace

### Statsig ★ Native Marketplace
- **Method:** Marketplace + Log Drains + Trace Drain
- **Features:** Feature flags, experiments, analytics — Pulse auto-computes experiment results

### Amplitude — SDK Only
- `@amplitude/analytics-browser`; no drain; API key via Vercel env var

### Mixpanel — SDK Only
- No marketplace listing; SDK-based with env var

### FullStory — SDK Only
- JavaScript snippet; no drain; known for session replay + behavioral analytics (enterprise)

### LogRocket — SDK Only
- `logrocket` npm package; strong Next.js support; session replay + error debugging correlation

### Heap — SDK Only
- Script-tag injection; no native Vercel integration

---

## Real User Monitoring (RUM)

### Cloudflare Zaraz
- **Method:** Requires Cloudflare proxy in front of Vercel
- **Features:** Server-side (edge) tag management — zero client-side perf impact for analytics loading
- **Caveat:** Routing conflicts possible; see https://vercel.com/kb/guide/cloudflare-with-vercel

### mParticle — SDK/CDP
- SDK-based customer data platform with 300+ downstream integrations; no native Vercel drain

---

## AI / LLM Observability

### Braintrust ★ Native Marketplace
- **Method:** Marketplace trace drain + SDK
- **Features:** AI eval, monitoring, observability; Vercel AI SDK tracing via OTel
- **Docs:** https://www.braintrust.dev/docs/integrations/sdk-integrations/vercel

### Langfuse — SDK + OTel
- **Method:** OTel span processor; Vercel AI SDK built-in telemetry
- **Features:** Open-source, self-hostable; tracing, prompt management, evals
- **Docs:** https://langfuse.com/integrations/frameworks/vercel-ai-sdk

### LangSmith — SDK Wrapper
- Works with OpenAI SDK, Vercel AI SDK, LlamaIndex

### Arize Phoenix — SDK + OTel
- Works with OpenAI Agents SDK; OTel-based

### MLflow — SDK Tracing
- Auto-tracks token usage for Vercel AI SDK calls
- **Docs:** https://mlflow.org/docs/latest/genai/tracing/integrations/listing/vercelai/

---

## OpenTelemetry Collectors

Any OTel-compatible collector works via custom drain. OTLP/HTTP only (port 4318).

| Collector | Notes |
|---|---|
| **Grafana Alloy** | Recommended for Grafana Cloud; handles log routing + traces |
| **OTel Collector (vanilla)** | Self-hosted; fan-out to multiple backends simultaneously |
| **Dash0** ★ Marketplace | Simplest native OTel — Logs + Traces + Metrics |
| **Honeycomb** | Custom drain; OTLP/HTTP ingest natively supported |
| **Middleware.io** ★ Marketplace | AI-powered; full OTel stack |

---

## Quick Reference: Integration Method Matrix

| Method | Tools |
|---|---|
| **Native Vercel Marketplace drain** | Sentry, Checkly, Dash0, Braintrust, Kubiks, Rollbar, Statsig, Axiom, Better Stack, Baselime, Logflare, Sematext, HyperDX, Middleware, UptimeRobot, PostHog |
| **External/connectable account drain** | Datadog, Highlight, New Relic, Logflare, LogDNA/Mezmo |
| **Custom OTLP/HTTP drain** | Grafana Cloud, Elastic APM, Dynatrace, Honeycomb, SigNoz, Jaeger, any OTel-native backend |
| **Custom JSON/NDJSON log drain** | Splunk (via HEC), Sumo Logic, any HTTP endpoint |
| **SDK only (no drain)** | Amplitude, Mixpanel, FullStory, LogRocket, Heap, Bugsnag, Airbrake, Raygun |
| **SDK + OTel processor** | Langfuse, LangSmith, Braintrust, Arize, MLflow |
