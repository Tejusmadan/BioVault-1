import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * BiometricPrompt Component
 * Handles biometric authentication with fingerprint or Face ID
 */
const BiometricPrompt = ({ onSuccess, onError, onCancel, promptMessage = 'Authenticate to continue' }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    initializeBiometric();
  }, []);

  useEffect(() => {
    if (isAuthenticating) {
      startPulseAnimation();
    }
  }, [isAuthenticating]);

  const initializeBiometric = async () => {
    const available = await checkBiometricAvailability();
    // Automatically trigger authentication when component mounts
    if (available) {
      setTimeout(() => {
        handleAuthenticate();
      }, 500);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const checkBiometricAvailability = async () => {
    try {
      // Check if hardware is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      console.log('Biometric hardware available:', hasHardware);

      if (!hasHardware) {
        setIsAvailable(false);
        console.log('No biometric hardware detected');
        // Don't show alert, just log - passcode will be used
        setIsAvailable(true); // Still allow authentication with passcode
        setBiometricType('Passcode');
        return true;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Biometric enrolled:', isEnrolled);

      if (!isEnrolled) {
        setIsAvailable(false);
        console.log('No biometric data enrolled');
        // Don't show alert, just log - passcode will be used
        setIsAvailable(true); // Still allow authentication with passcode
        setBiometricType('Passcode');
        return true;
      }

      // Get supported authentication types
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported authentication types:', supportedTypes);

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris');
      } else {
        setBiometricType('Passcode');
      }

      setIsAvailable(true);
      return true;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(true); // Still allow authentication with passcode
      setBiometricType('Passcode');
      return true;
    }
  };

  const handleAuthenticate = async () => {
    if (!isAvailable) {
      Alert.alert('Error', 'Authentication is not available.');
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Allow passcode fallback
        fallbackLabel: 'Use Passcode',
        biometricsSecurityLevel: 'strong', // Prefer strong biometrics (Face ID, Fingerprint)
      });

      setIsAuthenticating(false);

      if (result.success) {
        // Authentication successful
        const biometricData = {
          authenticated: true,
          type: biometricType,
          timestamp: new Date().toISOString(),
          success: result.success,
        };

        if (onSuccess) {
          onSuccess(biometricData);
        }
      } else {
        // Authentication failed or cancelled
        if (result.error === 'user_cancel' || result.error === 'app_cancel') {
          if (onCancel) {
            onCancel();
          }
        } else {
          const errorMessage = getErrorMessage(result.error);
          Alert.alert('Authentication Failed', errorMessage);
          if (onError) {
            onError(result.error);
          }
        }
      }
    } catch (error) {
      setIsAuthenticating(false);
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'An unexpected error occurred during authentication.');
      if (onError) {
        onError(error);
      }
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case 'user_cancel':
        return 'Authentication was cancelled by user.';
      case 'system_cancel':
        return 'Authentication was cancelled by system.';
      case 'authentication_failed':
        return 'Authentication failed. Please try again.';
      case 'not_enrolled':
        return 'No biometric data enrolled.';
      case 'passcode_not_set':
        return 'Device passcode is not set.';
      case 'lockout':
        return 'Too many failed attempts. Please try again later.';
      case 'lockout_permanent':
        return 'Biometric authentication is locked. Please use device passcode.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableIcon}>⚠️</Text>
          <Text style={styles.unavailableText}>
            Biometric authentication is not available on this device.
          </Text>
          <Text style={styles.unavailableSubtext}>
            Please ensure you have set up fingerprint or Face ID in your device settings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.biometricIconContainer,
          { transform: [{ scale: isAuthenticating ? pulseAnim : 1 }] },
        ]}
      >
        <Text style={styles.biometricIcon}>
          {biometricType === 'Face ID' ? '👤' : '👆'}
        </Text>
      </Animated.View>

      <Text style={styles.title}>{promptMessage}</Text>
      <Text style={styles.subtitle}>
        Use {biometricType} to authenticate
      </Text>

      <TouchableOpacity
        style={[styles.button, isAuthenticating && styles.buttonDisabled]}
        onPress={handleAuthenticate}
        disabled={isAuthenticating}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {isAuthenticating ? 'Authenticating...' : `Authenticate with ${biometricType}`}
        </Text>
      </TouchableOpacity>

      {isAuthenticating && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setIsAuthenticating(false);
            if (onCancel) {
              onCancel();
            }
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your biometric data never leaves your device and is processed securely.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  biometricIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  biometricIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a78bfa',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    maxWidth: 320,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  unavailableContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  unavailableIcon: {
    fontSize: 60,
    marginBottom: 24,
  },
  unavailableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  unavailableSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BiometricPrompt;
