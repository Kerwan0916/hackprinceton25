import * as FileSystem from 'expo-file-system';
import userData from '../data/userData.json';

// Path to JSON file
const USER_DATA_FILE = FileSystem.documentDirectory + 'userData.json';

// Initialize by copying the bundled JSON to the file system
export const initializeUserData = async () => {
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(USER_DATA_FILE);
    
    if (!fileInfo.exists) {
      // Write initial data from the bundled JSON
      await FileSystem.writeAsStringAsync(USER_DATA_FILE, JSON.stringify(userData));
    }
    return true;
  } catch (error) {
    console.error('Error initializing user data:', error);
    return false;
  }
};

// Read user data from file
export const getUserData = async () => {
  try {
    await initializeUserData(); // Make sure data is initialized
    const fileContent = await FileSystem.readAsStringAsync(USER_DATA_FILE);
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading user data:', error);
    // Return the bundled data as fallback
    return userData;
  }
};

// Update medications in user data
export const updateMedications = async (medications: any[]) => {
  try {
    const userData = await getUserData();
    userData.medications = medications;
    await FileSystem.writeAsStringAsync(USER_DATA_FILE, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error updating medications:', error);
    return false;
  }
};

// Update allergies in user data
export const updateAllergies = async (allergies: any[]) => {
  try {
    const userData = await getUserData();
    userData.allergies = allergies;
    await FileSystem.writeAsStringAsync(USER_DATA_FILE, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error updating allergies:', error);
    return false;
  }
};

// Get time options
export const getTimeOptions = async () => {
  try {
    const userData = await getUserData();
    return userData.timeOptions;
  } catch (error) {
    console.error('Error getting time options:', error);
    return userData.timeOptions; // Return bundled data as fallback
  }
}; 