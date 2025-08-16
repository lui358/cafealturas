import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined; // La pantalla Home no recibe parámetros
  Detail: { granoId: string }; // La pantalla Detail recibe el ID de un grano
  Cart: undefined;
  Login: undefined;
  Register: undefined;
  AdminDashboard: undefined; 
  CrearPedido: undefined;  
  AdminOrderDetail: { pedidoId: string };
};

// Exportamos los tipos para cada pantalla para usarlos fácilmente
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;
export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type AdminDashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;
export type CrearPedidoScreenProps = NativeStackScreenProps<RootStackParamList, 'CrearPedido'>;
export type AdminOrderDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminOrderDetail'>;
