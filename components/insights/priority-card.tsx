import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  notes?: string | null;
  timeLabel?: string | null;
};

export default function PriorityCard({ title, notes, timeLabel }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.checkbox}>
        <Ionicons name="ellipse-outline" size={22} color={Colors.light.onSurfaceVariant} />
      </View>
      <View style={styles.body}>
        <Text variant="body" style={styles.title} selectable>
          {title}
        </Text>
        {notes ? (
          <Text variant="bodySmall" muted selectable numberOfLines={2}>
            {notes}
          </Text>
        ) : null}
        {timeLabel ? (
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={12} color={Colors.light.onSurfaceVariant} />
            <Text variant="bodySmall" muted>
              {timeLabel}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.light.onSurfaceVariant} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    borderCurve: 'continuous',
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md + 6,
    paddingRight: Spacing.md,
    gap: Spacing.sm + 2,
    overflow: 'hidden',
    boxShadow: Shadows.ambient,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.light.error,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'HankenGrotesk_500Medium',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
