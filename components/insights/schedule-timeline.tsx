import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';

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
          <View style={styles.dot} />
          <View style={styles.content}>
            <Text variant="body">
              <Text style={styles.time}>{item.timeLabel}</Text>
              {' — '}
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
    paddingLeft: Spacing.md,
    gap: Spacing.lg,
  },
  line: {
    position: 'absolute',
    left: 6,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: Colors.light.outline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.outlineStrong,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  time: {
    fontFamily: 'PlayfairDisplay_500Medium',
  },
});
