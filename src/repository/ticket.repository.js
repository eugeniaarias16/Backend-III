// ticket.repository.js
import ticketMongo from '../dao/mongo/ticket.mongo.js';

class TicketRepository {
  async createTicket(ticketData) {
    return await ticketMongo.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketMongo.findById(id);
  }

  async getTicketByCode(code) {
    return await ticketMongo.findByCode(code);
  }
}

export default new TicketRepository();