// Design tokens ported 1:1 from the "Reading Buddy iOS v2" Claude design.
// Light ("paper") is the primary app surface; "ink" is the dark reading theme.

export const colors = {
  // --- Paper (light) ---
  paper: '#FAF7F1',
  paperSurface: '#FFFDF8',
  ink: '#221E1A',
  muted: '#6B6258',
  hairline: 'rgba(34, 30, 26, 0.10)',

  // --- Dark ---
  dBg: '#17150F',
  dSurface: '#211E16',
  dText: '#EDE7DC',
  dMuted: '#9A9082',
  dHairline: 'rgba(237, 231, 220, 0.12)',

  // --- Accent (the highlighter) ---
  amber: '#E0A23B',
  amberSoft: 'rgba(224, 162, 59, 0.30)',
  amberInk: '#8a5e16',

  // --- Legacy aliases (kept so existing screens keep compiling) ---
  background: '#17150F',
  surface: '#2A2622',
  surfaceElevated: '#211E16',
  primary: '#E0A23B',
  primaryLight: '#E8B661',
  text: '#EDE7DC',
  textSecondary: '#9A9082',
  border: '#3D3833',
  error: '#FF8A80',
};

export const readerThemes = {
  ink: { bg: '#17150F', fg: '#E3DCCF', mut: '#9A9082' },
  paper: { bg: '#FAF7F1', fg: '#2A251E', mut: '#6B6258' },
  sepia: { bg: '#F1E5CE', fg: '#3A2F1E', mut: '#7d6e54' },
} as const;

export type ReaderThemeKey = keyof typeof readerThemes;
