import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "Bangladesh"
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Address = mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;