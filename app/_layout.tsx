import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { DesignColors } from '@/constants/design';
import { useAppFonts } from '@/hooks/use-app-fonts';

const AppTheme = {
  dark: false,
  colors: {
    primary: DesignColors.primary,
    background: DesignColors.background,
    card: DesignColors.surfaceContainerLowest,
    text: DesignColors.onSurface,
    border: DesignColors.outlineVariant,
    notification: DesignColors.accentLavender,
  },
  fonts: {
    regular: { fontFamily: 'HankenGrotesk_400Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'HankenGrotesk_500Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'HankenGrotesk_600SemiBold', fontWeight: '600' as const },
    heavy: { fontFamily: 'HankenGrotesk_600SemiBold', fontWeight: '600' as const },
  },
};

export default function RootLayout() {
  const { loaded, error } = useAppFonts();

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={AppTheme}>
      <View style={{ flex: 1, backgroundColor: DesignColors.background }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: DesignColors.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="personal-information" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </View>
    </ThemeProvider>
  );
}
