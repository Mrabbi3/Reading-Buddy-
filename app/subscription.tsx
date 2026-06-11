import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaperScreen } from '../src/components/PaperScreen';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { Icons } from '../src/components/Icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

const BENEFITS = [
  'Unlimited summaries — highlight as much as you like',
  'Whole-book summaries in one tap',
  'Your highlights, synced across iPhone, iPad & web',
  'Faster, deeper explanations',
];

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');
  const close = () => router.back();

  return (
    <PaperScreen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30, paddingHorizontal: 28 }} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.close} onPress={close}><Text style={styles.closeText}>✕</Text></Pressable>

        <View style={styles.hero}>
          <View style={styles.lamp} />
          <Text style={styles.h}>Read everything, together.</Text>
          <Text style={styles.sub}>Unlimited margin notes, whole-book summaries, and everything synced.</Text>
        </View>

        <View style={{ marginBottom: 22 }}>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefit}>
              <View style={{ marginTop: 2 }}><Icons.check size={18} color={colors.amber} /></View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <Plan name="Annual" price="$39.99 / year · 7-day free trial" tag="Save 33%" sel={plan === 'annual'} onPress={() => setPlan('annual')} />
        <Plan name="Monthly" price="$4.99 / month" sel={plan === 'monthly'} onPress={() => setPlan('monthly')} />

        <PrimaryButton title={plan === 'annual' ? 'Start free trial' : 'Continue'} onPress={() => router.back()} style={{ marginTop: 8 }} />
        <Text style={styles.trial}>
          {plan === 'annual' ? '7 days free, then $39.99/year. Cancel anytime.' : '$4.99 billed monthly. Cancel anytime.'}
        </Text>
        <View style={styles.footLinks}>
          <Pressable onPress={close}><Text style={styles.link}>Maybe later</Text></Pressable>
          <Pressable><Text style={styles.link}>Restore purchases</Text></Pressable>
        </View>
      </ScrollView>
    </PaperScreen>
  );
}

function Plan({ name, price, tag, sel, onPress }: { name: string; price: string; tag?: string; sel: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.plan, sel && styles.planSel]} onPress={onPress}>
      <View style={[styles.radio, sel && styles.radioSel]}>{sel && <View style={styles.radioDot} />}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.planName}>{name}</Text>
        <Text style={styles.planPrice}>{price}</Text>
      </View>
      {tag && (
        <View style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  close: { position: 'absolute', top: 8, right: 22, zIndex: 5, padding: 8 },
  closeText: { fontFamily: typography.sansSemibold, fontSize: 18, color: colors.muted },
  hero: { alignItems: 'center', paddingTop: 20 },
  lamp: { width: 46, height: 46, borderRadius: 999, backgroundColor: colors.amber, marginBottom: 6,
    shadowColor: '#E0A23B', shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  h: { fontFamily: typography.serifLight, fontSize: 36, lineHeight: 39, color: colors.ink, textAlign: 'center', marginTop: 14, marginBottom: 10, letterSpacing: -0.6 },
  sub: { fontFamily: typography.serifItalic, fontSize: 17, lineHeight: 25, color: colors.muted, textAlign: 'center', maxWidth: 300, marginBottom: 22 },
  benefit: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 9 },
  benefitText: { flex: 1, fontFamily: typography.sans, fontSize: 15.5, color: colors.ink, lineHeight: 21 },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: colors.hairline, borderRadius: 16,
    padding: 16, marginBottom: 12, backgroundColor: colors.paperSurface },
  planSel: { borderColor: colors.amber, shadowColor: '#E0A23B', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  radio: { width: 22, height: 22, borderRadius: 999, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: colors.amber },
  radioDot: { width: 12, height: 12, borderRadius: 999, backgroundColor: colors.amber },
  planName: { fontFamily: typography.sansSemibold, fontSize: 16, color: colors.ink },
  planPrice: { fontFamily: typography.sans, fontSize: 13, color: colors.muted, marginTop: 2 },
  tag: { backgroundColor: 'rgba(224,162,59,0.16)', paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999 },
  tagText: { fontFamily: typography.sansSemibold, fontSize: 11, color: colors.amberInk },
  trial: { textAlign: 'center', fontFamily: typography.sans, fontSize: 12.5, color: colors.muted, marginTop: 12 },
  footLinks: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 6 },
  link: { fontFamily: typography.sansSemibold, fontSize: 15, color: colors.muted, padding: 12 },
});
