import "@/libs/dayjs"
import "@/styles/global.css"

import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { databaseInit } from '@/database/databaseInit'
import { SQLiteProvider } from 'expo-sqlite/next'

import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans"

import { colors } from "@/styles/colors"

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded] = useFonts({
    OpenSans_600SemiBold,
    OpenSans_400Regular,
    OpenSans_700Bold,
  })

  if (fontsLoaded) {
    SplashScreen.hideAsync()
  } else {
    return
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.gray[600] }}
    >
      <StatusBar style="light" />
      <SQLiteProvider databaseName="my-goals.db" onInit={databaseInit}>
        <Slot />
      </SQLiteProvider>
    </GestureHandlerRootView>
  )
}
