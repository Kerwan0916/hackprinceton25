import { Image, StyleSheet, Platform, View, ScrollView, Pressable, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import userData from '../data/userData.json';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
export default function HomeScreen() {
  const userName = userData.name; // Get name from userData.json
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryBlue, primaryTeal] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.welcomeText}>Welcome back to Syndra,</Text>
          <Text style={styles.nameText}>{userName}!</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={primaryBlue} />
        </View>
      </LinearGradient >
      
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <LinearGradient

        colors={[lightBlue, lightBlue] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientCard}
      >
        <Pressable style={styles.card}>
          <LinearGradient
            colors={[primaryTeal, primaryBlue] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.iconContainer}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.cardTitle}>Daily Check-in</Text>
        </Pressable>
        </LinearGradient>
        
        <LinearGradient

          colors={[lightBlue, lightBlue] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientCard}
        >
          <Pressable style={styles.pressableCard} onPress={() => router.push('/schedule' as any)}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <FontAwesome5 name="prescription-bottle-alt" size={24} color="white" />
            </LinearGradient>
            <View style={styles.medicationContent}>
              <Text style={styles.cardTitle}>Medications & Schedule</Text>
              <Text style={styles.reminderText}>Next reminder at 2:30 PM</Text>
            </View>
          </Pressable>
        </LinearGradient>

        <LinearGradient
          colors={[lightBlue, lightBlue] as const}

          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientCard}
        >
          <Pressable style={styles.pressableCard}>
            <LinearGradient
              colors={[primaryTeal, primaryBlue] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <FontAwesome5 name="heart" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Medical Information</Text>
          </Pressable>
        </LinearGradient>
        
        <LinearGradient
          colors={[lightBlue, lightBlue] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientCard}
        >
          <Pressable style={styles.pressableCard}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconContainer}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Ask a Question</Text>
          </Pressable>
        </LinearGradient>
        
        
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 26,
    color: white,
  },
  nameText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: white,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: white,
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
    backgroundColor: white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: lightBlue,
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
    color: darkBlue,
  },
  medicationContent: {
    flex: 1,
  },
  reminderText: {
    fontSize: 14,
    color: primaryBlue,
    marginTop: 5,
  },
  gradientCard: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  testimonialSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 15,
  },
  testimonial: {
    backgroundColor: white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accentLine: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginBottom: 15,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: darkBlue,
    marginBottom: 15,
  },
  testimonialAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryBlue,
  },
});
