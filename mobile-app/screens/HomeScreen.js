import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { api, socketManager } from '../utils/api';

/**
 * HomeScreen Component
 * Main screen showing paired devices and connection status
 */
const HomeScreen = ({ navigation, onUnpair }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectionPulse = new Animated.Value(1);

  useEffect(() => {
    initialize();
    setupNotificationListener();

    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      startConnectionPulse();
    }
  }, [isConnected]);

  const startConnectionPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(connectionPulse, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(connectionPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const initialize = async () => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      setCurrentDeviceId(deviceId);

      await connectWebSocket();
      await loadDevices();
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Error', 'Failed to initialize app. Please restart.');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = async () => {
    try {
      await socketManager.connect(handleAuthRequest);
      setIsConnected(true);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await api.getPairedDevices();
      if (response.success) {
        setDevices(response.devices || []);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load paired devices.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const handleAuthRequest = async (data) => {
    // Show notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Authentication Request',
        body: `Login requested from ${data.browser || 'browser'} on ${data.location || 'unknown location'}`,
        data: { requestId: data.requestId, ...data },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Show immediately
    });

    // Navigate to auth request screen
    navigation.navigate('AuthRequest', { authRequest: data });
  };

  const setupNotificationListener = () => {
    // Handle notification taps
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data.requestId) {
          navigation.navigate('AuthRequest', { authRequest: data });
        }
      }
    );

    return () => subscription.remove();
  };

  const handleUnpair = () => {
    Alert.alert(
      'Unpair Device',
      'Are you sure you want to unpair this device? You will need to pair it again to use BioVault.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.unpairDevice();
              socketManager.disconnect();

              // Notify parent component to update pairing status
              if (onUnpair) {
                onUnpair();
              }

              Alert.alert(
                'Unpaired',
                'Device has been unpaired successfully. You can now pair a new device.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error unpairing device:', error);
              Alert.alert('Error', 'Failed to unpair device. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear all stored credentials and let you pair again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored credentials
              await SecureStore.deleteItemAsync('deviceId');
              await SecureStore.deleteItemAsync('pairingToken');
              await SecureStore.deleteItemAsync('userId');
              socketManager.disconnect();

              // Notify parent component to update pairing status
              if (onUnpair) {
                onUnpair();
              }

              Alert.alert(
                'Reset Complete',
                'App has been reset. You can now pair a new device.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error resetting app:', error);
              Alert.alert('Error', 'Failed to reset app. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderDevice = (device) => {
    const isCurrentDevice = device.deviceId === currentDeviceId;

    return (
      <View
        key={device.deviceId}
        style={[styles.deviceCard, isCurrentDevice && styles.currentDeviceCard]}
      >
        <View style={styles.deviceIcon}>
          <Text style={styles.deviceIconText}>
            {device.deviceType === 'mobile' ? '📱' : '💻'}
          </Text>
        </View>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>
            {device.deviceName}
            {isCurrentDevice && (
              <Text style={styles.currentDeviceLabel}> (This Device)</Text>
            )}
          </Text>
          <Text style={styles.deviceDetails}>
            Last active: {new Date(device.lastActive).toLocaleDateString()}
          </Text>
          <Text style={styles.deviceDetails}>
            Paired: {new Date(device.pairedAt).toLocaleDateString()}
          </Text>
        </View>
        {device.isActive && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Connection Status */}
        <View style={styles.statusCard}>
          <Animated.View
            style={[
              styles.statusIndicator,
              isConnected ? styles.statusConnected : styles.statusDisconnected,
              { transform: [{ scale: isConnected ? connectionPulse : 1 }] },
            ]}
          />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isConnected
                ? 'Ready to authenticate login requests'
                : 'Trying to reconnect...'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔄</Text>
            <Text style={styles.actionButtonText}>Refresh Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonWarning]}
            onPress={handleResetApp}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔁</Text>
            <Text style={styles.actionButtonText}>Reset App (Clear Pairing)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={handleUnpair}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔓</Text>
            <Text style={styles.actionButtonText}>Unpair This Device</Text>
          </TouchableOpacity>
        </View>

        {/* Paired Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paired Devices</Text>
          {devices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📱</Text>
              <Text style={styles.emptyStateText}>No devices paired</Text>
            </View>
          ) : (
            devices.map(renderDevice)
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            When you try to log in to a website, you'll receive a notification on this
            device. Authenticate with your fingerprint or Face ID to approve the login.
          </Text>
          <View style={styles.infoNote}>
            <Text style={styles.infoNoteIcon}>🔒</Text>
            <Text style={styles.infoNoteText}>
              Your biometric data is processed locally and never sent to our servers.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  statusConnected: {
    backgroundColor: '#10b981',
  },
  statusDisconnected: {
    backgroundColor: '#ef4444',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonWarning: {
    backgroundColor: '#fffbeb',
  },
  actionButtonDanger: {
    backgroundColor: '#fef2f2',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentDeviceCard: {
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconText: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentDeviceLabel: {
    color: '#7c3aed',
    fontSize: 14,
  },
  deviceDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  activeIndicator: {
    marginLeft: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoSection: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  infoNoteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
});

export default HomeScreen;
