// Importamos las librerías necesarias
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargamos las variables de entorno (la ruta ahora sube dos niveles)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// --- Definición Robusta del Modelo ---
// Esto previene el error "OverwriteModelError" que puede ocurrir si el script
// se ejecuta en un entorno donde el modelo ya fue compilado.
const GranoSchema = new mongoose.Schema({
  nombre: String,
  origen: String,
  notas: String,
  precios: [{ peso: String, valor: Number }],
  tostados: [String],
  molidos: [String]
});

// Comprobamos si el modelo 'Grano' ya existe antes de crearlo
const Grano = mongoose.models.Grano || mongoose.model('Grano', GranoSchema);


// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida en el archivo .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para el seeder.');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Función para importar los datos
const importData = async () => {
  try {
    // 1. Borrar todos los datos existentes
    await Grano.deleteMany();
    console.log('🗑️ Datos antiguos eliminados.');

    // 2. Leer el archivo productos.json (la ruta ahora sube dos niveles)
    const dataPath = path.resolve(__dirname, '../../productos.json');
    const productos = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log('📄 Archivo JSON leído correctamente.');

    // 3. Insertar todos los productos en la base de datos
    await Grano.insertMany(productos);
    console.log('🌱 Datos importados con éxito.');
    process.exit();
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
};

// Conectamos a la BD y luego ejecutamos la importación
connectDB().then(() => {
  importData();
});
