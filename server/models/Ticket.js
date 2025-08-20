import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    exhibitionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exhibition',
        required: true
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },

    ticketStatus: {
        type: String,
        enum: ['active', 'used', 'cancelled'],
        default: 'active'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

ticketSchema.index({ userId: 1 });
ticketSchema.index({ exhibitionId: 1 });
ticketSchema.index({ ticketNumber: 1 });

const Ticket = mongoose.models.ticket || mongoose.model("ticket", ticketSchema);

export default Ticket;