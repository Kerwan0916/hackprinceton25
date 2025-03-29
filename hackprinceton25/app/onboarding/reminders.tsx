import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RemindersScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTimes, setReminderTimes] = useState({
    morning: true,
    afternoon: true,
    evening: true,
    bedtime: true,
  });

  const toggleReminderTime = (time: keyof typeof reminderTimes) => {
    setReminderTimes({
      ...reminderTimes,
      [time]: !reminderTimes[time],
    });
  };

  const handleComplete = () => {
    // Navigate to the main app
    router.push('/(tabs)' as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2473B3" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
          <Text style={styles.title}>Set Reminder Preferences</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={50}
            color="#1E5C8D"
          />
        </View>

        <Text style={styles.subtitle}>Choose when to receive reminders</Text>

        <Text style={styles.description}>
          We'll send you notifications to take your medications based on your
          preferences
        </Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#91C9F4' }}
            thumbColor={notificationsEnabled ? '#2473B3' : '#f4f3f4'}
            ios_backgroundColor="#D1D5DB"
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Reminder Times</Text>

        <View style={styles.reminderOptionsList}>
          <ReminderOption
            icon="weather-sunset-up"
            time="Morning"
            timeDescription="8:00 AM"
            isEnabled={reminderTimes.morning}
            onToggle={() => toggleReminderTime('morning')}
            disabled={!notificationsEnabled}
          />

          <ReminderOption
            icon="weather-sunny"
            time="Afternoon"
            timeDescription="12:00 PM"
            isEnabled={reminderTimes.afternoon}
            onToggle={() => toggleReminderTime('afternoon')}
            disabled={!notificationsEnabled}
          />

          <ReminderOption
            icon="weather-sunset-down"
            time="Evening"
            timeDescription="6:00 PM"
            isEnabled={reminderTimes.evening}
            onToggle={() => toggleReminderTime('evening')}
            disabled={!notificationsEnabled}
          />

          <ReminderOption
            icon="weather-night"
            time="Bedtime"
            timeDescription="10:00 PM"
            isEnabled={reminderTimes.bedtime}
            onToggle={() => toggleReminderTime('bedtime')}
            disabled={!notificationsEnabled}
          />
        </View>

        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Complete Setup</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

interface ReminderOptionProps {
  icon: string;
  time: string;
  timeDescription: string;
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function ReminderOption({
  icon,
  time,
  timeDescription,
  isEnabled,
  onToggle,
  disabled = false,
}: ReminderOptionProps) {
  return (
    <View
      style={[
        styles.reminderOption,
        disabled && styles.reminderOptionDisabled,
      ]}
    >
      <View style={styles.reminderOptionLeft}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#2473B3" />
        <View style={styles.reminderOptionText}>
          <Text style={styles.reminderTime}>{time}</Text>
          <Text style={styles.reminderTimeDescription}>{timeDescription}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#D1D5DB', true: '#91C9F4' }}
        thumbColor={isEnabled ? '#2473B3' : '#f4f3f4'}
        ios_backgroundColor="#D1D5DB"
        onValueChange={onToggle}
        value={isEnabled}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  stepText: {
    fontSize: 14,
    color: '#2473B3',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E2A47',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E2A47',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#496583',
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#0E2A47',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E7FF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E2A47',
    marginBottom: 16,
  },
  reminderOptionsList: {
    marginBottom: 24,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reminderOptionDisabled: {
    opacity: 0.5,
  },
  reminderOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderOptionText: {
    marginLeft: 12,
  },
  reminderTime: {
    fontSize: 16,
    color: '#0E2A47',
    fontWeight: '500',
  },
  reminderTimeDescription: {
    fontSize: 14,
    color: '#6C87A0',
  },
  button: {
    backgroundColor: '#2473B3',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 