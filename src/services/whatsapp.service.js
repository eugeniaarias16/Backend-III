// src/services/whatsapp.service.js
import twilio from 'twilio';
import config from '../config/config.js';

class WhatsAppService {
  constructor() {
    this.client = twilio(
      config.twilio_account_sid,
      config.twilio_auth_token
    );
    
    this.fromNumber = `whatsapp:${config.twilio_whatsapp_from}`;
    this.contentSid = config.twilio_content_sid;
  }

  // Método para enviar mensaje usando la plantilla estándar
  async sendTemplateMessage(phoneNumber, variables) {
    try {
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+${phoneNumber}`;
      }
      
      const toNumber = `whatsapp:${phoneNumber}`;
      
      // Convertir variables a formato JSON string
      const contentVariables = JSON.stringify(variables);
      
      const message = await this.client.messages.create({
        from: this.fromNumber,
        to: toNumber,
        contentSid: this.contentSid,
        contentVariables: contentVariables
      });
      
      console.log('WhatsApp enviado:', message.sid);
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Método para enviar confirmación de compra
  async sendPurchaseConfirmation(phoneNumber, ticket) {
    const variables = {
      "1": ticket.code, // código del ticket como primera variable
      "2": new Date(ticket.purchase_datetime).toLocaleString() // Fecha como segunda variable
    };
    
    return this.sendTemplateMessage(phoneNumber, variables);
  }
  

  async sendTestMessage(phoneNumber) {
  
    const variables = {
      "1": "12/1", 
      "2": "3pm"
    };
    
    return this.sendTemplateMessage(phoneNumber, variables);
  }
}

export default new WhatsAppService();