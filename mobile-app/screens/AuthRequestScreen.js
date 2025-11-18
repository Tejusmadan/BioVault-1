import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import BiometricPrompt from '../components/BiometricPrompt';
import { api } from '../utils/api';

const { width } = Dimensions.get('window');

/**
 * AuthRequestScreen Component
 * Shows authentication request details and handles approval/denial with biometric auth
 */
const AuthRequestScreen = ({ route, navigation }) => {
  const { authRequest } = route.params;
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [processed, setProcessed] = useState(false);
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Start urgent pulse animation
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleApprove = () => {
    if (processed) return;
    setShowBiometric(true);
  };

  const handleDeny = () => {
    if (processed) return;

    Alert.alert(
      'Deny Authentication',
      'Are you sure you want to deny this login request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deny',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.denyAuthRequest(authRequest.requestId);

              if (response.success) {
                setProcessed(true);
                Alert.alert('Request Denied', 'The login request has been denied.', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } else {
                Alert.alert(
                  'Error',
                  response.message || 'Failed to deny the request. Please try again.'
                );
              }
            } catch (error) {
              console.error('Error denying auth request:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message ||
                  'Failed to deny the request. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBiometricSuccess = async (biometricData) => {
    setLoading(true);
    try {
      const response = await api.approveAuthRequest(
        authRequest.requestId,
        biometricData
      );

      if (response.success) {
        setProcessed(true);
        setShowBiometric(false);
        Alert.alert(
          'Authentication Approved',
          'The login request has been approved successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to approve the request. Please try again.'
        );
        setShowBiometric(false);
      }
    } catch (error) {
      console.error('Error approving auth request:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to approve the request. Please try again.'
      );
      setShowBiometric(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
  };

  if (showBiometric) {
    return (
      <BiometricPrompt
        promptMessage="Authenticate to approve login"
        onSuccess={handleBiometricSuccess}
        onCancel={handleBiometricCancel}
      />
    );
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Alert Icon */}
          <Animated.View
            style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
          >
            <Text style={styles.icon}>🔐</Text>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Authentication Request</Text>
          <Text style={styles.subtitle}>
            Someone is trying to log in to your account
          </Text>

          {/* Request Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>📋</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Context</Text>
                <Text style={styles.detailValue}>
                  {authRequest.context || 'Authentication Request'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>🔑</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Request ID</Text>
                <Text style={styles.detailValue}>
                  {authRequest.requestId ? authRequest.requestId.substring(0, 8) + '...' : 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailIconText}>🕐</Text>
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {formatTimestamp(authRequest.timestamp)}
                </Text>
              </View>
            </View>
          </View>

          {/* Security Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Security Check</Text>
              <Text style={styles.warningText}>
                Only approve this request if you recognize the details above and are
                trying to log in right now.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.approveButton,
                (loading || processed) && styles.buttonDisabled,
              ]}
              onPress={handleApprove}
              disabled={loading || processed}
              activeOpacity={0.8}
            >
              <Text style={styles.approveButtonIcon}>✓</Text>
              <Text style={styles.approveButtonText}>
                {loading ? 'Processing...' : 'Approve Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.denyButton,
                (loading || processed) && styles.buttonDisabled,
              ]}
              onPress={handleDeny}
              disabled={loading || processed}
              activeOpacity={0.8}
            >
              <Text style={styles.denyButtonIcon}>✕</Text>
              <Text style={styles.denyButtonText}>Deny Login</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              If you didn't request this login, deny it immediately and consider
              changing your password.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
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
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIconText: {
    fontSize: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  approveButtonIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  denyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  denyButtonIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e0e7ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#3730a3',
    lineHeight: 20,
  },
});

export default AuthRequestScreen;
