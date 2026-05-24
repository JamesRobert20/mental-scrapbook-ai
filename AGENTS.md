# Mental Scrapbook — Agent Playbook

> **Read this top-to-bottom before writing any code.** It is the authoritative source for architecture, conventions, and package choices. For humans: product overview, install, and env setup are in **[README.md](./README.md)** — do not duplicate those sections here.

---

## 0. Context

Mental Scrapbook — voice-first daily planning (mic/text → AI → todos + voice reply; optional Gmail sync). **Expo Go on a physical device**; no custom native builds.

Product overview, install, env template, and run commands: **[README.md](./README.md)**.

---

## 1. Stack (canonical)

| Concern              | Choice                                                              | Notes                                                                       |
| -------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Runtime              | Expo SDK 54, React 19, RN 0.81, New Architecture ON                 | Versioned docs: https://docs.expo.dev/versions/v54.0.0/                     |
| React Compiler       | **ON** (`app.json` → `experiments.reactCompiler`)                   | Do not hand-memo by default — see §4.1                                      |
| Router               | `expo-router` (file-based, typed routes)                            | JS `Tabs` (custom pill tabBar), not NativeTabs (design is custom)           |
| State (client)       | `zustand`                                                           | Strict pattern — see §4                                                     |
| Server state / cache | `@tanstack/react-query`                                             | Wrap all async data in queries/mutations                                    |
| Backend              | **Expo Router `+api` routes only** (`app/api/**/+api.ts`)           | No Express, Next.js, Supabase, or separate Node service — see §1.1          |
| DB                   | `expo-sqlite` on device + Drizzle ORM                               | Users, sessions, todos — **client-only**; `+api` routes do not open this DB |
| Secrets / session    | `expo-secure-store`                                                 | Auth tokens, OAuth refresh tokens, Gmail tokens                             |
| Auth                 | Local email+password (SQLite + secure-store)                        | Hackathon scope — auth lives entirely on device, see §9                     |
| AI                   | Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`)             | Tool-calling agent on the server route, `useChat` on client                 |
| Voice in             | `expo-audio` (record) → server STT (Whisper Large v3 Turbo on Groq) | NOT `expo-av` (deprecated); Groq is ~4-5x faster than OpenAI Whisper        |
| Voice out            | OpenAI TTS via `/api/speak` → `expo-audio` playback                 | `expo-speech` is the offline fallback when the network call fails           |
| OAuth (Gmail)        | `expo-auth-session` + `expo-web-browser`                            | Google OAuth via auth code → exchange on API route                          |
| Styling              | `StyleSheet.create` + design tokens from `constants/theme.ts`       | No CSS, no Tailwind                                                         |
| Fonts                | `@expo-google-fonts/playfair-display`, `…/hanken-grotesk`           | Loaded once in root `_layout`                                               |
| Blur / glass         | `expo-blur` `<BlurView>`                                            | NOT `expo-glass-effect` (requires iOS 26 custom build)                      |
| Gradients            | `expo-linear-gradient`                                              | For the orb glow + card accents                                             |
| Vector / shapes      | `react-native-svg`                                                  | The "Pulse" indicator, organic shapes                                       |
| Images               | `expo-image`                                                        | Never `<Image>` from `react-native`, never `<img>`                          |
| Haptics              | `expo-haptics`                                                      | Conditional on iOS for delight                                              |

### Expo Go compatibility is non-negotiable

Before adding ANY new dependency, confirm:

1. It is listed as Expo Go compatible (no custom native code), OR
2. It is a pure-JS package.

If it requires `expo prebuild` / a dev client, **do not add it** without explicit approval.

Disallowed for this project (require custom builds):

- `react-native-mmkv`
- `expo-glass-effect`
- Native Google Sign-In SDKs (`@react-native-google-signin/google-signin`)
- Anything in `@stripe/stripe-react-native` native flows
- A **standalone** auth server (Express, Next.js, Hono on another port) — auth must use Expo `+api` routes in this repo, not a second backend

### 1.1 Expo Router `+api` routes — the only backend

**There is no separate backend repo or server.** All server-side code lives in `app/api/**/+api.ts` files co-located with the Expo app. Metro (dev) or EAS Hosting (prod) runs these handlers.

```
app/api/hello+api.ts     →  GET /api/hello
app/api/chat+api.ts      →  POST /api/chat
app/api/auth/sign-in+api.ts  →  POST /api/auth/sign-in   (only if that endpoint needs server secrets)
```

**File rules**

- Suffix must be `+api.ts` (not `route.ts`, not a `pages/api` folder elsewhere).
- Export named HTTP handlers: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- Handlers are **thin**: parse/validate request (zod) → call a service → `return Response.json(...)` or stream. No business logic inline.
- Server secrets (`AI_GATEWAY_API_KEY`, `GOOGLE_OAUTH_CLIENT_SECRET`, …) are read only in `server/env.ts` (via `+api.ts` handlers) — never `EXPO_PUBLIC_*`. Env file template: [README.md § Environment variables](./README.md#environment-variables).

**What runs on `+api` vs on the device**

| Concern                                 | Where it runs                                     | Why                                                                      |
| --------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| OpenAI chat / tool loop (streaming)     | `app/api/chat+api.ts`                             | API key must stay server-side                                            |
| Whisper transcription                   | `app/api/transcribe+api.ts`                       | Calls Groq (not AI Gateway — Gateway doesn't proxy audio)                |
| Gmail OAuth code → tokens               | `app/api/gmail/callback+api.ts`                   | Client secret                                                            |
| Gmail REST fetch + parse emails         | `app/api/gmail/sync+api.ts`                       | Access token handling                                                    |
| Users, sessions, todos CRUD             | **Client** (`lib/services` → repos → expo-sqlite) | DB file lives on the phone in Expo Go                                    |
| Password hash / sign-in                 | **Client** (hackathon)                            | Same SQLite; upgrade path uses `+api` if we add a hosted DB later        |
| Persisting todos after agent tool calls | **Client**                                        | Server streams tool calls; client executes tools against `todos.service` |

**Client → API calls**

- Always build URLs through `apiUrl('/api/...')` from `lib/infrastructure/api-url.ts`. **Never** use a bare `/api/...` string — on Expo Go a device cannot resolve relative URLs; the helper derives the dev host from `Constants.experienceUrl`.
- For **AI SDK `useChat` / streaming** specifically: pass `fetch: expoFetch` (from `expo/fetch`) into `DefaultChatTransport`. Native `fetch` in RN does not stream the AI SDK's UI message protocol.
- Streaming also requires polyfills (`structuredClone`, `TextEncoderStream`, `TextDecoderStream`). They're loaded once in `lib/infrastructure/polyfills.ts` and imported as the first line of `app/_layout.tsx`. Do not remove that import.
- React Query `queryFn` / `mutationFn` may call either local services (SQLite) or `apiUrl('/api/...')` — never mix them in one function without a comment.
- For Expo Go on a **physical device**, the dev machine must be reachable: run `pnpm start --tunnel` so the resolved host is reachable from the phone.

**`useChat` + tools**

- Point `useChat({ api: '/api/chat' })` (or equivalent per current AI SDK docs) at the `+api` route.
- Tools that **write to SQLite** (`createTodo`, `completeTodo`, …) are implemented on the **client** (tool execute handler / `onToolCall`) and call `todos.service` — the server route only streams model output and tool _definitions_, not device DB access.

**Do not**

- Create `server/`, `backend/`, or a second `package.json` for API code.
- Put OpenAI/Gmail SDK calls in components or hooks.
- Call `expo-sqlite` / Drizzle from inside a `+api.ts` file (no shared DB with the phone in Expo Go).

---

## 2. Layered architecture (READ FIRST)

The codebase is organized in **strict layers**. Each layer only depends on layers below it. Crossing layers (e.g. a component reading SQLite directly) is a bug, not a shortcut.

There are **two halves** of the codebase: client (the device app) and server (the `+api` route runtime). Each half is layered, and **client code never imports from `server/`**.

### Client (everything that runs on the phone)

```
┌─────────────────────────────────────────────────────────────────┐
│  Presentation       app/**, components/**                       │  screens, UI primitives
├─────────────────────────────────────────────────────────────────┤
│  Orchestration      hooks/**, stores/**                         │  react-query hooks, zustand actions
├─────────────────────────────────────────────────────────────────┤
│  Services           lib/services/**                             │  orchestrate queries, enforce invariants
├─────────────────────────────────────────────────────────────────┤
│  Queries            lib/queries/**                              │  pure DB read/write — no business rules
├─────────────────────────────────────────────────────────────────┤
│  Models             lib/models/**                               │  row types + DTO + mapRowToDto per entity
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure     lib/db/, lib/infrastructure/                │  db client, secure-store, crypto, api-client
└─────────────────────────────────────────────────────────────────┘
```

### Server (everything inside `+api.ts` handlers)

```
┌─────────────────────────────────────────────────────────────────┐
│  API boundary       app/api/**/+api.ts                          │  THIN — parse, validate, call service, return
├─────────────────────────────────────────────────────────────────┤
│  Services           server/services/**                          │  chat, gmail, transcription — orchestration
├─────────────────────────────────────────────────────────────────┤
│  Integrations       server/integrations/**                      │  openai, gmail REST, google oauth wrappers
├─────────────────────────────────────────────────────────────────┤
│  AI runtime         server/ai/**                                │  gateway client, agent tools, prompts, runner
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure     server/env.ts                               │  validated process.env reader
└─────────────────────────────────────────────────────────────────┘
```

### Shared kernel (importable from either half)

`lib/z/**` (zod schemas), `lib/types/**` (error classes, API response shapes), `lib/models/**` (types only — never run queries from server), `constants/**`.

### Allowed dependencies

| Layer                  | Can import from                                                           |
| ---------------------- | ------------------------------------------------------------------------- |
| Presentation (client)  | Orchestration, Shared kernel, `constants/**`                              |
| Orchestration (client) | Client services, `lib/infrastructure/api-client.ts`, Shared kernel        |
| Client services        | `lib/queries/**`, `lib/models/**`, Shared kernel, `lib/infrastructure/**` |
| Client queries         | `lib/db/**`, `lib/models/**` (types), Shared kernel                       |
| Client models          | `lib/db/schema.ts` (for `$inferSelect`), Shared kernel                    |
| `+api` handlers        | `server/services/**`, `server/env.ts`, Shared kernel                      |
| Server services        | `server/integrations/**`, `server/ai/**`, `server/env.ts`, Shared kernel  |
| Server integrations    | `server/env.ts`, Shared kernel                                            |
| `server/ai/**`         | `server/env.ts`, `server/integrations/**`, Shared kernel                  |

### Forbidden cross-layer moves

- A component imports `lib/queries/...` or `lib/db/...` → **wrong**, must go through a query hook → service → query.
- A query calls another query → **wrong**, lift the orchestration into a service.
- A service (client or server) imports React or any `expo-*` UI module → **wrong**, services are framework-free.
- A zustand store calls a query directly → **wrong**, route through a service or react-query hook.
- **Anything under `app/`, `components/`, `hooks/`, `stores/`, `lib/` imports from `server/`** → **bug**. `server/` is server-only.
- A `+api.ts` handler imports `expo-sqlite`, `lib/queries/`, or `lib/db/` → **wrong**, the device DB does not exist in the API runtime.

---

## 3. Folder structure

```
app/                              # routes ONLY. No co-located components, types, or utils.
  _layout.tsx                     # QueryProvider + Stack + <NotificationBanner />; fonts, auth bootstrap, splash
  index.tsx                       # redirect to (app) or (auth) based on useAuthStatus()
  (auth)/                         # public auth group
    _layout.tsx
    sign-in.tsx
    sign-up.tsx
  (app)/                          # protected tabs — Redirect to sign-in if not authenticated
    _layout.tsx                   # mounts useGmailAutoSync + useTodoReminders; custom pill tabBar
    index.tsx                     # Capture (default tab)
    insights.tsx
    profile/                      # profile tab + pushed sub-screens (stack)
      _layout.tsx
      index.tsx                   # Profile root (avatar, settings sections)
      personal-info.tsx
      notifications.tsx           # local reminders toggle
      language.tsx
      voice.tsx                   # TTS voice picker
      sync-gmail.tsx              # Gmail connect / auto-scan toggle / scan now
  api/                            # Expo +api routes — THIN handlers; delegate to server/
    chat+api.ts                   # POST → server/services/chat.service
    speak+api.ts                  # POST → server/services/speech.service (streams TTS)
    transcribe+api.ts             # POST → server/services/transcription.service (Whisper on Groq)
    gmail/
      callback+api.ts             # POST → server/services/gmail.service.handleGmailCallback
      refresh+api.ts              # POST → server/services/gmail.service.handleGmailRefresh
      sync+api.ts                 # POST → server/services/gmail.service.handleGmailSyncRequest

server/                           # SERVER-ONLY. Imported only by +api.ts files. See §1.1.
  env.ts                          # zod-validated process.env reader
  ai/
    agent.ts                      # ToolLoopAgent factory + ChatAgentUIMessage type
    prompts.ts                    # re-exports buildSystemPrompt from lib/ai/prompts
  integrations/
    gmail/
      oauth.ts                    # exchangeAuthCode, refreshAccessToken
      api.ts                      # listMessageIds, getMessageMetadata, fetchUserEmail
    groq/
      whisper.ts                  # audio → text (whisper-large-v3-turbo, low-latency)
    openai/
      tts.ts                      # text → mp3 stream (response.body passthrough)
  services/
    chat.service.ts               # handleChatRequest — validate, stream UI message protocol
    transcription.service.ts      # transcribeAudio
    speech.service.ts             # synthesizeSpeech — pipes OpenAI TTS body to client
    gmail.service.ts              # handleGmailCallback / Refresh / SyncRequest + extractTodoCandidates

components/                       # reusable UI. Presentation layer only.
  ui/                             # button, input, text, glass-pane, pill-tab-bar, notification-banner
  capture/                        # capture-orb, mic-button, transcript-stream, voice-input-bar, markdown-content
  insights/                       # calendar-strip, schedule-timeline, priority-card, todo-chip, section-header
  profile/                        # settings-section, settings-row, toggle-row
  layout/                         # screen-header

stores/                           # zustand stores (orchestration). See §6.
  auth.store.ts                   # session + user, bootstrap status
  capture.store.ts                # mic/recording/streaming state
  insights.store.ts               # selected day key
  preferences.store.ts            # speech voice, gmail auto-sync, notifications toggles
  banner.store.ts                 # in-app notification banner queue

hooks/                            # orchestration: react-query + small RN hooks.
  queries/
    use-todos.ts
    use-insights-todos.ts         # derives important / schedule / general for a day
    use-gmail-status.ts
  mutations/
    use-sign-in.ts
    use-sign-up.ts
    use-gmail-sync.ts             # runGmailSyncForCurrentUser → invalidate todos
  use-auth-bootstrap.ts
  use-capture-chat.ts             # wraps @ai-sdk/react useChat + client tool execution
  use-recorder.ts                 # wraps expo-audio (16kHz mono RecordingOptions)
  use-speaker.ts                  # /api/speak streaming + expo-audio playback (expo-speech fallback)
  use-gmail-auto-sync.ts          # foreground polling + AppState + banner/notify on new high-priority todos
  use-todo-reminders.ts           # schedules local notifications for upcoming scheduled todos
  use-color-scheme.ts / .web.ts

lib/                              # CLIENT + shared kernel (also imported by server-side modules where noted)
  ai/                             # shared by client (useChat tool execution) AND server (agent definition)
    chat-types.ts                 # ChatAgentUIMessage re-export, tool name unions
    prompts.ts                    # buildSystemPrompt(): SYSTEM_PROMPT with date/time/timezone
    tools.ts                      # agentTools (createTodo, listTodos, completeTodo, pullGmailTodos)
    voices.ts                     # SpeechVoiceId enum + DEFAULT_SPEECH_VOICE

  types/                          # shared errors, API response shapes
    api.ts
    errors.ts                     # AuthError, ValidationError, IntegrationError

  z/                              # zod schemas (validate at boundaries)
    auth.ts
    todo.ts                       # createTodoSchema (priority + dueAt ISO datetime, no category)

  models/                         # per-entity: row type, DTO, mapRowToDto
    user.model.ts
    session.model.ts
    todo.model.ts                 # TodoRow, Todo, TodoPriority, TodoSource, mapTodoRow
    gmail-token.model.ts          # GmailTokenRow, GmailConnection (email + lastSyncedAt + cursor)

  queries/                        # data access layer — pure DB queries, return Rows
    users.queries.ts
    sessions.queries.ts
    todos.queries.ts
    gmail-tokens.queries.ts       # find / upsert / delete / updateGmailSyncCursor

  services/                       # client business logic — orchestrate queries, return DTOs
    auth.service.ts               # signUp / signIn / signOut / bootstrapSession / getCurrentUser
    todos.service.ts              # listTodosForCurrentUser / createTodoForCurrentUser / completeTodoForCurrentUser
    gmail.service.ts              # exchange/persist/disconnect, syncGmailTodos, runGmailSyncForCurrentUser

  db/                             # device SQLite only — NEVER imported from server/
    client.ts                     # openDatabaseSync + IF NOT EXISTS DDL + drizzle()
    schema.ts                     # users, sessions, todos, gmail_tokens

  infrastructure/                 # leaf utilities; no React, no business rules
    api-client.ts                 # fetch('/api/...') + auth header (consumed by hooks)
    api-url.ts                    # apiUrl('/api/...') — derives host from Constants.experienceUrl
    crypto.ts                     # bcryptjs hashing (Expo Go safe)
    date-keys.ts                  # dayKey(), hasScheduledTime(), formatTimeLabel()
    haptics.ts                    # tap(tone) — single entry point over expo-haptics
    id.ts                         # createId(), createSessionToken()
    notifications.ts              # expo-notifications wrapper (permission, instant, schedule, cancel)
    polyfills.ts                  # structuredClone + TextEncoder/DecoderStream for AI SDK streaming
    secure-store.ts               # typed expo-secure-store wrapper (session + Gmail tokens)
    sentence-stream.ts            # extractSentences() — clause flusher for TTS chunking
    speech.ts                     # client-side TTS helpers consumed by useSpeaker
    transcribe.ts                 # client-side STT upload helper consumed by useRecorder

  navigation/
    routes.ts                     # typed Href constants (Routes.signIn, Routes.settings.syncGmail, …)

  providers/
    query-provider.tsx            # QueryClientProvider (single client instance)

constants/
  theme.ts                        # Colors, Spacing, Radii, Typography, Shadows — single source of truth

types/
  ambient-modules.d.ts            # declare module shims for untyped deps

assets/                           # images, splash, icons
```

**Naming:**

- Models: `<entity>.model.ts` — exports `<Entity>Row` (drizzle infer), `<Entity>` (DTO), `map<Entity>Row(row)`.
- Queries: `<entity>.queries.ts` — exports pure async functions (`findById`, `insert`, `update`) that return **Rows**, not DTOs.
- Services: `<domain>.service.ts` — exports use-case functions (`signIn`, `createTodoFromVoice`) that return **DTOs**.
- Stores: `<concern>.store.ts` (never exported — see §6).
- Components: kebab-case file, PascalCase symbol, default export.

**Rules:**

- `app/` holds **routes only**. Never put helpers, hooks, components, or types there.
- Path alias `@/*` is configured in `tsconfig.json`. Always use `@/...`, never `../../`.
- File names are **kebab-case** (`capture-orb.tsx`, not `CaptureOrb.tsx`).
- Default-export the primary symbol of a file. Everything else is named-export.

---

## 4. Code quality bar

This is a hackathon, but the code stays clean. Non-negotiable:

### Functions

- **Single responsibility.** One reason to change. If you write "and" in a function name, split it.
- **≤ 40 lines** per function, ideally < 20. Long body → extract helpers.
- **≤ 4 parameters.** More → take an `options` object.
- **Pure where possible.** No hidden globals. Inject dependencies through arguments.

### Modules

- Every module has a **clear purpose** stated in a single comment at the top OR obvious from the filename. No grab-bag `utils.ts` files — prefer `lib/infrastructure/<specific-thing>.ts`.
- One concept per module. If a file has both `User` and `Todo` logic, split it.
- No circular imports. If you need to import from a sibling, lift the shared piece up.

### Types

- Everything that crosses a layer boundary is **typed via `lib/types/**`** or **validated via `lib/z/**`** (zod) — DTOs at API routes, service inputs/outputs, mutation/query results.
- `any` is banned. `unknown` + a zod parse is the escape hatch.
- Prefer **discriminated unions** over flags (`{ kind: 'voice' | 'text' | 'gmail' }` over `{ isVoice, isText, isGmail }`).
- Inferred types from Drizzle (`InferSelectModel<typeof todos>`) — do not re-declare row shapes.

### Components

- **Presentational** components take props, return JSX. They do **no** data fetching, no zustand subscriptions for anything other than UI state.
- **Container** components (top-level per screen) do the orchestration: consume query hooks + store hooks, pass plain props to presentational children.
- Extract any JSX subtree > ~30 lines into its own component in `components/<area>/`.
- Hooks at the top of the function. Early returns for loading / error / unauthenticated states. Happy path last.

### React 19 + React Compiler (§1 stack — compiler ON)

`experiments.reactCompiler: true` in `app.json`. The compiler auto-memoizes components and callbacks. **Do not reach for `useCallback`, `useMemo`, or `memo` unless you have a documented reason** (see exceptions below).

**Default patterns**

- Write plain functions in render for event handlers (`onPress={() => …}`, `async function handleSend() { … }`). The compiler stabilizes what needs stabilizing.
- **Destructure functions from hooks at the top of the component** — never dot into a hook return object inside JSX or a nested handler (`router.push` → `const { push } = useRouter()` then `push(...)`). Same for `useChat`, `useRecorder`, etc.
- **Prefer event handlers over effects** for user-driven work (send message, record mic, navigate). Effects are for synchronizing with _external_ systems (bootstrap session once, splash hide, web color-scheme hydration, starting a Reanimated loop on mount).
- **Derive UI state during render**, not in `useEffect` (`const isThinking = chatStatus === 'streaming'` — not `useEffect` + `setState`).
- **Stable references for third-party instances**: if a library stores the object you pass in (e.g. `new DefaultChatTransport(...)` to `useChat`), create it once via `useRef` lazy init or module scope — a new instance every render still breaks even with the compiler.

**`useEffect` rules**

- Dependencies must be **primitives or stable values** — not whole objects you only use fields from.
- Cleanup on unmount for subscriptions, timers, and in-flight async (`cancelled` flag pattern in `use-auth-bootstrap`).
- Do **not** use an effect to call a parent callback when something changes; call the callback from the event/stream handler that caused the change (`onFinish` on `useChat`, not `useEffect([messages])`).

**Latest callback without re-running effects**

- `useEffectEvent` is the React 19 API for “always call the latest handler inside an effect without listing it in deps.” It is **not** exported from our current `react@19.1` package yet.
- Until it ships here: **`useRef` + sync in render** for callbacks passed into long-lived configs (`onAssistantText` → `onAssistantTextRef.current = onAssistantText` each render, read `.current` inside `onFinish`).

**When manual memo is still OK**

- `React.memo` on list row components **only** if profiling shows unnecessary row re-renders and the compiler did not fix it (FlashList rows with heavy children).
- `useMemo` for **genuinely expensive** pure computation (large sort/filter), not for “stable” callbacks.
- Reanimated: in **worklets** (`useAnimatedStyle`), `.value` is still normal; in **plain JS** (component body / effects), prefer shared-value `.get()` / `.set()` when the Reanimated + compiler docs require it.

**References:** Vercel `vercel-react-native-skills` rules `react-compiler-destructure-functions`, `react-compiler-reanimated-shared-values`; React docs on [React Compiler](https://react.dev/learn/react-compiler).

### Errors

- Throw `Error` subclasses defined in `lib/types/errors.ts` (e.g. `AuthError`, `ValidationError`, `IntegrationError`). Never throw bare strings.
- API routes catch at the boundary, return a typed `{ error: { code, message } }` shape with the right HTTP status.
- Components surface errors through React Query's `error` and a single `<ErrorBanner>` primitive.

### Comments (strict — read before writing one)

**Default: do not add a comment.** Names, types, and structure must carry the meaning. A comment is an admission that the code didn't.

Only add a comment when **all** of the following are true:

1. A reasonable reader of this file would be **wrong** about the code without it (non-obvious intent, gotcha, workaround, invariant, ordering constraint, security/perf trade-off).
2. The fix is not "rename a variable" or "extract a function" — try those first.
3. You can say it in **one short line**. If you need a paragraph, the architecture/rule belongs in `AGENTS.md`, not in the file.

What that rules out:

- **Section banners** (`// ---------- actions ----------`, `// helpers`). The file structure or extra blank line is enough.
- **Restating the next line** (`// hash the password`, `// fetch the user`, `// state`, `// types`, `// import x`).
- **JSDoc on internal functions** that already have a typed signature and a self-explanatory name. JSDoc is fine on **public service/util APIs** when there's a real caveat to document — not for every parameter.
- **Commented-out code.** Delete it; git has it.
- **TODOs without an owner.** `// TODO(jules): refactor when X` is fine; bare `// TODO` is not.
- **File-header comments** stating what the file is. The path + default export name already do that. Add a top-of-file comment **only** when the module has a non-obvious contract worth one line (e.g. "Polyfills bcryptjs' CSPRNG via expo-crypto.").

What stays:

- One-line **why** comments at non-obvious branches (`// keep this synchronous — react-query expects a sync selector`).
- The **single line of intent** at the top of a module when its filename doesn't fully convey it.
- **Architectural decisions** — those go in `AGENTS.md`, not in code.

If you're about to type `// ` and the code below it is obvious from its identifiers, delete the comment instead.

### Tests

- Out of scope for the hackathon, but services and queries must be written so they could be unit-tested without React (no module-scope React hooks, no top-level `useColorScheme()`, etc.).

### Imports

- Order: (1) `react`, (2) `react-native` / `expo-*`, (3) third-party, (4) `@/*`, (5) relative. Blank line between groups.
- No barrel re-export files unless they materially help DX (avoid `index.ts` in every folder).

---

## 5. Routing & auth gate

- Root `_layout.tsx` loads fonts, runs `useAuthBootstrap()`, and renders a splash until both finish. It hosts `<QueryProvider>`, the root `<Stack>`, and the top-of-app `<NotificationBanner />`.
- The gate is a `<Redirect href={Routes.signIn} />` inside `(app)/_layout.tsx`, keyed on `useAuthStatus()` from `stores/auth.store.ts`. The `(app)` group is the protected boundary; `(auth)` is public.
- `(app)/_layout.tsx` mounts `useGmailAutoSync()` and `useTodoReminders()` (foreground-only, see §11.1), then renders `<Tabs>` with a custom `tabBar` prop pointing at `components/ui/pill-tab-bar.tsx`. Order: Insights (left), Capture (center), Profile (right). Capture is `index.tsx`.
- Profile sub-screens live under `app/(app)/profile/**` (`personal-info`, `notifications`, `language`, `voice`, `sync-gmail`) and are pushed as a stack from `profile/index.tsx` via per-row Links. There is no separate `settings/` group.

---

## 6. State management — Zustand (strict pattern)

**The store is never exported. It only holds state — never functions, never derived data.** Consumers go through:

1. Exported **subscriber hooks** for reading state.
2. Exported **action functions** for writing state, defined at module scope using `setState` / `getState` destructured from the created store.

### Template

```tsx
// stores/capture.ts
import { create } from 'zustand'

type CaptureState = {
    status: 'idle' | 'recording' | 'thinking' | 'speaking'
    transcript: string
    audioUri: string | null
}

const useStore = create<CaptureState>(() => ({
    status: 'idle',
    transcript: '',
    audioUri: null
}))

const { setState, getState } = useStore

// ---------- subscriber hooks (read) ----------
export const useCaptureStatus = () => useStore(s => s.status)
export const useCaptureTranscript = () => useStore(s => s.transcript)
export const useCaptureAudioUri = () => useStore(s => s.audioUri)

// ---------- actions (write) ----------
export function setCaptureStatus(status: CaptureState['status']) {
    setState({ status })
}

export function appendTranscript(chunk: string) {
    setState({ transcript: getState().transcript + chunk })
}

export function resetCapture() {
    setState({ status: 'idle', transcript: '', audioUri: null })
}
```

**Do not:**

- `export default useStore` or `export const useCaptureStore`.
- Put functions inside the `create(() => ({ ... }))` initializer.
- Compute derived values inside the store — derive in the component or in a memoized selector hook.
- Call `setState((s) => ({ ... }))` updater form for trivial single-key writes — prefer object form. Use the updater form only when the new value depends on the previous one.

**Do:**

- Use one store per concern (`auth`, `capture`, `ui`). Do NOT make a giant root store.
- Place selector hooks that read a single primitive at the top of the exports list. They are the only thing components import.
- Treat action functions as the public API surface — they can be called from anywhere (event handlers, effects, react-query callbacks, even other stores).

---

## 7. Data fetching — TanStack React Query

- **Every async read** (local SQLite, server API route, third-party API) goes through `useQuery`.
- **Every async write** goes through `useMutation` with `onSuccess: invalidateQueries(...)`.
- Hooks live in `hooks/queries/` and `hooks/mutations/`, named `useTodos`, `useCreateTodo`, etc.
- Query keys are arrays starting with the entity name: `["todos"]`, `["todos", id]`, `["gmail", "status"]`. Keep them stable.
- Use `staleTime: 1000 * 60` as default for local-DB queries; tune per case.
- Never call a repository directly from a component or store. Always go through a service-backed query/mutation hook.

### Hook template

```tsx
// hooks/queries/use-todos.ts
import { useQuery } from '@tanstack/react-query'
import { listTodosForCurrentUser } from '@/lib/services/todos.service'

export function useTodos() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: listTodosForCurrentUser
    })
}
```

---

## 8. Database — `expo-sqlite` + Drizzle

- One DB file: `mental_scrapbook.db`, opened once in `lib/db/client.ts` via `openDatabaseSync`.
- Drizzle for type-safe queries. Schemas in `lib/db/schema.ts`.
- **Migrations (hackathon scope):** `client.ts` runs idempotent `CREATE TABLE IF NOT EXISTS` DDL at boot, plus a small set of `ALTER TABLE … ADD/DROP COLUMN` blocks wrapped in try/catch for in-place upgrades on existing installs. When the schema stabilizes, swap to `drizzle-kit generate` + `useMigrations()` from `drizzle-orm/expo-sqlite/migrator`.
- **Categorization is derived, not stored.** A todo's bucket on the Insights screen is computed in `use-insights-todos.ts` from `priority` and `hasScheduledTime(dueAt)`:
    - `important` ← `priority === 'high'`
    - `schedule` ← `hasScheduledTime(dueAt)` (sorted chronologically)
    - `general` ← everything else
- Tables:
    - `users` — `id`, `email`, `password_hash`, `first_name`, `last_name`, `created_at`
    - `sessions` — `token`, `user_id`, `expires_at`
    - `todos` — `id`, `user_id`, `title`, `notes`, `due_at` (full ISO datetime with offset when scheduled), `priority` (low | medium | high), `source` (manual | voice | gmail), `created_at`, `completed_at`
    - `gmail_tokens` — `user_id`, `access_token`, `refresh_token`, `expires_at`, `email`, `last_synced_at`, `last_seen_message_id` (server-side dedupe cursor — see §11.1)

---

## 9. Auth (hackathon)

Auth is **client-local** because `expo-sqlite` lives on the device (see §1.1). Do not add `app/api/auth/*+api.ts` unless we introduce a hosted database.

- Sign-up / sign-in: `auth.service.signUp()` / `signIn()` → repos write `users` + `sessions` in device SQLite → session token in `expo-secure-store` (`session_token`).
- Bootstrap: read token from secure-store → `sessions.repo` + `users.repo` validate → hydrate `stores/auth.store.ts`.
- Password hashing: `bcryptjs` in `lib/infrastructure/crypto.ts` (pure JS, Expo Go safe).
- Sign-out: delete session row + clear secure-store.
- **Upgrade path (v2):** when we add a hosted DB, move auth to `app/api/auth/*+api.ts` and keep the same `auth.service` shape so screens don't change.

---

## 10. AI agent

- Models go through the **Vercel AI Gateway** (default provider in `ai` v6). Set `AI_GATEWAY_API_KEY` in `.env`. **No `@ai-sdk/gateway` package needed** — passing a string model ID like `'anthropic/claude-sonnet-4.5'` directly to `streamText` / `ToolLoopAgent` invokes the Gateway automatically. Fetch the live model list with `curl https://ai-gateway.vercel.sh/v1/models` before picking; **never hardcode model IDs from memory**. Override the default via `AI_GATEWAY_CHAT_MODEL` in `.env`.
- The agent uses **`ToolLoopAgent`** (the AI SDK's recommended pattern — see `ai-sdk` skill `references/type-safe-agents.md`). Defined in `server/ai/agent.ts`; instructions in `server/ai/prompts.ts`.
- `app/api/chat+api.ts` is a 4-line handler → `server/services/chat.service.handleChatRequest()` → `createAgentUIStreamResponse({ agent, uiMessages })`.
- **Type-safe `useChat`**: `server/ai/agent.ts` exports `ChatAgentUIMessage = InferAgentUIMessage<ChatAgent>`. The client uses `useChat<ChatAgentUIMessage>()` for typed message parts (`tool-createTodo`, `tool-pullGmailTodos`, …).
- **Tool execution split** (device SQLite is unreachable from the server, and Gmail tokens live in secure-store):
    - **Client tools** (defined with NO `execute` on the server): `createTodo`, `completeTodo`, `listTodos`, `pullGmailTodos`. The client's `useChat` handles them via `onToolCall` and calls either `lib/services/todos.service.ts` (SQLite) or `POST /api/gmail/sync` with the Gmail access token from secure-store.
    - **Server tools** (full `execute` on the server): none yet. `renderUi({ kind, props })` will be added as a server tool returning a typed UI descriptor (discriminated union in `lib/z`) for the client to render inline.
- Tools (current — see `lib/ai/tools.ts`):
    - `createTodo({ title, notes?, dueAt?, priority? })` — client. `dueAt` is a full ISO datetime (with offset) when the user mentions a time; `priority` is `'high'` only for genuinely important items. No `category` — bucketing is derived (§8).
    - `listTodos({})` — client. Returns the user's open todos.
    - `completeTodo({ id })` — client.
    - `pullGmailTodos({ since? })` — client: calls `runGmailSyncForCurrentUser` which attaches the Gmail access token, POSTs `/api/gmail/sync`, dedupes against existing todos, and writes the survivors via `todos.service`. The server uses `generateText` + `Output.object` and is strict about only returning **actionable** emails.
- **AI SDK gotchas** (per `ai-sdk` skill `references/common-errors.md`): use `inputSchema` not `parameters`; use `maxOutputTokens` not `maxTokens`; use `stopWhen: stepCountIs(n)` not `maxSteps`; use `toUIMessageStreamResponse()` / `createAgentUIStreamResponse({ uiMessages })`; on the client, manage input state with `useState` and call `sendMessage({ text })` (the old `input`/`handleInputChange`/`handleSubmit` are gone).
- Voice flow (every hop is latency-optimized — see §13):
    1. User holds mic → `expo-audio` records at **16kHz mono** (custom `RecordingOptions`, not the `HIGH_QUALITY` preset — uploads are ~4x smaller, no STT accuracy loss).
    2. Release → upload to `/api/transcribe+api.ts` → **Groq `whisper-large-v3-turbo`** direct (~180-260ms round-trip, ~4-5x faster than OpenAI Whisper; Gateway does not proxy audio) → text.
    3. Text → `useChat.sendMessage({ text })` → `google/gemini-3-flash` via AI Gateway (fast TTFT).
    4. As tokens stream, `extractSentences` (`lib/infrastructure/sentence-stream.ts`) flushes **completed sentences** (hard breaks `.!?…\n` only — splitting on commas makes each chunk sound like its own statement) into `useSpeaker.speak()`.
    5. `useSpeaker` enqueues each chunk and starts the `POST /api/speak` fetch **immediately**; `/api/speak` pipes OpenAI TTS's response body straight through (no `arrayBuffer()` buffering on the server). The client downloads, caches as mp3, plays via `createAudioPlayer`; the next chunk is already synthesizing in parallel. `expo-speech` is the per-chunk fallback on network failure.
    6. `setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })` runs **once** at root mount — never re-called in the recording or playback hot paths.

---

## 11. Gmail integration

**Google Cloud Console setup (one-time):**

1. Create / select a project.
2. **APIs & Services → Library** → enable **Gmail API**.
3. **OAuth consent screen** → External, fill app name + support email, **add scope** `https://www.googleapis.com/auth/gmail.readonly`. Stay in **Testing** mode (no Google verification required for ≤100 listed test users — fine for hackathon).
4. **Credentials → Create OAuth client ID** → **Web application** (because `expo-auth-session` uses an HTTPS proxy redirect URI on Expo Go). Add the proxy redirect: `https://auth.expo.io/@<your-expo-username>/<slug>`. Copy `client_id` and `client_secret` into `.env`.

**Client flow (device, `app/(app)/profile/sync-gmail.tsx`):**

- Use `expo-auth-session/providers/google` `Google.useAuthRequest`:
    ```ts
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
        scopes: ['openid', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
        responseType: 'code', // auth-code + PKCE (the lib handles PKCE)
        extraParams: { access_type: 'offline', prompt: 'consent' } // forces refresh_token
    })
    ```
    `access_type: 'offline'` + `prompt: 'consent'` is what makes Google mint a `refresh_token`. Without `prompt: 'consent'`, returning users get only an access token.
- On `response.type === 'success'`: POST `{ code, redirectUri, codeVerifier }` to `/api/gmail/callback`. The server exchanges the code (client_secret stays server-side) and returns `{ accessToken, refreshToken, expiresIn, email }`. Persist these to `gmail_tokens` (device SQLite) and the access/refresh tokens to `expo-secure-store`.
- Token refresh: when access token expires, POST `{ refreshToken }` to `/api/gmail/refresh` (or call from `gmail.service` on the client). Update secure-store + `gmail_tokens.expires_at`.

**Server flow:**

- `/api/gmail/callback` → `server/services/gmail.service.handleGmailCallback` → `server/integrations/gmail/oauth.exchangeAuthCode` → fetches `userinfo` for the email.
- `/api/gmail/sync` (`Authorization: Bearer <gmailAccessToken>`) → `extractTodoCandidates`:
    1. `listMessageIds(token, 'newer_than:7d -category:promotions -category:social -category:updates', 15)`. Strips marketing, social, and shipping/order notifications so the LLM only sees plausible action items.
    2. `getMessageMetadata` for each (uses `format=metadata` + `metadataHeaders=Subject|From|Date` — no email body fetched, lighter quota).
    3. Pass subjects + snippets into `generateText({ model, output: Output.object(...) })` to extract typed todo candidates.

**Settings UI:**

- Show sync status (connected email, last sync timestamp) via a React Query hook that reads `gmail_tokens`.
- "Disconnect" button: clear secure-store + delete `gmail_tokens` row.

### 11.1 Auto-sync & notifications (foreground-only)

We poll Gmail and fire reminders **only while the app is in the foreground**. This is a deliberate, hackathon-scope choice — Expo Go cannot run real background tasks:

- `expo-background-task` / `expo-task-manager` require a custom dev/native build and are explicitly disallowed in Expo Go.
- Remote push (`expo-notifications` push tokens) is removed from Expo Go on SDK 53+ for Android; only local notifications work, and only while the OS keeps the JS runtime alive.
- A separate cron / serverless worker would need its own hosted backend (also out of scope per §1 / §1.1) plus push infrastructure.

What we ship in Expo Go:

- **`hooks/use-gmail-auto-sync.ts`** — `setInterval` while `AppState === 'active'`, gated by the `gmailAutoSyncEnabled` preference. Resyncs immediately on resume. Default cadence: 60s (configurable in `stores/preferences.store.ts`).
- **Server-side dedupe** — `app/api/gmail/sync+api.ts` accepts `lastSeenMessageId` and short-circuits before the LLM call when the newest inbox message hasn't changed. Persist the new cursor in `gmail_tokens.last_seen_message_id` after each sync (no LLM tokens burned on quiet inboxes).
- **Client-side dedupe** — `runGmailSyncForCurrentUser` normalizes titles and skips creating a todo when an open one already exists.
- **In-app banner** — `components/ui/notification-banner.tsx` + `stores/banner.store.ts` for new important todos or reminder messages. Always works regardless of OS permission.
- **Local notifications** — `lib/infrastructure/notifications.ts` wraps `expo-notifications`. `useTodoReminders` schedules one per upcoming scheduled todo (`hasScheduledTime(dueAt)`) within the next 24h, using the `reminderLeadMinutes` preference. Permission is requested lazily.

When we move off Expo Go, the upgrade path is:

1. Add `expo-background-task` (replaces deprecated `expo-background-fetch`) and register a task that calls `runGmailSyncForCurrentUser`. Minimum interval ≈ 15 min.
2. Switch `expo-notifications` to remote push by adding a push token registration on sign-in and a `+api` endpoint that triggers Expo Push from the server when a server-side sync (cron) finds new important emails.
3. Keep the foreground hook as the warm-path; background task is the cold-path.

---

## 12. Design system

All tokens are defined in `constants/theme.ts`. **Never inline literal colors, fonts, or spacing values in screens** — always pull from the theme.

- Colors → see `DESIGN.md` color block; mirrored as `Colors.light.*` (we run light-first; dark deferred).
- Typography → `Playfair Display` for editorial / headlines, `Hanken Grotesk` for UI / body.
- Spacing: 8-unit base, prefer multiples of 8 and 24.
- Radii: `sm 4 / md 12 / lg 16 / xl 24 / pill 9999`.
- Elevation: no drop shadows. Use `<BlurView intensity={20} tint="light">` for glassmorphic panes + an ambient diffused `boxShadow` (`0 12px 40px rgba(20,20,20,0.04)`).
- Bottom tabBar is a floating glass pill (see screenshots). Active tab uses primary fill; inactive tabs are muted.
- The Capture orb is the hero element — implement with `expo-linear-gradient` + multiple absolutely-positioned blurred blobs OR an SVG with `react-native-svg` filters. Add a subtle Reanimated float/rotate loop. **No third-party 3D renderer (Three.js is overkill for Expo Go demo).**
- The "Pulse" indicator is a small SVG circle with an animated `r` and color-cycling through Sage/Lavender/Blue when `captureStatus === 'thinking'`.

### Styling rules

- `StyleSheet.create` for any style reused more than once; inline objects are fine for one-offs.
- Use `boxShadow` (CSS string), never legacy `shadowOffset` / `elevation`.
- Use `borderCurve: 'continuous'` on rounded corners that are NOT pill-shaped.
- ScrollViews use `contentInsetAdjustmentBehavior="automatic"` and put padding on `contentContainerStyle`.
- Safe area: rely on stack/tab insets when possible; otherwise `react-native-safe-area-context`.
- `process.env.EXPO_OS` instead of `Platform.OS`.

---

## 13. Voice input/output

- Recording: `expo-audio` `useAudioRecorder({ ... })` with a **custom 16kHz mono `RecordingOptions`** defined in `hooks/use-recorder.ts` (Whisper resamples to 16kHz internally — recording higher is wasted upload bytes). Do **not** use `RecordingPresets.HIGH_QUALITY` for speech. Always check + request mic permission via `requestRecordingPermissionsAsync()` before recording.
- Press-and-hold UX: use `Gesture.LongPress()` from `react-native-gesture-handler` (or a Pressable with `onPressIn`/`onPressOut`) to start/stop recording. Provide haptic feedback via `lib/infrastructure/haptics.ts`.
- TTS: `hooks/use-speaker.ts` is the only abstraction the UI talks to. **The pipeline is built for low first-audio latency** — each spoken chunk's `POST /api/speak` fetch starts the moment a clause is flushed by `extractSentences`, runs in parallel with later chunks, and the server (`server/services/speech.service.ts`) streams OpenAI's mp3 body through without buffering. The client caches each chunk as a file via `expo-file-system` and plays them sequentially through `createAudioPlayer`; if the network call fails, it falls back to `expo-speech` per chunk so the user still gets a reply. **Never `await response.arrayBuffer()` on the server in `synthesizeSpeech`** — return `response.body` so first byte to client = first byte from OpenAI. **To swap providers later, edit only `server/integrations/openai/tts.ts` (or add a sibling integration and re-export from `server/services/speech.service.ts`).** Do not branch on provider in the hook.

## 13.1 Haptics

- One entry point: `tap(tone)` in `lib/infrastructure/haptics.ts`. Never import `expo-haptics` directly from components or hooks.
- Tones: `light` (default button/text-send), `medium` (primary button / mic press-in), `selection` (tab switch / list row), `success` (auth success, completed action), `warning` (destructive intent), `error` (request failure).
- Haptics are best-effort polish — never await, never throw from the wrapper.

---

## 14. Conventions cheat-sheet

- **Files**: kebab-case `.tsx` / `.ts`.
- **Components**: PascalCase symbols, default export per file.
- **Hooks**: `useThing`, named export.
- **Stores**: `stores/<concern>.ts`, never export the store itself.
- **Imports**: always `@/...` path alias.
- **Text**: every `<Text>` displaying user data gets `selectable`.
- **Numbers in counters/timers**: `fontVariant: ['tabular-nums']`.
- **Lists >20 rows**: use `@shopify/flash-list` (Expo Go compatible).
- **Icons**: `<Image source={{ uri: 'sf:...' } as any} />` via `expo-image` on iOS; for cross-platform fall back to `@expo/vector-icons` (already installed). Pick one per file and be consistent.
- **No `<img>`, no RN `<Image>`** — always `expo-image`.
- **No deprecated APIs**: no `expo-av`, no `SafeAreaView` from `react-native`, no `AsyncStorage`, no `expo-permissions`.
- **AI SDK**: do not trust memory — search `node_modules/ai/docs/` before writing agent code. See `references/common-errors.md` for renamed params.
- **Expo SDK 54**: when in doubt, read https://docs.expo.dev/versions/v54.0.0/ before adding API calls.

---

## 15. Environment variables

**Keys and setup:** [README.md § Environment variables](./README.md#environment-variables).

**Agent rules (do not duplicate in README):**

- Never put secrets in `EXPO_PUBLIC_*` — those values ship in the JS bundle.
- Read server env only in `server/env.ts` (zod-validated). Other `server/**` modules import `env` / `requireEnv` from there, never `process.env` directly.
- Client code must not import `server/env.ts`.

---

## 16. Running the project

See **[README.md § Quick start](./README.md#quick-start)** and **[Scripts](./README.md#scripts)**.

---

## 17. When adding a feature, the order is

1. **Schema** — add table/column in `lib/db/schema.ts`, run `pnpm drizzle-kit generate`.
2. **Model** — `lib/models/<entity>.model.ts` (row type, DTO, `mapRowToDto`).
3. **Zod** — `lib/z/` for inputs; shared errors/API shapes in `lib/types/` if needed.
4. **Queries** — `lib/queries/<entity>.queries.ts`. Pure DB functions, return **rows** only.
5. **Client service** — `lib/services/<domain>.service.ts`. Orchestrate queries, return DTOs.
6. **`+api` route** (only if secrets or external APIs) — thin `app/api/**/+api.ts` → `server/services/**`; never for device SQLite CRUD.
7. **Query/Mutation hook** — `hooks/queries/` or `hooks/mutations/`. Stable key, invalidations on mutate.
8. **Store slice** (only if transient client state needed that isn't server state).
9. **Component(s)** — split into container + presentational; reuse from `components/ui/`.
10. **Screen** — wire container into the route, add haptics + entering/exiting animations.

Never skip layers to "just put it in a `useState`". The hackathon clock does not buy you tech debt.
