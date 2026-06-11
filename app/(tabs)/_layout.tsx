import { Tabs } from 'expo-router';
import { Icons } from '../../src/components/Icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.paperSurface,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
        },
        tabBarActiveTintColor: colors.amberInk,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: typography.sansSemibold, fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }: { color: string }) => <Icons.book size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <Icons.sun size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
