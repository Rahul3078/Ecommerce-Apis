import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    firstName: { type: String, required: true },
    addressType: { type: String, required: true, enum: ['Home', 'Office', 'Other'] },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: { type: String },
    email: { type: String },
    isDefault: { type: Boolean, default: false },
},
    { timestamps: true })

const Address = mongoose.model("Address", addressSchema)
export default Address