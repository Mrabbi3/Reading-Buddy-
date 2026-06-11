import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaperScreen } from '../../src/components/PaperScreen';
import { Icons } from '../../src/components/Icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useAuth } from '../../src/providers/AuthProvider';
import { supabase } from '../../src/lib/supabase';

function Row({ icon, name, detail, chevron, right, onPress }: {
  icon?: React.ReactNode; name: string; detail?: string; chevron?: boolean; right?: React.ReactNode; onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      {icon && <View style={styles.rowIc}>{icon}</View>}
      <Text style={styles.rowName}>{name}</Text>
      {detail && <Text style={styles.rowDetail}>{detail}</Text>}
      {right}
      {chevron && <View style={{ opacity: 0.5 }}><Icons.forward size={16} color={colors.muted} /></View>}
    </Pressable>
  );
}

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [appearance, setAppearance] = useState('Auto');

  return (
    <PaperScreen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.wrap}>
          <View style={styles.acct}>
            <View style={styles.av}><Text style={styles.avText}>E</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.acctName}>{user?.email?.split('@')[0] || 'Eleanor Vale'}</Text>
              <View style={styles.acctSub}>
                <Icons.apple size={13} color={colors.muted} />
                <Text style={styles.acctSubText}>Signed in with Apple</Text>
              </View>
            </View>
            <View style={styles.pro}><Text style={styles.proText}>PRO</Text></View>
          </View>

          <Text style={styles.label}>SUBSCRIPTION</Text>
          <View style={styles.group}>
            <Row icon={<Icons.sparkle size={15} color={colors.amberInk} />} name="Manage subscription" chevron onPress={() => router.push('/subscription')} />
            <Row icon={<Icons.refresh size={16} color={colors.muted} />} name="Restore purchases" chevron />
          </View>

          <Text style={styles.label}>APPEARANCE</Text>
          <View style={styles.group}>
            <Row
              icon={<Icons.sun size={18} color={colors.muted} />}
              name="Theme"
              right={
                <View style={styles.seg}>
                  {['Auto', 'Light', 'Dark'].map((o) => (
                    <Pressable key={o} style={[styles.segBtn, appearance === o && styles.segBtnOn]} onPress={() => setAppearance(o)}>
                      <Text style={[styles.segText, appearance === o && styles.segTextOn]}>{o}</Text>
                    </Pressable>
                  ))}
                </View>
              }
            />
          </View>

          <Text style={styles.label}>ABOUT</Text>
          <View style={styles.group}>
            <Row icon={<Icons.book size={16} color={colors.muted} />} name="About Reading Buddy" detail="v1.0" />
            <Row icon={<Icons.lock size={16} color={colors.muted} />} name="Privacy" chevron />
            <Row name="Sign Out" onPress={() => supabase.auth.signOut()} />
          </View>

          <Text style={styles.tagline}>never read alone</Text>
        </View>
      </ScrollView>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: typography.serifLight, fontSize: 34, color: colors.ink, letterSpacing: -0.6 },
  wrap: { paddingHorizontal: 18 },
  acct: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, backgroundColor: colors.paperSurface,
    borderWidth: 1, borderColor: colors.hairline, borderRadius: 18, marginBottom: 26 },
  av: { width: 46, height: 46, borderRadius: 999, backgroundColor: '#2b271f', alignItems: 'center', justifyContent: 'center' },
  avText: { fontFamily: typography.serif, fontSize: 20, color: colors.paper },
  acctName: { fontFamily: typography.sansSemibold, fontSize: 16, color: colors.ink },
  acctSub: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  acctSubText: { fontFamily: typography.sans, fontSize: 13, color: colors.muted },
  pro: { backgroundColor: 'rgba(224,162,59,0.16)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 },
  proText: { fontFamily: typography.sansSemibold, fontSize: 11, letterSpacing: 0.8, color: colors.amberInk },

  label: { fontFamily: typography.sansSemibold, fontSize: 11, letterSpacing: 1.2, color: colors.muted, paddingHorizontal: 12, paddingBottom: 9 },
  group: { backgroundColor: colors.paperSurface, borderWidth: 1, borderColor: colors.hairline, borderRadius: 18, overflow: 'hidden', marginBottom: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.hairline },
  rowIc: { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(34,30,26,0.05)', alignItems: 'center', justifyContent: 'center' },
  rowName: { flex: 1, fontFamily: typography.sansMedium, fontSize: 16, color: colors.ink },
  rowDetail: { fontFamily: typography.sans, fontSize: 14, color: colors.muted },

  seg: { flexDirection: 'row', backgroundColor: 'rgba(34,30,26,0.06)', borderRadius: 9, padding: 2 },
  segBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 7 },
  segBtnOn: { backgroundColor: colors.paperSurface, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  segText: { fontFamily: typography.sansSemibold, fontSize: 12, color: colors.muted },
  segTextOn: { color: colors.ink },

  tagline: { textAlign: 'center', fontFamily: typography.serifItalic, fontSize: 15, color: colors.muted, paddingVertical: 14 },
});
