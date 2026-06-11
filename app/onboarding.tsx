import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { PaperScreen } from '../src/components/PaperScreen';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { Icons } from '../src/components/Icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';

// Marker-highlighted line: amber sweep grows under the text (.mk / .mk.on).
function Marked({ children, on, dur = 550 }: { children: React.ReactNode; on: boolean; dur?: number }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, {
      toValue: on ? 1 : 0,
      duration: dur,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [on]);
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: '14%',
          bottom: '8%',
          width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          backgroundColor: colors.amberSoft,
          borderRadius: 3,
        }}
      />
      <Text style={styles.cardLine}>{children}</Text>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [sweep, setSweep] = useState(false);
  const [noteIn, setNoteIn] = useState(false);
  const noteOpacity = useRef(new Animated.Value(0)).current;
  const noteY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    setSweep(false);
    setNoteIn(false);
    noteOpacity.setValue(0);
    noteY.setValue(14);
    let t1: any, t2: any;
    if (i === 0) t1 = setTimeout(() => setSweep(true), 600);
    if (i === 1) {
      t1 = setTimeout(() => setSweep(true), 450);
      t2 = setTimeout(() => {
        setNoteIn(true);
        Animated.parallel([
          Animated.timing(noteOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(noteY, { toValue: 0, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
        ]).start();
      }, 950);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [i]);

  const done = () => router.replace('/(tabs)');
  const last = i === 2;

  const slides = [
    {
      headline: 'Highlight any line.',
      sub: 'Drag across a phrase that stops you — the way you would with a marker.',
      art: (
        <View style={[styles.pageCard, { transform: [{ rotate: '-1.2deg' }] }]}>
          <Text style={styles.cardLine}>She had read the page twice</Text>
          <Text style={styles.cardLine}>
            without seeing it. <Marked on={sweep}>Then the meaning arrived, quietly,</Marked>
          </Text>
          <Marked on={sweep}>the way warmth fills a cold room.</Marked>
          <Text style={styles.cardLine}>Outside, the lamps came on.</Text>
        </View>
      ),
    },
    {
      headline: 'A note, right in the margin.',
      sub: "Get an instant summary where you're reading — never lose your place.",
      art: (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={[styles.pageCard, { transform: [{ rotate: '-1.4deg' }] }]}>
            <Marked on>The house had been waiting,</Marked>
            <Marked on>the whole time, for someone</Marked>
            <Marked on>to come home.</Marked>
          </View>
          <Animated.View
            style={[styles.note, { opacity: noteOpacity, transform: [{ translateY: noteY }] }]}>
            <View style={styles.noteAttr}>
              <Icons.sparkle size={11} color={colors.amber} />
              <Text style={styles.noteAttrText}>READING BUDDY</Text>
            </View>
            <Text style={styles.noteBody}>
              The house reads as patient, almost alive — its emptiness is anticipation, not neglect.
            </Text>
          </Animated.View>
        </View>
      ),
    },
    {
      headline: null,
      sub: null,
      art: (
        <View style={{ alignItems: 'center' }}>
          <View style={styles.lamp} />
          <Text style={styles.wordmark}>Reading Buddy</Text>
          <Text style={styles.tagline}>never read alone</Text>
        </View>
      ),
    },
  ];

  const s = slides[i];

  return (
    <PaperScreen>
      <View style={styles.stage}>
        {!last && (
          <Pressable style={styles.skip} onPress={done}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}

        <View style={styles.art}>{s.art}</View>

        <View style={styles.foot}>
          {s.headline && <Text style={styles.headline}>{s.headline}</Text>}
          {s.sub && <Text style={styles.sub}>{s.sub}</Text>}

          <View style={styles.dots}>
            {slides.map((_, k) => (
              <View key={k} style={[styles.dot, k === i && styles.dotOn]} />
            ))}
          </View>

          <PrimaryButton
            title={last ? 'Start reading' : 'Continue'}
            onPress={last ? done : () => setI(i + 1)}
          />
        </View>
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, paddingTop: 60 },
  skip: { position: 'absolute', top: 60, right: 22, zIndex: 5, padding: 8 },
  skipText: { fontFamily: typography.sansSemibold, fontSize: 15, color: colors.muted },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },
  foot: { paddingHorizontal: 32, paddingBottom: 46, alignItems: 'center' },

  pageCard: {
    backgroundColor: colors.paperSurface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 26,
    width: '100%',
    gap: 6,
    shadowColor: '#221E1A',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 5,
  },
  cardLine: { fontFamily: typography.serif, fontSize: 17, lineHeight: 27, color: '#322c25' },

  note: {
    marginTop: 18,
    alignSelf: 'flex-end',
    maxWidth: 240,
    backgroundColor: colors.dSurface,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  noteAttr: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  noteAttrText: { fontFamily: typography.sansSemibold, fontSize: 10, letterSpacing: 1.2, color: colors.amber },
  noteBody: { fontFamily: typography.serif, fontSize: 16, lineHeight: 23, color: colors.dText },

  lamp: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.amber,
    marginBottom: 20,
    shadowColor: '#E0A23B',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  wordmark: { fontFamily: typography.serifLight, fontSize: 46, color: colors.ink, letterSpacing: -1 },
  tagline: { fontFamily: typography.serifItalic, fontSize: 20, color: colors.muted, marginTop: 18 },

  headline: { fontFamily: typography.serifLight, fontSize: 38, lineHeight: 41, color: colors.ink, textAlign: 'center', marginBottom: 16, letterSpacing: -0.6 },
  sub: { fontFamily: typography.serifItalic, fontSize: 18, lineHeight: 27, color: colors.muted, textAlign: 'center', maxWidth: 300, marginBottom: 30 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 26 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.hairline },
  dotOn: { width: 22, backgroundColor: colors.amber },
});
