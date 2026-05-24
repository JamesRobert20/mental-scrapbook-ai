import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/app-text';
import { AppButton } from '@/components/ui/app-button';
import { APP_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '@/constants/languages';
import type { ProfileSettingSlug } from '@/constants/profile-settings';
import { colors, radii, spacing } from '@/constants/design-tokens';

import {
  SectionTitle,
  SettingField,
  SettingRow,
  SettingsGroup,
  SettingToggle,
} from './setting-primitives';

export function ProfileDetailContent({ slug }: { slug: ProfileSettingSlug }) {
  switch (slug) {
    case 'personal-information':
      return <PersonalInformationContent />;
    case 'security-privacy':
      return <SecurityPrivacyContent />;
    case 'subscription-plan':
      return <SubscriptionContent />;
    case 'sync-settings':
      return <SyncSettingsContent />;
    case 'export-mental-archive':
      return <ExportArchiveContent />;
    case 'clear-cache':
      return <ClearCacheContent />;
    case 'notifications':
      return <NotificationsContent />;
    case 'appearance':
      return <AppearanceContent />;
    case 'language':
      return <LanguageContent />;
    default:
      return null;
  }
}

function PersonalInformationContent() {
  return (
    <View style={styles.stack}>
      <SectionTitle>PROFILE</SectionTitle>
      <SettingsGroup>
        <SettingField label="First name" value="Julian" />
        <SettingField label="Last name" value="Chen" />
        <SettingField label="Display name" value="Julian" />
        <SettingField label="Email" value="julian.chen@email.com" />
        <SettingField label="Phone" value="+1 (415) 555-0142" />
        <SettingField label="Date of birth" value="March 12, 1992" />
        <SettingField label="Location" value="San Francisco, CA" isLast />
      </SettingsGroup>

      <SectionTitle>ABOUT YOU</SectionTitle>
      <SettingsGroup>
        <SettingField label="Bio" value="Building calmer tools for busy minds." />
        <SettingField label="Pronouns" value="he/him" isLast />
      </SettingsGroup>

      <AppButton
        label="Save changes"
        onPress={() => Alert.alert('Saved', 'Your profile information has been updated.')}
      />
    </View>
  );
}

function SecurityPrivacyContent() {
  const [biometric, setBiometric] = useState(true);
  const [lockOnLaunch, setLockOnLaunch] = useState(false);

  return (
    <View style={styles.stack}>
      <SectionTitle>SIGN IN</SectionTitle>
      <SettingsGroup>
        <SettingRow
          label="Change password"
          onPress={() => Alert.alert('Change password', 'Password reset link sent to your email.')}
        />
        <SettingRow
          label="Two-factor authentication"
          value="On"
          onPress={() => Alert.alert('2FA', 'Manage two-factor authentication in your account portal.')}
        />
        <SettingToggle
          label="Face ID / Touch ID"
          hint="Unlock the app with biometrics"
          value={biometric}
          onValueChange={setBiometric}
          isLast
        />
      </SettingsGroup>

      <SectionTitle>PRIVACY</SectionTitle>
      <SettingsGroup>
        <SettingToggle label="Lock app on launch" value={lockOnLaunch} onValueChange={setLockOnLaunch} />
        <SettingRow
          label="Privacy policy"
          onPress={() => Alert.alert('Privacy policy', 'Opens in browser in production build.')}
        />
        <SettingRow
          label="Download my data"
          onPress={() => Alert.alert('Data export', 'We will email you when your export is ready.')}
          isLast
        />
      </SettingsGroup>
    </View>
  );
}

function SubscriptionContent() {
  return (
    <View style={styles.stack}>
      <View style={styles.planCard}>
        <AppText variant="labelSm" color={colors.onPrimaryContainer}>
          CURRENT PLAN
        </AppText>
        <AppText variant="headlineMd" style={styles.planTitle}>
          Sanctuary
        </AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          $9.99 / month · Renews Apr 23, 2026
        </AppText>
        <View style={styles.planDivider} />
        <AppText variant="bodyMd">Unlimited capture & insights</AppText>
        <AppText variant="bodyMd">Cross-device sync</AppText>
        <AppText variant="bodyMd">Priority support</AppText>
      </View>

      <SettingsGroup>
        <SettingRow
          label="Payment method"
          value="Visa •••• 4242"
          onPress={() => Alert.alert('Payment', 'Update payment method in account portal.')}
        />
        <SettingRow
          label="Billing history"
          onPress={() => Alert.alert('Billing', 'View past invoices in account portal.')}
        />
        <SettingRow
          label="Cancel subscription"
          destructive
          onPress={() => Alert.alert('Cancel', 'You can cancel anytime before the next billing date.')}
          isLast
        />
      </SettingsGroup>

      <AppButton
        label="Upgrade plan"
        variant="glass"
        onPress={() => Alert.alert('Plans', 'Compare Sanctuary, Studio, and Lifetime plans.')}
      />
    </View>
  );
}

function SyncSettingsContent() {
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <View style={styles.stack}>
      <SettingsGroup>
        <SettingToggle
          label="Auto-sync"
          hint="Keep captures up to date across devices"
          value={autoSync}
          onValueChange={setAutoSync}
        />
        <SettingToggle label="Sync on Wi‑Fi only" value={wifiOnly} onValueChange={setWifiOnly} />
        <SettingRow
          label="Sync now"
          value="2 min ago"
          onPress={() => Alert.alert('Sync', 'Sync completed successfully.')}
        />
        <SettingRow
          label="Connected accounts"
          value="iCloud"
          onPress={() => Alert.alert('Accounts', 'Manage connected sync providers.')}
          isLast
        />
      </SettingsGroup>
    </View>
  );
}

function ExportArchiveContent() {
  return (
    <View style={styles.stack}>
      <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
        Export a copy of your scrapbook. Files are generated on this device.
      </AppText>
      <SettingsGroup>
        <SettingRow
          label="Format"
          value="Markdown + JSON"
          onPress={() => Alert.alert('Format', 'Choose Markdown, JSON, or both.')}
        />
        <SettingRow
          label="Date range"
          value="All time"
          onPress={() => Alert.alert('Range', 'Last 30 days, this year, or all time.')}
        />
        <SettingRow
          label="Include voice transcripts"
          value="Yes"
          onPress={() => Alert.alert('Transcripts', 'Toggle inclusion of voice notes.')}
          isLast
        />
      </SettingsGroup>
      <AppButton
        label="Export archive"
        onPress={() => Alert.alert('Export started', 'Your archive will be ready in a few moments.')}
      />
    </View>
  );
}

function ClearCacheContent() {
  return (
    <View style={styles.stack}>
      <View style={styles.storageCard}>
        <View style={styles.storageRow}>
          <AppText variant="bodyMd">Image previews</AppText>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            18 MB
          </AppText>
        </View>
        <View style={styles.storageRow}>
          <AppText variant="bodyMd">Temporary files</AppText>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            6 MB
          </AppText>
        </View>
        <View style={[styles.storageRow, styles.storageTotal]}>
          <AppText variant="bodyMd" style={styles.bold}>
            Total cache
          </AppText>
          <AppText variant="bodyMd" style={styles.bold}>
            24 MB
          </AppText>
        </View>
      </View>
      <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
        Clearing cache does not delete your captures, tasks, or account data.
      </AppText>
      <AppButton
        label="Clear cache"
        onPress={() => Alert.alert('Cache cleared', '24 MB of temporary data was removed.')}
      />
    </View>
  );
}

function NotificationsContent() {
  const [morning, setMorning] = useState(true);
  const [evening, setEvening] = useState(true);
  const [tasks, setTasks] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <View style={styles.stack}>
      <SectionTitle>REMINDERS</SectionTitle>
      <SettingsGroup>
        <SettingToggle label="Morning check-in" hint="8:00 AM" value={morning} onValueChange={setMorning} />
        <SettingToggle label="Evening wind-down" hint="9:00 PM" value={evening} onValueChange={setEvening} />
        <SettingToggle
          label="Task reminders"
          hint="Based on your schedule"
          value={tasks}
          onValueChange={setTasks}
          isLast
        />
      </SettingsGroup>

      <SectionTitle>OTHER</SectionTitle>
      <SettingsGroup>
        <SettingRow
          label="Notification sound"
          value="Gentle chime"
          onPress={() => Alert.alert('Sound', 'Choose a notification sound.')}
        />
        <SettingToggle label="Product updates" value={marketing} onValueChange={setMarketing} isLast />
      </SettingsGroup>
    </View>
  );
}

function AppearanceContent() {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <View style={styles.stack}>
      <SectionTitle>THEME</SectionTitle>
      <SettingsGroup>
        <SettingRow label="Warm light" value="Selected" showChevron={false} />
        <SettingRow label="Soft dark" onPress={() => Alert.alert('Theme', 'Dark mode coming soon.')} />
        <SettingRow label="Match system" onPress={() => Alert.alert('Theme', 'Follow system appearance.')} isLast />
      </SettingsGroup>

      <SectionTitle>DISPLAY</SectionTitle>
      <SettingsGroup>
        <SettingRow
          label="Accent intensity"
          value="Subtle"
          onPress={() => Alert.alert('Accent', 'Adjust color wash strength.')}
        />
        <SettingToggle label="Reduce motion" value={reducedMotion} onValueChange={setReducedMotion} isLast />
      </SettingsGroup>
    </View>
  );
}

function LanguageContent() {
  const [selectedCode, setSelectedCode] = useState(DEFAULT_LANGUAGE_CODE);

  return (
    <View style={styles.stack}>
      <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
        Choose the language used across the app interface.
      </AppText>
      <SettingsGroup>
        {APP_LANGUAGES.map((lang, index) => {
          const selected = lang.code === selectedCode;
          const displayLabel =
            lang.nativeLabel !== lang.label ? `${lang.nativeLabel} · ${lang.label}` : lang.label;

          return (
            <SettingRow
              key={lang.code}
              label={displayLabel}
              value={selected ? '✓' : undefined}
              showChevron={false}
              isLast={index === APP_LANGUAGES.length - 1}
              onPress={() => {
                setSelectedCode(lang.code);
                if (lang.code !== DEFAULT_LANGUAGE_CODE) {
                  Alert.alert(
                    'Language',
                    `${lang.nativeLabel} will apply after the next app reload.`,
                  );
                }
              }}
            />
          );
        })}
      </SettingsGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.elementGap,
  },
  planCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.containerPaddingMobile,
    gap: spacing.unit,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  planTitle: {
    marginTop: 4,
  },
  planDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.unit,
  },
  storageCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.containerPaddingMobile,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageTotal: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  bold: {
    fontFamily: 'HankenGrotesk_600SemiBold',
  },
});
