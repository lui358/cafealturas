import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useCartStore, CartItem } from '../store/cartStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';



export default function CartScreen() {
  // Obtenemos los items y las acciones del store del carrito
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;
const navigation = useNavigation<CartScreenNavigationProp>();

  // Calculamos el precio total del carrito
  const total = items.reduce((acc, item) => acc + item.opcionPrecio.valor * item.cantidad, 0);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemOptions}>{item.opcionPrecio.peso} | {item.tostado} | {item.molido}</Text>
        <Text style={styles.itemPrice}>${item.opcionPrecio.valor.toFixed(2)}</Text>
      </View>
      <View style={styles.itemQuantity}>
        <Text style={styles.quantityText}>x {item.cantidad}</Text>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id + index} // Clave única por si se añade el mismo item con opciones diferentes
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)} MXN</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5dc' },
  emptyText: { fontSize: 18, color: '#7a7a7a' },
  itemContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#6f4e37' },
  itemOptions: { fontSize: 14, color: '#7a7a7a', marginVertical: 4 },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#3a2e2e' },
  itemQuantity: { justifyContent: 'center', alignItems: 'center', paddingLeft: 10 },
  quantityText: { fontSize: 18, fontWeight: 'bold', color: '#3a2e2e' },
  summaryContainer: { borderTopWidth: 1, borderTopColor: '#ddd', padding: 20, backgroundColor: '#fff' },
  totalText: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  checkoutButton: { backgroundColor: '#2E8B57', borderRadius: 10, padding: 15, alignItems: 'center', marginBottom: 10 },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  clearButtonText: { color: 'red', textAlign: 'center', fontSize: 16 },
});