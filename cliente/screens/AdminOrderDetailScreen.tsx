import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { AdminOrderDetailScreenProps } from '../types/navigation';

interface Pedido {
  _id: string;
  nombreCliente: string;
  redSocial: string;
  detallePedido: string;
  montoTotal: number;
  estado: string;
  fechaCreacion: string;
}

const ESTADOS_POSIBLES = ['Pendiente', 'Pagado', 'En Preparación', 'Listo para Entrega', 'Confirmó Entrega', 'Cerrado', 'Cancelado'];

export default function AdminOrderDetailScreen({ route, navigation }: AdminOrderDetailScreenProps) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPedido = async () => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${pedidoId}`);
      setPedido(response.data);
    } catch (error) {
      console.error("Error al obtener el detalle del pedido:", error);
      if (Platform.OS === 'web') {
        alert("Error: No se pudo cargar el pedido.");
      } else {
        Alert.alert("Error", "No se pudo cargar el pedido.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedido();
  }, []);

  const handleUpdateStatus = async (nuevoEstado: string) => {
    try {
      await axios.put(`${API_URL}/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
      const message = "El estado del pedido ha sido actualizado.";
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Éxito", message);
      }
      setPedido(prev => prev ? { ...prev, estado: nuevoEstado } : null);
    } catch (error) {
      const message = "No se pudo actualizar el estado.";
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Error", message);
      }
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6f4e37" /></View>;
  }

  if (!pedido) {
    return <View style={styles.centered}><Text>Pedido no encontrado.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pedido de {pedido.nombreCliente}</Text>
        <Text style={styles.subtitle}>Recibido vía: {pedido.redSocial}</Text>
        <Text style={styles.total}>Total: ${pedido.montoTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles</Text>
        <Text style={styles.detalleText}>{pedido.detallePedido}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actualizar Estado</Text>
        <View style={styles.statusContainer}>
          {ESTADOS_POSIBLES.map(estado => (
            <TouchableOpacity
              key={estado}
              disabled={pedido.estado === estado}
              style={[styles.statusButton, pedido.estado === estado && styles.statusButtonSelected]}
              onPress={() => handleUpdateStatus(estado)}
            >
              <Text style={[styles.statusText, pedido.estado === estado && styles.statusTextSelected]}>{estado}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BOTÓN PARA VOLVER A LA LISTA */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>‹ Volver a la Lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5dc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#fff', padding: 20, marginHorizontal: 16, marginTop: 16, borderRadius: 10, elevation: 3 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#3a2e2e', marginBottom: 5 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 10 },
    total: { fontSize: 20, fontWeight: 'bold', color: '#2E8B57', textAlign: 'right' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#6f4e37', marginBottom: 10 },
    detalleText: { fontSize: 16, lineHeight: 24 },
    statusContainer: { flexWrap: 'wrap', flexDirection: 'row' },
    statusButton: { borderWidth: 1, borderColor: '#6f4e37', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, margin: 5 },
    statusButtonSelected: { backgroundColor: '#6f4e37' },
    statusText: { color: '#6f4e37', fontWeight: 'bold' },
    statusTextSelected: { color: '#fff' },
    backButton: { margin: 16, padding: 10, alignItems: 'center' },
    backButtonText: { fontSize: 16, color: '#6f4e37', fontWeight: 'bold' },
});
