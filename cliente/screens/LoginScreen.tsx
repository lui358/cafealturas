import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { LoginScreenProps } from '../types/navigation';
import { useAuthStore } from '../store/authStore'; // Importamos el auth store
import { API_URL } from '../config/api';


export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login); // Obtenemos la acción de login del store

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        email,
        password,
      });

      // Guardamos los datos del usuario en el estado global
      login(response.data.usuario, response.data.token);

      Alert.alert('¡Bienvenido!', `Hola, ${response.data.usuario.nombre}`);
      navigation.navigate('Home'); // Redirigir a la pantalla principal
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Correo Electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5dc' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#3a2e2e', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#6f4e37', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#6f4e37', textAlign: 'center', marginTop: 20, fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 16 },
});