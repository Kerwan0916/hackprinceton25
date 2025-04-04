import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from './Checkbox';
import { darkBlue, lightBlue, white, primaryBlue } from '@/constants/Colors';

interface MedicationItemProps {
  name: string;
  dosage: string;
  schedule: string;
  checked: boolean;
  onToggle: () => void;
}

export default function MedicationItem({
  name,
  dosage,
  schedule,
  checked,
  onToggle,
}: MedicationItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Checkbox checked={checked} onPress={onToggle} />
        <Text style={styles.medicationName}>{name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.dosageText}>{dosage}</Text>
        <Text style={styles.scheduleText}>{schedule}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: darkBlue,
    marginLeft: 12,
  },
  detailsContainer: {
    marginTop: 8,
    marginLeft: 36,
  },
  dosageText: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
  },
  scheduleText: {
    fontSize: 12,
    color: primaryBlue,
    marginTop: 4,
  },
}); 