import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { AdminDashboardScreenProps } from '../types/navigation';

// Definimos la interfaz para un Pedido
interface Pedido {
  _id: string;
  nombreCliente: string;
  redSocial: string;
  detallePedido: string;
  montoTotal: number;
  estado: string;
  fechaCreacion: string;
}

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pedidos`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect se ejecuta cada vez que la pantalla entra en foco.
  // Esto asegura que la lista de pedidos se actualice si volvemos de otra pantalla.
  useFocusEffect(
    useCallback(() => {
      fetchPedidos();
    }, [])
  );

  const renderItem = ({ item }: { item: Pedido }) => (
    <TouchableOpacity 
    style={styles.pedidoContainer}
    onPress={() => navigation.navigate('AdminOrderDetail', { pedidoId: item._id })}
  >
      <View style={styles.pedidoHeader}>
        <Text style={styles.clienteNombre}>{item.nombreCliente}</Text>
        <Text style={styles.pedidoTotal}>${item.montoTotal.toFixed(2)}</Text>
      </View>
      <Text style={styles.pedidoDetalle}>Vía: {item.redSocial}</Text>
      <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
        <Text style={styles.estadoTexto}>{item.estado}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6f4e37" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pedidos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos registrados.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CrearPedido')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Función para dar un color diferente a cada estado del pedido
const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Pendiente': return '#f0ad4e';
    case 'En Preparación': return '#5bc0de';
    case 'Listo para Entrega': return '#337ab7';
    case 'Completado': return '#5cb85c';
    case 'Cancelado': return '#d9534f';
    default: return '#777';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pedidoContainer: { backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3 },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  clienteNombre: { fontSize: 18, fontWeight: 'bold', color: '#3a2e2e' },
  pedidoTotal: { fontSize: 18, fontWeight: 'bold', color: '#2E8B57' },
  pedidoDetalle: { fontSize: 14, color: 'gray', marginBottom: 10 },
  estadoBadge: { borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-start' },
  estadoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  addButton: { position: 'absolute', right: 30, bottom: 30, backgroundColor: '#6f4e37', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  addButtonText: { color: '#fff', fontSize: 30, lineHeight: 30 },
});
