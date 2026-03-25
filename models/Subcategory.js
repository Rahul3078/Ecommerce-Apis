import mongoose from "mongoose";

const subCategoryShema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true
    },

    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

}, {
    timestamps: true
}
)

const Subcategory = mongoose.model("Subcategory", subCategoryShema)

export default Subcategory