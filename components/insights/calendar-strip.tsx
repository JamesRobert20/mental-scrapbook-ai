import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Spacing } from '@/constants/theme';

const DAYS = [
  { key: 'mon', label: 'MON', day: 12 },
  { key: 'tue', label: 'TUE', day: 13 },
  { key: 'wed', label: 'WED', day: 14, selected: true },
  { key: 'thu', label: 'THU', day: 15 },
  { key: 'fri', label: 'FRI', day: 16 },
];

export default function CalendarStrip() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {DAYS.map((item) => (
        <Pressable
          key={item.key}
          style={[styles.day, item.selected && styles.daySelected]}>
          <Text variant="label" style={[styles.dayLabel, item.selected && styles.dayLabelSelected]}>
            {item.label}
          </Text>
          <Text variant="headline" style={[styles.dayNum, item.selected && styles.dayNumSelected]}>
            {item.day}
          </Text>
          {item.selected ? <View style={styles.dot} /> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  day: {
    width: 56,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    borderCurve: 'continuous',
  },
  daySelected: {
    backgroundColor: Colors.light.primary,
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.light.onSurfaceVariant,
  },
  dayLabelSelected: {
    color: Colors.light.onPrimary,
  },
  dayNum: {
    fontSize: 20,
    color: Colors.light.onBackground,
  },
  dayNumSelected: {
    color: Colors.light.onPrimary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.onPrimary,
    marginTop: 2,
  },
});
