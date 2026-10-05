import { describe, expect, it } from 'vitest'
import { CATEGORIES, LETTERS } from '../data/categories'
import { Bag, GameEngine } from './engine'

/** Deterministic PRNG so bag/cycle assertions are stable. */
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

describe('Bag', () => {
  it('yields every item exactly once per cycle', () => {
    const bag = new Bag([1, 2, 3, 4, 5], mulberry32(7))
    const drawn = Array.from({ length: 5 }, () => bag.draw())
    expect(new Set(drawn).size).toBe(5)
  })

  it('refills after a full cycle', () => {
    const bag = new Bag(['a', 'b'], mulberry32(11))
    bag.draw()
    bag.draw()
    expect(bag.draw()).toBeTruthy() // from the refill
  })
})

describe('GameEngine', () => {
  it('spins the full letter set exactly once per cycle', () => {
    const engine = new GameEngine('nl', mulberry32(3))
    const letters = Array.from({ length: LETTERS.nl.length }, () => engine.spin())
    expect([...new Set(letters)].sort()).toEqual([...LETTERS.nl].sort())
  })

  it('starts a new cycle after the set is exhausted', () => {
    const engine = new GameEngine('de', mulberry32(5))
    const first = Array.from({ length: LETTERS.de.length }, () => engine.spin())
    const nextLetter = engine.spin()
    expect(first).toContain(nextLetter) // repeat only allowed now
  })

  it('spinning keeps the category (Re-spin semantics)', () => {
    const engine = new GameEngine('en', mulberry32(9))
    const before = engine.current.category
    engine.spin()
    engine.spin()
    expect(engine.current.category).toBe(before)
  })

  it('shows every category exactly once per cycle', () => {
    const engine = new GameEngine('fr', mulberry32(13))
    const seen = [engine.current.category.id]
    for (let i = 1; i < CATEGORIES.length; i++) seen.push(engine.next().id)
    expect(new Set(seen).size).toBe(CATEGORIES.length)
  })

  it('next clears the letter and moves to an unseen category', () => {
    const engine = new GameEngine('en', mulberry32(17))
    engine.spin()
    const previous = engine.current.category
    engine.next()
    expect(engine.current.letter).toBeNull()
    expect(engine.current.category).not.toBe(previous)
  })

  it('switching language resets the letter cycle to the new set', () => {
    const engine = new GameEngine('en', mulberry32(19))
    engine.spin() // an English letter
    engine.setLanguage('fr')
    const letters = Array.from({ length: LETTERS.fr.length }, () => engine.spin())
    expect([...new Set(letters)].sort()).toEqual([...LETTERS.fr].sort())
  })

  it('switching language clears the current letter but keeps the category', () => {
    const engine = new GameEngine('en', mulberry32(23))
    engine.spin()
    const category = engine.current.category
    engine.setLanguage('nl')
    expect(engine.current.letter).toBeNull()
    expect(engine.current.category).toBe(category)
  })

  it('draws only from the active set after a filter change', () => {
    const engine = new GameEngine('en', mulberry32(29))
    const thematic = CATEGORIES.filter((c) => c.pack === 'thematisch')
    engine.setFilter(thematic)
    const drawn = [engine.current.category, ...Array.from({ length: 9 }, () => engine.next())]
    for (const category of drawn) expect(category.pack).toBe('thematisch')
  })

  it('filters keep the no-repeat cycle over the active set', () => {
    const engine = new GameEngine('en', mulberry32(31))
    const kids = CATEGORIES.filter((c) => c.kid)
    engine.setFilter(kids)
    const seen = [engine.current.category.id]
    for (let i = 1; i < kids.length; i++) seen.push(engine.next().id)
    expect(new Set(seen).size).toBe(kids.length)
  })

  it('filter change starts a fresh round from the new set', () => {
    const engine = new GameEngine('en', mulberry32(37))
    engine.spin()
    const kids = CATEGORIES.filter((c) => c.kid)
    engine.setFilter(kids)
    expect(engine.current.letter).toBeNull()
    expect(kids).toContain(engine.current.category)
  })

  it('letter cycle survives a filter change', () => {
    const engine = new GameEngine('nl', mulberry32(41))
    engine.setFilter(CATEGORIES.filter((c) => c.pack === 'basis'))
    engine.spin() // one letter consumed before the filter change
    engine.setFilter(CATEGORIES.filter((c) => c.kid))
    const rest = Array.from({ length: LETTERS.nl.length - 1 }, () => engine.spin())
    // the bag continues: a full sweep still covers every letter exactly once
    const drawn = new Set(rest)
    expect(drawn.size).toBe(LETTERS.nl.length - 1)
  })
})
