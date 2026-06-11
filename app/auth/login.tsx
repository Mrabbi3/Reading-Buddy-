import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable, useWindowDimensions, Image } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isLarge = Platform.OS === 'web' && width > 768;

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
    else router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {isLarge && (
        <View style={styles.heroSide}>
          <Image source={require('../../public/images/web-hero.png')} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Image source={require('../../assets/icon.png')} style={styles.logoSmall} />
            <Text style={styles.heroText}>Your library, anywhere.</Text>
          </View>
        </View>
      )}
      <KeyboardAvoidingView style={[styles.container, isLarge && styles.containerLarge]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formWrap}>
          <View style={styles.header}>
            {!isLarge && <Image source={require('../../assets/icon.png')} style={styles.logo} />}
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.paper },
  heroSide: { flex: 1, backgroundColor: '#17150F', position: 'relative' },
  heroImg: { width: '100%', height: '100%', opacity: 0.85 },
  heroOverlay: { position: 'absolute', top: 40, left: 40 },
  logoSmall: { width: 42, height: 42, borderRadius: 10, marginBottom: 16 },
  heroText: { fontFamily: typography.serifLight, fontSize: 32, color: colors.paper },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  containerLarge: { flex: 0.8, maxWidth: 600 },
  formWrap: { maxWidth: 400, width: '100%', alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 64, height: 64, borderRadius: 14, marginBottom: 24 },
  title: { fontFamily: typography.serifLight, fontSize: 34, color: colors.ink, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontFamily: typography.serifItalic, fontSize: 17, color: colors.muted },
  form: { width: '100%' },
  input: { backgroundColor: colors.paperSurface, color: colors.ink, fontFamily: typography.sans, fontSize: 16,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.hairline, marginBottom: 16 },
  linkText: { fontFamily: typography.sans, color: colors.muted, textAlign: 'center', fontSize: 14 },
  linkBold: { fontFamily: typography.sansSemibold, color: colors.amberInk },
});
