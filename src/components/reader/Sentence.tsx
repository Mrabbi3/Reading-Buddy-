import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

// A tappable sentence. Selected / saved states paint the amber marker tint.
export function Sentence({
  text, fontSize, lineHeight, color, active, saved, onPress,
}: {
  text: string; fontSize: number; lineHeight: number; color: string;
  active: boolean; saved: boolean; onPress: () => void;
}) {
  const bg = active ? colors.amberSoft : saved ? 'rgba(224,162,59,0.20)' : 'transparent';
  return (
    <Text onPress={onPress} style={[styles.s, { fontSize, lineHeight, color, backgroundColor: bg }]}>
      {text}{' '}
    </Text>
  );
}

const styles = StyleSheet.create({ s: { borderRadius: 3 } });
