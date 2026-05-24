import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarStrip } from '@/components/insights/calendar-strip';
import { AppText } from '@/components/typography/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { colors, radii, spacing } from '@/constants/design-tokens';

const IMPORTANT = ['Pickup dog', 'Finish project'];
const SCHEDULE = [
  { time: '9:00 am', task: 'Get coffee' },
  { time: '11:45 am', task: 'Drop son at school' },
];
const TODOS = ['Clean garage', 'Go to gym'];

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <Section title="Calendar" fullBleed>
          <CalendarStrip />
        </Section>

        <Section title="Important">
          {IMPORTANT.map((item) => (
            <GlassCard key={item} accent="sage" style={styles.listCard}>
              <AppText variant="bodyLg">{item}</AppText>
            </GlassCard>
          ))}
        </Section>

        <Section title="Schedule">
          <View style={styles.timeline}>
            {SCHEDULE.map((item, index) => (
              <View key={item.time} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={styles.timelineDot} />
                  {index < SCHEDULE.length - 1 ? <View style={styles.timelineLine} /> : null}
                </View>
                <View style={styles.timelineContent}>
                  <AppText variant="headlineSm" style={styles.time}>
                    {item.time}
                  </AppText>
                  <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
                    — {item.task}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="General Todos">
          <View style={styles.todoGrid}>
            {TODOS.map((item) => (
              <GlassCard key={item} accent="blue" style={styles.todoCard}>
                <AppText variant="bodyMd" style={styles.todoText}>
                  {item}
                </AppText>
              </GlassCard>
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  fullBleed,
}: {
  title: string;
  children: ReactNode;
  fullBleed?: boolean;
}) {
  return (
    <View style={styles.section}>
      <AppText variant="headlineMd" style={styles.sectionTitle}>
        {title}
      </AppText>
      {fullBleed ? <View style={styles.fullBleed}>{children}</View> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: spacing.sectionGap / 2,
  },
  section: {
    gap: spacing.elementGap,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  fullBleed: {
    marginHorizontal: -spacing.containerPaddingMobile,
  },
  listCard: {
    marginBottom: spacing.unit,
  },
  timeline: {
    gap: spacing.elementGap,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.elementGap,
  },
  timelineRail: {
    width: 16,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: radii.full,
    backgroundColor: colors.outlineVariant,
    marginTop: 8,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.outlineVariant,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
    paddingBottom: spacing.unit,
  },
  time: {
    fontSize: 22,
  },
  todoGrid: {
    flexDirection: 'row',
    gap: spacing.unit,
  },
  todoCard: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'center',
  },
  todoText: {
    textAlign: 'center',
  },
});
