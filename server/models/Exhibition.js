import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true,
        default: "Palette Play Gallery"
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 1
    },
    availableTickets: {
        type: Number,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['active', 'sold-out', 'cancelled', 'completed'],
        default: 'active'
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    }
}, { timestamps: true });

exhibitionSchema.index({ month: 1, year: 1 });
exhibitionSchema.index({ eventDate: 1 });

const Exhibition = mongoose.models.exhibition || mongoose.model("exhibition", exhibitionSchema);

export default Exhibition;