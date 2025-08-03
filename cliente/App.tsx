import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importamos los íconos
import { useCartStore } from './store/cartStore';
import { RootStackParamList } from './types/navigation';

// Importamos todas nuestras pantallas
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Creamos los dos tipos de navegadores que usaremos
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// --- NAVEGADORES ANIDADOS ---

// 1. Creamos un "Stack" para el flujo de la tienda: Lista -> Detalle
function TiendaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

// 2. Creamos un "Stack" para el flujo de autenticación: Login -> Registro
function CuentaStack() {
  // Más adelante, aquí pondremos lógica para mostrar la pantalla de Perfil si el usuario ya inició sesión
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL DE PESTAÑAS ---

export default function App() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#f5f5dc' },
          headerTintColor: '#3a2e2e',
          tabBarActiveTintColor: '#6f4e37',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#ffffff' },
          // Función para mostrar el ícono correcto en cada pestaña
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Tienda') {
              iconName = focused ? 'cafe' : 'cafe-outline';
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else { // Cuenta
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Definimos nuestras 3 pestañas principales */}
        <Tab.Screen name="Tienda" component={TiendaStack} options={{ title: 'Nuestros Granos de Café' }}/>
        <Tab.Screen name="Carrito" component={CartScreen} options={{ tabBarBadge: totalItems > 0 ? totalItems : undefined, title: 'Mi Carrito' }} />
        <Tab.Screen name="Cuenta" component={CuentaStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}