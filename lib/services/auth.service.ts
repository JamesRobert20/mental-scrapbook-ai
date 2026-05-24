import { hashPassword, verifyPassword } from '@/lib/infrastructure/crypto';
import { createId, createSessionToken } from '@/lib/infrastructure/id';
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from '@/lib/infrastructure/secure-store';
import { mapUserRow, type SessionUser } from '@/lib/models/user.model';
import * as sessionsQueries from '@/lib/queries/sessions.queries';
import * as usersQueries from '@/lib/queries/users.queries';
import { AuthError } from '@/lib/types/errors';
import type { SignInInput, SignUpInput } from '@/lib/z/auth';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function sessionExpiry(): string {
  return new Date(Date.now() + SESSION_TTL_MS).toISOString();
}

async function createSessionForUser(userId: string): Promise<string> {
  const token = createSessionToken();
  await sessionsQueries.insertSession({ token, userId, expiresAt: sessionExpiry() });
  await setSessionToken(token);
  return token;
}

export async function signUp(input: SignUpInput): Promise<{ token: string; user: SessionUser }> {
  const existing = await usersQueries.findUserByEmail(input.email);
  if (existing) {
    throw new AuthError('An account with this email already exists', 'EMAIL_TAKEN');
  }

  const userId = createId();
  const passwordHash = await hashPassword(input.password);
  const row = await usersQueries.insertUser({
    id: userId,
    email: input.email.toLowerCase(),
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    createdAt: new Date().toISOString(),
  });

  const token = await createSessionForUser(userId);
  return { token, user: mapUserRow(row) };
}

export async function signIn(input: SignInInput): Promise<{ token: string; user: SessionUser }> {
  const row = await usersQueries.findUserByEmail(input.email);
  if (!row) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await verifyPassword(input.password, row.passwordHash);
  if (!valid) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const token = await createSessionForUser(row.id);
  return { token, user: mapUserRow(row) };
}

export async function signOut(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    await sessionsQueries.deleteSessionByToken(token);
  }
  await clearSessionToken();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  const session = await sessionsQueries.findSessionByToken(token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    await clearSessionToken();
    return null;
  }

  const user = await usersQueries.findUserById(session.userId);
  return user ? mapUserRow(user) : null;
}

export async function bootstrapSession(): Promise<SessionUser | null> {
  return getCurrentUser();
}
