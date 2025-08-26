import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

export type RootTabParamList = {
  Home: undefined;
  Scan: undefined;
  Habits: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { backgroundColor: '#fff' },
        headerStyle: { backgroundColor: '#f8fafc' },
        headerShadowVisible: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Scan':
              iconName = 'camera';
              break;
            case 'Habits':
              iconName = 'checkmark-done';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Scan" component={ScanScreen} options={{ title: 'Scan' }} />
      <Tab.Screen name="Habits" component={HabitsScreen} options={{ title: 'Habits' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};