import { Link, router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/typography/app-text';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { GlassCard } from '@/components/ui/glass-card';
import { PulseBlob } from '@/components/ui/pulse-blob';
import { ScreenHeader } from '@/components/ui/screen-header';
import { colors, radii, spacing } from '@/constants/design-tokens';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 380;
  const isTall = height > 740;

  const actionSpacing = isCompact ? 32 : isTall ? 44 : 40;
  const footerSpacing = isCompact ? 40 : isTall ? 52 : 48;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.sectionGap },
        ]}
        keyboardShouldPersistTaps="handled">
        <GlassCard style={styles.card}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <PulseBlob size={72} />
            </View>
          </View>
          <AppText variant="headlineMd" style={styles.welcome}>
            Welcome back
          </AppText>
          <View style={styles.form}>
            <AppInput label="Email" placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
            <AppInput label="Password" labelRight="Forgot Password?" placeholder="••••••••" secureTextEntry />
          </View>
          <View style={[styles.actionBlock, { marginTop: actionSpacing }]}>
            <AppButton label="Sign In" onPress={() => router.replace('/(tabs)/insights')} />
          </View>
          <View style={[styles.footer, { marginTop: footerSpacing }]}>
            <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
              Don&apos;t have an account?{' '}
            </AppText>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <AppText variant="bodyMd" color={colors.onSurface} style={styles.link}>
                  Sign Up
                </AppText>
              </Pressable>
            </Link>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingTop: spacing.elementGap,
  },
  card: {
    gap: spacing.elementGap,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  welcome: {
    textAlign: 'center',
  },
  form: {
    gap: spacing.elementGap,
  },
  actionBlock: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 4,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
