import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import '@/global.css'
import { useColorScheme } from '@/lib/useColorScheme'
import { useColorScheme as useNativeWindColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/theme'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { setColorScheme: setNativeWindColorScheme } =
    useNativeWindColorScheme()

  useEffect(() => {
    setNativeWindColorScheme(colorScheme)
  }, [colorScheme, setNativeWindColorScheme])

  const colors = Colors[colorScheme]

  return (
    <SafeAreaProvider>
      <SafeAreaView className=" flex-1 bg-background">
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="routes-screen" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
            <Stack.Screen
              name="token-selector-screen"
              options={{
                presentation: 'card',
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </Stack>
          <StatusBar
            backgroundColor={colors.background}
            style={colorScheme === 'dark' ? 'light' : 'dark'}
          />
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
