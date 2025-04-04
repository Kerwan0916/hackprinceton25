import { useFonts } from 'expo-font';

import { Stack, Slot, SplashScreen } from 'expo-router';
import { View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GoogleGenAI } from "@google/genai";
import { MedicationProvider } from './context/MedicationContext';

// Import API key or use a placeholder
let GOOGLE_API_KEY = "";
try {
  GOOGLE_API_KEY = require('@/constants/api').GOOGLE_API_KEY;
} catch (error) {
  console.warn("API key not found, using empty string");
}

import { useColorScheme } from '@/hooks/useColorScheme';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Simulate resource loading
    setTimeout(() => {
      SplashScreen.hideAsync();
      setLoaded(true);
    }, 1000);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" redirect={true} options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </MedicationProvider>
    </SafeAreaProvider>
  );
}
