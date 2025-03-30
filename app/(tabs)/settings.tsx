import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryBlue, primaryTeal] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>Settings</Text>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentLine}
            />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <Pressable 
            style={({ hovered }) => [
              styles.settingItem,
              hovered && styles.pressableActive
            ]}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={20} color={primaryBlue} />
              </View>
              <Text style={styles.settingText}>Profile Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </Pressable>
          
          <Pressable 
            style={({ hovered }) => [
              styles.settingItem,
              hovered && styles.pressableActive
            ]}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="medical" size={20} color={primaryBlue} />
              </View>
              <Text style={styles.settingText}>Health Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={[primaryTeal, primaryBlue] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentLine}
            />
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={[primaryBlue, primaryTeal] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name="notifications" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D9D9D9', true: lightBlue }}
              thumbColor={notificationsEnabled ? primaryBlue : '#F4F4F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={[primaryTeal, primaryBlue] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name="moon" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D9D9D9', true: lightBlue }}
              thumbColor={darkModeEnabled ? primaryBlue : '#F4F4F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={[primaryBlue, primaryTeal] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name="location" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#D9D9D9', true: lightBlue }}
              thumbColor={locationEnabled ? primaryBlue : '#F4F4F4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={[primaryBlue, primaryTeal] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentLine}
            />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <Pressable 
            style={({ hovered }) => [
              styles.settingItem,
              hovered && styles.pressableActive
            ]}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={[primaryTeal, primaryBlue] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name="help-circle" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </Pressable>
          
          <Pressable 
            style={({ hovered }) => [
              styles.settingItem,
              hovered && styles.pressableActive
            ]}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={[primaryBlue, primaryTeal] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name="shield-checkmark" size={20} color={white} />
              </LinearGradient>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </Pressable>
          
          <Pressable 
            style={({ hovered }) => [
              styles.settingItem, 
              styles.logoutItem,
              hovered && styles.pressableActive
            ]}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  pressableActive: {
    backgroundColor: 'gray',
  },
  title: {
    color: white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: white,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accentLine: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightBlue,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: darkBlue,
  },
  logoutItem: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 