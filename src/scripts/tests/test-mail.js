// src/scripts/test-mail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { createRequire } from 'module';
 
 
// Importar el módulo 'process' de Node.js
const require = createRequire(import.meta.url);
const process = require('process');

// Cargamos las variables de entorno directamente
dotenv.config();

// Crear un transportador de nodemailer directamente (sin usar config ni MailService)
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

// Opciones del correo electrónico
const mailOptions = {
  from: `"Prueba" <${process.env.MAIL_USER}>`,
  to: ['eugeniamariaarias97@gmail.com'], // Cambia esto por tu correo
  subject: 'Correo de prueba',
  html: '<h1>Prueba de correo</h1><p>Este es un correo de prueba para verificar la configuración.</p>'
};

// Enviar el correo y mostrar la respuesta completa
async function sendTestMail() {
  try {
    // Verificar la conexión primero
    await transporter.verify();
    console.log('Conexión al servidor de correo verificada');
    
    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    
    // Mostrar toda la información de la respuesta
    console.log(info);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTestMail();