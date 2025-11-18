import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import BiometricPrompt from '../components/BiometricPrompt';
import { api } from '../utils/api';

/**
 * PairingScreen Component
 * Handles QR code scanning and device pairing with biometric authentication
 */
const PairingScreen = ({ route, navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    console.log('PairingScreen mounted');
    console.log('Permission state:', permission);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    console.log('Permission changed:', permission);
  }, [permission]);

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Permission Required',
        'Camera access is required to scan QR codes for pairing.',
        [{ text: 'OK' }]
      );
    }
    return result.granted;
  };

  const handleStartScanning = async () => {
    if (!permission) {
      return;
    }
    if (!permission.granted) {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Error', 'Camera permission denied.');
        return;
      }
    }
    setScanning(true);
    setScanned(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setScanning(false);

    try {
      // Parse QR code data
      let pairingData;
      try {
        pairingData = JSON.parse(data);
      } catch {
        // If not JSON, treat as plain pairing code
        pairingData = { code: data };
      }

      const code = pairingData.code || pairingData.pairingCode || data;
      setPairingCode(code);

      // Verify the pairing code
      await verifyAndPair(code);
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Invalid QR Code',
        'The scanned QR code is not valid for BioVault pairing.',
        [
          {
            text: 'Scan Again',
            onPress: () => {
              setScanned(false);
              setScanning(true);
            },
          },
          { text: 'Cancel', onPress: () => setScanning(false) },
        ]
      );
    }
  };

  const handleManualPairing = async () => {
    if (!pairingCode.trim()) {
      Alert.alert('Error', 'Please enter a pairing code.');
      return;
    }
    await verifyAndPair(pairingCode.trim());
  };

  const verifyAndPair = async (code) => {
    setLoading(true);
    try {
      const response = await api.verifyPairingCode(code);

      if (response.success) {
        setSessionId(response.sessionId);
        setShowBiometric(true);
      } else {
        Alert.alert(
          'Invalid Code',
          response.message || 'The pairing code is invalid or expired.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setPairingCode('');
                setScanned(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error verifying pairing code:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to verify pairing code. Please check your internet connection and try again.',
        [
          {
            text: 'Retry',
            onPress: () => {
              setPairingCode('');
              setScanned(false);
            },
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = async (biometricData) => {
    setLoading(true);
    try {
      const deviceName = Device.deviceName || 'My Device';

      const response = await api.completePairing(sessionId, deviceName, biometricData);

      if (response.success) {
        Alert.alert(
          'Pairing Successful',
          'Your device has been paired successfully with BioVault!',
          [
            {
              text: 'Continue',
              onPress: () => {
                if (route.params?.onPairingComplete) {
                  route.params.onPairingComplete();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Pairing Failed',
          response.message || 'Failed to complete pairing. Please try again.'
        );
        setShowBiometric(false);
      }
    } catch (error) {
      console.error('Error completing pairing:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to complete pairing. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setShowBiometric(false),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
    setPairingCode('');
    setSessionId(null);
    setScanned(false);
  };

  if (showBiometric) {
    return (
      <BiometricPrompt
        promptMessage="Authenticate to pair device"
        onSuccess={handleBiometricSuccess}
        onCancel={handleBiometricCancel}
      />
    );
  }

  if (scanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>Scan the QR code from BioVault</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setScanning(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Debug render
  console.log('Rendering PairingScreen, permission:', permission, 'scanning:', scanning, 'showBiometric:', showBiometric);

  // Show loading if permission is still being checked
  if (permission === null) {
    console.log('Permission is null, showing loading');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 20, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering main UI');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔐</Text>
          <Text style={styles.title}>Pair Your Device</Text>
          <Text style={styles.subtitle}>
            Connect your mobile device to BioVault for secure biometric authentication
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Pair:</Text>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Open BioVault on your computer and go to Settings
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Click "Add Mobile Device" to generate a QR code
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Scan the QR code or enter the pairing code manually
            </Text>
          </View>
        </View>

        {/* QR Scanner Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleStartScanning}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.scanButtonIcon}>📷</Text>
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Entry Button */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualEntry(true)}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.manualButtonText}>Enter Pairing Code Manually</Text>
          <Text style={styles.manualButtonIcon}>✏️</Text>
        </TouchableOpacity>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your device will be securely paired using end-to-end encryption. Your
            biometric data never leaves your device.
          </Text>
        </View>
      </ScrollView>

      {/* Manual Entry Modal */}
      <Modal
        visible={showManualEntry}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowManualEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Pairing Code</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowManualEntry(false);
                  setPairingCode('');
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter the 6-character code displayed on your computer
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="ABC123"
              placeholderTextColor="#9ca3af"
              value={pairingCode}
              onChangeText={setPairingCode}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus={true}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.modalPairButton, loading && styles.pairButtonDisabled]}
              onPress={async () => {
                await handleManualPairing();
                setShowManualEntry(false);
              }}
              activeOpacity={0.8}
              disabled={loading || !pairingCode.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalPairButtonText}>Pair Device</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    paddingTop: 4,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#7c3aed',
    marginBottom: 24,
  },
  manualButtonText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  manualButtonIcon: {
    fontSize: 18,
  },
  pairButtonDisabled: {
    backgroundColor: '#a78bfa',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    fontSize: 24,
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
    marginBottom: 24,
  },
  modalPairButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPairButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3e8ff',
    padding: 16,
    borderRadius: 12,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  scannerContainer: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 32,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  cancelButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PairingScreen;
