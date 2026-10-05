import { CATEGORIES, type Category, type Lang, LETTERS } from '../data/categories'

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Draws uniformly without replacement; refills (reshuffled) once empty,
 * so a full cycle sees every item exactly once.
 */
export class Bag<T> {
  private pool: T[] = []

  constructor(
    private readonly source: readonly T[],
    private readonly rng: () => number = Math.random,
  ) {}

  draw(): T {
    if (this.pool.length === 0) this.pool = shuffle(this.source, this.rng)
    return this.pool.pop() as T
  }
}

export interface Round {
  category: Category
  /** null until the wheel has been spun for this round */
  letter: string | null
}

/**
 * Round flow per the game-loop spec: spin keeps the category and draws a new
 * letter; next advances to a not-yet-shown category and clears the letter.
 * Switching language resets the letter cycle (letter-wheel spec) but never
 * the category cycle. Changing the active set (setFilter) rebuilds the
 * category bag and starts a fresh round; the letter cycle is untouched.
 */
export class GameEngine {
  private categories: Bag<Category>
  private letters: Bag<string>
  private round: Round

  constructor(
    private lang: Lang,
    private readonly rng: () => number = Math.random,
  ) {
    this.categories = new Bag(CATEGORIES, rng)
    this.letters = new Bag(LETTERS[lang], rng)
    this.round = { category: this.categories.draw(), letter: null }
  }

  get current(): Round {
    return this.round
  }

  setLanguage(lang: Lang): void {
    if (lang === this.lang) return
    this.lang = lang
    this.letters = new Bag(LETTERS[lang], this.rng)
    this.round = { ...this.round, letter: null }
  }

  /**
   * Narrow draws to the active set (enabled packs, or kid entries in Kids
   * mode). Rebuilds the category bag and starts a fresh round, mirroring
   * the language-switch pattern; the letter bag is untouched.
   */
  setFilter(active: readonly Category[]): void {
    this.categories = new Bag(active, this.rng)
    this.round = { category: this.categories.draw(), letter: null }
  }

  /** Spin the wheel (also serves Re-spin): same category, fresh letter. */
  spin(): string {
    const letter = this.letters.draw()
    this.round = { ...this.round, letter }
    return letter
  }

  /** Advance to the next category; the letter is cleared (UI auto-spins). */
  next(): Category {
    const category = this.categories.draw()
    this.round = { category, letter: null }
    return category
  }
}
