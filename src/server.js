import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { createRequire } from 'module';

// Importar rutas
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import authRouter from "./routes/auth.router.js";

// Importar conexión a MongoDB
import connectDB from "./config/database.js";

// Importar manager de productos para MongoDB
import productService from "./services/product.service.js";

// Importar middlewares
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { handleMongooseErrors, handleAppErrors, handleUnexpectedErrors } from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';

// Importar configuración de Passport
import './config/passport.config.js';




// Importar el módulo 'process' de Node.js
const require = createRequire(import.meta.url);
const process = require('process');

// Cargar variables de entorno
config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8082; // Usar variable de entorno con fallback

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(responseMiddleware); // Middleware de respuesta
app.use(cookieParser());
app.use(passport.initialize()); 
app.use(requestLogger);

// Agregar esto antes de definir tus rutas en server.js
app.use((req, res, next) => {
  console.log(`Ruta solicitada: ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);

// Manejador de rutas no encontradas (debe ir ANTES de los middleware de errores)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores (deben ir DESPUÉS de las rutas y 404)
app.use(handleMongooseErrors);
app.use(handleAppErrors);
app.use(handleUnexpectedErrors);

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      console.error("No se pudo conectar a MongoDB. Verificando configuración...");
    } else {
      console.log("Conexión a MongoDB establecida con éxito");
    }
    
    // Iniciar servidor HTTP
    const httpServer = app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
      console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
    
    // Configurar WebSockets
    const io = new Server(httpServer);
    
    // Hacer io accesible en toda la app
    app.set("socketio", io);
    
    io.on("connection", (socket) => {
      console.log("Usuario conectado!");
      
      socket.on("newProduct", async (productData) => {
        console.log("Producto recibido desde el cliente:", productData);
        try {
          // Asegurarse de que price y stock sean números
          productData.price = Number(productData.price);
          productData.stock = Number(productData.stock);
          
          const newProduct = await productService.createProduct(productData);
          
          console.log("Producto agregado:", newProduct);
          const products = await productService.getProducts();
          console.log("Lista actualizada de productos:", products.payload);
          io.emit("updateProducts", products.payload);
          console.log("Evento updateProducts emitido");
        } catch (error) {
          console.error("Error al procesar el producto:", error.message);
          socket.emit("productError", { message: error.message });
        }
      });
      
      socket.on("disconnect", () => {
        console.log("Usuario desconectado");
      });
    });
    
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error.message);
    process.exit(1); // Salir con código de error
  }
};

// Iniciar la aplicación
startServer();
