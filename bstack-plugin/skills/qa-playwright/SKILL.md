---
description: Build (or extend) a production-grade Playwright E2E suite that covers every user, state, and role with strict proof-before/after every action. Uses a strict actions/flows/features/qa-tests hierarchy and mandates data-testid on every interacted element.
---

Please create e2e tests covering all cases of the software, any user, at any state, at any role — you must cover all. The most important thing is to **NEVER ASSUME**. I found that 100% of your assumptions are wrong! So please **before each action**: validate current state with logs, variables, screenshots, network — anything that can give you a clear understanding of the state of the app. Then apply the action. Then **re-estimate the state after** the action to prooofffffffff that this action completed and had the exact effect we expected.

The proof must be by looking at any source of data — DB, network, GitHub, database, role, audit, users, logs, screenshots, Playwright screenshots, Windows screenshots, processes, etc.

## Directory layout (MANDATORY)

```
apps/web/e2e/
├── actions/
│   ├── page/              # All actions possible on a single page (one file per page)
│   │   ├── sign-in.ts           # click-google, fill-email, submit-otp, assert-welcome
│   │   ├── onboarding.ts        # fill-business-name, pick-industry, click-continue
│   │   ├── home.ts              # open-composer, click-channel, read-kpi
│   │   └── ...                  # one file per route in src/app/(app)/ and (auth)/
│   ├── flows/             # Repeatable flows within ONE page (aggregate multiple actions)
│   │   ├── sign-in-with-google.ts
│   │   ├── onboarding-step1.ts
│   │   └── compose-draft-post.ts
│   └── features/          # Multi-page feature flows (aggregate flows)
│       ├── first-time-user-signup.ts   # sign-in → onboarding → home → create channel
│       ├── api-key-lifecycle.ts        # sign-in → settings/api-keys → mint → revoke
│       └── post-to-facebook.ts         # sign-in → compose → schedule → wait cron → verify
├── qa-tests/              # All E2E tests, one per feature, stacked
│   ├── signup.spec.ts
│   ├── api-keys.spec.ts
│   ├── publishing.spec.ts
│   └── ...
├── fixtures/              # Test users, seeded data, shared config
│   ├── users.ts           # test personas (owner, editor, viewer, admin, anonymous)
│   └── seed.ts            # DB seed helpers (uses Supabase service role)
├── helpers/               # Proof-gathering utilities
│   ├── screenshot.ts      # capture-and-attach helpers
│   ├── db-probe.ts        # read-from-Supabase assertions
│   ├── network-probe.ts   # intercept + assert on request/response
│   └── audit-probe.ts     # read audit_log rows
└── playwright.config.ts
```

## Hard rules — these are NOT suggestions

### 1. `data-testid` on every interacted element

Before writing a test, **audit the target component**. If the element being interacted with or asserted against does not have a `data-testid`, **add one to the source file**, then test.

- `data-testid` must be kebab-case and describe *purpose* not *style*: `sign-in-google-button`, `onboarding-business-name-input`, `home-kpi-followers`.
- Never select by text content, class name, or tag — those break on copy changes / Tailwind refactors.
- Prefer `page.getByTestId('...')` over `page.locator('[data-testid=...]')` (shorter, reads nicer).

### 2. Proof before AND proof after every action — no exceptions

For every action (click, fill, navigate, submit), structure the code as:

```ts
// 1. PROVE the precondition
const beforeState = await capturePageState(page, { testid: 'foo' });
expect(beforeState.url).toBe('/sign-in');
expect(beforeState.localStorage.session).toBeUndefined();
const beforeScreenshot = await page.screenshot({ path: 'before-action.png' });

// 2. ACT
await signInActions.clickContinueWithGoogle(page);

// 3. PROVE the action took the expected effect
const afterState = await capturePageState(page);
expect(afterState.url).toMatch(/\/onboarding|\/home/);
const dbUser = await dbProbe.readAuthUser('barakmenachem@gmail.com');
expect(dbUser.last_sign_in_at).toBeGreaterThan(beforeState.timestamp);
const auditRows = await auditProbe.readSince(beforeState.timestamp);
expect(auditRows).toContainEqual(expect.objectContaining({ action: 'user.signed_in' }));
const afterScreenshot = await page.screenshot({ path: 'after-action.png' });
```

Every action function in `actions/page/*.ts` must internally follow this pattern — do not push the burden onto test authors. Provide helpers in `helpers/` that return structured state snapshots.

### 3. Cover every user, state, role

For each feature test (`qa-tests/*.spec.ts`), parameterize over:

- **Users**: anonymous / authenticated / just-signed-up (no business) / has-business / has-multiple-businesses
- **Roles**: owner / admin / editor / viewer (once memberships beyond owner are supported)
- **States**: empty (no data) / populated (one of each) / at-limit (tier cap reached) / over-limit (downgraded tier)
- **Auth methods** where relevant: Google SSO / email+password (staging only)

Use `test.describe.parallel` + `test.each` patterns to combinatorially run. If a combination is impossible or meaningless (e.g. anonymous user accessing settings), write it as a negative test that asserts the redirect / 401 / 403.

### 4. Sources of proof — use at least TWO per assertion

- DOM — `data-testid` presence / text / attribute
- Network — response status, body shape, headers, cookies set
- DB (Supabase) — row presence, column values, RLS scope respected
- Audit log — `public.audit_log` contains the expected action row with correct actor + resource
- Vercel logs — pino event lines with expected `event` name + fields
- Screenshots — both PNG and accessibility tree snapshot
- URL — `page.url()` after navigation

If an assertion relies on only one source, it's fragile. Cross-check.

### 5. Test data discipline

- Every test **creates its own tenant + user** via `fixtures/seed.ts` (uses Supabase service role), tagged with a unique test id.
- Every test **tears down** in `afterEach` — delete the user row (cascades).
- Never hardcode UUIDs; generate with `gen_random_uuid()` on the DB side, read back in the seed helper.
- Never leak test data into prod if running against prod — prefer Vercel preview deploys against the staging Supabase.

### 6. Run targets

- **Default**: local dev server (`pnpm dev`) with staging Supabase env.
- **CI on PR**: Vercel Preview URL against staging Supabase. Playwright installs chromium, runs, uploads report artifact on failure.
- **Nightly schedule**: prod URL against prod Supabase, read-only smoke tests only (no seeding, no mutations).

## Execution order when `/bstack:qa-playwright` is invoked

1. **Read the repo**: list `src/app/` routes + `src/components/shell/` + server actions. Understand every page and interactive element that exists.
2. **Audit `data-testid` coverage**: grep for existing `data-testid` attributes. For any interactive element without one, add it to the source file (commit as a prep change).
3. **Scaffold the directory structure** under `apps/web/e2e/` as specified above. Fill every directory with at least one concrete file; never leave placeholder `_.gitkeep` only.
4. **Write the helpers first** (`helpers/*.ts`) so action files can import from them.
5. **Write action files** (`actions/page/*.ts`) — one per page, every interactive element gets a function.
6. **Build flows and features** from those actions.
7. **Write qa-tests** that exercise every combination of user × state × role relevant to each feature.
8. **Run the full suite** locally. Fix failures. Re-run. Do not ship with red.
9. **Wire CI** — add / update `.github/workflows/e2e.yml` to run the suite on PRs and nightly.
10. **Report back** with: directory listing, number of tests per feature, coverage of user×role×state matrix, pass/fail numbers, any `data-testid` additions made to source.

## Never assume — the audit checklist before declaring a test passing

- Was the DOM assertion cross-checked against a network response?
- Was the network assertion cross-checked against a DB row?
- Was the DB row cross-checked against an audit_log entry?
- Was a screenshot captured before AND after?
- Was the state reset between tests?
- Was the test run in a fresh browser context (no leaked cookies)?
- Did the assertion tolerate flakiness (retries) where genuinely non-deterministic, or fail fast where deterministic?

If any answer is "no" and you cannot justify why, go back and tighten the test.
