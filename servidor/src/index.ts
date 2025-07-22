// Importar librerías
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

// Crear la app de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// --- Conexión a la Base de Datos MongoDB ---
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Error: La variable de entorno MONGODB_URI no está definida.');
  process.exit(1); // Detiene la aplicación si no hay cadena de conexión
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// --- Definición de Modelos (Schemas) ---
// Un Schema define la estructura de los documentos en una colección
const granoSchema = new mongoose.Schema({
  nombre: String,
  origen: String,
  notas: String,
});

const Grano = mongoose.model('Grano', granoSchema);


// --- Definición de Rutas (API Endpoints) ---
app.get('/api', (req: Request, res: Response) => {
  res.send('¡El servidor del Café de Altura está funcionando y conectado a la BD!');
});

// Ruta para obtener todos los granos de café desde la BD
app.get('/api/granos', async (req: Request, res: Response) => {
  try {
    const granos = await Grano.find(); // Busca todos los documentos en la colección 'granos'
    res.json(granos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los granos de café' });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
