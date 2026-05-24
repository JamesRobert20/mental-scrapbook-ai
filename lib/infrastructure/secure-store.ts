import * as SecureStore from 'expo-secure-store';

const SESSION_TOKEN_KEY = 'session_token';
const GMAIL_ACCESS_TOKEN_KEY = 'gmail_access_token';
const GMAIL_REFRESH_TOKEN_KEY = 'gmail_refresh_token';

export async function getSessionToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function setSessionToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}

export async function getGmailAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(GMAIL_ACCESS_TOKEN_KEY);
}

export async function setGmailAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(GMAIL_ACCESS_TOKEN_KEY, token);
}

export async function getGmailRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(GMAIL_REFRESH_TOKEN_KEY);
}

export async function setGmailRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(GMAIL_REFRESH_TOKEN_KEY, token);
}

export async function clearGmailTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(GMAIL_ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(GMAIL_REFRESH_TOKEN_KEY);
}
