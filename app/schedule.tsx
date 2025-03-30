import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';
import { router } from 'expo-router';
import { useMedication } from '@/app/context/MedicationContext';

// Mock data - this would come from your medication database
const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    time: '8:00 AM',
    checked: false,
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    time: '12:00 PM',
    checked: false,
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    time: '10:00 PM',
    checked: false,
  },
];

export default function ScheduleScreen() {
  const [medications, setMedications] = useState(mockMedications);
  const [allCompleted, setAllCompleted] = useState(false);
  const { markDayAsCompleted, isDayCompleted, removeCompletedDay } = useMedication();

  // Check initial completion status
  useEffect(() => {
    const today = new Date();
    if (isDayCompleted(today)) {
      setMedications(medications.map(med => ({ ...med, checked: true })));
      setAllCompleted(true);
    }
  }, []);

  const toggleMedication = (id: string) => {
    const newMedications = medications.map(med => 
      med.id === id ? { ...med, checked: !med.checked } : med
    );
    setMedications(newMedications);

    // Check if all medications are completed
    const allChecked = newMedications.every(med => med.checked);
    setAllCompleted(allChecked);

    const today = new Date();
    if (allChecked) {
      // Mark today as completed in the calendar
      markDayAsCompleted(today);
      alert('Great job! You\'ve completed all your medications for today!');
    } else {
      // If any medication is unchecked, remove the day from completed days
      removeCompletedDay(today);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryBlue, primaryTeal] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={white} />
        </Pressable>
        <Text style={styles.title}>Today's Medications</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <FontAwesome5 name="prescription-bottle-alt" size={20} color={white} />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Medications</Text>
          </View>

          <View style={styles.medicationsList}>
            {medications.map(med => (
              <Pressable
                key={med.id}
                style={({ hovered }) => [
                  styles.medicationItem,
                  hovered && styles.medicationItemHovered
                ]}
                onPress={() => toggleMedication(med.id)}
              >
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDosage}>{med.dosage}</Text>
                  <Text style={styles.medicationTime}>{med.time}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  med.checked && styles.checkboxChecked
                ]}>
                  {med.checked && (
                    <Ionicons name="checkmark" size={20} color={white} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {allCompleted && (
            <View style={styles.completionMessage}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.completionText}>All medications completed for today!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: offWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: white,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
  },
  medicationsList: {
    marginTop: 10,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: offWhite,
    borderRadius: 10,
    marginBottom: 10,
  },
  medicationItemHovered: {
    backgroundColor: '#F5F5F5',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: darkBlue,
  },
  medicationDosage: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
    marginTop: 2,
  },
  medicationTime: {
    fontSize: 12,
    color: primaryBlue,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: primaryBlue,
  },
  completionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
  },
  completionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
}); 