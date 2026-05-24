# Mental Scrapbook

A serene, voice-first daily-planning assistant built with Expo. Hold the mic (or type), speak freely, and an AI agent transcribes your thoughts, creates structured todos, and replies in voice with on-screen transcription. Connect Gmail in Settings to turn emails into todos.

**Demo target:** Expo Go on a physical device (no custom native builds).

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

Scan the QR code with Expo Go.

### Physical device + API routes

Chat, transcription, and Gmail OAuth call Expo Router `+api` routes on your dev machine. From a phone, use a tunnel so `/api/*` resolves:

```bash
pnpm start --tunnel
```

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm start` | Expo dev server (Metro) |
| `pnpm start --tunnel` | Dev server with tunnel (device + `/api`) |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |

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

| Variable | Purpose |
| -------- | ------- |
| `AI_GATEWAY_API_KEY` | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — chat models |
| `GROQ_API_KEY` | [Groq](https://console.groq.com/keys) — Whisper Large v3 Turbo (low-latency STT) |
| `OPENAI_API_KEY` | OpenAI direct — TTS (`/api/speak`) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth (server token exchange) |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth (server only) |
| `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` | Same client ID, exposed to `expo-auth-session` on device |

Optional: set `AI_GATEWAY_CHAT_MODEL` to override the default chat model (e.g. `anthropic/claude-sonnet-4.5`). List models: `curl https://ai-gateway.vercel.sh/v1/models`.

## Architecture (high level)

- **Client:** Expo app — SQLite on device (users, sessions, todos), Zustand + React Query, voice via `expo-audio` / `expo-speech`.
- **Server:** `app/api/**/+api.ts` thin handlers → `server/` (AI agent, Whisper, Gmail). No separate backend repo.
- **AI:** Vercel AI SDK through AI Gateway; todo writes from tool calls run on the client (device DB).

Layering, naming, and agent implementation rules live in **[AGENTS.md](./AGENTS.md)** (required reading for coding agents and contributors).

## Troubleshooting

**`ERR_PNPM_IGNORED_BUILDS`** — Approve the package in `pnpm-workspace.yaml` under `allowBuilds:` (already set for `unrs-resolver` and `esbuild` in this repo).

**Type errors on routes** — Run `pnpm start` once so Expo Router regenerates `.expo/types/router.d.ts`, or use constants from `lib/navigation/routes.ts`.

## License

Private hackathon project.
