import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { GlassSurface } from '@/components/ui/glass-surface';
import { IridescentOrb } from '@/components/ui/iridescent-orb';
import { LoginInput, LoginPasswordInput } from '@/components/ui/login-input';
import { PillButton } from '@/components/ui/pill-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignColors, DesignRadii, DesignSpacing } from '@/constants/design';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = () => {
    if (isSubmitting) {
      return;
    }

    Keyboard.dismiss();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);

    const result = login(trimmedEmail, password);

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    const session = useAuthStore.getState().session;
    if (!session) {
      setError('Sign in failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    router.replace('/(tabs)/profile');
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}>
        <ScreenHeader showBack onBack={() => router.back()} italicTitle />

        <GlassSurface style={styles.card}>
          <View
            style={styles.cardInner}
            {...Platform.select({
              android: { importantForAutofill: 'noExcludeDescendants' as const },
              default: {},
            })}>
            <IridescentOrb size={88} />
            <AppText variant="headlineMd" style={styles.welcome}>
              Welcome back
            </AppText>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <LoginInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="default"
                returnKeyType="next"
                editable={!isSubmitting}
              />
              <LoginPasswordInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSignIn}
              />
            </View>

            <PillButton
              label={isSubmitting ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
            />

            <Pressable onPress={() => router.push('/signup')} style={styles.footerLink}>
              <AppText variant="bodyMd" color={DesignColors.onSurfaceVariant}>
                Don&apos;t have an account?{' '}
                <AppText variant="bodyMd" color={DesignColors.onSurface} style={styles.underline}>
                  Sign Up
                </AppText>
              </AppText>
            </Pressable>
          </View>
        </GlassSurface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 32,
    gap: 24,
  },
  card: {
    borderRadius: DesignRadii.xl,
    marginTop: 8,
  },
  cardInner: {
    padding: 28,
    alignItems: 'center',
    gap: 24,
  },
  welcome: {
    textAlign: 'center',
  },
  errorBanner: {
    width: '100%',
    backgroundColor: '#FFEBEE',
    borderRadius: DesignRadii.lg,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 18,
  },
  footerLink: {
    paddingTop: 4,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
