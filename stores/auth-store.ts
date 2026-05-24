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

type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

type AuthState = {
  users: StoredUser[];
  session: AuthSession | null;
  hasHydrated: boolean;
  register: (input: RegisterInput) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  getCurrentUser: () => StoredUser | null;
  updateProfile: (input: UpdateProfileInput) => AuthResult;
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

      getCurrentUser: () => {
        const { session, users } = get();
        if (!session) {
          return null;
        }

        return users.find((user) => user.id === session.userId) ?? null;
      },

      updateProfile: ({ firstName, lastName, email, password }) => {
        const { session, users } = get();
        if (!session) {
          return { ok: false, error: 'You must be signed in to update your profile.' };
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailTaken = users.some(
          (user) => user.id !== session.userId && user.email === normalizedEmail,
        );

        if (emailTaken) {
          return { ok: false, error: 'An account with this email already exists.' };
        }

        const updatedUsers = users.map((user) => {
          if (user.id !== session.userId) {
            return user;
          }

          return {
            ...user,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: password ?? user.password,
          };
        });

        const updatedUser = updatedUsers.find((user) => user.id === session.userId);

        if (!updatedUser) {
          return { ok: false, error: 'Unable to update profile.' };
        }

        set({
          users: updatedUsers,
          session: {
            userId: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
          },
        });

        return { ok: true };
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
