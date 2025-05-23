// AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import WeightInput from '../screens/Add';
import WeightChart from '../screens/Visualizer';
import LoginScreen from '../screens/Login';
import { Ionicons } from '@expo/vector-icons'; // O react-native-vector-icons

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs para usuarios logueados
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Peso') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Visualizer') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name="barbell-outline" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Peso" component={WeightInput} />
      <Tab.Screen name="Visualizer" component={WeightInput} />
      <Tab.Screen name="Perfil" component={WeightChart} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={BottomTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
