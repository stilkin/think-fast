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
import { LANGS, type Lang } from '../data/categories'
import { initSound, setMuted as setSoundMuted } from '../sound/sound'
import { GameEngine } from './engine'

const LANG_KEY = 'tf.lang'
const MUTED_KEY = 'tf.muted'

interface GameContextValue {
  /** true once preferences are loaded from storage */
  hydrated: boolean
  /** chosen language, null until the player picks one */
  lang: Lang | null
  muted: boolean
  engine: GameEngine
  setLang: (lang: Lang) => void
  toggleMuted: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<GameEngine | null>(null)
  if (!engineRef.current) engineRef.current = new GameEngine('en')
  const engine = engineRef.current

  const [hydrated, setHydrated] = useState(false)
  const [lang, setLangState] = useState<Lang | null>(null)
  const [muted, setMutedState] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANG_KEY)
        const storedMuted = await AsyncStorage.getItem(MUTED_KEY)
        if (cancelled) return
        if (storedLang && LANGS.includes(storedLang as Lang)) {
          engine.setLanguage(storedLang as Lang)
          setLangState(storedLang as Lang)
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

  const value = useMemo(
    () => ({ hydrated, lang, muted, engine, setLang, toggleMuted }),
    [hydrated, lang, muted, engine, setLang, toggleMuted],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used inside <GameProvider>')
  return context
}
