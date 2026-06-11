import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type P = { size?: number; color?: string };

// Stroked icon set ported from the design's `Ic` object (rb-icons.jsx).
export const Icons = {
  back: ({ size = 20, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  forward: ({ size = 20, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  sparkle: ({ size = 16, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill={color} />
    </Svg>
  ),
  book: ({ size = 20, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5v-12z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5v-12z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
  plus: ({ size = 18, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  ),
  list: ({ size = 20, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16M4 12h16M4 17h10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  check: ({ size = 18, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  apple: ({ size = 18, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 12.8c-.03-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.62-1.96-1.54-.16-3 .9-3.78.9-.78 0-1.98-.88-3.25-.86-1.67.03-3.21.97-4.07 2.47-1.74 3.02-.44 7.48 1.24 9.93.82 1.2 1.8 2.54 3.08 2.49 1.24-.05 1.7-.8 3.2-.8 1.49 0 1.91.8 3.21.77 1.33-.02 2.17-1.22 2.98-2.42.94-1.38 1.33-2.72 1.35-2.79-.03-.01-2.59-.99-2.62-3.94zM14.6 5.1c.68-.83 1.14-1.98.02-3.1-.99.12-2.18.66-2.88 1.46-.63.7-1.18 1.86-.18 3 .98.04 2.06-.49 3.04-1.36z" />
    </Svg>
  ),
  bookmark: ({ size = 16, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4h12v16l-6-4-6 4V4z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
  sun: ({ size = 18, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.7} />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
  refresh: ({ size = 16, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12a9 9 0 0115.5-6.2M21 4v4h-4M21 12a9 9 0 01-15.5 6.2M3 20v-4h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  lock: ({ size = 16, color = '#000' }: P) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 10V8a6 6 0 0112 0v2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M5 10h14v10H5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icons;
