import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook

type KYCScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KYCScreen'>;

export function KYCScreen() {
  const navigation = useNavigation<KYCScreenNavigationProp>();
  const { t } = useTranslation(); // Translation hook
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Aadhaar, 2: OTP, 3: Verified
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  const handleAadhaarSubmit = () => {
    if (!/^\d{12}$/.test(aadhaar)) {
      Alert.alert(t('invalid_aadhaar_title'), t('invalid_aadhaar_message'));
      return;
    }
    
    setLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      // In a real app, you would trigger an actual OTP send here
      Alert.alert(t('otp_sent_title'), t('otp_sent_message'));
    }, 1500);
  };

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert(t('invalid_otp_title'), t('invalid_otp_message'));
      return;
    }

    setLoading(true);
    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setStep(3);
      const verifiedUserData = {
        name: 'Rajesh Kumar',
        dateOfBirth: '15-08-1990',
        gender: 'Male',
        address: '123, MG Road, Gangtok, Sikkim - 737101',
      };
      setUserData(verifiedUserData);
      // After successful verification, navigate to ProfileSetup
      navigation.replace('ProfileSetup', {
        userData: verifiedUserData,
      });
    }, 1500);
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
          {/* Header with Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={40} color="#6366f1" />
            <View style={styles.iconGlow} />
          </View>

          <Text style={styles.title}>
            {t('kyc_title')} <Text style={styles.titleHighlight}>{t('kyc_verification')}</Text>
          </Text>

          <Text style={styles.subtitle}>
            {t('kyc_description')}
          </Text>

          {step === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="key" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('enter_aadhaar')}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={12}
                  value={aadhaar}
                  onChangeText={setAadhaar}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleAadhaarSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{t('send_otp')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0f172a" style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.privacyText}>
                {t('privacy_notice')}
              </Text>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.otpPrompt}>
                {t('otp_prompt')} ••••{aadhaar.slice(8)}
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('enter_otp')}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{t('verify_continue')}</Text>
                    <Ionicons name="checkmark" size={20} color="#0f172a" style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendContainer}>
                <Text style={styles.resendText}>{t('no_otp_received')} </Text>
                <Text style={styles.resendLink}>{t('resend_otp')}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <BlurView intensity={90} tint="dark" style={styles.blurView}>
              <View style={styles.progressContainer}>
                <ActivityIndicator size="small" color="#ffffff" style={styles.progressIndicator} />
                <Text style={styles.progressText}>{t('proceeding_to_profile')}</Text>
              </View>
            </BlurView>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
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
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  button: {
    flexDirection: 'row',
    backgroundColor: '#38bdf8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  privacyText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  otpPrompt: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resendText: {
    color: '#64748b',
  },
  resendLink: {
    color: '#38bdf8',
    fontWeight: '500',
  },
  verifiedBlurContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  verifiedContent: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  verifiedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
    textAlign: 'center',
  },
  verifiedSubtitle: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 24,
  },
  userInfoContainer: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#e2e8f0',
    marginLeft: 12,
    fontSize: 14,
  },
  progressIndicator: {
    marginBottom: 8,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  blurView: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    padding: 24,
    alignItems: 'center',
  },
});