import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';

export default function HealthInfoScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSignIn = () => {
    setLoggingIn(true);
    // Simulate login process
    setTimeout(() => {
      setLoggingIn(false);
      router.push('/onboarding/medications' as any);
    }, 1000);
  };

  const handleForgotPassword = () => {
    // Placeholder function
    alert('Forgot Password functionality would go here');
  };

  const handleCreateAccount = () => {
    // Placeholder function
    alert('Create Account functionality would go here');
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
            <FontAwesome5 name="user-circle" size={50} color={primaryBlue} />
          </LinearGradient>
          
          <Text style={styles.subtitle}>
            Sign in to your account
          </Text>
          
          <Text style={styles.description}>
            Enter your login details to access all features
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={handleSignIn}
            disabled={loggingIn}
            style={{width: '100%', marginTop: 16}}
          >
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {loggingIn ? 'Signing in...' : 'Sign In'}
              </Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable 
            onPress={handleCreateAccount}
            style={{width: '100%'}}
          >
            <View style={styles.createAccountButton}>
              <Text style={styles.createAccountText}>Create Account</Text>
            </View>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: primaryBlue,
    fontSize: 14,
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
  createAccountButton: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: primaryBlue,
  },
  createAccountText: {
    color: primaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: primaryBlue,
    fontSize: 14,
  },
}); 