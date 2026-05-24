import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <View style={styles.wrap}>
      <Text variant="headline">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
});
