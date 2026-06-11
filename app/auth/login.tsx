import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
    else router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={styles.lamp} />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your library</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={colors.muted}
          value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted}
          value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton title={loading ? 'Signing in…' : 'Sign In'} onPress={handleLogin} style={{ marginTop: 8, marginBottom: 24 }} />
        <Pressable onPress={() => router.push('/auth/signup')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign up</Text></Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  lamp: { width: 56, height: 56, borderRadius: 999, backgroundColor: colors.amber, marginBottom: 24,
    shadowColor: '#E0A23B', shadowOpacity: 0.5, shadowRadius: 28, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  title: { fontFamily: typography.serifLight, fontSize: 34, color: colors.ink, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontFamily: typography.serifItalic, fontSize: 17, color: colors.muted },
  form: { width: '100%' },
  input: { backgroundColor: colors.paperSurface, color: colors.ink, fontFamily: typography.sans, fontSize: 16,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.hairline, marginBottom: 16 },
  linkText: { fontFamily: typography.sans, color: colors.muted, textAlign: 'center', fontSize: 14 },
  linkBold: { fontFamily: typography.sansSemibold, color: colors.amberInk },
});
