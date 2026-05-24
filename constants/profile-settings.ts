import type { ComponentProps } from 'react';

import type { IconSymbol } from '@/components/ui/icon-symbol';

export type ProfileSettingSlug =
  | 'personal-information'
  | 'security-privacy'
  | 'subscription-plan'
  | 'sync-settings'
  | 'export-mental-archive'
  | 'clear-cache'
  | 'notifications'
  | 'appearance'
  | 'language';

export type ProfileSetting = {
  slug: ProfileSettingSlug;
  icon: ComponentProps<typeof IconSymbol>['name'];
  label: string;
  section: string;
};

export const PROFILE_SETTINGS: ProfileSetting[] = [
  {
    slug: 'personal-information',
    icon: 'person',
    label: 'Personal Information',
    section: 'ACCOUNT SETTINGS',
  },
  {
    slug: 'security-privacy',
    icon: 'shield.fill',
    label: 'Security & Privacy',
    section: 'ACCOUNT SETTINGS',
  },
  {
    slug: 'subscription-plan',
    icon: 'creditcard.fill',
    label: 'Subscription Plan',
    section: 'ACCOUNT SETTINGS',
  },
  {
    slug: 'sync-settings',
    icon: 'arrow.triangle.2.circlepath',
    label: 'Sync Settings',
    section: 'DATA MANAGEMENT',
  },
  {
    slug: 'export-mental-archive',
    icon: 'square.and.arrow.down',
    label: 'Export Mental Archive',
    section: 'DATA MANAGEMENT',
  },
  {
    slug: 'clear-cache',
    icon: 'trash.fill',
    label: 'Clear Cache',
    section: 'DATA MANAGEMENT',
  },
  {
    slug: 'notifications',
    icon: 'bell.fill',
    label: 'Notifications',
    section: 'APP PREFERENCES',
  },
  {
    slug: 'appearance',
    icon: 'paintpalette.fill',
    label: 'Appearance',
    section: 'APP PREFERENCES',
  },
  {
    slug: 'language',
    icon: 'globe',
    label: 'Language',
    section: 'APP PREFERENCES',
  },
];

export const PROFILE_SETTINGS_BY_SLUG = Object.fromEntries(
  PROFILE_SETTINGS.map((setting) => [setting.slug, setting]),
) as Record<ProfileSettingSlug, ProfileSetting>;

export const PROFILE_SECTIONS = [
  {
    title: 'ACCOUNT SETTINGS',
    items: PROFILE_SETTINGS.filter((s) => s.section === 'ACCOUNT SETTINGS'),
  },
  {
    title: 'DATA MANAGEMENT',
    items: PROFILE_SETTINGS.filter((s) => s.section === 'DATA MANAGEMENT'),
  },
  {
    title: 'APP PREFERENCES',
    items: PROFILE_SETTINGS.filter((s) => s.section === 'APP PREFERENCES'),
  },
];
