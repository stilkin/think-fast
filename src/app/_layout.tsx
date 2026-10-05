import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GameProvider, useGame } from '../game/GameState'
import { palette } from '../ui/theme'

SplashScreen.preventAutoHideAsync().catch(() => {})

const FONTS = {
  'Fredoka-Medium': require('../../assets/fonts/fredoka-v17-latin_latin-ext-500.ttf'),
  'Fredoka-SemiBold': require('../../assets/fonts/fredoka-v17-latin_latin-ext-600.ttf'),
}

function RootNavigator() {
  const { hydrated } = useGame()
  const [fontsLoaded] = useFonts(FONTS)
  const ready = hydrated && fontsLoaded

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {})
  }, [ready])

  if (!ready) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.ink },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </GameProvider>
    </SafeAreaProvider>
  )
}
