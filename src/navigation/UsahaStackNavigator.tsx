import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessUnitSelectorScreen from '../screens/usaha/BusinessUnitSelectorScreen';
import UnitDashboardScreen from '../screens/usaha/UnitDashboardScreen';

const UsahaStack = createNativeStackNavigator();

const UsahaStackNavigator = () => {
  return (
    <UsahaStack.Navigator
        screenOptions={{
             headerStyle: {
              backgroundColor: '#4f46e5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
        }}
    >
      <UsahaStack.Screen
        name="BusinessUnitSelector"
        component={BusinessUnitSelectorScreen}
        options={{ title: 'Pilih Unit Usaha' }}
      />
      <UsahaStack.Screen
        name="UnitDashboard"
        component={UnitDashboardScreen}
        options={({ route }: any) => ({ title: route.params?.unitName || 'Dashboard Usaha' })}
      />
      {/* Add other screens related to a business unit here, e.g., ProductManagementScreen */}
    </UsahaStack.Navigator>
  );
};

export default UsahaStackNavigator;
