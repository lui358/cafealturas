// Importamos la librería de Express
import express, { Request, Response } from 'express';

// Creamos una instancia de la aplicación Express
const app = express();

// Definimos el puerto en el que correrá el servidor
// Usamos el puerto 4000 para no chocar con el de React Native (que usa el 8081)
const PORT = 4000;

// Middleware para que nuestro servidor entienda JSON
app.use(express.json());

// --- Definición de nuestras rutas (API Endpoints) ---

// Ruta de prueba para asegurarnos de que el servidor funciona
app.get('/api', (req: Request, res: Response) => {
  res.send('¡El servidor del Café de Altura está funcionando!');
});

// Ruta para obtener la lista de granos de café (con datos de ejemplo)
app.get('/api/granos', (req: Request, res: Response) => {
  const granosDeCafe = [
    { id: 1, nombre: 'Arábica', origen: 'Veracruz', notas: 'Avainilladas y chocolatadas.' },
    { id: 2, nombre: 'Arábica', origen: 'Puebla, Toxtla', notas: 'Fuerte y chocolatado' },
    { id: 3, nombre: 'Bourbon', origen: 'Puebla, Toxtla', notas: 'Almendras, chocolate y frutos secos' },
    { id: 4, nombre: 'Caturra', origen: 'Puebla, Toxtla', notas: 'Chocolate' }
  ];
  res.json(granosDeCafe);
});

// --- Fin de las rutas ---

// Ponemos el servidor a escuchar peticiones en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});