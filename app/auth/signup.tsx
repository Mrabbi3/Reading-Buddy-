import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable, useWindowDimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { supabase } from '../../src/lib/supabase';

import * as Linking from 'expo-linking';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLarge = Platform.OS === 'web' && width > 768;

  const handleSignup = async () => {
    if (!email || !password) return;
    setLoading(true);
    
    // Concrete Fix: Create the deep link URL for Expo & Web so email confirmations actually work!
    const redirectUrl = Linking.createURL('/(tabs)');
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });
    setLoading(false);
    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else if (data.session) {
      // Auto-confirmed, log them right in!
      router.replace('/(tabs)');
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link. You must click it before signing in!');
      router.replace('/auth/login');
    }
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
            <Text style={styles.title}>Join Reading Buddy</Text>
            <Text style={styles.subtitle}>Create your free account</Text>
          </View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={colors.muted}
              value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted}
              value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title={loading ? 'Creating account…' : 'Sign Up'} onPress={handleSignup} style={{ marginTop: 8, marginBottom: 24 }} />
            <Pressable onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
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
