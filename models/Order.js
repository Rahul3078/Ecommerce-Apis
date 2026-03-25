import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true }, // per item price
        }
    ],

    address: {
        fullName: String,
        phone: String,
        pincode: String,
        locality: String,
        address: String,
        city: String,
        state: String,
        landmark: String,
        alternatePhone: String,
    },

    paymentMode: {
        type: String,
        enum: ["Cash on Delivery", "Online", "UPI", "Card", "NetBanking"],
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },

    orderStatus: {
        type: String,
        enum: [
            "Placed",
            "Dispatched",
            "OutForDelivery",
            "Delivered",
            "Completed",
            "Cancelled",
            "Returned"
        ],
        default: "Placed",
    },

    // ❌ Cancel
    cancellationReason: String,

    // 🔄 Return
    returnReason: String,
    returnStatus: {
        type: String,
        enum: ['Requested', 'Approved', 'Rejected', 'Completed'],
    },
    returnedAt: Date,         // kab return complete hua
    returnWindowDays: {       // kitne din ke andar return allow hai
        type: Number,
        default: 7
    },

    // 🚚 Tracking
    tracking: {
        carrier: String,
        trackingNumber: String,
        status: {
            type: String,
            enum: ['Label Created', 'In Transit', 'Out for Delivery', 'Delivered'],
            default: 'Label Created'
        },
        updatedAt: Date
    },

    // 💰
    totalAmount: {
        type: Number,
        required: true,
    },

    placedAt: {
        type: Date,
        default: Date.now,
    },

    deliveredAt: Date,   // ✅ kab deliver hua
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

