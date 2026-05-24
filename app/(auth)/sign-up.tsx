import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/typography/app-text';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { PulseBlob } from '@/components/ui/pulse-blob';
import { colors, radii, spacing } from '@/constants/design-tokens';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sectionGap, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <PulseBlob size={64} />
          </View>
          <AppText variant="displayLg" color={colors.inverseOnSurface} italic style={styles.heroTitle}>
            Create your sanctuary
          </AppText>
          <AppText variant="bodyMd" color={colors.onPrimaryContainer}>
            Begin your journey of mental clarity.
          </AppText>
        </View>

        <View style={styles.formCard}>
          <View style={styles.row}>
            <View style={styles.half}>
              <AppInput label="FIRST NAME" placeholder="Jane" autoCapitalize="words" />
            </View>
            <View style={styles.half}>
              <AppInput label="LAST NAME" placeholder="Doe" autoCapitalize="words" />
            </View>
          </View>
          <AppInput label="EMAIL ADDRESS" placeholder="jane.doe@example.com" keyboardType="email-address" autoCapitalize="none" />
          <AppInput label="PASSWORD" placeholder="••••••••" secureTextEntry />
          <AppButton
            label="Create Account"
            showArrow
            onPress={() => router.replace('/(tabs)/insights')}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="bodyMd" color={colors.onPrimaryContainer}>
            Already have an account?{' '}
          </AppText>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <AppText variant="bodyMd" color={colors.inverseOnSurface} style={styles.link}>
                Sign In
              </AppText>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: spacing.elementGap,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.unit,
    paddingBottom: spacing.elementGap,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.unit,
  },
  heroTitle: {
    textAlign: 'center',
    fontSize: 32,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.xl,
    padding: spacing.containerPaddingMobile,
    gap: spacing.elementGap,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.unit,
  },
  half: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
