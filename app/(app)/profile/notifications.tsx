import { ScrollView, StyleSheet } from 'react-native';

import Text from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

export default function NotificationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
      <Text variant="body" muted>
        Notification preferences coming soon.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.screenPadding,
    paddingBottom: 140,
  },
});
