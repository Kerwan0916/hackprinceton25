import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, primaryBlue, primaryTeal, white, offWhite } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '@/constants/api';
import { SNAP_PROMPT } from '@/constants/snap-prompt';

export default function SnapScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [picture, setPicture] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
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

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraOn) return;

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

      const result = await ai.models.generateContent({
        model: "gemini-2.5-pro-exp-03-25",
        config: {
          systemInstruction: SNAP_PROMPT,
        },
        contents: contents,
      });

      if (result && result.text) {
        setAiResponse(result.text);
      } else {
        setAiResponse('No response received from the AI model.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAiResponse('Error analyzing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetCamera = () => {
    setPicture(null);
    setAiResponse(null);
  };

  if (!picture) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[primaryBlue, primaryTeal] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>Snap</Text>
        </LinearGradient>
        
        <View style={styles.cameraContainer}>
          {isCameraOn ? (
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.cameraOffContainer}>
              <Text style={styles.cameraOffText}>Camera is off</Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, isCameraOn ? styles.stopButton : styles.startButton]} 
            onPress={toggleCamera}
          >
            <Text style={styles.buttonText}>
              {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </Text>
          </TouchableOpacity>

          {isCameraOn && (
            <TouchableOpacity 
              style={[styles.controlButton, styles.captureButton]} 
              onPress={takePicture}
            >
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryBlue, primaryTeal] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>Analysis Result</Text>
      </LinearGradient>

      <ScrollView style={styles.resultContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Analyzing image...</Text>
        ) : (
          <Text style={styles.resultText}>{aiResponse}</Text>
        )}
      </ScrollView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.resetButton]} 
          onPress={resetCamera}
        >
          <Text style={styles.buttonText}>Take Another Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraOffText: {
    color: white,
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  captureButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
}); 