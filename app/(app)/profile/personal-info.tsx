import { ScrollView, StyleSheet } from 'react-native';

import Input from '@/components/ui/input';
import Text from '@/components/ui/text';
import { useAuthUser } from '@/stores/auth.store';
import { Spacing } from '@/constants/theme';

export default function PersonalInfoScreen() {
  const user = useAuthUser();

  return (
    <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
      <Text variant="body" muted style={styles.intro}>
        Update how Mental Scrapbook addresses you.
      </Text>
      <Input label="First name" value={user?.firstName ?? ''} editable={false} />
      <Input label="Last name" value={user?.lastName ?? ''} editable={false} />
      <Input label="Email" value={user?.email ?? ''} editable={false} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.screenPadding,
    paddingBottom: 140,
    gap: Spacing.md,
  },
  intro: {
    marginBottom: Spacing.sm,
  },
});
