import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/typography/app-text';
import { colors, radii, spacing } from '@/constants/design-tokens';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const DAY_WIDTH = 56;
const DAY_GAP = 8;
const SNAP_INTERVAL = DAY_WIDTH + DAY_GAP;

type CalendarDay = {
  id: string;
  label: string;
  day: string;
  isToday: boolean;
};

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** All days of the current calendar month, ordered from the 1st. */
function buildCurrentMonthDays(): { days: CalendarDay[]; monthLabel: string; todayIndex: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = startOfLocalDay(now);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(now);

  const days: CalendarDay[] = [];
  let todayIndex = 0;

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const date = new Date(year, month, dayNum);
    const isToday = startOfLocalDay(date).getTime() === today.getTime();

    if (isToday) {
      todayIndex = dayNum - 1;
    }

    days.push({
      id: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      label: DAY_LABELS[date.getDay()],
      day: String(dayNum),
      isToday,
    });
  }

  return { days, monthLabel, todayIndex };
}

export function CalendarStrip() {
  const { days, monthLabel, todayIndex } = useMemo(() => buildCurrentMonthDays(), []);
  const todayId = days[todayIndex]?.id ?? days[0]?.id;

  const [selectedId, setSelectedId] = useState(todayId);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (todayIndex < 0 || !scrollRef.current) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: Math.max(0, (todayIndex - 2) * SNAP_INTERVAL),
        animated: true,
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [todayIndex]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    const day = days[Math.min(Math.max(index, 0), days.length - 1)];
    if (day) {
      setSelectedId(day.id);
    }
  };

  return (
    <View style={styles.wrapper}>
      <AppText variant="labelMd" color={colors.onSurfaceVariant} style={styles.monthLabel}>
        {monthLabel}
      </AppText>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}>
        {days.map((item) => {
          const isSelected = item.id === selectedId;
          const isToday = item.isToday;

          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              style={[
                styles.dayCard,
                isToday && styles.dayCardToday,
                isSelected && !isToday && styles.dayCardSelected,
              ]}>
              <AppText
                variant="labelSm"
                color={
                  isToday ? colors.onPrimary : isSelected ? colors.onSurface : colors.onSurfaceVariant
                }>
                {item.label}
              </AppText>
              <AppText
                variant="headlineMd"
                color={isToday ? colors.onPrimary : colors.onSurface}
                style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
                {item.day}
              </AppText>
              {isToday ? <View style={styles.todayDot} /> : null}
              {isSelected && !isToday ? <View style={styles.selectedDot} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.unit,
  },
  monthLabel: {
    paddingHorizontal: spacing.containerPaddingMobile,
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: DAY_GAP,
  },
  dayCard: {
    width: DAY_WIDTH,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radii.lg,
    gap: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayCardToday: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.06 }],
  },
  dayCardSelected: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.outlineVariant,
  },
  dayNumber: {
    fontSize: 28,
  },
  dayNumberToday: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.onPrimary,
    marginTop: 4,
  },
  selectedDot: {
    width: 5,
    height: 5,
    borderRadius: radii.full,
    backgroundColor: colors.onSurfaceVariant,
    marginTop: 4,
  },
});
