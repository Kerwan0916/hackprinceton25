import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to MedRemind</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="hospital-user" size={50} color="#1E5C8D" />
        </View>
        
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
            <FontAwesome5 name="hospital" size={20} color="#2473B3" />
            <Text style={styles.providerName}>Hospital Network</Text>
          </Pressable>
          
          <Pressable style={styles.providerOption}>
            <FontAwesome5 name="clinic-medical" size={20} color="#2473B3" />
            <Text style={styles.providerName}>Family Clinic</Text>
          </Pressable>
          
          <Pressable style={styles.providerOption}>
            <FontAwesome5 name="user-md" size={20} color="#2473B3" />
            <Text style={styles.providerName}>Private Practice</Text>
          </Pressable>
        </View>

        <Pressable 
          style={styles.button} 
          onPress={handleSignIn}
          disabled={importing}
        >
          <Text style={styles.buttonText}>
            {importing ? 'Importing...' : 'Sign In & Import'}
          </Text>
        </Pressable>
        
        <Pressable onPress={() => router.push('/onboarding/medications' as any)}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E2A47',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E2A47',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#496583',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#0E2A47',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
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
  },
  providerName: {
    marginLeft: 12,
    fontSize: 16,
    color: '#0E2A47',
  },
  button: {
    backgroundColor: '#2473B3',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#496583',
    fontSize: 14,
  },
}); 