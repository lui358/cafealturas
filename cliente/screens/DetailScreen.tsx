import React, { useEffect, useState } from 'react';
// Importamos 'Platform' para detectar si estamos en web o en móvil
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { API_URL } from '../config/api';  


interface OpcionPrecio { peso: string; valor: number; }
interface Grano { _id: string; nombre: string; origen: string; notas: string; precios: OpcionPrecio[]; tostados: string[]; molidos: string[]; }

const OptionSelector = ({ title, options, selected, onSelect }: { title: string, options: string[], selected: string, onSelect: (option: string) => void }) => (
  <View style={styles.optionGroup}>
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={styles.optionsWrapper}>
      {options.map((option) => (
        <TouchableOpacity key={option} style={[styles.optionButton, selected === option && styles.optionButtonSelected]} onPress={() => onSelect(option)}>
          <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function DetailScreen({ route }: { route: any }) {
  const { granoId } = route.params;
  const [grano, setGrano] = useState<Grano | null>(null);
  const [opcionPrecio, setOpcionPrecio] = useState<OpcionPrecio | null>(null);
  const [tostado, setTostado] = useState<string | null>(null);
  const [molido, setMolido] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchGrano = async () => {
      try {
        // const API_URL = `http://${YOUR_LOCAL_IP}:4000/api/granos/${granoId}`;
        const response = await axios.get(`${API_URL}/granos/${granoId}`);
        const data = response.data;
        setGrano(data);
        if (data.precios?.length > 0) setOpcionPrecio(data.precios[0]);
        if (data.tostados?.length > 0) setTostado(data.tostados[0]);
        if (data.molidos?.length > 0) setMolido(data.molidos[0]);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchGrano();
  }, [granoId]);

  const handleAddToCart = () => {
    if (grano && opcionPrecio && tostado && molido) {
      addItemToCart({
        _id: grano._id,
        nombre: grano.nombre,
        opcionPrecio: opcionPrecio,
        tostado: tostado,
        molido: molido,
      });

      const message = `${grano.nombre} ha sido añadido a tu carrito.`;
      // Lógica para mostrar la alerta correcta según la plataforma
      if (Platform.OS === 'web') {
        alert(message); // Usamos la alerta estándar del navegador
      } else {
        Alert.alert("¡Éxito!", message); // Usamos la alerta nativa en móvil
      }
    }
  };

  if (loading || !grano || !opcionPrecio || !tostado || !molido) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6f4e37" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{grano.nombre}</Text>
      <Text style={styles.subtitle}>Origen: {grano.origen}</Text>
      <Text style={styles.price}>${opcionPrecio.valor.toFixed(2)} MXN</Text>
      <OptionSelector title="Peso" options={grano.precios.map(p => p.peso)} selected={opcionPrecio.peso} onSelect={(peso) => setOpcionPrecio(grano.precios.find(p => p.peso === peso)!)} />
      <OptionSelector title="Tostado" options={grano.tostados} selected={tostado} onSelect={setTostado} />
      <OptionSelector title="Molido" options={grano.molidos} selected={molido} onSelect={setMolido} />
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notas de Cata:</Text>
        <Text style={styles.notesText}>{grano.notas}</Text>
      </View>

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Añadir al Carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#3a2e2e', textAlign: 'center', margin: 20 },
  subtitle: { fontSize: 20, color: '#7a7a7a', textAlign: 'center', marginBottom: 20 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', textAlign: 'center', marginBottom: 20 },
  optionGroup: { marginHorizontal: 20, marginVertical: 10 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: '#3a2e2e', marginBottom: 10 },
  optionsWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { borderWidth: 1, borderColor: '#6f4e37', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, marginRight: 10, marginBottom: 10 },
  optionButtonSelected: { backgroundColor: '#6f4e37' },
  optionText: { color: '#6f4e37', fontWeight: 'bold' },
  optionTextSelected: { color: '#fff' },
  notesContainer: { marginHorizontal: 20, padding: 15, backgroundColor: '#fff', borderRadius: 10 },
  notesTitle: { fontSize: 18, fontWeight: 'bold', color: '#6f4e37', marginBottom: 10 },
  notesText: { fontSize: 16, color: '#333', lineHeight: 24 },
  addToCartButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});