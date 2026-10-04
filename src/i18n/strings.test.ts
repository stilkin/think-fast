import { describe, expect, it } from 'vitest'
import { LANGS } from '../data/categories'
import { STRINGS } from './strings'

describe('ui strings', () => {
  it('every language defines every key, non-empty', () => {
    const keys = Object.keys(STRINGS.en) as Array<keyof typeof STRINGS.en>
    expect(keys.length).toBeGreaterThan(0)
    for (const lang of LANGS) {
      for (const key of keys) {
        expect(STRINGS[lang][key], `${lang}.${key}`).toBeTruthy()
      }
    }
  })

  it('saySomething keeps both placeholders in every language', () => {
    for (const lang of LANGS) {
      expect(STRINGS[lang].saySomething).toContain('{category}')
      expect(STRINGS[lang].saySomething).toContain('{letter}')
    }
  })
})
