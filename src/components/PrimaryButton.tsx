import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// The amber pill CTA (.btn-primary) from the design.
export function PrimaryButton({
  title,
  onPress,
  style,
  left,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  left?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}>
      <View style={styles.row}>
        {left}
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.amber,
    borderRadius: 999,
    paddingVertical: 17,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0A23B',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.97 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: {
    fontFamily: typography.sansSemibold,
    fontSize: 17,
    color: '#2b1d05',
    letterSpacing: 0.2,
  },
});
