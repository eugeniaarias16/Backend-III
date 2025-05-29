// src/services/mail.service.js
import nodemailer from 'nodemailer';
import config from '../config/config.js';

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mail_host,
      port: config.mail_port,
      secure: config.mail_secure,
      auth: {
        user: config.mail_user,
        pass: config.mail_password
      }
    });
    
    // Verificar conexión al iniciar el servicio
    this.verifyConnection();
  }

  // Método para verificar la conexión al iniciar
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Servicio de email conectado correctamente');
    } catch (error) {
      console.error('Error en la configuración del servicio de email:', error);
    }
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: `"E-Commerce" <${config.mail_user}>`,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return { success: false, error: error.message };
    }
  }

  // Métodos específicos para diferentes tipos de correos
  async sendWelcomeEmail(user) {
    const subject = '¡Bienvenido a nuestra plataforma!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3498db;">¡Bienvenido, ${user.first_name}!</h1>
        <p>Gracias por registrarte en nuestra plataforma de e-commerce.</p>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes comenzar a explorar nuestros productos y realizar compras.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p><strong>Email:</strong> ${user.email}</p>
        </div>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        <p>¡Esperamos que disfrutes de tu experiencia de compra!</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>Este es un correo automático, por favor no responder.</p>
        </div>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  async sendPurchaseConfirmation(user, ticket) {
    const subject = 'Confirmación de compra';
    const productsHtml = ticket.products 
      ? ticket.products.map(p => `<li>${p.product.name || p.product.title} x ${p.quantity} - $${p.product.price * p.quantity}</li>`).join('')
      : '';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3498db;">¡Compra Confirmada!</h1>
        <p>Hola ${user.first_name}, tu compra ha sido procesada correctamente.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3>Detalles de la compra:</h3>
          <p><strong>Código:</strong> ${ticket.code}</p>
          <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
          <p><strong>Total:</strong> $${ticket.amount}</p>
          
          <h4>Productos:</h4>
          <ul>
            ${productsHtml}
          </ul>
        </div>
        
        <p>Gracias por tu compra. Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>Este es un correo automático, por favor no responder.</p>
        </div>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordReset(user, resetToken) {
    const subject = 'Recuperación de contraseña';
    const resetUrl = `${config.frontend_url}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3498db;">Recuperación de contraseña</h1>
        <p>Hola ${user.first_name}, has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Restablecer contraseña</a>
        </div>
        
        <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
        <p>Este enlace expirará en 1 hora por seguridad.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #7f8c8d; font-size: 12px;">
          <p>Este es un correo automático, por favor no responder.</p>
        </div>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }
}

export default new MailService();