import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LANGS, type Lang } from '../data/categories'
import { useGame } from '../game/GameState'
import { LANGUAGE_FLAGS, NATIVE_NAMES, stringsFor } from '../i18n/strings'
import { fonts, palette, radius, shadow, spacing, type } from '../ui/theme'

/**
 * Language screen: shown on first launch and whenever the player opens the
 * language switcher (game.tsx navigates with ?switch=1). English copy is the
 * neutral voice until a choice is made.
 */
export default function LanguageScreen() {
  const { lang, setLang } = useGame()
  const { switch: isSwitcher } = useLocalSearchParams()
  const openedFromGame = isSwitcher === '1'
  const insets = useSafeAreaInsets()
  const s = stringsFor('en')

  // Saved language + cold start: straight to the game (ui-localization spec).
  useEffect(() => {
    if (lang && !openedFromGame) router.replace('/game')
  }, [lang, openedFromGame])

  if (lang && !openedFromGame) return null

  const choose = (next: Lang) => {
    setLang(next)
    router.replace('/game')
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.title}>Think Fast!</Text>
      <Text style={styles.tagline}>{s.tagline}</Text>

      <View style={styles.list}>
        {LANGS.map((option) => {
          const selected = option === lang
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={NATIVE_NAMES[option]}
              onPress={() => choose(option)}
              style={({ pressed }) => [
                styles.ticket,
                selected && styles.ticketSelected,
                pressed && styles.ticketPressed,
              ]}
            >
              <Text style={styles.flag}>{LANGUAGE_FLAGS[option]}</Text>
              <Text style={styles.ticketLabel}>{NATIVE_NAMES[option]}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    gap: spacing.l,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: type.title,
    color: palette.cream,
  },
  tagline: {
    fontFamily: fonts.text,
    fontSize: type.tagline,
    color: palette.cream,
    opacity: 0.8,
  },
  list: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.m,
    marginTop: spacing.xl,
  },
  ticket: {
    ...shadow,
    backgroundColor: palette.cream,
    borderRadius: radius.ticket,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  ticketSelected: {
    borderWidth: 3,
    borderColor: palette.butter,
  },
  ticketPressed: {
    transform: [{ scale: 0.97 }],
  },
  flag: {
    fontSize: 30,
  },
  ticketLabel: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: palette.ink,
  },
})
