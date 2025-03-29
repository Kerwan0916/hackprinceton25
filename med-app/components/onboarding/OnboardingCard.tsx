import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

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
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Link href={nextScreen as any} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            {isLastCard ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
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
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E2A47',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#496583',
    textAlign: 'center',
    marginBottom: 36,
  },
  button: {
    backgroundColor: '#2473B3',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 