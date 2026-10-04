import { router } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LETTERS, labelFor } from '../data/categories'
import type { Round } from '../game/engine'
import { useGame } from '../game/GameState'
import { challengeSentence, LANGUAGE_FLAGS, stringsFor } from '../i18n/strings'
import { initSound } from '../sound/sound'
import { fonts, palette, radius, shadow, spacing, type } from '../ui/theme'
import { Wheel, type WheelHandle } from '../wheel/Wheel'

/** Breathing room between "next category" and the automatic re-spin. */
const AUTO_SPIN_DELAY_MS = 450

export default function GameScreen() {
  const { lang: chosenLang, muted, toggleMuted, engine } = useGame()
  // The router only sends us here once a language is chosen; 'en' is the
  // project's fallback while that choice is in flight.
  const lang = chosenLang ?? 'en'
  const s = stringsFor(lang)
  const insets = useSafeAreaInsets()

  const [round, setRound] = useState<Round>(engine.current)
  const [landedLetter, setLandedLetter] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const wheelRef = useRef<WheelHandle>(null)

  const categoryLabel = labelFor(round.category, lang)

  // Language switch mid-game: wheel rebuilds, letter cycle resets (specs),
  // any landed letter is cleared with the round. `lang` is the trigger.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional re-sync on language change
  useEffect(() => {
    setRound({ ...engine.current })
    setLandedLetter(null)
  }, [lang, engine])

  const drawAndSpin = useCallback(() => {
    if (spinning) return
    initSound()
    const letter = engine.spin()
    setSpinning(true)
    wheelRef.current?.spinTo(letter)
  }, [engine, spinning])

  const handleLand = useCallback((letter: string) => {
    setLandedLetter(letter)
    setSpinning(false)
  }, [])

  const handleNext = useCallback(() => {
    if (spinning) return
    engine.next()
    setRound({ ...engine.current })
    setLandedLetter(null)
    setTimeout(drawAndSpin, AUTO_SPIN_DELAY_MS)
  }, [drawAndSpin, engine, spinning])

  // The letter stamp: one orchestrated moment answering the landing.
  const stamp = useSharedValue(0)
  useEffect(() => {
    stamp.value = landedLetter ? withSpring(1, { damping: 9, stiffness: 260, mass: 0.7 }) : 0
  }, [landedLetter, stamp])
  const stampStyle = useAnimatedStyle(() => ({
    opacity: stamp.value,
    transform: [{ scale: 0.2 + 0.8 * stamp.value }, { rotate: `${-16 + 9 * stamp.value}deg` }],
  }))

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : spacing.s }]}>
        <Text style={styles.headerTitle}>Think Fast!</Text>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.language}
            onPress={() => router.replace('/?switch=1')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Text style={styles.iconButtonText}>{LANGUAGE_FLAGS[lang]}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.sound}
            onPress={toggleMuted}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Text style={styles.iconButtonText}>{muted ? '🔇' : '🔊'}</Text>
          </Pressable>
        </View>
      </View>

      {/* category ticket with the letter stamp */}
      <View
        style={styles.ticket}
        accessibilityLabel={
          landedLetter ? challengeSentence(lang, categoryLabel, landedLetter) : categoryLabel
        }
      >
        <Text style={styles.ticketIcon}>{round.category.icon}</Text>
        <Text style={styles.ticketLabel} numberOfLines={2}>
          {categoryLabel}
        </Text>
        {landedLetter ? (
          <Animated.View style={[styles.stamp, stampStyle]}>
            <Text style={styles.stampLetter}>{landedLetter}</Text>
          </Animated.View>
        ) : (
          <Text style={styles.stampHint}>{s.tapToSpin}</Text>
        )}
      </View>

      {/* the wheel */}
      <View style={styles.wheelWrap}>
        <Wheel
          ref={wheelRef}
          letters={LETTERS[lang]}
          hubLabel={s.spin}
          onSpinRequest={drawAndSpin}
          onLand={handleLand}
          disabled={spinning}
        />
      </View>

      {/* actions */}
      <View
        style={[styles.actions, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.m }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.respin}
          disabled={spinning}
          onPress={drawAndSpin}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonText}>{s.respin}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.next}
          disabled={spinning}
          onPress={handleNext}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>{s.next}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: type.header,
    color: palette.cream,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: palette.inkDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 20,
  },
  ticket: {
    ...shadow,
    marginTop: spacing.m,
    width: '88%',
    maxWidth: 420,
    backgroundColor: palette.cream,
    borderRadius: radius.ticket,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: 84,
  },
  ticketIcon: {
    fontSize: 34,
  },
  ticketLabel: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: type.category,
    color: palette.ink,
  },
  stamp: {
    width: 64,
    height: 64,
    borderRadius: radius.stamp,
    backgroundColor: palette.butter,
    borderWidth: 3,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampLetter: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: palette.ink,
  },
  stampHint: {
    maxWidth: 84,
    textAlign: 'center',
    fontFamily: fonts.text,
    fontSize: 14,
    color: palette.ink,
    opacity: 0.65,
  },
  wheelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actions: {
    width: '88%',
    maxWidth: 420,
    gap: spacing.s,
    paddingTop: spacing.m,
  },
  primaryButton: {
    backgroundColor: palette.butter,
    borderRadius: radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow,
  },
  primaryButtonText: {
    fontFamily: fonts.display,
    fontSize: type.button,
    color: palette.ink,
  },
  secondaryButton: {
    borderColor: palette.cream,
    borderWidth: 2,
    borderRadius: radius.button,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: fonts.display,
    fontSize: type.button,
    color: palette.cream,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
})
