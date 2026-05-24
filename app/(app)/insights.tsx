import { ScrollView, StyleSheet, View } from 'react-native';

import CalendarStrip from '@/components/insights/calendar-strip';
import PriorityCard from '@/components/insights/priority-card';
import ScheduleTimeline from '@/components/insights/schedule-timeline';
import SectionHeader from '@/components/insights/section-header';
import TodoChip from '@/components/insights/todo-chip';
import ScreenHeader from '@/components/layout/screen-header';
import Text from '@/components/ui/text';
import { useInsightsTodos } from '@/hooks/queries/use-insights-todos';
import { Colors, Spacing } from '@/constants/theme';

export default function InsightsScreen() {
  const { important, schedule, general, isLoading } = useInsightsTodos();

  const scheduleItems = schedule.map((t) => ({
    id: t.id,
    timeLabel: t.timeLabel ?? 'All day',
    title: t.title,
  }));

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic">
        <ScreenHeader />

        <View style={styles.calendar}>
          <CalendarStrip />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Important" count={important.length} />
          {isLoading ? (
            <Text variant="bodySmall" muted>
              Loading…
            </Text>
          ) : important.length > 0 ? (
            <View style={styles.cardStack}>
              {important.map((todo) => (
                <PriorityCard
                  key={todo.id}
                  title={todo.title}
                  notes={todo.notes}
                  timeLabel={todo.timeLabel}
                />
              ))}
            </View>
          ) : (
            <Text variant="bodySmall" muted>
              Nothing important for this day.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Schedule" count={schedule.length} />
          {isLoading ? (
            <Text variant="bodySmall" muted>
              Loading…
            </Text>
          ) : scheduleItems.length > 0 ? (
            <ScheduleTimeline items={scheduleItems} />
          ) : (
            <Text variant="bodySmall" muted>
              Nothing scheduled for this day.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="General" count={general.length} />
          {isLoading ? (
            <Text variant="bodySmall" muted>
              Loading…
            </Text>
          ) : general.length > 0 ? (
            <View style={styles.chipWrap}>
              {general.map((todo) => (
                <TodoChip key={todo.id} title={todo.title} />
              ))}
            </View>
          ) : (
            <Text variant="bodySmall" muted>
              No general todos for this day.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 140,
    gap: Spacing.xl,
  },
  calendar: {
    marginTop: -Spacing.sm,
  },
  section: {
    gap: 0,
  },
  cardStack: {
    gap: Spacing.sm + 2,
  },
  chipWrap: {
    gap: Spacing.sm,
  },
});
