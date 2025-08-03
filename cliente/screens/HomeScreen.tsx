import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { HomeScreenProps } from '../types/navigation';
import { API_URL } from '../config/api';


interface OpcionPrecio {
  peso: string;
  valor: number;
}

interface Grano {
  _id: string;
  nombre: string;
  origen: string;
  notas: string;
  precios: OpcionPrecio[]; // Aseguramos que el tipo incluye el nuevo campo de precio

}

// Aceptamos 'navigation' como una propiedad para poder movernos a otras pantallas
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [granos, setGranos] = useState<Grano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGranos = async () => {
      try {
        const response = await axios.get(`${API_URL}/granos`);
        setGranos(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGranos();
  }, []);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6f4e37" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={granos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          // Envolvemos cada item en un 'TouchableOpacity' para hacerlo tappable
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { granoId: item._id })}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Nombre: {item.nombre}</Text>
                <Text style={styles.itemSubtitle}>Origen: {item.origen}</Text>
                {/* Modificamos esta línea para mostrar el precio inicial */}
                <Text style={styles.itemPrice}>Desde ${item.precios[0].valor.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { backgroundColor: '#ffffff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', color: '#6f4e37' },
  itemSubtitle: { fontSize: 16, color: '#7a7a7a', marginTop: 4 },
  itemPrice: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#3a2e2e',
  marginTop: 10,
  textAlign: 'right',
},
});
