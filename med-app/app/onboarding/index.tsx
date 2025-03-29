import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import OnboardingCard from '../../components/onboarding/OnboardingCard';
import { AccountIcon, HealthInfoIcon, MedicationsIcon, RemindersIcon } from '../../components/onboarding/OnboardingIcons';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to MedRemind</Text>
      <Text style={styles.subheading}>Let's set up your account</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={296} // card width + margins
        decelerationRate="fast"
      >
        <OnboardingCard 
          title="Create an Account" 
          description="Sign up to get started" 
          icon={<AccountIcon />}
          nextScreen="/onboarding/health-info"
        />
        
        <OnboardingCard 
          title="Enter Your Health Info" 
          description="Provide your health conditions and allergies" 
          icon={<HealthInfoIcon />}
          nextScreen="/onboarding/medications"
        />
        
        <OnboardingCard 
          title="Add Your Medications" 
          description="Include your dosages and schedule" 
          icon={<MedicationsIcon />}
          nextScreen="/onboarding/reminders"
        />
        
        <OnboardingCard 
          title="Set Reminder Preferences" 
          description="Choose when to receive reminders" 
          icon={<RemindersIcon />}
          nextScreen="/(tabs)"
          isLastCard={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0E2A47',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#496583',
    marginBottom: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
}); 