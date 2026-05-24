import { ScrollView, StyleSheet } from 'react-native';

import Text from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

export default function SecurityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
      <Text variant="body" muted>
        Password changes and session management will live here. Sessions are stored locally on your device for the
        hackathon demo.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.screenPadding,
  },
});
