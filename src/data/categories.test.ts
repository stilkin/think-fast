import { describe, expect, it } from 'vitest'
import { CATEGORIES, LANGS, LETTERS, type Pack } from './categories'

const KNOWN_PACKS: readonly Pack[] = ['basis', 'gevorderd', 'thematisch']

describe('letter sets', () => {
  it.each([...LANGS])('%s excludes the right rare initials', (lang) => {
    const letters = LETTERS[lang]
    expect(letters).not.toContain('X')
    if (lang === 'nl' || lang === 'de') {
      expect(letters).not.toContain('Q')
      expect(letters).not.toContain('Y')
    }
    if (lang === 'en') expect(letters).not.toContain('Q')
    if (lang === 'fr') {
      expect(letters).not.toContain('K')
      expect(letters).not.toContain('W')
      expect(letters).not.toContain('Y')
    }
  })

  it.each([...LANGS])('%s has the expected size with no duplicates', (lang) => {
    const letters = LETTERS[lang]
    const expected = lang === 'en' ? 24 : lang === 'fr' ? 22 : 23
    expect(letters).toHaveLength(expected)
    expect(new Set(letters).size).toBe(expected)
  })
})

describe('category data contract', () => {
  it('has at least 40 entries', () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(40)
  })

  it('has unique ids', () => {
    const seen = new Set<string>()
    const duplicates: string[] = []
    for (const c of CATEGORIES) {
      if (seen.has(c.id)) duplicates.push(c.id)
      seen.add(c.id)
    }
    expect(`duplicate ids: ${duplicates.join(', ')}`).toBe('duplicate ids: ')
  })

  it('every entry has a non-empty English label', () => {
    const offenders = CATEGORIES.filter((c) => !c.label.en?.trim()).map((c) => c.id)
    expect(`missing English label: ${offenders.join(', ')}`).toBe('missing English label: ')
  })

  it('every entry has a known pack', () => {
    const offenders = CATEGORIES.filter((c) => !KNOWN_PACKS.includes(c.pack)).map((c) => c.id)
    expect(`unknown pack: ${offenders.join(', ')}`).toBe('unknown pack: ')
  })

  it('shipped set is labeled in all four languages', () => {
    const offenders = CATEGORIES.flatMap((c) =>
      LANGS.filter((lang) => !c.label[lang]?.trim()).map((lang) => `${c.id} (${lang})`),
    )
    expect(`missing labels: ${offenders.join(', ')}`).toBe('missing labels: ')
  })

  it('covers the classic base list', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id))
    const required = [
      'animals',
      'pets',
      'jobs',
      'vegetables',
      'fruit',
      'cities',
      'countries',
      'vehicles',
      'furniture',
      'colors',
      'european-capitals',
      'famous-people',
      'brands',
      'sports',
      'movies',
      'bands',
      'supermarket',
      'farm',
    ]
    const missing = required.filter((id) => !ids.has(id))
    expect(`missing base-list categories: ${missing.join(', ')}`).toBe(
      'missing base-list categories: ',
    )
  })
})
