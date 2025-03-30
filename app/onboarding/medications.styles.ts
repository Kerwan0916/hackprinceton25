import { StyleSheet } from 'react-native';
import { primaryBlue, primaryTeal, darkBlue, lightBlue, white, offWhite } from '@/constants/Colors';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  stepText: {
    fontSize: 14,
    color: white,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: lightBlue,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkBlue,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: darkBlue,
    opacity: 0.7,
    marginBottom: 16,
  },
  medicationsList: {
    marginBottom: 24,
  },
  allergiesList: {
    marginBottom: 24,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: primaryBlue,
  },
  allergyName: {
    fontSize: 16,
    color: darkBlue,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 