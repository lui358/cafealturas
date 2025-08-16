/// Importar librerías
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- AÑADE ESTA LÍNEA

// Cargar variables de entorno del archivo .env
dotenv.config();

// Crear la app de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
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
  precios: [
    {
      peso: String, // ej: "250g"
      valor: Number // ej: 250
    }
  ],
  tostados: [String], // Un array de strings, ej: ["Claro", "Medio", "Medio-Oscuro", "Oscuro"]
  molidos: [String]  // Un array de strings, ej: ["Grano Entero", "Medio", "Fino", "Espresso"]
});

const Grano = mongoose.model('Grano', granoSchema);
// ...  definición de Grano ...

// --- Definición del Modelo de Usuario ---
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codigoPostal: { type: String, required: true, default: '' }, // Campo opcional para el envío
  direccion: { type: String, default: '' }, // Campo para el envío
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// --- Definición del Modelo de Pedido ---
const pedidoSchema = new mongoose.Schema({
  nombreCliente: { type: String, required: true },
  redSocial: { type: String, enum: ['Facebook', 'Instagram', 'WhatsApp', 'Otro'], required: true },
  detallePedido: { type: String, required: true },
  montoTotal: { type: Number, required: true },
  estado: { 
    type: String, 
    // LISTA DE ESTADOS ACTUALIZADA
    enum: ['Pendiente', 'Pagado', 'En Preparación', 'Listo para Entrega', 'Confirmó Entrega', 'Cerrado', 'Cancelado'], 
    default: 'Pendiente' 
  },
  fechaCreacion: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

// --- Definición de Rutas (API Endpoints) ---
app.get('/api', (req: Request, res: Response) => {
  res.send('¡El servidor del Café de Altura está funcionando y conectado a la BD!');
});

// OBTENER TODOS LOS PEDIDOS
app.get('/api/pedidos', async (req: Request, res: Response) => {
  try {
    // Ordenamos por fecha de creación, los más nuevos primero
    const pedidos = await Pedido.find().sort({ fechaCreacion: -1 }).lean();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos.' });
  }
});
// OBTENER UN SOLO PEDIDO POR SU ID
app.get('/api/pedidos/:id', async (req: Request, res: Response) => {
  try {
    const pedido = await Pedido.findById(req.params.id).lean();
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido.' });
  }
});
// CREAR UN NUEVO PEDIDO
app.post('/api/pedidos', async (req: Request, res: Response) => {
  try {
    const { nombreCliente, redSocial, detallePedido, montoTotal } = req.body;
    const nuevoPedido = new Pedido({
      nombreCliente,
      redSocial,
      detallePedido,
      montoTotal,
    });
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido.' });
  }
});

// ACTUALIZAR EL ESTADO DE UN PEDIDO
app.put('/api/pedidos/:id/estado', async (req: Request, res: Response) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findById(req.params.id);

    if (pedido) {
      pedido.estado = estado;
      await pedido.save();
      res.json(pedido);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado del pedido.' });
  }
});

// Ruta para obtener TODOS los granos de café (para la pantalla de inicio)
app.get('/api/granos', async (req: Request, res: Response) => {
  try {
    const granos = await Grano.find().lean();
    res.json(granos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los granos de café' });
  }
});

// Nueva ruta para obtener UN SOLO grano por su ID (para la pantalla de detalle)
app.get('/api/granos/:id', async (req: Request, res: Response) => {
  try {
    const grano = await Grano.findById(req.params.id).lean();
    if (!grano) {
      return res.status(404).json({ message: 'Grano de café no encontrado' });
    }
    res.json(grano);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el grano de café' });
  }
});

// RUTA PARA REGISTRAR UN NUEVO USUARIO
app.post('/api/usuarios/registro', async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, codigoPostal } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptada,
      codigoPostal,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
  }
});

// RUTA PARA INICIAR SESIÓN
app.post('/api/usuarios/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Comparar la contraseña ingresada con la encriptada en la BD
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Si todo es correcto, creamos un token
    const payload = { id: usuario._id, nombre: usuario.nombre };
    const token = jwt.sign(payload, 'secreto_super_secreto', { expiresIn: '1h' });

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
