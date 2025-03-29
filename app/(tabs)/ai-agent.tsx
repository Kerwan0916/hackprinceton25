import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_API_KEY } from '@/constants/api';
import { Message } from '@/interface/message';

export default function AIAgentScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your health assistant. How can I help you today?", isUser: false }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      await recording.startAsync();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        setIsProcessing(true);
        await handleAudioInput(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleAudioInput = async (audioUri: string) => {
    try {
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        const contents = [
          { text: "Please transcribe and respond to this audio message." },
          {
            inlineData: {
              mimeType: "audio/wav",
              data: base64Data,
            },
          },
        ];

        const result = await ai.models.generateContent({
          model: "gemini-2.5-pro-exp-03-25",
          contents: contents,
        });
        
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process the audio message.";
        setMessages(prev => [...prev, { text: responseText, isUser: false }]);
        
        // TODO: replace with TTS
        Speech.speak(responseText, {
          language: 'en',
          pitch: 1,
          rate: 1,
        });
        
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to process audio input', err);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble processing your audio right now.", 
        isUser: false 
      }]);
      setIsProcessing(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Health Assistant</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer} 
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <View style={message.isUser ? styles.userMessage : styles.botMessage}>
              <Text style={styles.messageText}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {isProcessing && (
          <View style={styles.messageContainer}>
            <View style={styles.botMessage}>
              <ActivityIndicator color="#2473B3" />
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Pressable 
          style={[styles.micButton, isRecording && styles.micButtonRecording]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Ionicons 
            name={isRecording ? "stop-circle" : "mic"} 
            size={24} 
            color="white" 
          />
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
    justifyContent: 'center',
  },
  micButton: {
    backgroundColor: '#2473B3',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  micButtonRecording: {
    backgroundColor: '#E53935',
    transform: [{ scale: 1.1 }],
  },
});