import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AIAgentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Health Assistant</Text>
      </View>
      
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        <View style={styles.messageContainer}>
          <View style={styles.botMessage}>
            <Text style={styles.messageText}>
              Hello! I'm your health assistant. How can I help you today?
            </Text>
          </View>
        </View>
        
        <View style={styles.messageContainer}>
          <View style={styles.userMessage}>
            <Text style={styles.messageText}>
              What should I do if I miss a dose of my medication?
            </Text>
          </View>
        </View>
        
        <View style={styles.messageContainer}>
          <View style={styles.botMessage}>
            <Text style={styles.messageText}>
              If you miss a dose of your medication, it's important not to double up on the next dose unless specifically directed by your healthcare provider. Take your next dose at the regular scheduled time. For specific guidance on your medications (like Lisinopril), please consult your doctor or pharmacist.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your health question..."
          multiline
        />
        <Pressable style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2473B3',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  botMessage: {
    backgroundColor: '#E0F3F9',
    borderRadius: 18,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: '#2473B3',
    borderRadius: 18,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0E2A47',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#2473B3',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
}); 