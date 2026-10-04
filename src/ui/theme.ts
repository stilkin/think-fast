import type { ViewStyle } from 'react-native'

/**
 * Think Fast visual identity: a fairground wheel at dusk.
 * Deep indigo night sky, candy-color segments, cream tickets, butter CTA.
 * One family (Fredoka) carries everything; one orchestrated motion moment
 * per action (spin, letter stamp, press feedback).
 */
export const palette = {
  /** night-sky indigo — app background */
  ink: '#241B4F',
  /** deeper indigo — wheel rim, sunken areas */
  inkDeep: '#1A1338',
  /** warm bulb-glow white — tickets, text */
  cream: '#FFF6E7',
  butter: '#FFC53D',
  coral: '#FF6B6B',
  mint: '#3BC9A6',
  sky: '#4CC9F0',
  lilac: '#9B8CFF',
  tangerine: '#FF9F45',
} as const

/** Wheel segment colors, cycled; letter text is always ink on these. */
export const SEGMENT_COLORS = [
  palette.butter,
  palette.coral,
  palette.mint,
  palette.sky,
  palette.lilac,
  palette.tangerine,
] as const

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const

export const radius = {
  ticket: 20,
  button: 999,
  stamp: 18,
} as const

/** Loaded in src/app/_layout.tsx via useFonts. */
export const fonts = {
  display: 'Fredoka-SemiBold',
  text: 'Fredoka-Medium',
} as const

export const type = {
  title: 38,
  tagline: 17,
  category: 28,
  letter: 54,
  button: 19,
  header: 20,
} as const

export const shadow: ViewStyle = {
  shadowColor: '#0B0721',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 10,
  elevation: 8,
}
