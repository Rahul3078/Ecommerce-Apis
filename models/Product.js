import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    productPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },


    productImage: [
        {
            url: String,
            public_id: String
        }
    ],
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'

    }


})
const Product = mongoose.model("Product", productSchema)
export default Product