import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { CrearPedidoScreenProps } from '../types/navigation';

export default function CrearPedidoScreen({ navigation }: CrearPedidoScreenProps) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [redSocial, setRedSocial] = useState('Instagram'); // Valor por defecto
  const [detallePedido, setDetallePedido] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [error, setError] = useState('');

  const handleCrearPedido = async () => {
    setError('');
    if (!nombreCliente || !detallePedido || !montoTotal) {
      setError('Nombre, detalle y monto son obligatorios.');
      return;
    }

    try {
      await axios.post(`${API_URL}/pedidos`, {
        nombreCliente,
        redSocial,
        detallePedido,
        montoTotal: parseFloat(montoTotal), // Convertimos el monto a número
      });

      Alert.alert('Éxito', 'El pedido ha sido registrado correctamente.');
      navigation.goBack(); // Volver al panel de administración
    } catch (err) {
      setError('No se pudo crear el pedido. Intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Pedido</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre del Cliente"
        value={nombreCliente}
        onChangeText={setNombreCliente}
      />

      <Text style={styles.label}>Red Social de Origen:</Text>
      <View style={styles.socialContainer}>
        {['Instagram', 'Facebook', 'WhatsApp'].map(social => (
          <TouchableOpacity
            key={social}
            style={[styles.socialButton, redSocial === social && styles.socialButtonSelected]}
            onPress={() => setRedSocial(social)}
          >
            <Text style={[styles.socialText, redSocial === social && styles.socialTextSelected]}>{social}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Detalle del Pedido (ej. 2x Arabica 500g...)"
        value={detallePedido}
        onChangeText={setDetallePedido}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Monto Total (ej. 359.98)"
        value={montoTotal}
        onChangeText={setMontoTotal}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCrearPedido}>
        <Text style={styles.buttonText}>Guardar Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5dc' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3a2e2e', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  label: { fontSize: 16, color: '#3a2e2e', marginBottom: 10, fontWeight: '600' },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  socialButton: { borderWidth: 1, borderColor: '#6f4e37', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 },
  socialButtonSelected: { backgroundColor: '#6f4e37' },
  socialText: { color: '#6f4e37', fontWeight: 'bold' },
  socialTextSelected: { color: '#fff' },
  button: { backgroundColor: '#2E8B57', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 16 },
});
