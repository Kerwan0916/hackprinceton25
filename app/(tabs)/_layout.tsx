import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { router } from 'expo-router';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Custom AI agent button that stands out in the middle
function AIAgentButton() {
  return (
    <TouchableOpacity 
      style={styles.aiButtonContainer}
      onPress={() => router.push('/(tabs)/ai-agent' as any)}
    >
      <View style={styles.aiButton}>
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
      </View>
    </TouchableOpacity>
  );
}

// Simplified tab layout with blue and white theme
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2473B3', // Primary blue color
        tabBarInactiveTintColor: '#8A8A8A',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
       name="calendar"
       options={{
        title: 'Calendar',
        tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
       }}
       />
      <Tabs.Screen
        name="ai-agent"
        options={{
          title: 'AI Agent',
          tabBarButton: () => <AIAgentButton />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  aiButtonContainer: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2473B3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});