import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '../../constants/Colors';

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
    <LinearGradient
      colors={[primaryBlue, primaryTeal]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        style={styles.scrollView}
      >
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={white} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.stepText}>Step 3 of 3</Text>
            <Text style={styles.title}>Set Reminder Preferences</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <LinearGradient
            colors={[lightBlue, 'rgba(91, 191, 186, 0.2)']}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <MaterialCommunityIcons
              name="calendar-clock"
              size={50}
              color={primaryTeal}
            />
          </LinearGradient>

          <Text style={styles.subtitle}>Choose when to receive reminders</Text>

          <Text style={styles.description}>
            We'll send you notifications to take your medications based on your
            preferences
          </Text>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: lightBlue }}
              thumbColor={notificationsEnabled ? primaryBlue : '#f4f3f4'}
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

          <Pressable onPress={handleComplete}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Complete Setup</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
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
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          style={styles.reminderIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialCommunityIcons name={icon as any} size={24} color={white} />
        </LinearGradient>
        <View style={styles.reminderOptionText}>
          <Text style={styles.reminderTime}>{time}</Text>
          <Text style={styles.reminderTimeDescription}>{timeDescription}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#D1D5DB', true: lightBlue }}
        thumbColor={isEnabled ? primaryBlue : '#f4f3f4'}
        ios_backgroundColor="#D1D5DB"
        onValueChange={onToggle}
        value={isEnabled}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
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
    color: white,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleLabel: {
    fontSize: 16,
    color: darkBlue,
  },
  divider: {
    height: 1,
    backgroundColor: lightBlue,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 16,
  },
  reminderOptionsList: {
    marginBottom: 24,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightBlue,
  },
  reminderOptionDisabled: {
    opacity: 0.6,
  },
  reminderOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderOptionText: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: '600',
    color: darkBlue,
  },
  reminderTimeDescription: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 