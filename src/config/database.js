import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const process = require('process');

// Cargar variables de entorno
dotenv.config();

// Definir URI de conexión
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexión a MongoDB establecida con éxito');
    return true;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    return false;
  }
};

export default connectDB;