import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Spacing } from '@/constants/theme';

type ScheduleItem = {
  id: string;
  timeLabel: string;
  title: string;
};

type Props = {
  items: ScheduleItem[];
};

export default function ScheduleTimeline({ items }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.markerWrap}>
            <View style={styles.dot} />
          </View>
          <View style={styles.card}>
            <Text variant="bodySmall" style={styles.time}>
              {item.timeLabel}
            </Text>
            <Text variant="body" selectable style={styles.title}>
              {item.title}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: 4,
    gap: Spacing.md,
  },
  line: {
    position: 'absolute',
    left: 9,
    top: 14,
    bottom: 14,
    width: 1,
    backgroundColor: Colors.light.outline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  markerWrap: {
    width: 11,
    paddingTop: 14,
    alignItems: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.md,
    borderCurve: 'continuous',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: 2,
  },
  time: {
    fontFamily: 'PlayfairDisplay_500Medium',
    color: Colors.light.onSurfaceVariant,
  },
  title: {
    fontFamily: 'HankenGrotesk_500Medium',
  },
});
