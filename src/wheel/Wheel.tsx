import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Pressable, useWindowDimensions, View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Path, Polygon, Text } from 'react-native-svg'
import { playChime, playTick } from '../sound/sound'
import { fonts, palette, SEGMENT_COLORS } from '../ui/theme'
import { landingRotation, spinDurationMs, wheelGeometry } from './geometry'

/**
 * The letter wheel: a fixed fairground frame (rim, bulbs, pointer, hub) with
 * the segment disc rotating inside it. The outcome is decided before the
 * animation starts (design D3) — spinTo(letter) animates to that letter.
 */

export interface WheelHandle {
  /** Animate a spin that lands on `letter`; ignored while already spinning. */
  spinTo: (letter: string) => void
}

interface WheelProps {
  letters: readonly string[]
  /** label in the hub, e.g. the localized "SPIN" */
  hubLabel: string
  onSpinRequest: () => void
  onLand: (letter: string) => void
  disabled?: boolean
  size?: number
}

const C = 50
const SEGMENT_R = 42
const RIM_R = 48

// 0deg is the top pointer; -90 shifts math coordinates (0rad = +x axis).
const pointAt = (radius: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: C + radius * Math.cos(rad), y: C + radius * Math.sin(rad) }
}

export const Wheel = forwardRef<WheelHandle, WheelProps>(function Wheel(
  { letters, hubLabel, onSpinRequest, onLand, disabled = false, size },
  ref,
) {
  const { width, height } = useWindowDimensions()
  const wheelSize = size ?? Math.min(width - 32, height * 0.46, 400)

  const geometry = useMemo(() => wheelGeometry(letters), [letters])
  const rotation = useSharedValue(0)
  const spinning = useSharedValue(false)
  const reduceMotion = useReducedMotion()

  const segments = useMemo(
    () =>
      geometry.letters.map((letter, i) => {
        const half = geometry.segmentAngle / 2
        const center = geometry.centerOf(i)
        const start = pointAt(SEGMENT_R, center - half)
        const end = pointAt(SEGMENT_R, center + half)
        const largeArc = geometry.segmentAngle > 180 ? 1 : 0
        const d = `M ${C} ${C} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${SEGMENT_R} ${SEGMENT_R} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`
        const letterPos = pointAt(SEGMENT_R * 0.7, center)
        return {
          d,
          color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
          letter,
          letterPos,
          textRotation: center,
        }
      }),
    [geometry],
  )

  // Rim bulbs: fixed frame detail, like a fairground wheel at dusk.
  const bulbs = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (360 / 16) * i
        const pos = pointAt(RIM_R, angle)
        return { ...pos, angle, color: i % 2 === 0 ? palette.butter : palette.cream }
      }),
    [],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: shared values are stable refs read at call time
  useImperativeHandle(
    ref,
    () => ({
      spinTo: (letter: string) => {
        const index = geometry.letters.indexOf(letter)
        if (index < 0 || spinning.value) return
        spinning.value = true
        const final = landingRotation(geometry, index, rotation.value)
        rotation.value = withTiming(
          final,
          {
            duration: reduceMotion ? 350 : spinDurationMs(),
            easing: Easing.out(Easing.cubic),
          },
          (finished) => {
            spinning.value = false
            if (finished) {
              runOnJS(playChime)()
              runOnJS(onLand)(letter)
            }
          },
        )
      },
    }),
    [geometry, onLand, reduceMotion],
  )

  // One tick each time a segment boundary passes the pointer.
  useAnimatedReaction(
    () => Math.floor(rotation.value / geometry.segmentAngle),
    (current, previous) => {
      if (current !== null && previous !== null && current !== previous && !reduceMotion) {
        runOnJS(playTick)()
      }
    },
    [geometry.letters, geometry.segmentAngle, reduceMotion],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <View style={{ width: wheelSize, height: wheelSize }}>
      {/* frame: rim + bulbs (bottom layer) */}
      <Svg
        viewBox="0 0 100 100"
        width={wheelSize}
        height={wheelSize}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Circle cx={C} cy={C} r={RIM_R} fill={palette.inkDeep} />
        {bulbs.map((b) => (
          <Circle key={b.angle} cx={b.x} cy={b.y} r={1.7} fill={b.color} />
        ))}
      </Svg>

      {/* rotating disc: colored segments + letters */}
      <Animated.View style={[{ position: 'absolute', inset: 0 }, animatedStyle]}>
        <Svg viewBox="0 0 100 100" width={wheelSize} height={wheelSize}>
          {segments.map((s) => (
            <Path key={s.letter} d={s.d} fill={s.color} stroke={palette.ink} strokeWidth={1.2} />
          ))}
          {segments.map((s) => (
            <Text
              key={s.letter}
              x={s.letterPos.x}
              y={s.letterPos.y}
              fontSize={7.5}
              fontFamily={fonts.display}
              fill={palette.ink}
              textAnchor="middle"
              transform={`rotate(${s.textRotation} ${s.letterPos.x} ${s.letterPos.y})`}
            >
              {s.letter}
            </Text>
          ))}
        </Svg>
      </Animated.View>

      {/* frame on top: pointer + hub (never rotate, never intercept touches) */}
      <Svg
        viewBox="0 0 100 100"
        width={wheelSize}
        height={wheelSize}
        style={{ position: 'absolute', inset: 0 }}
        pointerEvents="none"
      >
        <Polygon
          points="44,1 56,1 50,13"
          fill={palette.cream}
          stroke={palette.ink}
          strokeWidth={1.4}
        />
        <Circle cx={C} cy={C} r={13} fill={palette.cream} stroke={palette.ink} strokeWidth={1.6} />
        <Text
          x={C}
          y={C + 2.6}
          fontSize={6}
          fontFamily={fonts.display}
          fill={palette.ink}
          textAnchor="middle"
        >
          {hubLabel}
        </Text>
      </Svg>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hubLabel}
        disabled={disabled}
        onPress={onSpinRequest}
        style={{ position: 'absolute', inset: 0, borderRadius: 999 }}
      />
    </View>
  )
})
