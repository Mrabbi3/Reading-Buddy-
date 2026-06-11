import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

export default function Landing() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Reading Buddy</Text>
        <Text style={styles.subtitle}>never read alone</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Start Reading" onPress={() => router.replace('/onboarding')} />
        <Pressable onPress={() => router.push('/auth/login')} style={styles.loginBtn}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </Pressable>
        <Text style={styles.disclaimer}>A reading companion for everything you read.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 84, height: 84, borderRadius: 18, marginBottom: 26 },
  title: { fontFamily: typography.serifLight, fontSize: 46, color: colors.ink, letterSpacing: -1 },
  subtitle: { fontFamily: typography.serifItalic, fontSize: 20, color: colors.muted, marginTop: 14 },
  footer: { paddingHorizontal: 32, paddingBottom: 40 },
  loginBtn: { paddingVertical: 14, alignItems: 'center' },
  loginText: { fontFamily: typography.sansSemibold, fontSize: 15, color: colors.amberInk },
  disclaimer: { textAlign: 'center', fontFamily: typography.sans, fontSize: 13, color: colors.muted, marginTop: 4 },
});
