import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  users: StoredUser[];
  session: AuthSession | null;
  hasHydrated: boolean;
  register: (input: RegisterInput) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      session: null,
      hasHydrated: false,

      register: ({ firstName, lastName, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = get().users.find(
          (user) => user.email.toLowerCase() === normalizedEmail,
        );

        if (existingUser) {
          return { ok: false, error: 'An account with this email already exists.' };
        }

        const newUser: StoredUser = {
          id: `${Date.now()}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          password,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
        }));

        return { ok: true };
      },

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const matchedUser = get().users.find(
          (user) => user.email === normalizedEmail && user.password === password,
        );

        if (!matchedUser) {
          return { ok: false, error: 'Invalid email or password.' };
        }

        set({
          session: {
            userId: matchedUser.id,
            firstName: matchedUser.firstName,
            lastName: matchedUser.lastName,
            email: matchedUser.email,
          },
        });

        return { ok: true };
      },

      logout: () => {
        set({ session: null });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'mental-scrapbook-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        users: state.users,
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useAuthSession() {
  return useAuthStore((state) => state.session);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => Boolean(state.session));
}

export function useAuthHydrated() {
  return useAuthStore((state) => state.hasHydrated);
}
