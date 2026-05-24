# Murmur

My head holds about four ideas at once before they start falling out. The grocery item overwrites the email I owe someone, which overwrites the friend's birthday on Saturday. Murmur is the smallest possible fix: hold the mic, talk through them, and they land on your day before the next thing crowds them out. Connect Gmail and the few emails that actually need an action show up there too — newsletters and receipts stay where they belong.

Built in a weekend for the SAIT Hackathon. Most of what I forget isn't important. Enough of it is that _"I'll remember"_ stopped being a strategy a long time ago.

**Demo target:** Expo Go on a physical device (no custom native builds, no separate backend).

## What's interesting under the hood

If you only have time to read three files, read these:

1. **Sentence-chunked streaming TTS** — `hooks/use-speaker.ts` + `server/services/speech.service.ts`. As the chat model streams, `lib/infrastructure/sentence-stream.ts` flushes one clause at a time into the TTS pipeline. Each `/api/speak` request starts immediately and runs in parallel; the server pipes OpenAI's mp3 body straight through (no `arrayBuffer()` buffering). The client plays them in order. First audio comes back roughly when the first sentence finishes — not when the whole reply is done.
2. **Server-side LLM cost dedupe for Gmail** — `server/services/gmail.service.ts`. `gmail_tokens.last_seen_message_id` is the cursor; if the inbox head hasn't moved since the last sync, the route returns `[]` before Gemini sees a single token. Polling every 60s while the app is open costs roughly nothing on a quiet inbox.
3. **Tool execution split** — `lib/ai/tools.ts` + `hooks/use-capture-chat.ts`. Tool _definitions_ live on the server agent (`server/ai/agent.ts`), but tools that touch device SQLite or secure-store (`createTodo`, `completeTodo`, `listTodos`, `pullGmailTodos`) execute on the client via `onToolCall`. The model never sees the DB; the device never sees the API key.

Smaller things I'm proud of:

- 16kHz mono recording in `hooks/use-recorder.ts` — ~4× smaller upload than the `HIGH_QUALITY` preset, with no loss in Whisper accuracy.
- Whisper goes to Groq, not OpenAI — about 4–5× faster end-to-end (`server/integrations/groq/whisper.ts`).
- Hand-rolled Expo `auth.expo.io/start` flow for Google OAuth in `app/(app)/profile/sync-gmail.tsx` — works in Expo Go without a custom build.
- A todo's bucket (Important / Schedule / General) is **derived** from `priority` and `dueAt`, not stored. See `hooks/queries/use-insights-todos.ts`. Adding a new bucket is one filter, not a migration.
- Foreground-only auto-sync with `AppState` + inflight guards in `hooks/use-gmail-auto-sync.ts`. Background tasks need a custom build (see [AGENTS.md §11.1](./AGENTS.md#111-auto-sync--notifications-foreground-only)) — we surface that limit in the UI instead of pretending.
- Optional **device calendar** sync for scheduled todos — dedicated "Murmur" calendar via `expo-calendar` (`lib/infrastructure/calendar.ts`, toggle in Profile → Calendar).
- **Agent smoke tests** from the terminal — `pnpm agent:scenarios` runs the real ToolLoopAgent + tool schemas with stubbed SQLite (`scripts/`).
- **Developer DB export** — Profile → Developer dumps redacted JSON of all device tables (`lib/services/debug.service.ts`) for debugging or demo state.
- **Multi-language** — Profile → Language picks one of 8 languages (English, Spanish, French, German, Portuguese, Italian, Japanese, Chinese). Agent replies, TTS voice, and Whisper STT all follow the choice (`lib/i18n/languages.ts`). High-visibility UI (auth, profile, capture, voice/language pickers) is also translated via `lib/i18n/strings.ts` + `useT()`; a few dense settings screens stay in English by design.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- [Expo Go](https://expo.dev/go) on your phone
- API keys (see [Environment variables](#environment-variables))

## Quick start

```bash
pnpm install
# Create .env from the template in "Environment variables" below
pnpm start
```

Install [Expo Go](https://expo.dev/go) on your phone, then scan the QR code with your device's camera (iOS) or the Expo Go app (Android).

### Physical device + API routes

Chat, transcription, and Gmail OAuth call Expo Router `+api` routes on your dev machine. From a phone, use a tunnel so `/api/*` resolves:

```bash
pnpm start --tunnel
```

## Scripts

| Command                 | Description                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `pnpm start`            | Expo dev server (Metro)                                                     |
| `pnpm start --tunnel`   | Dev server with tunnel (device + `/api`)                                    |
| `pnpm typecheck`        | TypeScript check (`tsc --noEmit`)                                           |
| `pnpm lint`             | ESLint (includes Prettier rules)                                            |
| `pnpm format`           | Write Prettier formatting across the repo                                   |
| `pnpm format:check`     | Verify Prettier formatting without writing                                  |
| `pnpm rtc`              | Pre-commit shorthand: `format` → `lint` → `typecheck`                       |
| `pnpm agent "<prompt>"` | One-shot agent probe (real model + tools, stubbed SQLite)                   |
| `pnpm agent:scenarios`  | Agent smoke tests (3 fixed prompts, pass/fail) — needs `AI_GATEWAY_API_KEY` |

## Environment variables

Create a `.env` file in the project root (gitignored):

```env
# Server-only — never prefix secrets with EXPO_PUBLIC_
AI_GATEWAY_API_KEY=...
GROQ_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...

# Public — safe in the JS bundle (OAuth client id for the device)
EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=...
```

| Variable                             | Purpose                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `AI_GATEWAY_API_KEY`                 | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — chat models            |
| `GROQ_API_KEY`                       | [Groq](https://console.groq.com/keys) — Whisper Large v3 Turbo (low-latency STT) |
| `OPENAI_API_KEY`                     | OpenAI direct — TTS (`/api/speak`)                                               |
| `GOOGLE_OAUTH_CLIENT_ID`             | Google OAuth (server token exchange)                                             |
| `GOOGLE_OAUTH_CLIENT_SECRET`         | Google OAuth (server only)                                                       |
| `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` | Same client ID, exposed to `expo-auth-session` on device                         |

Optional: set `AI_GATEWAY_CHAT_MODEL` to override the default chat model (e.g. `anthropic/claude-sonnet-4.5`). List models: `curl https://ai-gateway.vercel.sh/v1/models`.

## Architecture (high level)

- **Client:** Expo app, SQLite on device (users, sessions, todos, Gmail tokens), Zustand + React Query, voice via `expo-audio`.
- **Server:** `app/api/**/+api.ts` thin handlers delegating to `server/services/**`. No separate backend repo, no hosted DB.
- **AI:** Vercel AI SDK through AI Gateway. Tool _definitions_ live on the server; tools that write to the device DB execute on the client via `useChat.onToolCall`.

Layering, naming, and the full set of conventions live in **[AGENTS.md](./AGENTS.md)** — required reading before contributing.

## Troubleshooting

**`ERR_PNPM_IGNORED_BUILDS`** — Approve the package in `pnpm-workspace.yaml` under `allowBuilds:` (already set for `unrs-resolver` and `esbuild` in this repo).

**Type errors on routes** — Run `pnpm start` once so Expo Router regenerates `.expo/types/router.d.ts`, or use constants from `lib/navigation/routes.ts`.

**`pnpm start --tunnel` fails with `Cannot read properties of undefined (reading 'body')`** — Upstream `expo-ngrok` session-limit issue. Use `pnpm start --lan` instead (LAN works fine as long as your phone and dev machine share a network).

## License

Private hackathon project.
