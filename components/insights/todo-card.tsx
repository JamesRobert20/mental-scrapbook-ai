import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  compact?: boolean;
};

export default function TodoCard({ title, compact }: Props) {
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Text variant="body" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: Radii.lg,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  compact: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
