import mongoose from "mongoose";

const productcartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                // required: true,
                default: 1
            },
            productPrice: {
                type: Number
            },
            productName: {
                type: String
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model("Cart", productcartSchema);
export default Cart;