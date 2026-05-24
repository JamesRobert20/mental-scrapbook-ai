// Server-only. Never import from client code (anything under app/, components/, hooks/, lib/).
import { z } from 'zod';

const schema = z.object({
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1).optional(),
});

const parsed = schema.safeParse({
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
});

if (!parsed.success) {
  throw new Error(`Invalid server env: ${parsed.error.message}`);
}

export const env = parsed.data;

export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value as NonNullable<(typeof env)[K]>;
}
