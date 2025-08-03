import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

// La configuración de la API que ya funciona
const YOUR_LOCAL_IP = '192.168.1.64';
const API_URL = `http://${YOUR_LOCAL_IP}:4000/api/granos`;

export default function App() {
  // Volvemos a usar un estado que espera un array de granos
  const [granos, setGranos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGranos = async () => {
      try {
        const response = await axios.get(API_URL);
        setGranos(response.data); // Guardamos el array completo en el estado
      } catch (err) {
        setError('No se pudo conectar al servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchGranos();
  }, []);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6f4e37" /><Text>Cargando desde el servidor...</Text></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // Volvemos a usar la FlatList, que ahora funcionará correctamente
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Nuestros Granos de Café</Text>
      <FlatList
        data={granos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Nombre: {item.nombre}</Text>
            <Text style={styles.itemSubtitle}>Origen: {item.origen}</Text>
            <Text style={styles.itemNotes}>Notas: {item.notas}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Los estilos finales y limpios
const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 30, backgroundColor: '#f5f5dc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#3a2e2e' },
  itemContainer: { backgroundColor: '#ffffff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', color: '#6f4e37' },
  itemSubtitle: { fontSize: 16, color: '#7a7a7a', marginTop: 4 },
  itemNotes: { fontSize: 14, color: '#333', marginTop: 8, fontStyle: 'italic' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', margin: 20 },
});