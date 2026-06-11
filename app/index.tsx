import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        <View style={styles.lamp} />
        <Text style={styles.title}>Reading Buddy</Text>
        <Text style={styles.subtitle}>never read alone</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Start Reading" onPress={() => router.replace('/onboarding')} />
        <Text style={styles.disclaimer}>A reading companion for everything you read.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lamp: { width: 64, height: 64, borderRadius: 999, backgroundColor: colors.amber, marginBottom: 26,
    shadowColor: '#E0A23B', shadowOpacity: 0.55, shadowRadius: 34, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  title: { fontFamily: typography.serifLight, fontSize: 46, color: colors.ink, letterSpacing: -1 },
  subtitle: { fontFamily: typography.serifItalic, fontSize: 20, color: colors.muted, marginTop: 14 },
  footer: { paddingHorizontal: 32, paddingBottom: 40 },
  disclaimer: { textAlign: 'center', fontFamily: typography.sans, fontSize: 13, color: colors.muted, marginTop: 16 },
});
