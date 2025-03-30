import { Image, StyleSheet, Platform, View, ScrollView, Pressable, Text } from 'react-native';
import React, { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useMedication } from '@/app/context/MedicationContext';
import { router } from 'expo-router';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, primaryBlue, primaryTeal, white } from '@/constants/Colors';
import { hoverGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/hoverGesture';
import { LinearGradient } from 'expo-linear-gradient';

function Calendar(){
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Array<{date: string; title: string; time: string}>>([
    { date: new Date().toISOString().split('T')[0], title: 'Take Medication', time: '9:00 AM' },
    { date: new Date().toISOString().split('T')[0], title: 'Doctor Appointment', time: '2:30 PM' },
    { date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], title: 'Lab Test', time: '10:00 AM' },
  ]);
  const { isDayCompleted } = useMedication();

  const addEvent = (title: string, date: Date, time: string) => {
    const dateString = date.toISOString().split('T')[0];
    setEvents([...events, { date: dateString, title, time }]);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)); 
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const renderCalendarHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.calendarHeader}>
        {days.map(day => (
          <Text key={day} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>
    );
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = events.some(event => event.date === dateString);
      const completed = isDayCompleted(date);
      
      days.push(
        <Pressable 
          key={i}
          onPress={() => selectDate(date)}
          style={({hovered}) => [
            styles.calendarDay,
            date.getDate() === selectedDate.getDate() && styles.selectedDay,
            completed && styles.completedDay,
            hovered && styles.hoveredDay
          ]}>
          <Text style={[
            styles.calendarDayText,
            date.getDate() === selectedDate.getDate() && styles.selectedDayText,
            completed && styles.completedDayText
          ]}>{i}</Text>
          {hasEvents && <View style={styles.eventDot} />}
        </Pressable>
      );
    }

    return <View style={styles.calendarGrid}>{days}</View>;
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.monthSelector}>
        <Pressable onPress={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
          <Ionicons name="chevron-back" size={24} color="#2473B3" />
        </Pressable>
        <Text style={styles.monthText}>
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable onPress={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
          <Ionicons name="chevron-forward" size={24} color="#2473B3" />
        </Pressable>
      </View>

      {renderCalendarHeader()}
      {renderCalendarDays()}

      <Pressable 
        style={({ hovered }) => [
          styles.scheduleButton,
          hovered && styles.scheduleButtonHovered
        ]}
        onPress={() => router.push('/schedule' as any)}
      >
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.scheduleButtonGradient}
        >
          <Ionicons name="calendar-outline" size={20} color={white} />
          <Text style={styles.scheduleButtonText}>See Daily Schedule</Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Events</Text>
        {events.map((event, index) => (
          <View key={index} style={styles.eventItem}>
            <View style={styles.eventTimeContainer}>
              <Ionicons name="time" size={20} color="#2473B3" />
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>User!</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#2473B3" />
        </View>
      </View>
      <Calendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2473B3',
  },
  welcomeText: {
    fontSize: 26,
    color: 'white',
  },
  nameText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0F3F9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E2A47',
  },
  medicationContent: {
    flex: 1,
  },
  reminderText: {
    fontSize: 14,
    color: '#2473B3',
    marginTop: 5,
  },
  medicalInfoCard: {
    backgroundColor: 'white',
  },
  askQuestionCard: {
    backgroundColor: 'white',
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#555',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2473B3',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDayText: {
    textAlign: 'center',
  },
  selectedDay: {
    backgroundColor: '#E0F3F9',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#2473B3',
    fontWeight: 'bold',
  },
  hoveredDay: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
    bottom: 5,
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2473B3',
  },
  eventItem: {
    padding: 15,
    backgroundColor: '#F5F9FD',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2473B3',
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventTime: {
    marginLeft: 5,
    color: '#666',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedDay: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  completedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scheduleButton: {
    marginVertical: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  scheduleButtonHovered: {
    opacity: 0.9,
  },
  scheduleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  scheduleButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
