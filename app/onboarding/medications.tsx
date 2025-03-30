import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import MedicationItem from '@/components/onboarding/MedicationItem';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, white } from '@/constants/Colors';
import userData from '../data/userData.json';
import { styles } from './medications.styles';

export default function MedicationsScreen() {
  const [medications, setMedications] = useState(
    userData.medications.map(med => ({ ...med }))
  );
  
  const [allergies, setAllergies] = useState(
    userData.allergies.map(allergy => ({ ...allergy }))
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
            onPress={() => router.push('/(tabs)' as any)}
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