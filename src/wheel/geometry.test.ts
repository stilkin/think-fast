import { describe, expect, it } from 'vitest'
import { landingRotation, normalize, spinDurationMs, wheelGeometry } from './geometry'

const LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWZ'.split('') // nl set, 23 letters

function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('wheelGeometry', () => {
  it('sizes segments to fill the circle', () => {
    const g = wheelGeometry(LETTERS)
    expect(g.segmentAngle).toBeCloseTo(360 / 23)
  })

  it('centers segment 0 under the pointer at rotation 0', () => {
    const g = wheelGeometry(LETTERS)
    expect(g.indexAtPointer(0)).toBe(0)
  })

  it('reads back the letter under the pointer for any rotation', () => {
    const g = wheelGeometry(LETTERS)
    for (let i = 0; i < LETTERS.length; i++) {
      const rotation = normalize(-g.centerOf(i))
      expect(g.indexAtPointer(rotation)).toBe(i)
    }
  })
})

describe('landingRotation', () => {
  it('lands the target segment under the pointer', () => {
    const g = wheelGeometry(LETTERS)
    const rng = mulberry32(23)
    for (let spin = 0; spin < 50; spin++) {
      const current = rng() * 5000
      const target = Math.floor(rng() * LETTERS.length)
      const final = landingRotation(g, target, current, rng)
      expect(g.indexAtPointer(final)).toBe(target)
    }
  })

  it('always spins forward with at least 4 revolutions', () => {
    const g = wheelGeometry(LETTERS)
    const rng = mulberry32(29)
    for (let spin = 0; spin < 20; spin++) {
      const current = rng() * 10000
      const final = landingRotation(g, Math.floor(rng() * LETTERS.length), current, rng)
      expect(final - current).toBeGreaterThanOrEqual(4 * 360)
      expect(final - current).toBeLessThanOrEqual(7 * 360)
    }
  })

  it('durations stay in the 3.8-4.3 s window', () => {
    const rng = mulberry32(31)
    for (let i = 0; i < 50; i++) {
      const ms = spinDurationMs(rng)
      expect(ms).toBeGreaterThanOrEqual(3800)
      expect(ms).toBeLessThanOrEqual(4300)
    }
  })
})
