# OpenAI Symphony — Observability

**Repo:** https://github.com/openai/symphony  
**Released:** Late April 2026  
**Type:** Open-source Codex agent orchestration specification

---

## What Symphony Is (and Is Not)

Symphony is **not** an observability product. It is an **agent orchestration spec** for running Codex coding agents autonomously against a Linear project board.

Architecture:
- Reference implementation in **Elixir** (Phoenix LiveView for dashboard)
- Polls Linear on a fixed cadence → creates isolated workspaces per issue → dispatches Codex agents → watches CI → delivers PRs without human supervision
- **Not a Vercel product** — but used to auto-generate PRs for apps deployed on Vercel

---

## Symphony's Built-in Observability Layer

The SPEC.md defines observability as an explicit architectural concern, decoupled from orchestration logic.

### Required (MUST)
- Structured logging with stable `key=value` format
- Context fields on every log: `issue_id`, `issue_identifier`, `session_id`
- Startup/validation/dispatch failures visible without attaching a debugger
- Log sink failures MUST NOT crash the orchestrator

### Optional Status Surfaces (SHOULD)
Real-time runtime snapshot exposing:
- Active sessions with turn counts and token consumption
- Retry queue with scheduled retry times and error reasons
- Aggregate Codex token totals (input / output / total)
- Runtime seconds for completed sessions
- Latest rate-limit payloads

### HTTP API Endpoints
| Endpoint | Purpose |
|---|---|
| `GET /api/v1/state` | System state summary |
| `GET /api/v1/<issue_identifier>` | Per-issue debug details |
| `POST /api/v1/refresh` | Trigger immediate reconciliation |
| `GET /` | Phoenix LiveView human-readable dashboard |

### Log Sinks
Configurable: stdout, file, or external services (Datadog, Grafana, ELK, etc.).

**Design principle:** Dashboards and HTTP endpoints are "observability/control surfaces only and MUST NOT become REQUIRED for orchestrator correctness."

---

## OpenAI Agents SDK — Built-in Tracing

This is the production AI observability story for apps calling OpenAI models.

**Docs:** https://openai.github.io/openai-agents-python/tracing/  
**Dashboard:** platform.openai.com → Logs → Traces

### Span Types Captured Automatically

| Span | What it captures |
|---|---|
| `generation_span` | LLM calls — inputs, outputs, model, tokens |
| `function_span` | Tool invocations and results |
| `agent_span` | Full agent runs |
| `guardrail_span` | Guardrail evaluations |
| `handoff_span` | Agent-to-agent handoffs |
| `transcription_span` | Speech-to-text |
| `speech_span` | Text-to-speech |

### Configuration
```python
# Disable globally
import os
os.environ["OPENAI_AGENTS_DISABLE_TRACING"] = "1"
# or
from agents import set_tracing_disabled
set_tracing_disabled(True)

# Disable per run
result = await Runner.run(agent, RunConfig(tracing_disabled=True))

# Strip sensitive data
result = await Runner.run(agent, RunConfig(trace_include_sensitive_data=False))

# Custom processor
from agents import add_trace_processor
add_trace_processor(my_processor)

# Flush immediately (serverless / Celery)
from agents import flush_traces
await flush_traces()
```

### Trace Grading / Evals
1. Inspect traces at platform.openai.com → Logs → Traces
2. Create criteria-based **graders** to score traces
3. Build repeatable **datasets** for regression detection
4. Set up **Continuous Evaluation (CE)** to run on every code change

Not available under Zero Data Retention (ZDR) policies.

---

## Vercel AI SDK + OpenAI Observability

For Next.js apps using Vercel AI SDK calling OpenAI:

```ts
// Enable built-in telemetry per call
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Hello',
  experimental_telemetry: { isEnabled: true },
});
```

Traces export via OTel to any OTLP backend. Documented integrations:
- **Langfuse** — open-source, self-hostable
- **Braintrust** — Vercel Marketplace native
- **SigNoz** — open-source, strong Next.js docs
- **MLflow** — auto-tracks token usage
- **Sentry** — via `@sentry/nextjs` Vercel AI integration

### 23+ SDK-supported third-party processors
Langfuse, LangSmith, Datadog, Arize Phoenix, MLflow, Braintrust, AgentOps, Pydantic Logfire, Weights & Biases, PostHog, and more.

Integration pattern: implement a custom `TraceProcessor` that receives all spans.

---

## Key Takeaway

To monitor OpenAI agent calls in a Vercel app:
1. Enable `experimental_telemetry` in Vercel AI SDK calls
2. Use `@vercel/otel` with `registerOTel()` in `instrumentation.ts`
3. Route traces to Braintrust (Vercel Marketplace) or Langfuse (self-host) for LLM-specific analytics
4. Route infrastructure traces to Datadog/Grafana via Trace Drain
