import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CATEGORIES, type Category, LANGS, type Lang, type Pack } from '../data/categories'
import { initSound, setMuted as setSoundMuted } from '../sound/sound'
import { GameEngine } from './engine'

const LANG_KEY = 'tf.lang'
const MUTED_KEY = 'tf.muted'
const PACKS_KEY = 'tf.packs'
const KIDS_KEY = 'tf.kids'
const TIMER_ENABLED_KEY = 'tf.timer.enabled'
const TIMER_SECONDS_KEY = 'tf.timer.seconds'

/** Which packs are enabled; defaults to everything on. */
export type PackSelection = Record<Pack, boolean>

const ALL_PACKS: PackSelection = { basis: true, gevorderd: true, thematisch: true }

export type TimerSeconds = 10 | 20 | 30
export const TIMER_DURATIONS: readonly TimerSeconds[] = [10, 20, 30]

/**
 * The active category set per the game-loop spec: every entry of the enabled
 * packs, or the kid-tagged entries when Kids mode is on (design D1/D8). The
 * provider computes it and hands it to the engine — the engine stays dumb.
 */
function activeCategories(packs: PackSelection, kids: boolean): Category[] {
  if (kids) return CATEGORIES.filter((c) => c.kid === true)
  return CATEGORIES.filter((c) => packs[c.pack])
}

/**
 * The UI keeps the active set non-empty (last pack stays on); this guard also
 * shrugs off tampered or corrupt storage instead of draining an empty bag.
 */
function applyFilter(engine: GameEngine, active: Category[]): void {
  if (active.length > 0) engine.setFilter(active)
}

function parsePackSelection(stored: string | null): PackSelection | null {
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored) as Partial<Record<Pack, unknown>>
    const packs = {} as PackSelection
    for (const pack of Object.keys(ALL_PACKS) as Pack[]) {
      if (typeof parsed[pack] !== 'boolean') return null
      packs[pack] = parsed[pack]
    }
    return packs
  } catch {
    return null
  }
}

interface GameContextValue {
  /** true once preferences are loaded from storage */
  hydrated: boolean
  /** chosen language, null until the player picks one */
  lang: Lang | null
  muted: boolean
  engine: GameEngine
  packs: PackSelection
  kids: boolean
  timerEnabled: boolean
  timerSeconds: TimerSeconds
  /** bumped on every active-set change so screens can react (fresh round + spin) */
  filterVersion: number
  setLang: (lang: Lang) => void
  toggleMuted: () => void
  setPacks: (next: PackSelection) => void
  setKids: (next: boolean) => void
  setTimerEnabled: (next: boolean) => void
  setTimerSeconds: (next: TimerSeconds) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<GameEngine | null>(null)
  if (!engineRef.current) engineRef.current = new GameEngine('en')
  const engine = engineRef.current

  const [hydrated, setHydrated] = useState(false)
  const [lang, setLangState] = useState<Lang | null>(null)
  const [muted, setMutedState] = useState(false)
  const [packs, setPacksState] = useState<PackSelection>(ALL_PACKS)
  const [kids, setKidsState] = useState(false)
  const [timerEnabled, setTimerEnabledState] = useState(false)
  const [timerSeconds, setTimerSecondsState] = useState<TimerSeconds>(20)
  const [filterVersion, setFilterVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [storedLang, storedMuted, storedPacks, storedKids, storedTimerOn, storedTimerSec] =
          await Promise.all([
            AsyncStorage.getItem(LANG_KEY),
            AsyncStorage.getItem(MUTED_KEY),
            AsyncStorage.getItem(PACKS_KEY),
            AsyncStorage.getItem(KIDS_KEY),
            AsyncStorage.getItem(TIMER_ENABLED_KEY),
            AsyncStorage.getItem(TIMER_SECONDS_KEY),
          ])
        if (cancelled) return
        if (storedLang && LANGS.includes(storedLang as Lang)) {
          engine.setLanguage(storedLang as Lang)
          setLangState(storedLang as Lang)
        }
        const restoredPacks = parsePackSelection(storedPacks)
        if (restoredPacks) setPacksState(restoredPacks)
        const restoredKids = storedKids === 'true'
        if (restoredKids) setKidsState(true)
        // A narrowed selection rebuilds the engine's bag before first render.
        if (restoredPacks || restoredKids) {
          applyFilter(engine, activeCategories(restoredPacks ?? ALL_PACKS, restoredKids))
        }
        if (storedTimerOn === 'true') setTimerEnabledState(true)
        if (storedTimerSec === '10' || storedTimerSec === '30') {
          setTimerSecondsState(Number(storedTimerSec) as TimerSeconds)
        }
        if (storedMuted === 'true') {
          setSoundMuted(true)
          setMutedState(true)
        }
      } catch {
        // storage unavailable (e.g. embedded webview): play with defaults
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [engine])

  const setLang = useCallback(
    (next: Lang) => {
      initSound()
      setLangState(next)
      engine.setLanguage(next)
      AsyncStorage.setItem(LANG_KEY, next).catch(() => {})
    },
    [engine],
  )

  const toggleMuted = useCallback(() => {
    initSound()
    setMutedState((current) => {
      const next = !current
      setSoundMuted(next)
      AsyncStorage.setItem(MUTED_KEY, String(next)).catch(() => {})
      return next
    })
  }, [])

  const setPacks = useCallback(
    (next: PackSelection) => {
      setPacksState(next)
      applyFilter(engine, activeCategories(next, kids))
      setFilterVersion((v) => v + 1)
      AsyncStorage.setItem(PACKS_KEY, JSON.stringify(next)).catch(() => {})
    },
    [engine, kids],
  )

  const setKids = useCallback(
    (next: boolean) => {
      setKidsState(next)
      applyFilter(engine, activeCategories(packs, next))
      setFilterVersion((v) => v + 1)
      AsyncStorage.setItem(KIDS_KEY, String(next)).catch(() => {})
    },
    [engine, packs],
  )

  const setTimerEnabled = useCallback((next: boolean) => {
    setTimerEnabledState(next)
    AsyncStorage.setItem(TIMER_ENABLED_KEY, String(next)).catch(() => {})
  }, [])

  const setTimerSeconds = useCallback((next: TimerSeconds) => {
    setTimerSecondsState(next)
    AsyncStorage.setItem(TIMER_SECONDS_KEY, String(next)).catch(() => {})
  }, [])

  const value = useMemo(
    () => ({
      hydrated,
      lang,
      muted,
      engine,
      packs,
      kids,
      timerEnabled,
      timerSeconds,
      filterVersion,
      setLang,
      toggleMuted,
      setPacks,
      setKids,
      setTimerEnabled,
      setTimerSeconds,
    }),
    [
      hydrated,
      lang,
      muted,
      engine,
      packs,
      kids,
      timerEnabled,
      timerSeconds,
      filterVersion,
      setLang,
      toggleMuted,
      setPacks,
      setKids,
      setTimerEnabled,
      setTimerSeconds,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used inside <GameProvider>')
  return context
}
