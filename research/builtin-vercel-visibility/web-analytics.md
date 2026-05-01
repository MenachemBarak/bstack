# Vercel Web Analytics

**Plans:** All (free tier included)  
**Docs:** https://vercel.com/docs/analytics  
**Dashboard:** Project → Analytics tab

---

## What It Is

Privacy-first, cookieless page-level analytics built into Vercel. Tracks visitors and page views without collecting personal data.

---

## Setup

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx (Next.js App Router)
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Framework packages:
- `@vercel/analytics/react` — React / Next.js
- `@vercel/analytics/vue` — Vue
- `@vercel/analytics/svelte` — Svelte / SvelteKit
- `@vercel/analytics` — vanilla JS (inject script tag)

---

## Metrics

### Traffic
- **Unique visitors** — hash-based, no cookies, resets daily
- **Page views** — total and per-page
- **Bounce rate** — single-page sessions
- **Visit duration** — time on site

### Demographics
- Country / Region
- Browser (Chrome, Safari, Firefox, etc.)
- OS (macOS, Windows, iOS, Android)
- Device type (Desktop, Mobile, Tablet)
- Referrer source

### Custom Events

Track user actions beyond page views:

```tsx
import { track } from '@vercel/analytics';

// Track button click
<button onClick={() => track('signup-clicked', { plan: 'pro' })}>
  Sign Up
</button>

// Track form submit
track('form-submitted', { formId: 'contact' });

// Track purchase
track('purchase', { amount: 49.99, currency: 'USD' });
```

Custom event data appears in Analytics dashboard under "Events" tab with property breakdowns.

### Feature Flag Integration

Track analytics events tied to Vercel Feature Flags / Edge Config:

```tsx
import { track } from '@vercel/analytics';
import { flag } from '@vercel/edge-config';

const variant = await flag('homepage-hero');
track('hero-viewed', { variant });
```

---

## Dashboard Features

- **Time range:** 24h, 7d, 30d, 90d, custom
- **Top pages** — ranked by views or visitors
- **Referrers** — traffic sources
- **Filter by environment** — Production, Preview
- **Event explorer** — filter by custom event name + properties
- **CSV export** — download raw data

---

## Privacy Design

- **No cookies** — compliant with GDPR, CCPA, ePrivacy without consent banners
- **Hash-based visitor ID** — daily rotating salt, cannot be correlated across days
- **No fingerprinting** — no canvas, WebGL, or font enumeration
- **No cross-site tracking** — data isolated per project
- **IP addresses never stored**

---

## Data Limits

| Plan | Events/month |
|---|---|
| Hobby | 2,500 |
| Pro | 25,000 |
| Enterprise | Custom |

Overage: $0.0001/event.

---

## Script Injection (No Package Install)

For non-JS frameworks, inject the script directly:

```html
<script defer src="/_vercel/insights/script.js"></script>
```

Vercel automatically serves this from the edge when analytics is enabled in project settings.
