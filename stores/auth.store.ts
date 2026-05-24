import { create } from 'zustand';

import type { SessionUser } from '@/lib/models/user.model';

type AuthState = {
  status: 'bootstrapping' | 'authenticated' | 'unauthenticated';
  user: SessionUser | null;
};

const authStore = create<AuthState>(() => ({
  status: 'bootstrapping',
  user: null,
}));

const { setState } = authStore;

export const useAuthStatus = () => authStore((s) => s.status);
export const useAuthUser = () => authStore((s) => s.user);
export const useIsAuthenticated = () => authStore((s) => s.status === 'authenticated');

export function setAuthBootstrapping() {
  setState({ status: 'bootstrapping', user: null });
}

export function setAuthAuthenticated(user: SessionUser) {
  setState({ status: 'authenticated', user });
}

export function setAuthUnauthenticated() {
  setState({ status: 'unauthenticated', user: null });
}
