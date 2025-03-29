import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white } from '@/constants/Colors';

interface OnboardingCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  nextScreen: string;
  isLastCard?: boolean;
}

export default function OnboardingCard({
  title,
  description,
  icon,
  nextScreen,
  isLastCard = false,
}: OnboardingCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[lightBlue, 'rgba(91, 191, 186, 0.1)']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.iconContainer}
      >
        {icon}
      </LinearGradient>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Link href={nextScreen as any} asChild>
        <Pressable>
          <LinearGradient
            colors={[primaryBlue, primaryTeal] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isLastCard ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: 280,
    height: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: darkBlue,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: darkBlue,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 36,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    width: 232,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 