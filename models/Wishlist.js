import mongoose from "mongoose";

const productgwishlistschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
},
    { timestamps: true })

const Wishlist = mongoose.model("Wishlist", productgwishlistschema)
export default Wishlist