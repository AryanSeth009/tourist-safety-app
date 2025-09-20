import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ProfileSetupScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetup'>;

interface ProfileSetupProps {
  navigation: ProfileSetupScreenNavigationProp;
  route: ProfileSetupScreenRouteProp;
}

export function ProfileSetupScreen({ navigation, route }: ProfileSetupProps) {
  // User data from KYC verification
  const { userData: kycUserData } = route.params;
  const [userData, setUserData] = useState({
    name: kycUserData.name || '',
    dateOfBirth: kycUserData.dateOfBirth || '',
    gender: kycUserData.gender || '',
    address: kycUserData.address || '',
  });

  // Emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: '', phone: '', relation: '' },
    { name: '', phone: '', relation: '' },
  ]);

  // Medical information
  const [medicalInfo, setMedicalInfo] = useState({
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
  });

  const [currentSection, setCurrentSection] = useState(0); // 0: Emergency contacts, 1: Medical info
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setEmergencyContacts(updatedContacts);
  };

  const addEmergencyContact = () => {
    if (emergencyContacts.length < 5) {
      setEmergencyContacts([...emergencyContacts, { name: '', phone: '', relation: '' }]);
    }
  };

  const handleSubmit = () => {
    // Validate emergency contacts
    const validContacts = emergencyContacts.filter(contact => 
      contact.name && contact.phone && contact.relation
    );

    if (validContacts.length < 1) {
      Alert.alert('Emergency Contact Required', 'Please add at least one emergency contact with complete details.');
      return;
    }

    if (validContacts.length < 2) {
      Alert.alert(
        'Add Another Contact', 
        'For your safety, we recommend adding at least two emergency contacts. Continue with one?',
        [
          { text: 'Add Another', style: 'cancel' },
          { text: 'Continue', onPress: () => completeProfile() }
        ]
      );
      return;
    }

    completeProfile();
  };

  const completeProfile = () => {
    // Here you would send the data to your backend and blockchain
    const profileData = {
      ...userData,
      emergencyContacts: emergencyContacts.filter(contact => 
        contact.name && contact.phone && contact.relation
      ),
      medicalInfo
    };

    console.log('Profile data:', profileData);
    
    // Navigate to main app
    navigation.replace('MainApp');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={40} color="#6366f1" />
              <View style={styles.iconGlow} />
            </View>
            
            <Text style={styles.title}>
              Complete Your <Text style={styles.titleHighlight}>Safety Profile</Text>
            </Text>
            
            <Text style={styles.subtitle}>
              This information could save your life in an emergency
            </Text>
          </View>

          {/* User Info Display */}
          <BlurView intensity={80} tint="dark" style={styles.userInfoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color="#94a3b8" />
              <Text style={styles.infoText}>Name: {userData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#94a3b8" />
              <Text style={styles.infoText}>DOB: {userData.dateOfBirth}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="body" size={18} color="#94a3b8" />
              <Text style={styles.infoText}>Gender: {userData.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="home" size={18} color="#94a3b8" />
              <Text style={styles.infoText}>Address: {userData.address}</Text>
            </View>
          </BlurView>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, currentSection === 0 && styles.progressStepActive]}>
              <Text style={styles.progressText}>1</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={[styles.progressStep, currentSection === 1 && styles.progressStepActive]}>
              <Text style={styles.progressText}>2</Text>
            </View>
          </View>

          {/* Section Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, currentSection === 0 && styles.tabActive]}
              onPress={() => setCurrentSection(0)}
            >
              <Text style={[styles.tabText, currentSection === 0 && styles.tabTextActive]}>
                Emergency Contacts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, currentSection === 1 && styles.tabActive]}
              onPress={() => setCurrentSection(1)}
            >
              <Text style={[styles.tabText, currentSection === 1 && styles.tabTextActive]}>
                Medical Info
              </Text>
            </TouchableOpacity>
          </View>

          {/* Emergency Contacts Section */}
          {currentSection === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Emergency Contacts {emergencyContacts.length > 0 && `(${emergencyContacts.length})`}
              </Text>
              
              <Text style={styles.sectionDescription}>
                Add at least 2 emergency contacts who will be notified in case of an emergency
              </Text>

              {emergencyContacts.map((contact, index) => (
                <BlurView key={index} intensity={80} tint="dark" style={styles.contactCard}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactNumber}>#{index + 1}</Text>
                    {index >= 2 && (
                      <TouchableOpacity 
                        onPress={() => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index))}
                      >
                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Ionicons name="person" size={18} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#94a3b8"
                      value={contact.name}
                      onChangeText={(text) => updateEmergencyContact(index, 'name', text)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Ionicons name="call" size={18} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      value={contact.phone}
                      onChangeText={(text) => updateEmergencyContact(index, 'phone', text)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Ionicons name="heart" size={18} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Relation (e.g., Father, Friend)"
                      placeholderTextColor="#94a3b8"
                      value={contact.relation}
                      onChangeText={(text) => updateEmergencyContact(index, 'relation', text)}
                    />
                  </View>
                </BlurView>
              ))}

              {emergencyContacts.length < 5 && (
                <TouchableOpacity style={styles.addButton} onPress={addEmergencyContact}>
                  <Ionicons name="add-circle" size={20} color="#38bdf8" />
                  <Text style={styles.addButtonText}>Add Another Contact</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.nextButton}
                onPress={() => setCurrentSection(1)}
              >
                <Text style={styles.nextButtonText}>Next: Medical Information</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Medical Information Section */}
          {currentSection === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medical Information</Text>
              
              <Text style={styles.sectionDescription}>
                This information helps first responders provide better care in emergencies
              </Text>

              <BlurView intensity={80} tint="dark" style={styles.medicalCard}>
                <View style={styles.inputGroup}>
                  <Ionicons name="water" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Blood Group (Optional)"
                    placeholderTextColor="#94a3b8"
                    value={medicalInfo.bloodGroup}
                    onChangeText={(text) => setMedicalInfo({...medicalInfo, bloodGroup: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Ionicons name="warning" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Allergies (Optional)"
                    placeholderTextColor="#94a3b8"
                    value={medicalInfo.allergies}
                    onChangeText={(text) => setMedicalInfo({...medicalInfo, allergies: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Ionicons name="medical" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Medical Conditions (Optional)"
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={3}
                    value={medicalInfo.medicalConditions}
                    onChangeText={(text) => setMedicalInfo({...medicalInfo, medicalConditions: text})}
                  />
                </View>
              </BlurView>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setCurrentSection(0)}
                >
                  <Ionicons name="arrow-back" size={20} color="#38bdf8" />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Complete Profile</Text>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  contentContainer: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    top: -10,
    left: -10,
    opacity: 0.4,
    zIndex: -1,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleHighlight: {
    color: '#818cf8',
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: '#6366f1',
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#374151',
    marginHorizontal: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactNumber: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  medicalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#38bdf8',
    marginLeft: 8,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  nextButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
  },
  backButtonText: {
    color: '#38bdf8',
    fontWeight: '500',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    flex: 2,
    marginLeft: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
  },
  userInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#e2e8f0',
    marginLeft: 12,
    fontSize: 15,
  },
});