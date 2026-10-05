import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { Circle, Svg } from 'react-native-svg'
import { playBuzzer, playTock } from '../sound/sound'
import { fonts, palette } from '../ui/theme'

/**
 * The round countdown (round-timer spec, design D9): a ring around the letter
 * stamp draining butter -> tangerine -> coral, the seconds visible, a tock
 * once per second over the final five, and a buzzer + color-only expired
 * state at zero. One JS-side clock owns everything time-related; Reanimated
 * animates only the ring drain. Started on landing (~300 ms grace after the
 * stamp settles), cancelled — never paused — by any round action, which skips
 * the buzzer by construction.
 */

export interface RoundTimerHandle {
  /** Start (or restart) the countdown for a fresh landing. */
  start: () => void
  /** Cancel without the buzzer and hide the ring until the next start. */
  cancel: () => void
}

interface RoundTimerProps {
  durationMs: number
  /** Fires once when the countdown reaches zero (buzzer already played). */
  onExpire?: () => void
  /** The letter stamp this ring wraps. */
  children: ReactNode
}

const GRACE_MS = 300
const RING_R = 44
const CIRC = 2 * Math.PI * RING_R

/**
 * Reanimated's animatedProps do not live-update react-native-svg on web, so
 * the ring falls back there to props derived from the per-second state
 * (stepped drain). Native keeps the smooth 60 fps drain.
 */
const IS_WEB = Platform.OS === 'web'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const RoundTimer = forwardRef<RoundTimerHandle, RoundTimerProps>(function RoundTimer(
  { durationMs, onExpire, children },
  ref,
) {
  /** 1 = full time left, drains to 0 — the ring's visual truth. */
  const progress = useSharedValue(0)
  const ticker = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [visible, setVisible] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [expired, setExpired] = useState(false)

  const stopClock = useCallback(() => {
    if (ticker.current) clearTimeout(ticker.current)
    ticker.current = null
  }, [])

  const cancel = useCallback(() => {
    stopClock()
    cancelAnimation(progress)
    setVisible(false)
    setExpired(false)
    setSecondsLeft(0)
  }, [progress, stopClock])

  const start = useCallback(() => {
    cancel()
    const total = Math.max(1, Math.round(durationMs / 1000))
    setVisible(true)
    setSecondsLeft(total)
    // Linear so the drain keeps exact pace with the seconds (the default
    // ease-in-out rushes the middle and reads as finishing early).
    progress.value = 1
    progress.value = withDelay(
      GRACE_MS,
      withTiming(0, { duration: durationMs, easing: Easing.linear }),
    )

    // The clock: badge, tocks, buzzer and expiry, one tick per second. Each
    // tick re-arms against its absolute deadline — RN's setInterval re-arms
    // from callback time, so jank would accumulate and drift the clock away
    // from the ring; setTimeout on a fixed grid cannot.
    const idealBase = Date.now() + GRACE_MS
    const fire = (tick: number) => {
      const remaining = total - tick
      setSecondsLeft(Math.max(0, remaining))
      if (remaining <= 0) {
        stopClock()
        playBuzzer()
        setExpired(true)
        onExpire?.()
        return
      }
      if (remaining <= 5) playTock()
      ticker.current = setTimeout(
        () => fire(tick + 1),
        Math.max(0, idealBase + (tick + 1) * 1000 - Date.now()),
      )
    }
    ticker.current = setTimeout(() => fire(1), GRACE_MS + 1000)
  }, [cancel, durationMs, onExpire, progress, stopClock])

  useImperativeHandle(ref, () => ({ start, cancel }), [start, cancel])

  // Never leave a clock running behind an unmounted ring.
  useEffect(() => stopClock, [stopClock])

  // Ring visuals. Native: smoothly driven by the shared value; web: stepped
  // once per second off the badge state.
  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - progress.value),
    stroke: interpolateColor(
      progress.value,
      [0, 0.25, 0.5],
      [palette.coral, palette.tangerine, palette.butter],
    ),
  }))
  const totalSeconds = Math.max(1, Math.round(durationMs / 1000))
  const fractionLeft = secondsLeft / totalSeconds
  const webStroke =
    fractionLeft > 0.5 ? palette.butter : fractionLeft > 0.25 ? palette.tangerine : palette.coral
  const webDashOffset = CIRC * (1 - fractionLeft)

  return (
    <View style={styles.wrap} pointerEvents="none">
      {visible && (
        <Svg viewBox="0 0 96 96" style={styles.ring}>
          <Circle
            cx={48}
            cy={48}
            r={RING_R}
            fill="none"
            stroke={palette.ink}
            strokeOpacity={0.12}
            strokeWidth={5}
          />
          {IS_WEB ? (
            <Circle
              cx={48}
              cy={48}
              r={RING_R}
              fill="none"
              stroke={webStroke}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={webDashOffset}
              transform="rotate(-90 48 48)"
            />
          ) : (
            <AnimatedCircle
              cx={48}
              cy={48}
              r={RING_R}
              fill="none"
              stroke={palette.butter}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              transform="rotate(-90 48 48)"
              animatedProps={ringProps}
            />
          )}
        </Svg>
      )}
      {children}
      {visible && (
        <View style={[styles.badge, expired && styles.badgeExpired]}>
          <Text style={styles.badgeText}>{secondsLeft}s</Text>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  wrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    inset: 0,
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    minWidth: 34,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: palette.ink,
    alignItems: 'center',
  },
  badgeExpired: {
    backgroundColor: palette.coral,
  },
  badgeText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: palette.cream,
  },
})
