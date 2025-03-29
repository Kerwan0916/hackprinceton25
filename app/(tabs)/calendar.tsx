import { Image, StyleSheet, Platform, View, ScrollView, Pressable, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { hoverGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/hoverGesture';

export default function HomeScreen() {
  const userName = "Name"; // This would come from user profile in a real app
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{userName}!</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#2473B3" />
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <Pressable style={({hovered}) => [
          styles.card,
          {backgroundColor: hovered ? 'gray' : 'white'},
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: '#2473B3' }]}>
            <Ionicons name="checkmark" size={24} color="white" />
          </View>
          <Text style={styles.cardTitle}>Daily Check-in</Text>
        </Pressable>
        
        <Pressable style={({hovered}) => [
          styles.card,
          {backgroundColor: hovered ? 'gray' : 'white'},
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: '#2473B3' }]}>
            <FontAwesome5 name="prescription-bottle-alt" size={24} color="white" />
          </View>
          <View style={styles.medicationContent}>
            <Text style={styles.cardTitle}>Medications & Schedule</Text>
            <Text style={styles.reminderText}>Next reminder at 2:00 PM</Text>
          </View>
        </Pressable>
        
        <Pressable style={({hovered}) => [
          styles.card,
          {backgroundColor: hovered ? 'gray' : 'white'},
        ]}>          
        <View style={[styles.iconContainer, { backgroundColor: '#2473B3' }]}>
            <FontAwesome5 name="heart" size={24} color="white" />
          </View>
          <Text style={styles.cardTitle}>Medical Information</Text>
        </Pressable>
        
        <Pressable style={({hovered}) => [
          styles.card,
          {backgroundColor: hovered ? 'gray' : 'white'},
        ]}>          
        <View style={[styles.iconContainer, { backgroundColor: '#2473B3' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
          </View>
          <Text style={styles.cardTitle}>Ask a Question</Text>
        </Pressable>
      </ScrollView>
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
});
