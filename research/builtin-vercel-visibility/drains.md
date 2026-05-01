# Vercel Drains

**Plans:** Pro ($0.50/drain/month), Enterprise (included)  
**Docs:** https://vercel.com/docs/observability/log-drains / https://vercel.com/docs/observability/otel-overview  
**Dashboard:** Project → Settings → Log Drains

---

## What It Is

Real-time streaming of observability data from Vercel to any external endpoint. Enables sending all Vercel signals to your own observability stack (Datadog, Grafana, Splunk, custom SIEM, etc.).

---

## 4 Drain Data Types

### 1. Log Drain (`log v1`)
Streams all log events from functions, middleware, edge, and builds.

```json
{
  "id": "log-abc123",
  "message": "Error: Cannot read property 'id' of undefined",
  "timestamp": 1714500000000,
  "source": "lambda",
  "projectId": "prj_...",
  "deploymentId": "dpl_...",
  "host": "myapp.vercel.app",
  "path": "/api/users",
  "statusCode": 500,
  "level": "error",
  "requestId": "req_...",
  "proxy": {
    "region": "iad1",
    "timestamp": 1714500000000,
    "statusCode": 500
  }
}
```

Sources included: Build logs, Runtime (Serverless + Edge), Static requests, Middleware

### 2. Trace Drain (`trace v1`)
Streams distributed traces in OpenTelemetry format.

- Format: OpenTelemetry OTLP (JSON or Protobuf)
- Every function invocation generates a root span
- Sub-spans for: external fetches, DB queries (if instrumented), middleware
- Includes: traceId, spanId, parentSpanId, duration, status, attributes

```json
{
  "traceId": "abc123...",
  "spanId": "def456...",
  "parentSpanId": null,
  "name": "GET /api/users",
  "kind": "SERVER",
  "startTime": "2026-05-01T10:00:00.000Z",
  "endTime": "2026-05-01T10:00:00.045Z",
  "status": { "code": "OK" },
  "attributes": {
    "http.method": "GET",
    "http.route": "/api/users",
    "http.status_code": 200,
    "vercel.region": "iad1"
  }
}
```

### 3. Speed Insights Drain (`speed_insights v1`)
Streams real-user performance events as they occur.

```json
{
  "type": "web-vital",
  "metric": "LCP",
  "value": 1823,
  "rating": "good",
  "path": "/products/[id]",
  "country": "US",
  "deviceType": "mobile",
  "connection": "4g",
  "deploymentId": "dpl_...",
  "timestamp": 1714500000000
}
```

### 4. Web Analytics Drain (`analytics v2`)
Streams every page view and custom event.

```json
{
  "type": "pageview",
  "path": "/pricing",
  "referrer": "https://google.com",
  "country": "DE",
  "browser": "Chrome",
  "os": "macOS",
  "deviceType": "desktop",
  "timestamp": 1714500000000,
  "projectId": "prj_..."
}
```

---

## Setting Up a Drain

### Via Dashboard
1. Project → Settings → Log Drains
2. Click "Add Drain"
3. Choose data type (Logs / Traces / Speed Insights / Analytics)
4. Enter endpoint URL
5. Choose format (JSON, NDJSON, Syslog)
6. Optionally add HMAC secret for payload verification

### Via CLI
```bash
# Add log drain
vercel log-drains add my-drain \
  --url https://ingest.example.com/vercel \
  --type json

# Add trace drain
vercel log-drains add trace-drain \
  --url https://otel.example.com/traces \
  --type trace

# List drains
vercel log-drains ls

# Remove drain
vercel log-drains rm my-drain
```

### Via REST API
```bash
POST /v1/log-drains
{
  "name": "my-drain",
  "type": "json",
  "url": "https://ingest.example.com/vercel",
  "sources": ["lambda", "edge", "static", "build"]
}
```

---

## Drain Security

**HMAC Verification**
Each drain event includes `x-vercel-signature` header:
```
HMAC-SHA1(secret, payload)
```

Verify on your endpoint:
```js
import crypto from 'crypto';

function verifyDrain(req, secret) {
  const sig = req.headers['x-vercel-signature'];
  const expected = crypto
    .createHmac('sha1', secret)
    .update(req.rawBody)
    .digest('hex');
  return sig === expected;
}
```

---

## Native Drain Targets (Marketplace)

One-click integrations that configure a drain automatically:

| Integration | Data Types | Notes |
|---|---|---|
| **Datadog** | Logs + Traces | Auto-maps to DD log pipeline |
| **New Relic** | Logs + Traces | Auto-configures NR ingest |
| **Sentry** | Logs (errors) | Error grouping + sourcemaps |
| **Highlight** | Logs + Traces | Session replay correlation |
| **HyperDX** | Logs + Traces | Open-source observability |
| **Middleware** | Logs + Traces | AI-powered analysis |
| **Dash0** | Traces (OTel) | OpenTelemetry native |

---

## OpenTelemetry Auto-Instrumentation

Beyond Trace Drains, Vercel also supports OTel SDK instrumentation in your code:

```ts
// instrumentation.ts (Next.js)
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'my-app' });
}
```

This automatically:
- Creates spans for every route handler
- Creates spans for external fetches
- Propagates trace context via W3C TraceContext headers
- Ships traces via OTLP to your configured drain
