// ticket.service.js
import ticketRepository from '../repository/ticket.repository.js';

class TicketService {
  async createTicket(purchaseData) {
    try {
      const ticketData = {
        amount: purchaseData.amount,
        purchaser: purchaseData.purchaser
      };

      const newTicket = await ticketRepository.createTicket(ticketData);
      return newTicket;
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async getTicketById(id) {
    try {
      return await ticketRepository.getTicketById(id);
    } catch (error) {
      throw new Error(`Error al obtener ticket: ${error.message}`);
    }
  }
}

export default new TicketService();