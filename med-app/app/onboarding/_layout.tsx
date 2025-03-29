import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#E3F2F9' }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#E3F2F9' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="health-info" />
        <Stack.Screen name="medications" />
        <Stack.Screen name="reminders" />
      </Stack>
    </View>
  );
} 