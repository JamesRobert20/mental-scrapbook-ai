import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IridescentOrb } from '@/components/ui/iridescent-orb';
import { PillButton } from '@/components/ui/pill-button';
import { TextField } from '@/components/ui/text-field';
import { DesignColors, DesignRadii, DesignSpacing } from '@/constants/design';
import { useAuthStore } from '@/stores/auth-store';

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof SignupForm, string>>;

const INITIAL_FORM: SignupForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,}$/;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateField(field: keyof SignupForm, form: SignupForm): string | undefined {
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const email = form.email.trim();
  const password = form.password;

  switch (field) {
    case 'firstName':
      if (!firstName) return 'First Name is required';
      if (!NAME_PATTERN.test(firstName)) return 'Please enter a valid first name';
      return undefined;
    case 'lastName':
      if (!lastName) return 'Last name is required';
      if (!NAME_PATTERN.test(lastName)) return 'Please enter a valid last name';
      return undefined;
    case 'email':
      if (!email) return 'email address is required';
      if (!isValidEmail(email)) return 'Please enter a valid email address';
      return undefined;
    case 'password':
      if (!password) return 'password is required';
      if (password.length < 8) return 'Password must be at least 8 characters';
      return undefined;
    default:
      return undefined;
  }
}

function validateForm(form: SignupForm): FormErrors {
  const fields: (keyof SignupForm)[] = ['firstName', 'lastName', 'email', 'password'];
  const errors: FormErrors = {};

  for (const field of fields) {
    const message = validateField(field, form);
    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}

export default function SignupScreen() {
  const register = useAuthStore((state) => state.register);
  const scrollRef = useRef<ScrollView>(null);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage('');

    if (hasSubmitted) {
      const message = validateField(field, { ...form, [field]: value });
      setErrors((current) => {
        const next = { ...current };
        if (message) {
          next[field] = message;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleCreateAccount = () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage('');
      scrollRef.current?.scrollTo({ y: 280, animated: true });
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    void (async () => {
      try {
        const result = register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        if (!result.ok) {
          setErrors((current) => ({ ...current, email: result.error }));
          scrollRef.current?.scrollTo({ y: 280, animated: true });
          return;
        }

        setSuccessMessage('account created successfully');
        scrollRef.current?.scrollTo({ y: 0, animated: true });

        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const errorCount = Object.keys(errors).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color={DesignColors.onPrimary} />
            </Pressable>

            <View style={styles.heroBody}>
              <View style={styles.orbWrap}>
                <IridescentOrb size={96} />
              </View>
              <AppText variant="displayLg" color={DesignColors.onPrimary} style={styles.heroTitle}>
                Create your sanctuary
              </AppText>
              <AppText variant="bodyLg" color={DesignColors.onPrimaryContainer} style={styles.heroSubtitle}>
                Begin your journey of mental clarity.
              </AppText>
            </View>
          </View>

          <View style={styles.formCard}>
            {successMessage ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={20} color={DesignColors.secondary} />
                <AppText variant="bodyMd" color={DesignColors.secondary} style={styles.successText}>
                  {successMessage}
                </AppText>
              </View>
            ) : null}

            {hasSubmitted && errorCount > 0 ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color="#D32F2F" />
                <Text style={styles.errorBannerText}>
                  Please fix {errorCount} error{errorCount > 1 ? 's' : ''} below.
                </Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <TextField
                label="First Name"
                placeholder="Jane"
                value={form.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                autoCapitalize="words"
                autoComplete="given-name"
                textContentType="givenName"
                returnKeyType="next"
                required
                error={hasSubmitted ? errors.firstName : undefined}
              />
              <TextField
                label="Last Name"
                placeholder="Doe"
                value={form.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                autoCapitalize="words"
                autoComplete="family-name"
                textContentType="familyName"
                returnKeyType="next"
                required
                error={hasSubmitted ? errors.lastName : undefined}
              />
              <TextField
                label="Email Address"
                placeholder="jane.doe@example.com"
                value={form.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                required
                error={hasSubmitted ? errors.email : undefined}
              />
              <TextField
                label="Password"
                placeholder="••••••••"
                value={form.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleCreateAccount}
                required
                error={hasSubmitted ? errors.password : undefined}
              />
            </View>

            <PillButton
              label={isSubmitting ? 'Creating...' : 'Create Account'}
              showArrow={!isSubmitting}
              onPress={handleCreateAccount}
            />

            <Pressable onPress={() => router.replace('/login')} style={styles.footerLink}>
              <AppText variant="bodyMd" color={DesignColors.onSurfaceVariant}>
                Already have an account?{' '}
                <AppText variant="bodyMd" color={DesignColors.onSurface} style={styles.underline}>
                  Sign In
                </AppText>
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.primary,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 32,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  heroBody: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  orbWrap: {
    marginBottom: 4,
  },
  heroTitle: {
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  formCard: {
    flex: 1,
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderTopLeftRadius: DesignRadii.xl,
    borderTopRightRadius: DesignRadii.xl,
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 24,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: DesignColors.secondaryContainer,
    borderRadius: DesignRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  successText: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: DesignRadii.lg,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorBannerText: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  footerLink: {
    alignItems: 'center',
    paddingTop: 4,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
