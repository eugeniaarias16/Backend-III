// ticket.mongo.js
import Ticket from '../models/ticket.model.js';

class TicketMongo {
  async create(ticketData) {
    const newTicket = new Ticket(ticketData);
    return await newTicket.save();
  }

  async findById(id) {
    return await Ticket.findById(id).lean();
  }

  async findByCode(code) {
    return await Ticket.findOne({ code }).lean();
  }
}

export default new TicketMongo();