import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/typography/app-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, radii, spacing } from '@/constants/design-tokens';

export function SettingsGroup({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

export function SettingRow({
  label,
  value,
  hint,
  onPress,
  showChevron = !!onPress,
  destructive,
  isLast,
}: {
  label: string;
  value?: string;
  hint?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  isLast?: boolean;
}) {
  const content = (
    <>
      <View style={styles.rowText}>
        <AppText variant="bodyMd" color={destructive ? colors.error : colors.onSurface}>
          {label}
        </AppText>
        {hint ? (
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {hint}
          </AppText>
        ) : null}
      </View>
      <View style={styles.rowEnd}>
        {value ? (
          <AppText variant="bodyMd" color={colors.onSurfaceVariant} style={styles.value}>
            {value}
          </AppText>
        ) : null}
        {showChevron ? (
          <IconSymbol name="chevron.right" size={16} color={colors.outline} />
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, !isLast && styles.rowBorder, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, !isLast && styles.rowBorder]}>{content}</View>;
}

export function SettingToggle({
  label,
  hint,
  value,
  onValueChange,
  isLast,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowText}>
        <AppText variant="bodyMd">{label}</AppText>
        {hint ? (
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {hint}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.outlineVariant, true: colors.secondary }}
        thumbColor={colors.surfaceContainerLowest}
      />
    </View>
  );
}

export function SettingField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType,
  secureTextEntry,
  isLast,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.field, !isLast && styles.rowBorder]}>
      <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.fieldLabel}>
        {label.toUpperCase()}
      </AppText>
      <Pressable style={styles.fieldInput}>
        <AppText
          variant="bodyMd"
          color={value ? colors.onSurface : colors.onPrimaryContainer}
          style={styles.fieldValue}>
          {value || placeholder}
        </AppText>
      </Pressable>
      {/* Hidden TextInput for future edit — display-only for demo */}
      {onChangeText ? null : null}
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.sectionTitle}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingVertical: 16,
    gap: spacing.unit,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  pressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '50%',
  },
  value: {
    textAlign: 'right',
  },
  field: {
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingVertical: 14,
    gap: 8,
  },
  fieldLabel: {
    letterSpacing: 0.8,
  },
  fieldInput: {
    paddingVertical: 4,
  },
  fieldValue: {
    fontSize: 17,
  },
  sectionTitle: {
    marginBottom: spacing.unit,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
});
