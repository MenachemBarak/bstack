# Top 10 High-Traffic Apps Built on Vercel

Architecture patterns, scale, and observability challenges from real production deployments.

---

## 1. Stripe

**What:** Global payments infrastructure ($billions in transaction volume)  
**Framework:** Next.js  
**Use on Vercel:** High-traffic microsites (e.g., Black Friday real-time transaction display)

### Architecture
- 3-layer caching: `getStaticProps` (build) → ISR (1s max-age) → SWR (client real-time)
- Full Vercel Edge Network seeding for CDN offload
- Data sources isolated from core payment infrastructure with fallback mechanisms

### Scale
- 17M+ edge requests at launch
- Peak: 93,304 transactions/minute displayed
- 99.999%+ API uptime, 100% campaign uptime
- Built in 19 days concept-to-launch

### Observability Challenges
Original WebSocket approach lagged under load → replaced with ISR + SWR. Real-time fallback logic for metric failures was the key reliability concern at peak traffic.

---

## 2. Notion

**What:** All-in-one workspace (tens of millions of users)  
**Framework:** Next.js  
**Use on Vercel:** Marketing site + edge experimentation + Sandbox code execution

### Architecture
- **Experimentation:** Statsig A/B tests synced to Vercel Edge Config; assignment via Edge Middleware
- **Rendering:** SSR to minimize payload
- **CLS:** Averages 0.09 (top-tier)
- **Notion Workers (advanced):** Vercel Sandbox (Firecracker microVMs) — each execution boots its own kernel with filesystem snapshots, network credential injection, and dynamic egress policy updates

### Scale
- Hundreds of experiments/year
- Millions of users running concurrent isolated code executions
- Hotfix time: 1hr → 15min; rollbacks: seconds

### Observability Challenges
Firecracker microVMs introduce observability gaps — monitoring/logging for isolated VM executions is explicitly called out as a challenge. Built-in Vercel monitoring used for weekly error/cache queries.

---

## 3. Gamma

**What:** AI-powered presentation/doc/site builder (10M users in 9 months)  
**Framework:** Next.js  
**Use on Vercel:** Full-stack AI application

### Architecture
- **AI:** Vercel AI SDK for multi-agent orchestration (model-agnostic, ~30 lines to switch models)
- **Images:** 1.5B+ images across 60 models/20 providers via custom `ImageModelV3` interface with composable middleware for automatic tracing and cost tracking
- **Functions:** LLM HTML → structured Tiptap schema (JSDOM), async asset resolution, content serialization, theme preview generation
- 250+ deployments/day, 7-minute median deploy time, 99% deployment success rate
- Team of ~20 engineers

### Scale
- 10M users in 9 months post-AI launch
- 1.5B+ total images generated

### Observability Challenges
"Balancing rapid model iteration with production-grade observability" — identified as core challenge. The composable middleware layer for automatic tracing and cost tracking per model is critical given multi-provider pipeline.

---

## 4. Leonardo.ai

**What:** AI image/video generation (4.5M images/day)  
**Framework:** Next.js  
**Use on Vercel:** Full-stack AI application with AWS Bedrock integration

### Architecture
- Aggressive CDN caching: reduced page load by 95%
- Vercel Monitoring for real-time serverless function observability
- Preview Deployments for team iteration

### Scale
- 4.5M images generated daily
- Previous: 60s page loads, frequent outages → now near-instant
- Build times: 10min → 2min
- Product iteration: months → 1–4 weeks

### Observability Challenges
Correlating frontend response times (Vercel) with backend AI inference latency (separate GPU infrastructure) — native Vercel monitoring covers the web layer but not the model inference layer. Requires external APM for full-stack tracing.

---

## 5. Washington Post (Elections)

**What:** Major US news org — election night results platform  
**Framework:** Next.js (migrated from AWS ECS)  
**Use on Vercel:** Live election results across 1,000+ races

### Architecture
- ISR for static scalability + live data freshness from thousands of simultaneous elections
- Original WebSocket "lagged like crazy" under load — rewritten at the last moment before 2022 midterms on Vercel (described as "a huge win")
- TypeScript full frontend rewrite
- US House page: ~400 races rendered simultaneously

### Scale
- 1,000+ individual elections across 52 results pages simultaneously
- "Incredibly spiky" traffic — tens of millions of concurrent news consumers on election night

### Observability Challenges
Managing extreme, unpredictable election-night traffic spikes against a constant live data stream. ISR solved the backend-hammering problem. Real-time data freshness with seconds-latency across hundreds of pages is the core engineering tension.

---

## 6. Morning Brew

**What:** Digital media company (18M monthly users)  
**Framework:** Next.js + Sanity CMS  
**Use on Vercel:** Full headless media platform

### Architecture
- On-demand ISR: content teams update without redeployments → 100% cache hit rate
- 2M serverless function invocations/month
- Preview Deployments for cross-functional collaboration (devs + editors + designers)

### Scale
- 18M+ monthly users
- 15M monthly cache requests
- Revenue: $20M (2020) → $50M (2021) after Vercel migration (2.5x)

### Observability Challenges
Cache coherence at scale — ensuring on-demand ISR invalidations propagate instantly and correctly. Monitoring stale pages and ISR revalidation failures requires tooling beyond native Vercel analytics.

---

## 7. Under Armour

**What:** Global athletic apparel/ecommerce ($billions GMV)  
**Framework:** Next.js (migrated from Salesforce Commerce Cloud monolith)  
**Use on Vercel:** Headless ecommerce frontend

### Architecture
- Headless frontend (Vercel/Next.js) + backend commerce services
- Edge Functions/Middleware for server-side personalization
- ISR for cached product/category pages
- Vercel WAF: DDoS/bot protection (3B+ blocks in BFCM 2024)
- Dynamic concurrency scaling for BFCM traffic peaks

### Scale
- Part of Vercel BFCM 2024: 99.9992% uptime, 86.7B requests across platform
- 500ms TTFB reduction post-migration
- 2% conversion increase overall; 5x conversion at peak sales events

### Observability Challenges
BFCM traffic is 10x normal — monitoring the DDoS mitigation layer (1.75M malicious requests/second) while tracking legitimate user conversion requires distinguishing real traffic from bot traffic in real time. Split observability between Vercel frontend and commerce backend.

---

## 8. Fanatics Collectibles

**What:** Sports collectibles/licensed merchandise ($8.1B Fanatics revenue 2024)  
**Framework:** Next.js (migrated from Magento monolith)  
**Use on Vercel:** Headless ecommerce + Shopify backend

### Architecture
- Headless Shopify (commerce) + Next.js SSR (frontend)
- "No Ops" serverless philosophy — product focus, not infra
- Core principle: site speed as direct SEO driver

### Scale
- Handles sudden massive traffic spikes from sports championships and product launches
- Fanatics overall: $8.1B revenue 2024 (up from $3.5B in 2021)

### Observability Challenges
Collectibles launches tied to live sports events (team wins at 11 PM → massive traffic within minutes). The observability window is very short and downtime directly costs revenue. Auto-scaling handles capacity; the challenge is detecting and responding to errors in real time during those short windows.

---

## 9. PAIGE (Fashion DTC)

**What:** Premium denim/apparel brand — direct-to-consumer ecommerce  
**Framework:** Next.js App Router (migrated from Commercetools + Angular + Bloomreach)  
**Use on Vercel:** Full headless ecommerce

### Architecture
- Two-tier: Shopify (integrated commerce/fulfillment) + Next.js/Vercel (frontend)
- SSR resolving prior SEO issues from the Angular stack
- Edge Middleware for server-side personalization
- Automated deployments, instant rollbacks

### Scale
- BFCM 2024: 22% revenue increase, 76% conversion rate increase
- Previous BFCM: site instability; new stack described as "blissfully boring" at peak

### Observability Challenges
Migration from 3-vendor integration (Commercetools + Angular + Bloomreach) to 2-tier stack dramatically simplified observability — previously no single source of truth made failure attribution extremely difficult.

---

## 10. Suno

**What:** AI music generation platform (V5 ELO 1293, top benchmark 2025)  
**Framework:** Next.js  
**Use on Vercel:** Web experience + API routing layer

### Architecture
- Vercel: Next.js frontend + API routes (user-facing layer)
- Separate GPU inference infrastructure (not on Vercel)
- Split architecture: web layer on Vercel ↔ AI inference on GPU cloud

### Scale
- Millions of users; V4.5 supports up to 8-minute song generation
- V5 surpasses all competitor benchmarks as of 2025

### Observability Challenges
Classic split-architecture problem: correlating user-facing Next.js layer (observable via Vercel) with GPU inference latency, queue depth, and model availability on separate infrastructure. Requires custom OTel instrumentation to trace the full path from user input → generated audio output.

---

## Cross-Cutting Architecture Patterns

| Pattern | Used By |
|---|---|
| ISR + SWR for real-time at scale | Stripe, Washington Post, Morning Brew |
| Edge Middleware for experimentation | Notion (Statsig), Under Armour, PAIGE |
| Headless commerce (Shopify + Next.js) | Fanatics, PAIGE |
| Vercel AI SDK for multi-model | Gamma, Leonardo, Suno |
| Firewall/DDoS (WAF) | Under Armour, Fanatics |
| Preview deployments as safety net | All 10 |

## Shared Observability Challenges

1. **Serverless cold starts** — no persistent process for traditional APM agents; requires OTel + trace drains
2. **Split architectures** — Vercel covers the web/function layer; AI inference/DB/commerce backends need separate tooling with manual trace stitching
3. **ISR cache coherence** — detecting stale pages and revalidation failures needs tooling beyond native Vercel analytics
4. **Unpredictable traffic spikes** — elections, sports wins, BFCM; very short observability window with high cost of failure
5. **DDoS vs real traffic** — BFCM 2024: 270K real req/sec + 1.75M DDoS req/sec simultaneously blocked

## Vercel Platform BFCM Scale Reference

| Metric | BFCM 2024 | BFCM 2025 |
|---|---|---|
| Total requests | 86.7B | 115.8B (+33.6%) |
| Function invocations | 28.9B | 43.2B (+49.5%) |
| Firewall actions | 6.3B | 7.5B (+19%) |
| Deployments | 2.45M | 6.1M (+149%) |
| Uptime | 99.9992% | — |
