# Vercel AI Gateway Observability

**Plans:** All (gateway usage included in compute)  
**Docs:** https://vercel.com/docs/ai-gateway  
**Dashboard:** Project → Observability → AI Gateway section

---

## What It Is

Vercel AI Gateway is a managed proxy for AI model calls. Every request routed through it is automatically instrumented — no extra setup needed for observability.

---

## Setup

```ts
// Use the gateway URL instead of provider directly
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  baseURL: 'https://gateway.ai.cloudflare.com/v1/{account}/{gateway}',
  // OR Vercel AI Gateway:
  baseURL: process.env.AI_GATEWAY_URL,
});
```

With Vercel AI SDK:
```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Calls automatically routed through Vercel AI Gateway
// when VERCEL_AI_GATEWAY_URL env var is set
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain observability',
});
```

---

## Metrics Tracked

### Per-Request Metrics
| Metric | Description |
|---|---|
| **Latency** | Total request duration (ms) |
| **TTFT** | Time to First Token — measures streaming responsiveness |
| **Input tokens** | Tokens in the prompt |
| **Output tokens** | Tokens in the completion |
| **Total tokens** | Input + Output |
| **Status** | Success / Error / Timeout |
| **Model** | Which model was called (gpt-4o, claude-3-5, etc.) |
| **Provider** | OpenAI, Anthropic, Google, etc. |

### Aggregate Dashboard
- **Total requests** — volume over time
- **Error rate** — failed model calls
- **Token usage** — total input/output tokens over time
- **Estimated cost** — spend by model and provider
- **Latency distribution** — p50/p75/p90/p99 per model
- **Top models by usage** — which models your app calls most
- **Per-project breakdown** — cost/usage isolated per Vercel project

---

## Cost Tracking

AI Gateway tracks estimated spend based on public pricing for each model:

| Provider | Models Tracked |
|---|---|
| OpenAI | GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo, o1, o3 |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Haiku, Claude 3 Opus, Claude 4 |
| Google | Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash |
| Meta | Llama 3.x (via providers) |
| Mistral | Mistral Large, Mistral Small |
| Cohere | Command R, Command R+ |

Cost breakdown available by: model, project, time range, environment.

---

## Request Logs

Full request/response logs for each AI call:

```json
{
  "requestId": "gw_...",
  "timestamp": "2026-05-01T10:00:00Z",
  "model": "gpt-4o",
  "provider": "openai",
  "inputTokens": 847,
  "outputTokens": 312,
  "totalTokens": 1159,
  "latencyMs": 1843,
  "ttftMs": 312,
  "status": "success",
  "projectId": "prj_...",
  "environment": "production",
  "estimatedCost": 0.00892
}
```

- Logs retained according to plan (same as Observability dashboard)
- Prompt/completion content optionally logged (disabled by default for privacy)

---

## Caching

AI Gateway supports semantic caching:
- Cache hit/miss rates visible in dashboard
- Cache hits avoid model costs entirely
- Cache metrics: hit rate, tokens saved, cost saved

---

## Fallback & Retry Observability

If AI Gateway is configured with fallback models:
- Dashboard shows which fallback was triggered and why
- Primary model failure reason (timeout, rate limit, error)
- Fallback model used and its response metrics

---

## Integration with Observability Dashboard

AI Gateway data appears in the main Observability dashboard under the **AI Gateway** insight section alongside other categories (Functions, Edge, etc.). Includes:
- Request count
- Error rate
- p99 latency
- Top error messages
