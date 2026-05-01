# Vercel Marketplace Observability Integrations

**Marketplace URL:** https://vercel.com/integrations  
**Category:** Observability / Monitoring

All integrations below can be added from the Vercel Marketplace. Most work by configuring a Log Drain + optional environment variables injected into your project.

---

## Native Vercel-Built Integrations

These integrations have first-party support in the Vercel dashboard.

### Sentry
**Type:** Error monitoring  
**Install:** vercel.com/integrations/sentry  
**What it does:**
- Auto-configures `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` env vars
- Sets up a Log Drain to forward error-level logs
- Enables source map upload on every build
- Bundles `@sentry/nextjs` (or framework equivalent) automatically

**Observability added:**
- Error grouping with stack traces
- Release tracking (each deploy = Sentry release)
- Performance tracing (transactions + spans)
- Session replay (record user actions leading to error)
- Alerting with Slack/PagerDuty/email routing

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

### Checkly
**Type:** Synthetic monitoring  
**Install:** vercel.com/integrations/checkly  
**What it does:**
- Runs synthetic checks (API + browser) on every Vercel deployment
- Checks run against preview URLs before production promotion
- Blocks deployment promotion if checks fail (optional)

**Observability added:**
- API endpoint health checks on a schedule
- Playwright-based browser checks (E2E)
- Multi-region check execution
- Alerting on check failures
- Response time tracking over time

```ts
// checkly.config.ts
import { defineConfig } from 'checkly';

export default defineConfig({
  projectName: 'My App',
  checks: {
    locations: ['us-east-1', 'eu-west-1'],
    tags: ['production'],
  },
});
```

---

### Datadog
**Type:** Full-stack APM  
**Install:** vercel.com/integrations/datadog  
**What it does:**
- Configures Log Drain → Datadog Log Management
- Configures Trace Drain → Datadog APM (distributed tracing)
- Injects `DD_API_KEY` env var
- Auto-creates Datadog log pipeline for Vercel log format

**Observability added:**
- All runtime logs in DD Log Explorer with full-text search
- Distributed traces correlated with logs
- Service maps
- APM dashboards (latency, error rate, throughput)
- Anomaly detection
- Custom metrics via DogStatsD

```ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel';
import { DatadogSpanExporter } from 'dd-trace';

export function register() {
  registerOTel({
    serviceName: 'my-app',
    spanExporter: new DatadogSpanExporter(),
  });
}
```

---

### New Relic
**Type:** Full-stack observability  
**Install:** vercel.com/integrations/new-relic  
**What it does:**
- Configures Log Drain → New Relic Log Management
- Configures Trace Drain → New Relic Distributed Tracing
- Injects `NEW_RELIC_LICENSE_KEY` and `NEW_RELIC_APP_NAME`

**Observability added:**
- NRQL queries over all Vercel logs
- Distributed tracing with flame graphs
- Error inbox (deduplicated error tracking)
- Custom dashboards
- Alerts via NRQL conditions

---

### Highlight
**Type:** Session replay + logs + traces  
**Install:** vercel.com/integrations/highlight  
**What it does:**
- Configures Log Drain for runtime logs
- Configures Trace Drain for OTel traces
- SDK for session replay + frontend error capture

**Observability added:**
- Full session replay (watch exactly what users did)
- Console log capture (frontend)
- Network request recording (frontend)
- Backend log correlation with frontend sessions
- Error alerting

```tsx
import { H } from 'highlight.run';

H.init('<YOUR_PROJECT_ID>', {
  serviceName: 'my-app',
  environment: 'production',
  version: process.env.VERCEL_GIT_COMMIT_SHA,
});
```

---

### HyperDX
**Type:** Open-source full-stack observability  
**Install:** vercel.com/integrations/hyperdx  
**What it does:**
- Configures Log + Trace drains
- Self-hostable or cloud SaaS

**Observability added:**
- Correlated logs + traces + sessions
- Full-text log search
- Trace flamecharts
- Database query analysis
- Custom dashboards (Grafana-compatible)

---

### Dash0
**Type:** OpenTelemetry-native observability  
**Install:** vercel.com/integrations/dash0  
**What it does:**
- Receives OTel traces from Vercel Trace Drain
- Native OTLP ingestion

**Observability added:**
- Full distributed tracing (OTel native)
- Service topology maps
- Trace-to-log correlation
- SLO tracking

---

### Braintrust
**Type:** AI evaluation + observability  
**Install:** vercel.com/integrations/braintrust  
**What it does:**
- Traces AI SDK calls to Braintrust
- Captures prompts, completions, latency, costs

**Observability added:**
- LLM call tracing with input/output logging
- Evals and scoring pipelines
- Prompt versioning and A/B testing
- Dataset management for fine-tuning

---

### Statsig
**Type:** Feature flags + experimentation  
**Install:** vercel.com/integrations/statsig  
**What it does:**
- Feature gate management via Edge Config
- A/B experiment tracking

**Observability added:**
- Experiment metrics (conversion, revenue, latency impact)
- Feature flag exposure logging
- Pulse (auto-computed experiment results)
- Metrics explorer

---

### Middleware (AI-Powered)
**Type:** AI-powered observability  
**Install:** vercel.com/integrations/middleware  
**What it does:**
- Log + Trace drain to Middleware platform
- AI root cause analysis

**Observability added:**
- AI-generated insights on log patterns
- Anomaly detection with natural language explanation
- Alert summarization
- Auto-correlation of related errors

---

### Rollbar
**Type:** Error monitoring  
**Install:** vercel.com/integrations/rollbar  
**What it does:**
- Log Drain for error-level events
- SDK for frontend error capture

**Observability added:**
- Error grouping + deduplication
- Deploy tracking (new version = new baseline)
- Person tracking (link errors to users)
- Alerting with routing rules

---

### Kubiks
**Type:** Cost + performance analytics  
**Install:** vercel.com/integrations/kubiks  
**What it does:**
- Analyzes Vercel usage and cost data
- No drain required — reads Vercel API directly

**Observability added:**
- Vercel spend breakdown by team/project
- Cost trend analysis
- Function execution cost per route
- Budget alerts

---

## Choosing the Right Integration

| Need | Best Option |
|---|---|
| Error tracking + stack traces | Sentry |
| Full APM (enterprise) | Datadog or New Relic |
| Session replay | Highlight |
| Synthetic E2E checks | Checkly |
| OTel-native tracing | Dash0 |
| LLM observability | Braintrust |
| AI cost analysis + insights | Middleware |
| Open source / self-hosted | HyperDX |
| A/B testing + experiments | Statsig |
| Error deduplication | Rollbar |
| Vercel cost management | Kubiks |

---

## Integration Installation Pattern

All marketplace integrations follow the same pattern:
1. Click "Add Integration" on marketplace page
2. Authorize Vercel OAuth
3. Select projects to apply to
4. Integration automatically:
   - Creates log/trace drains
   - Injects API key env vars into selected projects
   - Optionally triggers a new deployment to pick up new vars
