import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import MedicationItem from '../../components/onboarding/MedicationItem';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2473B3" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
          <Text style={styles.title}>Confirm Your Medications</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="pills" size={20} color="#2473B3" />
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
          <FontAwesome5 name="allergies" size={20} color="#2473B3" />
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
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </Pressable>
              <Text style={styles.allergyName}>{allergy.name}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/onboarding/reminders' as any)}
        >
          <Text style={styles.buttonText}>Confirm & Continue</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E2A47',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#496583',
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
    padding: 12,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2473B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2473B3',
  },
  allergyName: {
    fontSize: 16,
    marginLeft: 12,
    color: '#0E2A47',
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