import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from './store/cartStore';
import { RootStackParamList } from './types/navigation';

// Importamos todas nuestras pantallas
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import CrearPedidoScreen from './screens/CrearPedidoScreen';
import AdminOrderDetailScreen from './screens/AdminOrderDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// --- NAVEGADORES ANIDADOS ---

function TiendaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function CuentaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Creamos el Stack para el flujo de Administración
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="CrearPedido" component={CrearPedidoScreen} />
      <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} />
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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
            if (route.name === 'Tienda') iconName = focused ? 'cafe' : 'cafe-outline';
            else if (route.name === 'Carrito') iconName = focused ? 'cart' : 'cart-outline';
            else if (route.name === 'Cuenta') iconName = focused ? 'person-circle' : 'person-circle-outline';
            else if (route.name === 'Admin') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Tienda" component={TiendaStack} options={{ title: 'Nuestros Granos de Café' }}/>
        <Tab.Screen name="Carrito" component={CartScreen} options={{ tabBarBadge: totalItems > 0 ? totalItems : undefined, title: 'Mi Carrito' }} />
        <Tab.Screen name="Cuenta" component={CuentaStack} options={{ title: 'Mi Cuenta' }}/>
        {/* Ahora usamos el AdminStack correctamente */}
        <Tab.Screen name="Admin" component={AdminStack} options={{ title: 'Admin Panel' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}