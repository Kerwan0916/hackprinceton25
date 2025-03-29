import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import OnboardingCard from '../../components/onboarding/OnboardingCard';
import { AccountIcon, HealthInfoIcon, MedicationsIcon, RemindersIcon } from '../../components/onboarding/OnboardingIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, offWhite } from '../../constants/Colors';

export default function OnboardingScreen() {
  return (
    <LinearGradient
      colors={[primaryBlue, primaryTeal]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.heading}>Welcome to CareBlue</Text>
          <Text style={styles.subheading}>Let's set up your account</Text>
        </LinearGradient>
        
        <View style={styles.dotContainer}>
          <LinearGradient
            colors={[primaryTeal, primaryBlue] as const}
            style={styles.dot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <LinearGradient
            colors={[primaryBlue, primaryTeal] as const}
            style={styles.dot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <LinearGradient
            colors={[primaryTeal, primaryBlue] as const}
            style={styles.dot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerGradient: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    width: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
}); 