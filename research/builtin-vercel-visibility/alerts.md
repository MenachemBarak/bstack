# Vercel Alerts

**Plans:** All  
**Docs:** https://vercel.com/docs/observability/alerts  
**Dashboard:** Project → Observability → Alerts

---

## What It Is

Automatic anomaly detection on key Vercel metrics. Alerts fire when a metric deviates significantly from its historical baseline — no manual threshold configuration required.

---

## Alert Types

### Error Anomaly Alerts

Triggers when error rates spike above baseline.

| Trigger | Description |
|---|---|
| **5xx Error Rate** | Server errors spike — function crashes, timeouts, unhandled exceptions |
| **4xx Error Rate** | Client error spike — often signals broken links, missing assets, auth failures |

Detection method: Statistical anomaly — fires when error rate exceeds 4 standard deviations above the trailing 24-hour average.

### Usage Anomaly Alerts

Triggers when resource consumption spikes unexpectedly (cost protection).

| Trigger | Metric |
|---|---|
| **Function CPU Time** | Serverless function compute usage |
| **Function Duration** | Wall-clock execution time |
| **Fast Data Transfer** | CDN data egress volume |
| **Edge Requests** | Edge function/CDN request count |
| **Function Invocations** | Total function call count |

---

## Notification Channels

| Channel | Setup |
|---|---|
| **Email** | Automatic to project owner; configure additional recipients in settings |
| **Slack** | OAuth integration → posts to any channel |
| **Webhook** | POST JSON payload to any HTTP endpoint |

### Webhook Payload Example
```json
{
  "type": "alert",
  "alertType": "error_anomaly",
  "metric": "5xx",
  "value": 0.12,
  "threshold": 0.03,
  "environment": "production",
  "project": "my-app",
  "deployment": "dpl_...",
  "timestamp": "2026-05-01T10:30:00Z",
  "url": "https://vercel.com/team/my-app/observability"
}
```

---

## AI Investigation

When an alert fires, Vercel can automatically run an AI-powered investigation:

1. Pulls relevant logs from the time window
2. Pulls observability metrics for context
3. Identifies likely root cause
4. Summarizes findings in the alert notification

Enabled per-alert in settings. Uses the same data visible in the Observability dashboard.

---

## Configuration

Via dashboard:
1. Project → Settings → Alerts
2. Select alert type
3. Choose environment (Production / Preview / All)
4. Add notification channel(s)
5. Enable/disable AI Investigation

Via REST API:
```bash
POST /v9/projects/{projectId}/alert-configs
{
  "type": "error_anomaly",
  "metric": "5xx",
  "environment": "production",
  "notifications": [
    { "type": "email", "email": "ops@example.com" },
    { "type": "webhook", "url": "https://hooks.example.com/vercel" }
  ]
}
```

---

## Alert Suppression

- Alerts auto-suppress during deployments (expected error spike during rollout)
- Cool-down period: 1 hour between repeated alerts for the same metric
- Can manually silence specific alerts from the dashboard

---

## Environments

Alerts are configurable per environment:
- **Production** — most critical, highest signal
- **Preview** — useful for catching regressions in PRs before merge
- **All** — monitor every deployment
