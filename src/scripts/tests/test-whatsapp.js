// src/scripts/tests/test-whatsapp.js
import twilio from 'twilio';
import config from '../../config/config.js';




async function testWhatsAppSimple() {
  try {
    console.log('========== PRUEBA DE ENVÍO DE WHATSAPP ==========');
    
    // Obtener credenciales desde el archivo de configuración
    const accountSid = config.twilio_account_sid;
    const authToken = config.twilio_auth_token;
    const fromNumber = `whatsapp:${config.twilio_whatsapp_from}`;
    const toNumber = `whatsapp:${config.twilio_number_to}`;
    const contentSid = config.twilio_content_sid;
    
    console.log('Configuración:');
    console.log(`- Account SID: ${accountSid}`);
    console.log(`- Auth Token: ${authToken ? 'Configurado' : 'No configurado'}`);
    console.log(`- From: ${fromNumber}`);
    console.log(`- To: ${toNumber}`);
    console.log(`- Content SID: ${contentSid}`);
    
    // Verificar que todas las variables requeridas estén configuradas
    if (!accountSid || !authToken || !config.twilio_whatsapp_from || !config.twilio_number_to) {
        console.log('❌ ERROR: Faltan variables de configuración. Revisa tu archivo .env');
        return;
    }
    
    // Crear cliente
    console.log('Creando cliente de Twilio...');
    const client = twilio(accountSid, authToken);
    
    // Enviar mensaje
    console.log('Enviando mensaje...');
    
    // Definir opciones del mensaje
    const messageOptions = {
      from: fromNumber,
      to: toNumber
    };
    
    // Si hay un Content SID, usar plantilla, sino enviar mensaje de texto normal
    if (contentSid) {
      messageOptions.contentSid = contentSid;
      messageOptions.contentVariables = JSON.stringify({"1":"12/1","2":"3pm"});
    } else {
      messageOptions.body = 'Hola! Este es un mensaje de prueba desde mi aplicación.';
    }
    
    const message = await client.messages.create(messageOptions);
    
    console.log('✅ Mensaje enviado exitosamente:');
    console.log(`- SID: ${message.sid}`);
    console.log('============ PRUEBA FINALIZADA ============');
  } catch (error) {
    console.log('❌ ERROR AL ENVIAR MENSAJE:');
    console.error(error);
    console.log('============ PRUEBA FINALIZADA ============');
  }
}

// Ejecutar prueba
testWhatsAppSimple();