import { ScrollView, StyleSheet, View } from 'react-native';

import CalendarStrip from '@/components/insights/calendar-strip';
import ScheduleTimeline from '@/components/insights/schedule-timeline';
import SectionHeader from '@/components/insights/section-header';
import TodoCard from '@/components/insights/todo-card';
import ScreenHeader from '@/components/layout/screen-header';
import Text from '@/components/ui/text';
import { useTodos } from '@/hooks/queries/use-todos';
import { Colors, Spacing } from '@/constants/theme';

export default function InsightsScreen() {
  const { data: allTodos = [], isLoading } = useTodos();
  const important = allTodos.filter((t) => t.category === 'important');
  const schedule = allTodos.filter((t) => t.category === 'schedule');
  const general = allTodos.filter((t) => t.category === 'general');

  const scheduleItems = schedule.map((t) => ({
    id: t.id,
    timeLabel: t.timeLabel ?? 'All day',
    title: t.title,
  }));

  const fallbackSchedule = [
    { id: '1', timeLabel: '9:00 am', title: 'Get coffee' },
    { id: '2', timeLabel: '11:45 am', title: 'Drop son at school' },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic">
        <ScreenHeader />
        <View style={styles.section}>
          <SectionHeader title="Calendar" />
          <CalendarStrip />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Important" />
          {isLoading ? (
            <Text muted>Loading…</Text>
          ) : important.length > 0 ? (
            important.map((todo) => <TodoCard key={todo.id} title={todo.title} />)
          ) : (
            <>
              <TodoCard title="Pickup dog" />
              <TodoCard title="Finish project" />
            </>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Schedule" />
          <ScheduleTimeline items={scheduleItems.length > 0 ? scheduleItems : fallbackSchedule} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="General Todos" />
          <View style={styles.generalRow}>
            {(general.length > 0 ? general : [{ id: 'g1', title: 'Clean garage' }, { id: 'g2', title: 'Go to gym' }]).map(
              (todo) => (
                <View key={todo.id} style={styles.generalCell}>
                  <TodoCard title={todo.title} compact />
                </View>
              ),
            )}
          </View>
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
    paddingBottom: 120,
  },
  section: {
    marginBottom: Spacing.md,
  },
  generalRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  generalCell: {
    flex: 1,
  },
});
