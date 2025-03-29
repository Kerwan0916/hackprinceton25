import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { primaryBlue, primaryTeal, white } from '@/constants/Colors';

export const AccountIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome5 name="user-alt" size={50} color={primaryBlue} />
  </View>
);

export const HealthInfoIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome5 name="clipboard-list" size={50} color={primaryTeal} />
  </View>
);

export const MedicationsIcon = () => (
  <View style={styles.iconWrapper}>
    <FontAwesome5 name="pills" size={50} color={primaryBlue} />
  </View>
);

export const RemindersIcon = () => (
  <View style={styles.iconWrapper}>
    <MaterialCommunityIcons name="calendar-clock" size={50} color={primaryTeal} />
  </View>
);

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 