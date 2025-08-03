import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { RegisterScreenProps } from '../types/navigation';
import { API_URL } from '../config/api';


export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigoPostal, setCodigoPostal] = useState(''); 
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async () => {
    setError(''); // Limpiar errores previos
    // --- Validación del Frontend ---
    if (!nombre || !email || !password || !codigoPostal) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // --- Llamada a la API ---
      const response = await axios.post(`${API_URL}/usuarios/registro`, {
        nombre,
        email,
        password,
        codigoPostal,
      });
      Alert.alert('¡Registro Exitoso!', response.data.message);
      navigation.navigate('Login'); // Redirigir al login después del registro
    } catch (err: any) {
      // Mostrar error del servidor (ej. "email ya en uso")
      setError(err.response?.data?.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Nombre Completo" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Correo Electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Código Postal" value={codigoPostal} onChangeText={setCodigoPostal} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia Sesión</Text>
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
