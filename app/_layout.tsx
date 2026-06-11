import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import { colors } from '../src/theme/colors';
import { AuthProvider, useAuth } from '../src/providers/AuthProvider';
import { BookProvider } from '../src/providers/BookProvider';
import { useEffect } from 'react';

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabs = segments[0] === '(tabs)';
    const inPdfReader = segments[0] === 'pdf-reader';

    // Only redirect if user is trying to access protected routes without auth
    if (!session && (inTabs || inPdfReader)) {
      router.replace('/auth/login');
    }
    // If user just logged in and is still on auth screens, send to tabs
    else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
        animation: 'fade',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="pdf-reader/[id]" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <BookProvider>
        <InitialLayout />
        <StatusBar style="dark" />
      </BookProvider>
    </AuthProvider>
  );
}
