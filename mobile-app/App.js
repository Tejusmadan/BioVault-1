import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import PairingScreen from './screens/PairingScreen';
import AuthRequestScreen from './screens/AuthRequestScreen';

const Stack = createStackNavigator();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isDevicePaired, setIsDevicePaired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPairingStatus();
    setupNotifications();
  }, []);

  const checkPairingStatus = async () => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const pairingToken = await SecureStore.getItemAsync('pairingToken');
      setIsDevicePaired(!!(deviceId && pairingToken));
    } catch (error) {
      console.error('Error checking pairing status:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupNotifications = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('auth-requests', {
        name: 'Authentication Requests',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7c3aed',
      });
    }

    // Request notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push notification permissions');
    }
  };

  if (loading) {
    return null; // Or a loading screen component
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#7c3aed',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isDevicePaired ? (
            <Stack.Screen
              name="Pairing"
              component={PairingScreen}
              options={{
                title: 'Pair Device',
                headerShown: true,
              }}
              initialParams={{ onPairingComplete: () => setIsDevicePaired(true) }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Home"
                options={{
                  title: 'BioVault',
                  headerLeft: null,
                }}
              >
                {(props) => <HomeScreen {...props} onUnpair={() => setIsDevicePaired(false)} />}
              </Stack.Screen>
              <Stack.Screen
                name="AuthRequest"
                component={AuthRequestScreen}
                options={{
                  title: 'Authentication Request',
                  presentation: 'modal',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
