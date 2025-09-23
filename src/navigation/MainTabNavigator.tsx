import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import UsahaStackNavigator from './UsahaStackNavigator';
import PengajuanScreen from '../screens/PengajuanScreen';
import KeuanganScreen from '../screens/KeuanganScreen';
import KoperasiScreen from '../screens/KoperasiScreen';
import PengaturanScreen from '../screens/PengaturanScreen';

// Assuming you have an icon component or library
// import { Feather } from '@expo/vector-icons';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Dashboard') iconName = 'layout';
          else if (route.name === 'Usaha') iconName = 'briefcase';
          else if (route.name === 'Pengajuan') iconName = 'file-text';
          else if (route.name === 'Keuangan') iconName = 'dollar-sign';
          else if (route.name === 'Koperasi') iconName = 'users';
          else if (route.name === 'Pengaturan') iconName = 'settings';

          // return <Feather name={iconName as any} size={size} color={color} />;
          return <Text style={{ color }}>{iconName.slice(0, 4)}</Text>;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4f46e5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Usaha" component={UsahaStackNavigator} options={{ headerShown: false }}/>
      <Tab.Screen name="Pengajuan" component={PengajuanScreen} />
      <Tab.Screen name="Keuangan" component={KeuanganScreen} />
      <Tab.Screen name="Koperasi" component={KoperasiScreen} />
      <Tab.Screen name="Pengaturan" component={PengaturanScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
