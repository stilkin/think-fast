/**
 * Pure geometry for the letter wheel: segment layout and the math that turns
 * a chosen letter into the rotation the wheel animates to. Kept free of
 * React Native imports so it is unit-testable.
 */

export interface WheelGeometry {
  /** letters in wheel order (clockwise from the top) */
  letters: readonly string[]
  /** degrees per segment */
  segmentAngle: number
  /** clockwise angle from the top pointer to the center of segment i */
  centerOf: (index: number) => number
  /** index of the letter under the top pointer for a given wheel rotation */
  indexAtPointer: (rotation: number) => number
}

export function wheelGeometry(letters: readonly string[]): WheelGeometry {
  if (letters.length < 2) throw new Error('wheel needs at least 2 letters')
  const segmentAngle = 360 / letters.length
  // Segment i occupies [i*seg - seg/2, i*seg + seg/2) around its center, so
  // segment 0 is centered under the pointer at rotation 0.
  const centerOf = (index: number) => normalize(index * segmentAngle)
  const indexAtPointer = (rotation: number) => {
    const a = normalize(-rotation) // pointer position in wheel coordinates
    return ((Math.round(a / segmentAngle) % letters.length) + letters.length) % letters.length
  }
  return { letters, segmentAngle, centerOf, indexAtPointer }
}

/** Normalizes an angle to [0, 360). */
export function normalize(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Rotation that brings `targetIndex` under the top pointer, starting from
 * `currentRotation`: 4-6 extra revolutions plus jitter inside the segment
 * (margin keeps the pointer clearly inside, away from the edges).
 */
export function landingRotation(
  geometry: WheelGeometry,
  targetIndex: number,
  currentRotation: number,
  rng: () => number = Math.random,
): number {
  const half = geometry.segmentAngle / 2
  const margin = Math.min(3, half * 0.25)
  const jitter = (rng() * 2 - 1) * (half - margin)
  const target = normalize(-geometry.centerOf(targetIndex) + jitter)
  const delta = normalize(target - currentRotation)
  const revolutions = 4 + Math.floor(rng() * 3) // 4, 5 or 6
  return currentRotation + delta + revolutions * 360
}

/** Spin duration in ms: ~3.8-4.3 s, randomized per spin. */
export function spinDurationMs(rng: () => number = Math.random): number {
  return 3800 + rng() * 500
}
