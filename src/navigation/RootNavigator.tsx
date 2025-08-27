import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../modules/dashboard/screens/DashboardScreen';
import { GoalsScreen } from '../modules/goals/screens/GoalsScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { Ionicons } from '@expo/vector-icons';

export type RootTabParamList = {
  Dashboard: undefined;
  Goals: undefined;
  Habits: undefined;
  Scan: undefined;
  History: undefined;
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
          let iconName: keyof typeof Ionicons.glyphMap = 'grid-outline';
          switch (route.name) {
            case 'Dashboard': iconName = 'grid-outline'; break;
            case 'Goals': iconName = 'flag-outline'; break;
            case 'Habits': iconName = 'checkbox-outline'; break;
            case 'Scan': iconName = 'camera-outline'; break;
            case 'History': iconName = 'time-outline'; break;
            case 'Profile': iconName = 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};