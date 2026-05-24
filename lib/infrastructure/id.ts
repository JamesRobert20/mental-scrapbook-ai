export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSessionToken(): string {
  return `sess_${createId()}_${Math.random().toString(36).slice(2)}`;
}
