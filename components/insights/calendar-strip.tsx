import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import Text from '@/components/ui/text';
import { toDayKey } from '@/lib/infrastructure/date-keys';
import { tap } from '@/lib/infrastructure/haptics';
import {
  setInsightsSelectedDayKey,
  useInsightsSelectedDayKey,
} from '@/stores/insights.store';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

const DAY_WIDTH = 56;
const DAY_GAP = 8;
const DAY_STEP = DAY_WIDTH + DAY_GAP;
const DAYS_BEFORE = 45;
const DAYS_AFTER = 45;
const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Day = {
  key: string;
  date: Date;
  weekday: string;
  dayNum: number;
  isToday: boolean;
};

function buildDays(): Day[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDayKey(today);
  const days: Day[] = [];
  for (let offset = -DAYS_BEFORE; offset <= DAYS_AFTER; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    days.push({
      key: toDayKey(d),
      date: d,
      weekday: WEEKDAY[d.getDay()],
      dayNum: d.getDate(),
      isToday: toDayKey(d) === todayKey,
    });
  }
  return days;
}

function monthLabelFor(date: Date): string {
  return `${MONTH[date.getMonth()]} ${date.getFullYear()}`;
}

function indexFromScrollX(scrollX: number, dayCount: number): number {
  return Math.max(0, Math.min(dayCount - 1, Math.round(scrollX / DAY_STEP)));
}

function centerOffsetFor(index: number, viewportWidth: number): number {
  if (viewportWidth <= 0) return Math.max(0, index * DAY_STEP - DAY_STEP * 2);
  return Math.max(0, index * DAY_STEP + DAY_WIDTH / 2 - viewportWidth / 2);
}

export default function CalendarStrip() {
  const scrollRef = useRef<ScrollView>(null);
  const daysRef = useRef<Day[]>(buildDays());
  const days = daysRef.current;
  const todayIndex = days.findIndex((d) => d.isToday);
  const today = days[todayIndex >= 0 ? todayIndex : 0];

  const selectedDayKey = useInsightsSelectedDayKey();
  const [headerDate, setHeaderDate] = useState(today.date);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [showTodayPill, setShowTodayPill] = useState(false);
  const [showSelectedPill, setShowSelectedPill] = useState(false);
  const selectedIndex = days.findIndex((d) => d.key === selectedDayKey);
  const selectionIsToday = selectedDayKey === today.key;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const offset = centerOffsetFor(todayIndex, viewportWidth);
      scrollRef.current?.scrollTo({ x: offset, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [todayIndex, viewportWidth]);

  function handleViewportLayout(event: LayoutChangeEvent) {
    setViewportWidth(event.nativeEvent.layout.width);
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = indexFromScrollX(scrollX, days.length);
    const day = days[index];
    setHeaderDate((prev) => {
      if (
        prev.getMonth() === day.date.getMonth() &&
        prev.getFullYear() === day.date.getFullYear()
      ) {
        return prev;
      }
      return day.date;
    });

    if (viewportWidth <= 0) return;
    const threshold = viewportWidth * 0.6;

    const todayDrift = Math.abs(scrollX - centerOffsetFor(todayIndex, viewportWidth));
    const nextShowToday = todayDrift > threshold;
    setShowTodayPill((prev) => (prev === nextShowToday ? prev : nextShowToday));

    if (selectionIsToday || selectedIndex < 0) {
      setShowSelectedPill((prev) => (prev ? false : prev));
      return;
    }
    const selectedDrift = Math.abs(scrollX - centerOffsetFor(selectedIndex, viewportWidth));
    const nextShowSelected = selectedDrift > threshold;
    setShowSelectedPill((prev) => (prev === nextShowSelected ? prev : nextShowSelected));
  }

  function handleSelect(day: Day) {
    tap('selection');
    setInsightsSelectedDayKey(day.key);
    setHeaderDate(day.date);
    const index = days.findIndex((d) => d.key === day.key);
    if (index >= 0) {
      scrollRef.current?.scrollTo({
        x: centerOffsetFor(index, viewportWidth),
        animated: true,
      });
    }
    setShowTodayPill(false);
    setShowSelectedPill(false);
  }

  function scrollToIndex(index: number, day?: Day) {
    if (index < 0) return;
    tap('light');
    if (day) {
      setInsightsSelectedDayKey(day.key);
      setHeaderDate(day.date);
    }
    scrollRef.current?.scrollTo({
      x: centerOffsetFor(index, viewportWidth),
      animated: true,
    });
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text variant="bodySmall" muted style={styles.month}>
          {monthLabelFor(headerDate)}
        </Text>
        <View style={styles.pillRow}>
          {showSelectedPill ? (
            <Pressable
              onPress={() => scrollToIndex(selectedIndex, days[selectedIndex])}
              style={styles.pill}>
              <Ionicons name="bookmark-outline" size={13} color={Colors.light.onBackground} />
              <Text variant="label" style={styles.pillLabel}>
                Selected
              </Text>
            </Pressable>
          ) : null}
          {showTodayPill ? (
            <Pressable onPress={() => scrollToIndex(todayIndex, today)} style={styles.pill}>
              <Ionicons name="locate-outline" size={13} color={Colors.light.onBackground} />
              <Text variant="label" style={styles.pillLabel}>
                Today
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View onLayout={handleViewportLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          contentContainerStyle={styles.row}>
          {days.map((item) => {
            const active = item.key === selectedDayKey;
            return (
              <Pressable
                key={item.key}
                onPress={() => handleSelect(item)}
                style={[
                  styles.day,
                  active && styles.daySelected,
                  !active && item.isToday && styles.dayToday,
                ]}>
                <Text
                  variant="label"
                  style={[styles.dayLabel, active && styles.dayLabelSelected]}>
                  {item.weekday}
                </Text>
                <Text style={[styles.dayNum, active && styles.dayNumSelected]}>{item.dayNum}</Text>
                {item.isToday && !active ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  month: {
    paddingLeft: 2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surface,
    boxShadow: Shadows.ambient,
  },
  pillLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: Colors.light.onBackground,
  },
  row: {
    gap: DAY_GAP,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  day: {
    width: DAY_WIDTH,
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.lg,
    borderCurve: 'continuous',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.outline,
  },
  dayToday: {
    borderColor: Colors.light.primary,
  },
  daySelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.light.onSurfaceVariant,
  },
  dayLabelSelected: {
    color: Colors.light.onPrimary,
  },
  dayNum: {
    fontFamily: 'PlayfairDisplay_500Medium',
    fontSize: 20,
    lineHeight: 24,
    color: Colors.light.onBackground,
  },
  dayNumSelected: {
    color: Colors.light.onPrimary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
  },
});
