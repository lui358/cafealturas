import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return null; // Medida de seguridad, no debería ocurrir
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola, {user.nombre}!</Text>
      <Text style={styles.email}>{user.email}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5dc' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3a2e2e', textAlign: 'center', marginBottom: 10 },
  email: { fontSize: 18, color: 'gray', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#d9534f', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});