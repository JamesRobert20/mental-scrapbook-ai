import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { DesignColors } from '@/constants/design';
import { useAuthHydrated, useAuthSession } from '@/stores/auth-store';

export default function TabLayout() {
  const session = useAuthSession();
  const hasHydrated = useAuthHydrated();

  if (hasHydrated && !session) {
    return <Redirect href="/login" />;
  }

  return (    <Tabs
      initialRouteName="insights"
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: DesignColors.onSurface,
        tabBarInactiveTintColor: DesignColors.outline,
        tabBarStyle: {
          backgroundColor: DesignColors.surfaceContainerLowest,
          borderTopColor: DesignColors.outlineVariant,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bulb' : 'bulb-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'mic' : 'mic-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
