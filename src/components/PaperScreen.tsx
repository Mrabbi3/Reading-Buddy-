import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

// Warm "paper" canvas used by every light screen in the v2 design.
// (The CSS paper-grain is a fractal-noise SVG; on native we approximate with a
//  flat warm surface — visually faithful at phone scale.)
export function PaperScreen({
  children,
  bg = colors.paper,
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
