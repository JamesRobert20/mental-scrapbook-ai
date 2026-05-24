import type { Href } from 'expo-router';

export const Routes = {
  home: '/(app)' as Href,
  signIn: '/(auth)/sign-in' as Href,
  signUp: '/(auth)/sign-up' as Href,
  insights: '/(app)/insights' as Href,
  capture: '/(app)' as Href,
  profile: '/(app)/profile' as Href,
  settings: {
    personalInfo: '/(app)/settings/personal-info' as Href,
    security: '/(app)/settings/security' as Href,
    notifications: '/(app)/settings/notifications' as Href,
    language: '/(app)/settings/language' as Href,
    syncGmail: '/(app)/settings/sync-gmail' as Href,
  },
} as const;
