import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import MyLogo from '../../assets/favicon.png';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Animated,
  Easing,
  Dimensions,
  Modal,
  ScrollView 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  useEffect(() => {
    // Load saved language preference
    loadLanguagePreference();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
    ]).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      console.log('HomeScreen: Loaded saved language:', savedLanguage);

      if (savedLanguage) {
        const languageObj = languages.find(lang => lang.code === savedLanguage);
        if (languageObj) {
          setCurrentLanguage(languageObj);
          i18n.changeLanguage(savedLanguage);
          console.log('HomeScreen: Set language from storage:', languageObj.code);
        }
      } else {
        // Set default based on device language
        const deviceLanguage = i18n.language;
        console.log('HomeScreen: No saved language, device language:', deviceLanguage);
        const matchedLanguage = languages.find(lang => 
          lang.code === deviceLanguage || lang.code === deviceLanguage.split('-')[0]
        );
        if (matchedLanguage) {
          setCurrentLanguage(matchedLanguage);
          i18n.changeLanguage(matchedLanguage.code);
          console.log('HomeScreen: Set language from device:', matchedLanguage.code);
        } else {
          console.log('HomeScreen: No matching device language, defaulting to English.');
        }
      }
    } catch (error) {
      console.error('HomeScreen: Error loading language preference:', error);
    }
  };

  const changeLanguage = async (lng: any) => {
    try {
      console.log('HomeScreen: Attempting to change language to:', lng.code);
      // Save to async storage
      await AsyncStorage.setItem('userLanguage', lng.code);
      console.log('HomeScreen: Saved language to storage:', lng.code);
      
      // Change i18n language
      await i18n.changeLanguage(lng.code);
      console.log('HomeScreen: i18n language changed to:', i18n.language);
      
      // Update local state
      setCurrentLanguage(lng);
      setModalVisible(false);
      
      console.log('HomeScreen: Language changed to:', lng.code);
    } catch (error) {
      console.error('HomeScreen: Error changing language:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg-gradient.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Language Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <BlurView intensity={90} tint="dark" style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('choose_language')}</Text>
              <ScrollView style={styles.languageList}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      currentLanguage.code === language.code && styles.languageItemActive
                    ]}
                    onPress={() => changeLanguage(language)}
                  >
                    <View style={styles.languageTextContainer}>
                      <Text style={styles.languageText}>{language.nativeName}</Text>
                      <Text style={styles.languageSubText}>{language.name}</Text>
                    </View>
                    {currentLanguage.code === language.code && (
                      <Ionicons name="checkmark" size={20} color="#22c55e" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BlurView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Particles and overlay container unchanged */}

      <View style={styles.overlayContainer}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Updated Logo Container - Bigger and no circle */}
          <View style={styles.logoContainer}>
            <Image source={MyLogo} style={styles.logoImage} resizeMode="contain" />
          </View>

          <Text style={styles.title}>
            {t('welcome_to')}{'\n'}
            <Text style={styles.titleHighlight}>{t('app_name')}</Text>
          </Text>

          <Text style={styles.description}>
            {t('explore_with_confidence')}
          </Text>

          {/* Language Selector Button */}
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="language" size={20} color="#38bdf8" />
            <Text style={styles.languageButtonText}>{currentLanguage.nativeName}</Text>
            <Ionicons name="chevron-down" size={16} color="#94a3b8" />
          </TouchableOpacity>

          <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('KYC')}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{t('get_started')}</Text>
                <Ionicons name="arrow-forward" size={22} color="white" style={styles.buttonIcon} />
              </TouchableOpacity>
            </Animated.View>
          </BlurView>

          <View style={styles.securityBadges}>
            <View style={styles.badge}>
              <Ionicons name="lock-closed" size={16} color="#10b981" />
              <Text style={styles.badgeText}>{t('secure')}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="key" size={16} color="#8b5cf6" />
              <Text style={styles.badgeText}>{t('encrypted')}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="finger-print" size={16} color="#f59e0b" />
              <Text style={styles.badgeText}>{t('verified')}</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(8, 8, 24, 0.86)',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
  },
  modalContent: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'rgb(31, 41, 55)',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageItemActive: {
    backgroundColor: 'rgba(56, 191, 248, 0.53)',
  },
  languageTextContainer: {
    flex: 1,
    backgroundColor:'rgba(56, 191, 248, 0)'
  },
  languageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  languageSubText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6366f1',
    opacity: 0.3,
    // filter: 'blur(60px)',
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  //
  logoContainer: {
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // logo image 
  logoImage: {
    width: 250,    
    height: 250,   
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  titleHighlight: {
    color: '#818cf8',
    fontWeight: '800',
  },
  description: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontWeight: '400',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  blurContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.7)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  securityBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  badgeText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
});