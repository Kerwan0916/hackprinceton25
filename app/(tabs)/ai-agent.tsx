import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

// Access your API key (see "Set up your API key" below)
const API_KEY = Constants.expoConfig?.extra?.apiKey;
const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey;

if (!API_KEY) {
  console.error("API Key not found. Please check your app.config.js and .env file.");
  // Optionally, show an alert or disable functionality
  // Alert.alert("Error", "API Key not found. Chat functionality may be limited.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Safety settings suitable for a health context - adjust as needed
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Be cautious with medical advice
  },
];

// Define patient information variables that can be updated later
let patientName: string | null = null; // This will be set when patient information is available 
let patientMedicalHistory: string | null = null; // This will be set when medical history is available

// System instruction to guide the AI
const systemInstruction = `You are an AI healthcare assistant designed to help patients check in when they feel they might be experiencing symptoms.

**Your Role:** The patient, ${patientName || '[Patient Name]'}, has initiated this conversation because they want to check in about how they are feeling. Your role is to respond warmly and empathetically, asking questions to understand any symptoms they might be experiencing right now. You will use the provided medical history to ask more relevant follow-up questions if needed, but always start broadly.

**Context:**
* Patient Name: ${patientName || '[Patient Name Placeholder]'}
* Patient's Medical History: ${patientMedicalHistory || '[Patient\'s Medical History Placeholder]'}

**Your Task Flow:**
1. **Acknowledge & Greet:** Start with a warm greeting, acknowledging the patient initiated the check-in. Use their name.
   * *Example Start:* "Hi ${patientName || '[Patient Name]'}, thanks for reaching out. I understand you wanted to check in on how you're feeling. Can you tell me a bit about what's going on?"
2. **Ask Broadly:** Begin with an open-ended question to understand their general state or concerns.
   * *Example Broad Questions:* "How have you been feeling overall recently?" or "What symptoms have you noticed?"
3. **Listen & Ask Clarifying Follow-ups:** Based on the patient's response, ask follow-up questions to get more detail about any symptoms mentioned.
   * These questions should aim to clarify: What the symptom feels like, when it started, how often it occurs, if anything makes it better or worse.
   * *Example Follow-ups:* "Okay, you mentioned feeling tired. Can you tell me more about that fatigue?" or "When did the headache start?" or "Is there anything that seems to trigger the dizziness?"
4. **Use History (If Applicable):** If the patient mentions symptoms potentially related to their known medical history (provided in the Context), you can ask more specific follow-up questions informed by that history. *Do not* bring up conditions unless the patient mentions related symptoms first.
   * *Example (if history includes Diabetes and patient mentions excessive thirst):* "You mentioned feeling very thirsty. Have you also noticed any other changes, like needing to use the restroom more often?"
5. **Maintain Focus:** Your sole purpose is to gather information about current symptoms through questions.

**Constraints & Safety Rules:**
* **CRITICAL: Emergency Detection:** If the patient describes symptoms that sound potentially severe or urgent (e.g., mentions chest pain, difficulty breathing, sudden severe headache, uncontrolled bleeding, sudden weakness/numbness especially on one side, confusion, slurred speech, fainting), **immediately** stop asking further questions about symptoms and state clearly: **"Based on what you're describing, it's important to seek immediate medical attention. Please call 911 or your local emergency number right away."** Do not attempt to assess the severity yourself; trigger this response based on the patient describing potentially alarming symptoms.
* **NO Medical Advice:** Absolutely do NOT provide medical advice, diagnoses, treatment suggestions, reassurances about symptoms, or interpretations (e.g., don't say "that sounds like X" or "it's probably nothing serious").
* **Warm & Empathetic Tone:** Maintain a consistently warm, supportive, respectful, and understanding tone.
* **Avoid Leading Questions:** Don't suggest symptoms. Ask open-ended questions (e.g., instead of "Are you feeling nauseous?", ask "How has your stomach been feeling?" only if they mention stomach issues).
* **Focus on Symptoms:** Keep the conversation focused on understanding the patient's current symptoms and feelings.`;

export default function AIAgentScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: `Hello! I'm your health assistant. How can I help you today?` }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingResponse, setPendingResponse] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  // Animation values for the typing dots
  const dotOneOpacity = useRef(new Animated.Value(0.3)).current;
  const dotTwoOpacity = useRef(new Animated.Value(0.3)).current;
  const dotThreeOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    requestMicPermission();
    if (model) {
      const newChat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      });
      setChatSession(newChat);
    }

    return () => {
      recording?.getStatusAsync().then(status => {
        if (status.isRecording) {
          recording.stopAndUnloadAsync();
        }
      });
    };
  }, []);

  const requestMicPermission = async () => {
    try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Microphone access is needed for voice input.');
            return false;
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        return true;
    } catch (err) {
        console.error('Failed to request mic permissions or set audio mode', err);
        Alert.alert('Error', 'Could not set up audio recording.');
        return false;
    }
  };

  const startRecording = async () => {
    if (isRecording || isTranscribing || isLoading) {
      console.log("[startRecording] Aborted: Already busy");
      return;
    }

    if (!API_KEY) {
      Alert.alert("API Key Missing", "Cannot transcribe audio without an API key configured.");
      return;
    }

    const hasPermission = await requestMicPermission();
    if (!hasPermission) return;

    try {
      console.log("[startRecording] Setting audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      console.log("[startRecording] Creating and starting recording...");
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      console.log("[startRecording] Recording created successfully");
      setRecording(newRecording);
      setIsRecording(true);
      setInputText('');
      
    } catch (err) {
      console.error('[startRecording] Error creating recording:', err);
      Alert.alert('Recording Error', `Could not start recording: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsRecording(false);
    }
  };

  const stopRecordingAndTranscribeAndSend = async () => {
    if (!recording) {
      console.log("[stopRecording] No active recording found");
      setIsRecording(false);
      return;
    }

    console.log("[stopRecording] Stopping recording...");
    setIsRecording(false);
    setIsTranscribing(true);
    
    let uri = null;
    let audioBase64 = null;
    let mimeType = 'audio/mp4';
    let transcriptionSuccess = false;
    let transcribedText = '';
    
    try {
      const recordingToStop = recording;
      setRecording(null);
      
      console.log("[stopRecording] Calling stopAndUnloadAsync()...");
      await recordingToStop.stopAndUnloadAsync();
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
      
      uri = recordingToStop.getURI();
      if (!uri) {
        throw new Error("Recording URI is null after stopping");
      }

      console.log('[stopRecording] Recording stopped. URI:', uri);

      if (Platform.OS === 'web' && uri.startsWith('blob:')) {
        console.log("[stopRecording] Running on web, fetching blob...");
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch blob: ${response.statusText}`);
        }
        const blob = await response.blob();
        mimeType = blob.type;
        console.log(`[stopRecording] Blob fetched. Type: ${mimeType}, Size: ${blob.size}`);

        audioBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result?.toString().split(',')[1];
            resolve(base64Data || null);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });

      } else if (Platform.OS !== 'web') {
        console.log("[stopRecording] Running on native, reading file...");
        audioBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        throw new Error(`Unsupported platform/URI combination: ${Platform.OS} / ${uri.substring(0, 10)}`);
      }

      if (!audioBase64) {
        throw new Error("Audio data could not be converted to Base64");
      }

      console.log(`[stopRecording] Sending audio for transcription...`);
      const GOOGLE_TRANSCRIPTION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

      const apiResponse = await fetch(GOOGLE_TRANSCRIPTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Transcribe this audio Do not add any additional text or commentary. Just the transcription." },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: audioBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0,
          },
          safetySettings: safetySettings
        }),
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        console.error('[stopRecording] Gemini API HTTP Error:', apiResponse.status, result);
        const errorMessage = result.error?.message || `HTTP error ${apiResponse.status}`;
        throw new Error(`Transcription failed: ${errorMessage}`);
      }

      if (!result.candidates || result.candidates.length === 0) {
        console.error('[stopRecording] Gemini API Error - No candidates:', result);
        throw new Error('Transcription failed. No candidates returned from API.');
      }

      const firstCandidate = result.candidates[0];
      if (!firstCandidate.content?.parts?.[0]?.text) {
        console.error('[stopRecording] Unexpected Gemini API Response structure:', JSON.stringify(result, null, 2));
        throw new Error('Transcription failed. No text in response.');
      }
      
      transcribedText = firstCandidate.content.parts[0].text.trim();
      console.log('[stopRecording] Transcription:', transcribedText);
      setInputText(transcribedText);
      transcriptionSuccess = true;
      
    } catch (error) {
      console.error('[stopRecording] Error during stop/transcribe process:', error);
      Alert.alert('Transcription Error', `Failed to transcribe: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setInputText('');
    } finally {
      setIsTranscribing(false);

      if (transcriptionSuccess && transcribedText) {
        console.log("[stopRecording] Transcription successful, sending message...");
        await onSendMessage(transcribedText);
      }

      if (Platform.OS !== 'web' && uri) {
        try {
          await FileSystem.deleteAsync(uri);
          console.log("[stopRecording] Deleted recording file");
        } catch (deleteError) {
          console.error("[stopRecording] Error deleting recording file:", deleteError);
        }
      }
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
        stopRecordingAndTranscribeAndSend();
    } else {
        startRecording();
    }
  };

  const playWebAudio = async (audioUrl: string) => {
    try {
      console.log("Starting web audio playback");
      // For web, create a new HTML5 Audio element (not the expo-av Audio)
      const webAudio = new window.Audio(audioUrl);
      
      // Set up event listeners
      webAudio.onended = () => {
        console.log("Web audio playback complete");
        setIsSpeaking(false);
        // Clean up the URL
        URL.revokeObjectURL(audioUrl);
      };
      
      // Use addEventListener instead of onerror to avoid type issues
      webAudio.addEventListener('error', () => {
        console.error("Web audio playback error");
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      });
      
      // Add a timeout - if audio doesn't start playing within 5 seconds, consider it failed
      const playbackTimeout = setTimeout(() => {
        console.log("Audio playback timeout - may be stuck");
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      }, 5000);
      
      // Start playback
      await webAudio.play().catch(error => {
        console.error("Error starting web audio playback:", error);
        // Clear the timeout since we know it failed
        clearTimeout(playbackTimeout);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      });
      
      // If we get here, playback started successfully - clear the timeout
      clearTimeout(playbackTimeout);
      
    } catch (error) {
      console.error('Error playing web audio:', error);
      setIsSpeaking(false);
    }
  };

  const playTTSAudio = async (fileUri: string) => {
    try {
      console.log("Starting native audio playback");
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          console.log("Native audio playback complete");
          newSound.unloadAsync();
          setSound(null);
          setIsSpeaking(false); // Ensure speaking state is reset
          FileSystem.deleteAsync(fileUri).catch(err => 
            console.log("Error deleting temp audio file:", err)
          );
        }
      });
    } catch (error) {
      console.error('Error playing TTS audio:', error);
      setIsSpeaking(false); // Ensure speaking state is reset on error
    }
  };

  // Clean up audio on component unmount and add safety timeout
  useEffect(() => {
    // Safety timeout to reset speaking state after 30 seconds
    // in case the audio playback callbacks don't fire properly
    let safetyTimeout: NodeJS.Timeout | null = null;
    
    if (isSpeaking) {
      console.log("Speaking started, setting safety timeout");
      safetyTimeout = setTimeout(() => {
        console.log("Safety timeout: resetting speaking state");
        setIsSpeaking(false);
      }, 30000); // 30 seconds max for any message
    }
    
    return () => {
      if (safetyTimeout) {
        clearTimeout(safetyTimeout);
      }
      
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.getStatusAsync().then(status => {
          if (status.isRecording) {
            recording.stopAndUnloadAsync();
          }
        });
      }
    };
  }, [sound, recording, isSpeaking]);

  const addMessageToChat = (text: string) => {
    console.log("🎉 Now displaying AI message as text:", text.substring(0, 30) + "...");
    const botMessage = { role: 'model', parts: [{ text }] };
    setMessages(prev => [...prev, botMessage]);
  };

  const onSendMessage = async (textToSend?: string) => {
    const messageText = textToSend ?? inputText;
    if (isLoading || isTranscribing) return;
    if (!messageText.trim() || !chatSession) {
        console.log("Send cancelled: No text or chat session unavailable.");
        return;
    }

    console.log("Sending user message:", messageText.substring(0, 50) + (messageText.length > 50 ? "..." : ""));
    const userMessage = { role: 'user', parts: [{ text: messageText }] };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log("Waiting for Gemini response...");
      const result = await chatSession.sendMessage(messageText);
      const response = await result.response;
      const text = response.text();

      console.log("Received AI response:", text.substring(0, 50) + "...");
      
      // Store the response but don't display it yet
      setPendingResponse(text);
      
      // Try to generate and play the audio
      if (text && OPENAI_API_KEY) {
        console.log("Starting TTS generation...");
        setIsSpeaking(true);
        try {
          const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'tts-1',
              voice: 'alloy',
              input: text,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI TTS API Error:", errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          console.log("TTS API response received, preparing audio...");
          if (Platform.OS === 'web') {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            // Show message before playing audio on web
            addMessageToChat(text);
            setPendingResponse(null);
            
            await playWebAudio(audioUrl);
          } else {
            const audioData = await response.arrayBuffer();
            const base64Audio = Buffer.from(audioData).toString('base64');
            
            const fileUri = `${FileSystem.cacheDirectory}tts-output-${Date.now()}.mp3`;
            await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
              encoding: FileSystem.EncodingType.Base64,
            });
            
            // Show message before playing audio on native
            addMessageToChat(text);
            setPendingResponse(null);
            
            await playTTSAudio(fileUri);
          }
        } catch (error) {
          console.error('Error in TTS:', error);
          // If there's an error with TTS, show the message anyway
          addMessageToChat(text);
          setPendingResponse(null);
          Alert.alert('TTS Error', 'Could not convert text to speech');
          setIsSpeaking(false);
        }
      } else {
        // If no TTS is available, just show the message
        addMessageToChat(text);
        setPendingResponse(null);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error sending the message." }] };
      setMessages(prev => [...prev, errorMessage]);
      setPendingResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Animation sequence for the typing dots
  useEffect(() => {
    if (isLoading || pendingResponse) {
      console.log("Starting typing animation");
      
      // Create animation sequence
      const animation = Animated.loop(
        Animated.sequence([
          // Dot one animates first
          Animated.timing(dotOneOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotOneOpacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          // Then dot two
          Animated.timing(dotTwoOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotTwoOpacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          // Then dot three
          Animated.timing(dotThreeOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotThreeOpacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      
      animation.start();
      
      return () => {
        console.log("Cleaning up typing animation");
        animation.stop();
      };
    }
  }, [isLoading, pendingResponse, dotOneOpacity, dotTwoOpacity, dotThreeOpacity]);

  // Function to update patient information and refresh the chat session
  const updatePatientInfo = (name: string, medicalHistory: string) => {
    patientName = name;
    patientMedicalHistory = medicalHistory;
    
    // Refresh chat session with new patient information
    if (model) {
      const newChat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      });
      setChatSession(newChat);
      
      // Reset messages and add initial greeting with patient name
      setMessages([
        { role: 'model', parts: [{ text: `Hello${patientName ? ' ' + patientName : ''}! I'm your health assistant. How can I help you today? I understand you wanted to check in on how you're feeling.` }] }
      ]);
    }
  };

  // Make the function accessible outside the component
  // @ts-ignore - This is intentional to expose the function
  AIAgentScreen.updatePatientInfo = updatePatientInfo;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Health Assistant</Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageContainer, { 
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }]}>
            <View style={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
              <Text style={msg.role === 'user' ? styles.userMessageText : styles.botMessageText}>
                {msg.parts[0].text}
              </Text>
            </View>
          </View>
        ))}
        {(isLoading || pendingResponse) && (
          <View style={[styles.messageContainer, { alignItems: 'flex-start' }]}>
            <View style={styles.botMessage}>
              <View style={styles.typingContainer}>
                <Animated.View style={[styles.typingDot, { opacity: dotOneOpacity }]} />
                <Animated.View style={[styles.typingDot, { opacity: dotTwoOpacity }]} />
                <Animated.View style={[styles.typingDot, { opacity: dotThreeOpacity }]} />
              </View>
            </View>
          </View>
        )}
        {isTranscribing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1E88E5" />
            <Text style={styles.loadingText}>Transcribing audio...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={
            isRecording 
              ? "Recording... Press mic to stop" 
              : pendingResponse
                ? "Assistant is preparing speech..."
                : isSpeaking 
                  ? "Assistant is speaking..."
                  : "Type or press mic to speak..."
          }
          multiline
          value={inputText}
          onChangeText={setInputText}
          editable={!isLoading && !isRecording && !isTranscribing && !isSpeaking && !pendingResponse && !!chatSession}
        />
        
         <Pressable
            style={({ pressed }) => [
                styles.micButton,
                (isTranscribing || isLoading || !!pendingResponse) && styles.buttonDisabled,
                isRecording && styles.micButtonRecording,
                pressed && !(isTranscribing || isLoading || isRecording || !!pendingResponse) && styles.micButtonPressed 
            ]}
            onPress={handleMicToggle}
            disabled={isLoading || isTranscribing || !!pendingResponse || !API_KEY}
        >
            {isTranscribing ? (
                 <ActivityIndicator size="small" color="#FFFFFF" /> 
            ) : (
                 <Ionicons name={isRecording ? "stop-circle-outline" : "mic"} size={24} color={"#FFFFFF"} />
            )}
        </Pressable>

        <Pressable
           style={[
             styles.sendButton,
             (!inputText || isLoading || isRecording || isTranscribing || isSpeaking || !!pendingResponse) && styles.buttonDisabled
           ]}
          onPress={() => onSendMessage()}
          disabled={!inputText || isLoading || isRecording || isTranscribing || isSpeaking || !!pendingResponse || !chatSession}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={24} color={(!inputText || isLoading || isRecording || isTranscribing || isSpeaking || !!pendingResponse) ? "#A0A0A0" : "#FFFFFF"} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2473B3',
    paddingTop: Constants.statusBarHeight + 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
    width: '100%',
    display: 'flex',
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderTopLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  userMessage: {
    backgroundColor: '#2473B3',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '85%',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
   botMessageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
  },
  userMessageText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'white',
  },
   loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
   loadingText: {
     marginLeft: 10,
     fontSize: 14,
     color: '#555',
   },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5EAF0',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 44,
    maxHeight: 120,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    marginRight: 8,
     lineHeight: 20,
  },
   micButton: {
    backgroundColor: '#2473B3',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 2,
     elevation: 2,
  },
   micButtonRecording: {
     backgroundColor: '#D32F2F',
   },
   micButtonPressed: {
     backgroundColor: '#1E88E5',
   },
   buttonDisabled: {
     opacity: 0.6,
   },
  sendButton: {
    backgroundColor: '#2473B3',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 2,
     elevation: 2,
  },
   sendButtonDisabled: {
    backgroundColor: '#A0C7E4',
    opacity: 0.6,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 30,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2473B3',
    marginHorizontal: 3,
    opacity: 0.7,
  },
  typingDotMiddle: {
    opacity: 0.5,
  },
}); 