import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PACKS, type Pack } from '../data/categories'
import { type PackSelection, TIMER_DURATIONS, type TimerSeconds, useGame } from '../game/GameState'
import { stringsFor } from '../i18n/strings'
import { fonts, palette, radius, shadow, spacing, type } from '../ui/theme'

/** The developer's tip jar (kofi spec): opened in the browser, never blocking. */
const KOFI_URL = 'https://ko-fi.com/stilkin'

/** The app's privacy policy (game-settings spec): same quiet footer treatment. */
const PRIVACY_URL = 'https://think-fast.pocito.fyi/privacy'

/**
 * Settings (game-settings spec): Kids master switch above the pack toggles,
 * timer on/off with discrete duration chips. State lives in the provider —
 * this route is dumb chrome on top, so back returns to an unchanged game.
 */
export default function SettingsScreen() {
  const {
    lang: chosenLang,
    packs,
    kids,
    timerEnabled,
    timerSeconds,
    setPacks,
    setKids,
    setTimerEnabled,
    setTimerSeconds,
  } = useGame()
  const lang = chosenLang ?? 'en'
  const s = stringsFor(lang)
  const insets = useSafeAreaInsets()

  const packList = Object.keys(PACKS) as Pack[]
  const enabledCount = packList.filter((p) => packs[p]).length

  /** The last enabled pack stays on: the active set is never empty. */
  const togglePack = (pack: Pack) => {
    if (kids) return // Kids mode owns the filter while it is on
    if (packs[pack] && enabledCount === 1) return
    const next: PackSelection = { ...packs, [pack]: !packs[pack] }
    setPacks(next)
  }

  return (
    <View style={styles.screen}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : spacing.s }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.back}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Text style={styles.iconButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{s.settings}</Text>
        {/* invisible spacer balances the back button, centering the title */}
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.l },
        ]}
      >
        {/* Kids mode: master switch over the packs (design D1) */}
        <View style={styles.card}>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: kids }}
            onPress={() => setKids(!kids)}
            disabled={false}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>{s.kidsMode}</Text>
            <Switch
              value={kids}
              onValueChange={() => setKids(!kids)}
              trackColor={{ false: '#4A3F7A', true: palette.butter }}
              thumbColor={palette.cream}
            />
          </Pressable>
          <Text style={styles.hint}>{s.kidsModeHint}</Text>
        </View>

        {/* pack toggles — remember the selection, greyed out under Kids mode */}
        <View style={[styles.card, kids && styles.cardDisabled]}>
          <Text style={styles.sectionLabel}>{s.packsSection}</Text>
          {packList.map((pack) => (
            <Pressable
              key={pack}
              accessibilityRole="switch"
              accessibilityState={{ checked: packs[pack], disabled: kids }}
              onPress={() => togglePack(pack)}
              disabled={kids}
              style={({ pressed }) => [
                styles.row,
                kids && styles.rowDisabled,
                pressed && !kids && styles.rowPressed,
              ]}
            >
              <Text style={[styles.rowLabel, kids && styles.labelDisabled]}>
                {PACKS[pack][lang]}
              </Text>
              <Switch
                value={packs[pack]}
                onValueChange={() => togglePack(pack)}
                disabled={kids}
                trackColor={{
                  false: kids ? '#A9A2BC' : '#4A3F7A',
                  true: kids ? '#D8CFB4' : palette.butter,
                }}
                thumbColor={kids ? '#E8E2D2' : palette.cream}
              />
            </Pressable>
          ))}
        </View>

        {/* round timer */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{s.timerSection}</Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: timerEnabled }}
            onPress={() => setTimerEnabled(!timerEnabled)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>{s.timerSection}</Text>
            <Switch
              value={timerEnabled}
              onValueChange={() => setTimerEnabled(!timerEnabled)}
              trackColor={{ false: '#4A3F7A', true: palette.butter }}
              thumbColor={palette.cream}
            />
          </Pressable>
          <Text style={styles.chipsLabel}>{s.timerLength}</Text>
          <View style={styles.chips}>
            {TIMER_DURATIONS.map((seconds) => {
              const selected = timerSeconds === seconds
              return (
                <Pressable
                  key={seconds}
                  accessibilityRole="button"
                  accessibilityLabel={`${seconds} s`}
                  accessibilityState={{ selected, disabled: !timerEnabled }}
                  onPress={() => setTimerSeconds(seconds as TimerSeconds)}
                  disabled={!timerEnabled}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    !timerEnabled && styles.chipsDisabled,
                    pressed && timerEnabled && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {seconds} s
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* footer links (kofi + game-settings specs): support first, then the
            quieter text-only privacy link — the bottom of the bottom */}
        <View style={styles.footer}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={s.supportKoFi}
            onPress={() => Linking.openURL(KOFI_URL)}
            style={({ pressed }) => [styles.footerLink, pressed && styles.rowPressed]}
          >
            <Text style={styles.kofiEmoji}>☕</Text>
            <Text style={styles.footerText}>{s.supportKoFi}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={s.privacyPolicy}
            onPress={() => Linking.openURL(PRIVACY_URL)}
            style={({ pressed }) => [styles.footerLink, pressed && styles.rowPressed]}
          >
            <Text style={styles.footerText}>{s.privacyPolicy}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: type.header,
    color: palette.cream,
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
    fontSize: 28,
    lineHeight: 32,
    color: palette.cream,
    marginTop: -4,
  },
  scroll: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    gap: spacing.m,
  },
  card: {
    ...shadow,
    width: '100%',
    maxWidth: 420,
    backgroundColor: palette.cream,
    borderRadius: radius.ticket,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    gap: spacing.m,
  },
  rowPressed: {
    opacity: 0.75,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  cardDisabled: {
    opacity: 0.75,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    color: palette.ink,
  },
  labelDisabled: {
    opacity: 0.6,
  },
  hint: {
    fontFamily: fonts.text,
    fontSize: 14,
    color: palette.ink,
    opacity: 0.65,
    paddingBottom: spacing.s,
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: palette.ink,
    opacity: 0.6,
    textTransform: 'uppercase',
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  chipsLabel: {
    fontFamily: fonts.text,
    fontSize: 14,
    color: palette.ink,
    opacity: 0.65,
    paddingTop: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.s,
    paddingVertical: spacing.s,
  },
  chip: {
    flex: 1,
    borderWidth: 2,
    borderColor: palette.ink,
    borderRadius: radius.button,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: palette.butter,
  },
  chipsDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: palette.ink,
  },
  chipTextSelected: {
    color: palette.ink,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.s,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingVertical: 12,
    paddingHorizontal: spacing.l,
  },
  kofiEmoji: {
    fontSize: 15,
    color: palette.coral,
  },
  footerText: {
    fontFamily: fonts.text,
    fontSize: 14,
    color: palette.cream,
    opacity: 0.65,
  },
})
