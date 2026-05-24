import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { LoginPasswordInput } from '@/components/ui/login-input';
import { PillButton } from '@/components/ui/pill-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignColors, DesignFonts, DesignRadii, DesignSpacing } from '@/constants/design';
import { useAuthStore } from '@/stores/auth-store';

type FormErrors = {
  password?: string;
  confirmPassword?: string;
};

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.readOnlyField}>
      <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
      <View style={styles.readOnlyValue}>
        <AppText variant="bodyMd">{value}</AppText>
      </View>
    </View>
  );
}

export default function PersonalInformationScreen() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/login');
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [getCurrentUser]);

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!isChangingPassword) {
      return nextErrors;
    }

    if (!password) {
      nextErrors.password = 'password is required';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    return nextErrors;
  };

  const handleSave = () => {
    if (!isChangingPassword) {
      return;
    }

    setHasSubmitted(true);
    setSuccessMessage('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const result = updateProfile({
      firstName,
      lastName,
      email,
      password,
    });

    if (!result.ok) {
      setErrors({ password: result.error });
      return;
    }

    setSuccessMessage('Password updated successfully');
    setIsChangingPassword(false);
    setPassword('');
    setConfirmPassword('');
    setHasSubmitted(false);
    setErrors({});
  };

  const handleCancel = () => {
    setIsChangingPassword(false);
    setPassword('');
    setConfirmPassword('');
    setHasSubmitted(false);
    setErrors({});
    setSuccessMessage('');
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setPassword('');
    setConfirmPassword('');
    setErrors((current) => {
      const next = { ...current };
      delete next.password;
      delete next.confirmPassword;
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Personal Information"
            showBack
            onBack={() => router.back()}
            centerTitle={false}
          />

          {successMessage ? (
            <View style={styles.successBanner}>
              <AppText variant="bodyMd" color={DesignColors.secondary}>
                {successMessage}
              </AppText>
            </View>
          ) : null}

          <View style={styles.form}>
            <ReadOnlyField label="First Name" value={firstName} />
            <ReadOnlyField label="Last Name" value={lastName} />
            <ReadOnlyField label="Email" value={email} />

            <View style={styles.passwordSection}>
              {!isChangingPassword ? (
                <>
                  <View style={styles.passwordHeader}>
                    <Text style={styles.passwordLabel}>PASSWORD</Text>
                    <Pressable onPress={handleChangePassword} style={styles.changeButton}>
                      <AppText variant="labelSm" color={DesignColors.onSurface}>
                        Change
                      </AppText>
                    </Pressable>
                  </View>
                  <View style={styles.maskedPassword}>
                    <AppText variant="bodyMd" color={DesignColors.onSurfaceVariant}>
                      ••••••••
                    </AppText>
                  </View>
                </>
              ) : (
                <View style={styles.passwordFields}>
                  <LoginPasswordInput
                    label="New Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter new password"
                  />
                  {hasSubmitted && errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}

                  <LoginPasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                  />
                  {hasSubmitted && errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>
              )}
            </View>
          </View>

          {isChangingPassword ? (
            <View style={styles.actions}>
              <PillButton label="Save Changes" onPress={handleSave} />
              <PillButton label="Cancel" variant="secondary" onPress={handleCancel} />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 32,
    gap: 24,
  },
  successBanner: {
    backgroundColor: DesignColors.secondaryContainer,
    borderRadius: DesignRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  form: {
    gap: 18,
  },
  readOnlyField: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: DesignFonts.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: DesignColors.onSurfaceVariant,
  },
  readOnlyValue: {
    minHeight: 52,
    borderRadius: DesignRadii.lg,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    backgroundColor: DesignColors.surfaceContainerLow,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  passwordSection: {
    gap: 8,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.24,
    color: DesignColors.onSurfaceVariant,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignRadii.full,
    backgroundColor: DesignColors.surfaceContainer,
  },
  maskedPassword: {
    minHeight: 52,
    borderRadius: DesignRadii.lg,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    backgroundColor: DesignColors.surfaceContainerLow,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  passwordFields: {
    gap: 16,
  },
  actions: {
    gap: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: -8,
  },
});
