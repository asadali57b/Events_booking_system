const { ref } = require('joi');
const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticketDetails: {
        name: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: String, required: true },
        price: { type: Number, required: true },
      },
    
   qrCode: {
    type: String,
    required: true
},
isValid:{
    type: Boolean,
    default: true
},
createdAt: {
    type: Date,
    default: Date.now
}
})
module.exports = mongoose.model('Ticket', TicketSchema);