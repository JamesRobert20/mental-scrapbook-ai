import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignColors, DesignRadii, DesignSpacing } from '@/constants/design';

const DAYS = [
  { label: 'MON', day: 12, active: false },
  { label: 'TUE', day: 13, active: false },
  { label: 'WED', day: 14, active: true },
];

const IMPORTANT = ['Pickup dog', 'Finish project'];
const SCHEDULE = [
  { time: '9:00 am', task: 'Get coffee' },
  { time: '11:45 am', task: 'Drop son at school' },
];
const TODOS = ['Clean garage', 'Go to gym'];

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader />

        <View style={styles.section}>
          <AppText variant="headlineSm">Calendar</AppText>
          <View style={styles.calendarRow}>
            {DAYS.map((item) => (
              <View
                key={item.label}
                style={[styles.dayPill, item.active && styles.dayPillActive]}>
                <AppText
                  variant="labelSm"
                  color={item.active ? DesignColors.onPrimary : DesignColors.onSurfaceVariant}>
                  {item.label}
                </AppText>
                <AppText
                  variant="headlineSm"
                  color={item.active ? DesignColors.onPrimary : DesignColors.onSurface}>
                  {item.day}
                </AppText>
                {item.active ? <View style={styles.activeDot} /> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="headlineSm">Important</AppText>
          <View style={styles.stack}>
            {IMPORTANT.map((item) => (
              <View key={item} style={styles.wideCard}>
                <AppText variant="bodyLg">{item}</AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="headlineSm">Schedule</AppText>
          <View style={styles.timeline}>
            {SCHEDULE.map((item, index) => (
              <View key={item.time} style={styles.timelineRow}>
                <View style={styles.timelineTrack}>
                  {index > 0 ? <View style={styles.timelineLineTop} /> : null}
                  <View style={styles.timelineDot} />
                  {index < SCHEDULE.length - 1 ? <View style={styles.timelineLineBottom} /> : null}
                </View>
                <View style={styles.timelineContent}>
                  <AppText variant="labelMd" color={DesignColors.onSurfaceVariant}>
                    {item.time}
                  </AppText>
                  <AppText variant="bodyLg">{item.task}</AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="headlineSm">General Todos</AppText>
          <View style={styles.grid}>
            {TODOS.map((item) => (
              <View key={item} style={styles.gridCard}>
                <AppText variant="bodyLg">{item}</AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  content: {
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 24,
    gap: 28,
  },
  section: {
    gap: 16,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dayPill: {
    flex: 1,
    minHeight: 96,
    borderRadius: DesignRadii.xl,
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  dayPillActive: {
    backgroundColor: DesignColors.primary,
    borderColor: DesignColors.primary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DesignColors.onPrimary,
    marginTop: 2,
  },
  stack: {
    gap: 12,
  },
  wideCard: {
    minHeight: 72,
    borderRadius: DesignRadii.xl,
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  timeline: {
    gap: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
    minHeight: 72,
  },
  timelineTrack: {
    width: 16,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DesignColors.outlineVariant,
    marginTop: 8,
  },
  timelineLineTop: {
    position: 'absolute',
    top: 0,
    width: 1,
    height: 8,
    backgroundColor: DesignColors.outlineVariant,
  },
  timelineLineBottom: {
    position: 'absolute',
    top: 18,
    bottom: 0,
    width: 1,
    backgroundColor: DesignColors.outlineVariant,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: DesignRadii.xl,
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    padding: 20,
    justifyContent: 'center',
  },
});
