import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import MedicationItem from '../../components/onboarding/MedicationItem';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';

// Mock data - this would come from the medical provider in a real app
const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    schedule: 'Take once daily in the morning',
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    schedule: 'Take twice daily with meals',
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    schedule: 'Take once daily at bedtime',
  },
  {
    id: '4',
    name: 'Levothyroxine',
    dosage: '50mcg',
    schedule: 'Take once daily on an empty stomach',
  },
];

const mockAllergies = [
  { id: '1', name: 'Penicillin' },
  { id: '2', name: 'Sulfa Drugs' },
  { id: '3', name: 'Aspirin' },
];

export default function MedicationsScreen() {
  const [medications, setMedications] = useState(
    mockMedications.map(med => ({ ...med, checked: true }))
  );
  
  const [allergies, setAllergies] = useState(
    mockAllergies.map(allergy => ({ ...allergy, checked: true }))
  );

  const toggleMedication = (id: string) => {
    setMedications(
      medications.map(med => 
        med.id === id ? { ...med, checked: !med.checked } : med
      )
    );
  };

  const toggleAllergy = (id: string) => {
    setAllergies(
      allergies.map(allergy => 
        allergy.id === id ? { ...allergy, checked: !allergy.checked } : allergy
      )
    );
  };

  return (
    <LinearGradient
      colors={[primaryBlue, white]}
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
            <Text style={styles.stepText}>Step 2 of 3</Text>
            <Text style={styles.title}>Confirm Your Medications</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <FontAwesome5 name="pills" size={20} color={white} />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Medications</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Confirm the medications imported from your medical record
          </Text>

          <View style={styles.medicationsList}>
            {medications.map(med => (
              <MedicationItem
                key={med.id}
                name={med.name}
                dosage={med.dosage}
                schedule={med.schedule}
                checked={med.checked}
                onToggle={() => toggleMedication(med.id)}
              />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={[primaryTeal, primaryBlue] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <FontAwesome5 name="allergies" size={20} color={white} />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Allergies</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Confirm any allergies we should know about
          </Text>

          <View style={styles.allergiesList}>
            {allergies.map(allergy => (
              <View key={allergy.id} style={styles.allergyItem}>
                <Pressable
                  style={[
                    styles.checkbox,
                    allergy.checked && styles.checkboxChecked,
                  ]}
                  onPress={() => toggleAllergy(allergy.id)}
                >
                  {allergy.checked && (
                    <Ionicons name="checkmark" size={16} color={white} />
                  )}
                </Pressable>
                <Text style={styles.allergyName}>{allergy.name}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/onboarding/reminders' as any)}
          >
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Confirm & Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
    marginBottom: 16,
  },
  medicationsList: {
    marginBottom: 24,
  },
  allergiesList: {
    marginBottom: 24,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: primaryBlue,
  },
  allergyName: {
    fontSize: 16,
    color: darkBlue,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 