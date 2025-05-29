// src/config/config.js
import dotenv from "dotenv";
dotenv.config();
import { createRequire } from 'module';


// Importar el módulo 'process' de Node.js
const require = createRequire(import.meta.url);
const process = require('process');


const config = {
  // Servidor
  port: process.env.PORT || 8082,
  node_env: process.env.NODE_ENV || 'development',
  
  // Base de datos
  mongodb_uri: process.env.MONGODB_URI,
  
  // JWT
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "1h",
  
  // Email
  mail_service: process.env.MAIL_SERVICE || 'gmail',
  mail_host: process.env.MAIL_HOST || 'smtp.gmail.com',
  mail_port: process.env.MAIL_PORT || 587,
  mail_secure: process.env.MAIL_SECURE === 'true',
  mail_user: process.env.MAIL_USER,
  mail_password: process.env.MAIL_PASSWORD,
  frontend_url: process.env.FRONTEND_URL || `http://localhost:8082`,

 // Twilio WhatsApp
twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
twilio_whatsapp_from: process.env.TWILIO_WHATSAPP_FROM, // De dónde viene el mensaje
twilio_number_to: process.env.TWILIO_NUMBER_TO,         // A dónde va el mensaje (tu número)
twilio_content_sid: process.env.TWILIO_CONTENT_SID
};






console.log(`Configuración cargada | Puerto: ${config.port} | DB: ${config.mongodb_uri ? '✅' : '❌'}`);

export default config;