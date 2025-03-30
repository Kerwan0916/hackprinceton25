import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, offWhite } from '@/constants/Colors';

export default function OnboardingLayout() {
  return (
    <LinearGradient
      colors={[primaryBlue, primaryTeal]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="health-info" />
        <Stack.Screen name="medications" />
      </Stack>
    </LinearGradient>
  );
} 