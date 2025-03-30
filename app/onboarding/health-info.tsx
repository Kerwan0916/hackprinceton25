import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';

export default function HealthInfoScreen() {
  const [provider, setProvider] = useState('');
  const [importing, setImporting] = useState(false);

  const handleSignIn = () => {
    setImporting(true);
    // Simulate importing data
    setTimeout(() => {
      setImporting(false);
      router.push('/onboarding/medications' as any);
    }, 2000);
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
          <Text style={styles.title}>Welcome to Syndra</Text>
        </LinearGradient>

        <View style={styles.card}>
          <LinearGradient
            colors={[lightBlue, 'rgba(91, 191, 186, 0.2)']} 
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <FontAwesome5 name="hospital-user" size={50} color={primaryBlue} />
          </LinearGradient>
          
          <Text style={styles.subtitle}>
            Sign in with your medical provider
          </Text>
          
          <Text style={styles.description}>
            We'll securely import your medical history, medications, and allergies
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Healthcare Provider</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for your provider"
              value={provider}
              onChangeText={setProvider}
            />
          </View>

          <View style={styles.providerOptions}>
            <Pressable style={styles.providerOption}>
              <LinearGradient
                colors={[primaryBlue, primaryTeal] as const}
                style={styles.providerIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <FontAwesome5 name="hospital" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.providerName}>Hospital Network</Text>
            </Pressable>
            
            <Pressable style={styles.providerOption}>
              <LinearGradient
                colors={[primaryTeal, primaryBlue] as const}
                style={styles.providerIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <FontAwesome5 name="clinic-medical" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.providerName}>Family Clinic</Text>
            </Pressable>
            
            <Pressable style={styles.providerOption}>
              <LinearGradient
                colors={[primaryBlue, primaryTeal] as const}
                style={styles.providerIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <FontAwesome5 name="user-md" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.providerName}>Private Practice</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={handleSignIn}
            disabled={importing}
          >
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {importing ? 'Importing...' : 'Sign In & Import'}
              </Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable onPress={() => router.push('/onboarding/medications' as any)}>
            <Text style={styles.skipText}>Skip for now</Text>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: darkBlue,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: lightBlue,
    fontSize: 16,
  },
  providerOptions: {
    width: '100%',
    marginBottom: 24,
  },
  providerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: lightBlue,
  },
  providerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    color: darkBlue,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: primaryBlue,
    fontSize: 14,
  },
}); 