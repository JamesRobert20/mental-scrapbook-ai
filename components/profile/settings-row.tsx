import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  destructive?: boolean;
};

export default function SettingsRow({ label, icon, onPress, destructive }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? Colors.light.error : Colors.light.onBackground}
      />
      <Text variant="body" style={[styles.label, destructive && styles.destructive]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.light.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  label: {
    flex: 1,
  },
  destructive: {
    color: Colors.light.error,
  },
});
