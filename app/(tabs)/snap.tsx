import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, primaryBlue, primaryTeal, white, offWhite } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '@/constants/api';
import { SNAP_PROMPT } from '@/constants/snap-prompt';
import { Ionicons } from '@expo/vector-icons';

// Define the interface for structured medication data
interface MedicationData {
  medication_name: string;
  purpose: string;
  effects: string;
  typical_dosage: string;
  directions_of_use?: string;
  expiration_date?: string;
  important_considerations: string;
  disclaimer: string;
}

// Card component for displaying medication information
const MedicationInfoCard = ({ 
  title, 
  iconName, 
  accentColor, 
  children 
}: { 
  title: string, 
  iconName: keyof typeof Ionicons.glyphMap, 
  accentColor: string, 
  children: React.ReactNode 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
          <Ionicons name={iconName} size={24} color={accentColor} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardContent}>{children}</Text>
      </View>
    </View>
  );
};

export default function SnapScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [picture, setPicture] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [medicationData, setMedicationData] = useState<MedicationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  
  // This function is kept for compatibility but no longer used in the UI
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      
      if (photo?.base64) {
        setPicture(photo.base64);
        await analyzeImage(photo.base64);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setIsLoading(true);
    try {
      const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image;

      const contents = [
        { text: "Please analyze this picture and respond with detailed information about the medication." },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
      ];

      // Use the updated SNAP_PROMPT that already requests JSON formatting
      const result = await ai.models.generateContent({
        model: "gemini-2.5-pro-exp-03-25",
        config: {
          systemInstruction: SNAP_PROMPT,
        },
        contents: contents,
      });

      // Extract the text response
      let responseText = '';
      
      try {
        // @ts-ignore - Handle different response formats from the AI model
        if (result && result.text) {
          // @ts-ignore - text might be a function or a string property
          responseText = typeof result.text === 'function' ? result.text() : String(result.text);
        }
        
        // If we have a response text, try to parse it as JSON
        if (responseText) {
          try {
            // Find the JSON structure in the response
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            
            if (jsonStart >= 0 && jsonEnd > jsonStart) {
              const jsonText = responseText.substring(jsonStart, jsonEnd);
              const data = JSON.parse(jsonText) as MedicationData;
              setMedicationData(data);
              
              // Also set a formatted text version for backward compatibility
              const formattedText = formatMedicationData(data);
              setAiResponse(formattedText);
            } else {
              // No JSON structure found
              setAiResponse(responseText);
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            setAiResponse(responseText);
          }
        } else {
          setAiResponse('No valid response received from the AI model.');
        }
      } catch (error) {
        console.error('Error processing response:', error);
        setAiResponse('Error processing the AI response.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAiResponse('Error analyzing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatMedicationData = (data: MedicationData): string => {
    return `
Medication Name: ${data.medication_name}

Purpose: ${data.purpose}

Effects: ${data.effects}

Typical Dosage: ${data.typical_dosage}

${data.directions_of_use ? `Directions of Use: ${data.directions_of_use}\n\n` : ''}

${data.expiration_date ? `Expiration Date: ${data.expiration_date}\n\n` : ''}

Important Considerations: ${data.important_considerations}

Disclaimer: ${data.disclaimer}
    `;
  };

  const resetCamera = () => {
    setPicture(null);
    setAiResponse(null);
    setMedicationData(null);
  };

  if (!picture) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>Snap</Text>
        </LinearGradient>
        
        <View style={styles.cameraContainer}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera} 
            facing={facing}
          />
          
          {/* Camera controls overlay */}
          <View style={styles.cameraControlsOverlay}>
            {/* Flip camera button */}
            <TouchableOpacity 
              style={styles.flipCameraButton} 
              onPress={toggleCameraFacing}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-reverse-outline" size={26} color="white" />
            </TouchableOpacity>
            
            {/* Capture button */}
            <TouchableOpacity 
              style={styles.captureButtonCircle} 
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            {/* Empty view for balance */}
            <View style={styles.emptySpace} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[primaryBlue, primaryTeal] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>Analysis Result</Text>
      </LinearGradient>

      <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Analyzing image...</Text>
          </View>
        ) : medicationData ? (
          <View style={styles.cardsContainer}>
            <MedicationInfoCard 
              title="Medication Name" 
              iconName="medical" 
              accentColor="#4299e1"
            >
              {medicationData.medication_name}
            </MedicationInfoCard>
            
            <MedicationInfoCard 
              title="Purpose" 
              iconName="bulb" 
              accentColor="#48bb78"
            >
              {medicationData.purpose}
            </MedicationInfoCard>
            
            <MedicationInfoCard 
              title="Effects" 
              iconName="flash" 
              accentColor="#ed8936"
            >
              {medicationData.effects}
            </MedicationInfoCard>
            
            <MedicationInfoCard 
              title="Typical Dosage" 
              iconName="calculator" 
              accentColor="#9f7aea"
            >
              {medicationData.typical_dosage}
            </MedicationInfoCard>
            
            {medicationData.directions_of_use && (
              <MedicationInfoCard 
                title="Directions of Use" 
                iconName="document-text" 
                accentColor="#38b2ac"
              >
                {medicationData.directions_of_use}
              </MedicationInfoCard>
            )}
            
            {medicationData.expiration_date && (
              <MedicationInfoCard 
                title="Expiration Date" 
                iconName="time" 
                accentColor="#667eea"
              >
                {medicationData.expiration_date}
              </MedicationInfoCard>
            )}
            
            <MedicationInfoCard 
              title="Important Considerations" 
              iconName="warning" 
              accentColor="#e53e3e"
            >
              {medicationData.important_considerations}
            </MedicationInfoCard>
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimer}>{medicationData.disclaimer}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.resultText}>{aiResponse}</Text>
        )}
      </ScrollView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.takeAnotherButton} 
          onPress={resetCamera}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Take Another Picture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: offWhite,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraControlsOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  captureButtonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    width: 50,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: offWhite,
    margin: 0,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  resultContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    padding: 16,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  disclaimerContainer: {
    width: '90%',
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  disclaimer: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  takeAnotherButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 