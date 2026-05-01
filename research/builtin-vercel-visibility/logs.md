# Vercel Logs

**Docs:** https://vercel.com/docs/observability/runtime-logs

---

## Log Types

### 1. Build Logs
- Captured during every build (all plans)
- Shows full build output including framework compilation, dependency install, function bundling
- Retained for the lifetime of the deployment
- Accessible: Project → Deployments → [deployment] → Build Logs
- Streamed live during active builds
- Searchable by string

### 2. Runtime Logs
Real-time stdout/stderr from Serverless and Edge Functions.

| Plan | Retention |
|---|---|
| Hobby | 1 hour |
| Pro | 1 day |
| Enterprise | 3 days |
| Observability Plus | 30 days |

- Accessible: Project → Logs tab (live tail or historical)
- Filter by: log level (info/warn/error), environment, deployment, region, path
- Structured JSON logs preserved as-is
- `console.log`, `console.error`, `console.warn` all captured
- Edge Runtime logs appear with region tag

### 3. Activity Logs
- Team-level audit trail: deployments created, env vars changed, members added, domain changes
- All plans
- Retained: 90 days
- Accessible: Team Settings → Activity

### 4. Audit Logs (Enterprise)
- Full immutable audit trail for compliance
- Includes: who did what, from which IP, at what time
- 90-day retention with CSV export
- Accessible via: Enterprise dashboard or REST API
- Covers: SSO events, role changes, secret access, deployment triggers

---

## Log Drains

**Plans:** Pro ($0.50/drain/month), Enterprise (included)  
**Docs:** https://vercel.com/docs/observability/log-drains

Stream logs in real-time to any HTTP endpoint.

### Supported Formats

| Format | Schema |
|---|---|
| `log v1` | Standard JSON log events |
| `ndjson` | Newline-delimited JSON |
| `syslog` | RFC 5424 syslog format |

### Log Drain Sources
- Build logs
- Runtime logs (Serverless + Edge Functions)
- Static file request logs
- Middleware logs

### Configuration
```bash
# Via CLI
vercel log-drains add <name> --url https://logs.example.com/drain --type json

# Via dashboard
Project → Settings → Log Drains → Add Drain
```

### Fields in Each Log Event
```json
{
  "id": "...",
  "message": "actual log line",
  "timestamp": 1714500000000,
  "source": "lambda|edge|static|build",
  "projectId": "prj_...",
  "deploymentId": "dpl_...",
  "host": "example.vercel.app",
  "path": "/api/route",
  "statusCode": 200,
  "proxy": { "region": "iad1", "timestamp": ... },
  "level": "info|warning|error",
  "requestId": "..."
}
```

### Native Integrations for Log Drains
Configure one-click log drain targets from the Vercel Marketplace:
- **Datadog** — ships to Datadog Log Management
- **Sentry** — ships errors to Sentry projects
- **Highlight** — ships to Highlight.io
- **HyperDX** — ships to HyperDX
- **New Relic** — ships to NR Log Management
- **Middleware** — AI-powered log analysis

---

## Searching Logs

Via dashboard:
- Free-text search on `message` field
- Filter: environment, deployment, region, log level, date range
- Click any log line → expand full JSON context

Via API:
```bash
vercel logs <deployment-url> --output json
vercel logs <deployment-url> --follow   # stream live
```
