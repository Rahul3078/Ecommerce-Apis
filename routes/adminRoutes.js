import express, { Router } from 'express'
import {
    createSubcategory, subcategoryUpdate,
    getallsubcategory, deletesubcategory, categoryUpdate,
    createCategory, deleteCategory, getAllCategory, login,
    register, createProduct, getallproduct, deleteProduct,
    updateProduct
} from '../controllers/adminController.js';
// import upload from '../middleware/uploads.js';
import {
    uploadSingle,
    uploadMultiple
} from "../util/upload.js";
const routes = express.Router();


routes.post("/register", register)
routes.post("/login", login)
// routes.post(
//     "/createCategory",
//     upload.single("categoryImage"),
//     createCategory
// );
routes.post(
    "/createCategory",
    uploadSingle("categoryImage"),
    createCategory
);

routes.get("/getAllCategory", getAllCategory)
routes.delete("/deleteCategory/:id", deleteCategory)
// routes.put(
//     "/categoryUpdate",
//     upload.single("categoryImage"),
//     categoryUpdate
// );
routes.put(
    "/categoryUpdate",
    uploadSingle("categoryImage"),
    categoryUpdate
);

// routes.post(
//     "/createCategory",
//     upload.array("categoryImage", 1),
//     createCategory
// );

// "subcategory"
routes.post("/createSubcategory", createSubcategory)
routes.get("/getallsubcategory", getallsubcategory)
routes.delete("/deletesubcategory/:id", deletesubcategory)
routes.put("/subcategoryUpdate", subcategoryUpdate)

//"Products create"
// routes.post("/createProduct", upload.array("productImage", 5), createProduct)
routes.post(
    "/createProduct",
    uploadMultiple("productImage", 5),
    createProduct
);
routes.get("/getallproduct", getallproduct)
routes.delete("/deleteProduct/:productId", deleteProduct)
routes.put("/updateProduct", updateProduct)





export default routes


