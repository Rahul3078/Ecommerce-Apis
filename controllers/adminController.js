import Admin from "../models/Admin.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
// import { uploadToCloudinary } from "../utils/upload.js";

import { uploadToCloudinary, deleteFromCloudinary } from "../util/upload.js";



export const register = async (req, res) => {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(401).json({
            result: "false",
            message: "All Field are req ,name,email,password "
        })
    }
    try {
        let existUser = await Admin.findOne({ email });
        if (existUser) {
            return res.status(401).json({
                result: "false",
                message: "Admin alredy exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = new Admin({
            name,
            email,
            password: hashedPassword

        })

        const data = await insertUser.save();

        res.status(200).json({
            result: "true",
            message: "Admin register successfull",
            data: data
        })

    } catch (error) {
        res.status(500).json({
            result: "false",
            message: "Internal server error"
        })

    }
}

export const login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            result: "false",
            message: "This field are req, email, password"
        })

    }

    try {
        let existUser = await Admin.findOne({ email });
        if (!existUser) {
            return res.status(400).json({
                return: "false",
                message: "admin Not found "
            })
        }
        let token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        res.status(200).json({
            result: "true",
            message: "admin login Successfull ",
            data: existUser,
            token
        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error"
        })
    }
}

export const createSubcategory = async (req, res) => {
    let { subCategoryName, Category } = req.body;


    if (!subCategoryName || !Category) {
        return res.status(400).json({
            result: "false",
            message: "This field are req ,subCategoryName,Category"
        })
    }
    try {

        let subcategory = await Subcategory.findOne({ subCategoryName })
        console.log("subcategory", subcategory)
        if (subcategory) {
            return res.status(400).json({
                result: "false",
                message: "subcategory alredy exist"
            })
        }


        const newCategory = new Subcategory({
            Category,
            subCategoryName
        })
        await newCategory.save();
        res.status(200).json({
            result: "true",
            message: "subCategory created successfull..",
            data: newCategory
        })
    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error "
        })
    }
}

// export const createCategory = async (req, res) => {
//     try {
//         const { categoryName, categoryDescription } = req.body;

//         if (!categoryName || !categoryDescription) {
//             return res.status(400).json({
//                 result: false,
//                 message: "categoryName and categoryDescription are required"
//             });
//         }

//         const existing = await Category.findOne({ categoryName });

//         if (existing) {
//             return res.status(400).json({
//                 result: false,
//                 message: "Category already exists"
//             });
//         }

//         // Handle both single and multiple file uploads
//         let categoryImage = [];

//         if (req.files && req.files.length > 0) {
//             // Multiple files
//             categoryImage = req.files.map(file => file.path.replace(/\\/g, "/"));
//         } else if (req.file) {
//             // Single file
//             categoryImage = [req.file.path.replace(/\\/g, "/")];
//         }

//         const newCategory = new Category({
//             categoryName,
//             categoryDescription,
//             categoryImage
//         });

//         await newCategory.save();

//         res.status(201).json({
//             result: true,
//             message: "Category created successfully",
//             data: newCategory
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             result: false,
//             message: "Internal Server Error"
//         });
//     }
// };


export const createCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({
                result: false,
                message: "categoryName and categoryDescription are required"
            });
        }

        const existing = await Category.findOne({ categoryName });

        if (existing) {
            return res.status(400).json({
                result: false,
                message: "Category already exists"
            });
        }

        // ✅ NEW: store Cloudinary URLs
        let categoryImage = [];

        // multiple images
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadToCloudinary(file.path);
                categoryImage.push(result.secure_url);  // ✅ URL
            }
        }
        // single image
        else if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            categoryImage = [result.secure_url]; // ✅ URL
        }

        const newCategory = new Category({
            categoryName,
            categoryDescription,
            categoryImage
        });

        await newCategory.save();

        res.status(201).json({
            result: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            result: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllCategory = async (req, res) => {
    try {
        let category = await Category.find();
        if (category.length === 0) {
            return res.status(400).json({
                result: "false",
                message: "Category not found "
            })
        }

        res.status(200).json({
            result: "true",
            message: "Get all Category ..",
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error "
        })
    }
}

export const deleteCategory = async (req, res) => {
    let { id } = req.params
    try {
        let category = await Category.findByIdAndDelete(id)
        if (!category) {
            return res.status(400).json({
                result: "false",
                message: "Category  not found "
            })
        }

        res.status(200).json({
            result: "true",
            message: "Category delete successfull"

        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error "
        })
    }
}

// export const categoryUpdate = async (req, res) => {
//     try {
//         const { categoryId, categoryName, categoryDescription } = req.body;

//         if (!categoryId || !categoryName || !categoryDescription) {
//             return res.status(400).json({
//                 result: false,
//                 message: "categoryId, categoryName and categoryDescription are required"
//             });
//         }

//         const existing = await Category.findById(categoryId);

//         if (!existing) {
//             return res.status(400).json({
//                 result: false,
//                 message: "Category not exists"
//             });
//         }

//         // Handle both single and multiple file uploads
//         let categoryImage = [];

//         if (req.files && req.files.length > 0) {
//             // Multiple files
//             categoryImage = req.files.map(file => file.path.replace(/\\/g, "/"));
//         } else if (req.file) {
//             // Single file
//             categoryImage = [req.file.path.replace(/\\/g, "/")];
//         }



//         existing.categoryName = categoryName
//         existing.categoryDescription = categoryDescription
//         existing.categoryImage = categoryImage


//         await existing.save();

//         res.status(201).json({
//             result: true,
//             message: "Category update successfully",
//             data: existing
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             result: false,
//             message: "Internal Server Error"
//         });
//     }
// };


export const categoryUpdate = async (req, res) => {
    try {
        const { categoryId, categoryName, categoryDescription } = req.body;

        if (!categoryId || !categoryName || !categoryDescription) {
            return res.status(400).json({
                result: false,
                message: "categoryId, categoryName and categoryDescription are required"
            });
        }

        const existing = await Category.findById(categoryId);

        if (!existing) {
            return res.status(400).json({
                result: false,
                message: "Category not exists"
            });
        }

        let categoryImage = existing.categoryImage; // keep old by default

        // ✅ If new image uploaded
        if ((req.files && req.files.length > 0) || req.file) {

            // 🔥 DELETE OLD IMAGES FROM CLOUDINARY
            if (existing.categoryImage && existing.categoryImage.length > 0) {
                for (let img of existing.categoryImage) {
                    if (img.public_id) {
                        await deleteFromCloudinary(img.public_id);
                    }
                }
            }

            // 🔥 UPLOAD NEW IMAGES
            categoryImage = [];

            // multiple images
            if (req.files && req.files.length > 0) {
                for (let file of req.files) {
                    const result = await uploadToCloudinary(file.path);

                    categoryImage.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                }
            }

            // single image
            else if (req.file) {
                const result = await uploadToCloudinary(req.file.path);

                categoryImage = [{
                    url: result.secure_url,
                    public_id: result.public_id
                }];
            }
        }

        // update fields
        existing.categoryName = categoryName;
        existing.categoryDescription = categoryDescription;
        existing.categoryImage = categoryImage;

        await existing.save();

        res.status(200).json({
            result: true,
            message: "Category updated successfully",
            data: existing
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            result: false,
            message: "Internal Server Error"
        });
    }
};

export const getallsubcategory = async (req, res) => {
    try {
        let subcategory = await Subcategory.find();
        if (subcategory.length === 0) {
            return res.status(400).json({
                result: "false",
                message: "subCategory not found "
            })
        }
        res.status(200).json({
            result: "true",
            message: "Get all getallsubcategory ..",
            data: subcategory
        })
    }
    catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error "
        })
    }
}

export const deletesubcategory = async (req, res) => {
    let { id } = req.params
    try {
        let subcategory = await Subcategory.findByIdAndDelete(id)
        if (!subcategory) {
            return res.status(400).json({
                result: "false",
                message: "subcategory  not found "
            })
        }

        res.status(200).json({
            result: "true",
            message: "subcategory delete successfull"

        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error "
        })
    }
}

export const subcategoryUpdate = async (req, res) => {
    try {
        const { subcategoryId, subCategoryName } = req.body;

        if (!subcategoryId || !subCategoryName) {
            return res.status(400).json({
                result: false,
                message: "subcategoryId, subCategoryName are required"
            });
        }

        const existing = await Subcategory.findById(subcategoryId);

        if (!existing) {
            return res.status(400).json({
                result: false,
                message: "subCategory not exists"
            });
        }


        existing.subCategoryName = subCategoryName



        await existing.save();

        res.status(201).json({
            result: true,
            message: "subCategory update successfully",
            data: existing
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            result: false,
            message: "Internal Server Error"
        });
    }
};


// export const createProduct = async (req, res) => {
//     let { productName, brand, category, subCategory, productPrice, description, stock, quantity } = req.body
//     if (!productName || !brand || !category || !subCategory || !productPrice || !description || !stock || !quantity) {
//         return res.status(400).json({
//             message: "all fields are required productName,brand,category,subCategory,productPrice,description,stock,quantity ",
//             result: "false"
//         })
//     }
//     try {
//         let product = await Product.findOne({ productName })

//         if (product) {
//             return res.status(400).json({
//                 result: "false",
//                 message: "Product already exist."
//             })
//         }

//         // Handle both single and multiple file uploads
//         let productImage = [];

//         if (req.files && req.files.length > 0) {
//             // Multiple files
//             productImage = req.files.map(file => file.path.replace(/\\/g, "/"));
//         } else if (req.file) {
//             // Single file
//             productImage = [req.file.path.replace(/\\/g, "/")];
//         }

//         let newProduct = await Product.create({
//             productName,
//             brand,
//             category,
//             subCategory,
//             productPrice,
//             description,
//             stock,
//             quantity,
//             productImage
//         })

//         return res.status(200).json({
//             result: "true",
//             message: "products create successfully",
//             data: newProduct
//         })
//     }

//     catch (error) {
//         res.status(500).json({
//             message: "internal server error",
//             result: "false"
//         })
//     }
// }


export const createProduct = async (req, res) => {
    try {
        let {
            productName,
            brand,
            category,
            subCategory,
            productPrice,
            description,
            stock,
            quantity
        } = req.body;

        // validation
        if (!productName || !brand || !category || !subCategory || !productPrice || !description || !stock || !quantity) {
            return res.status(400).json({
                message: "all fields are required productName,brand,category,subCategory,productPrice,description,stock,quantity",
                result: false
            });
        }

        // check existing product
        let product = await Product.findOne({ productName });

        if (product) {
            return res.status(400).json({
                result: false,
                message: "Product already exist."
            });
        }

        // ✅ NEW: Cloudinary upload
        let productImage = [];

        // multiple images
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadToCloudinary(file.path);

                productImage.push({
                    url: result.secure_url,      // ✅ image URL
                    public_id: result.public_id // ✅ for delete/update
                });
            }
        }

        // single image (optional support)
        else if (req.file) {
            const result = await uploadToCloudinary(req.file.path);

            productImage = [{
                url: result.secure_url,
                public_id: result.public_id
            }];
        }

        // create product
        let newProduct = await Product.create({
            productName,
            brand,
            category,
            subCategory,
            productPrice,
            description,
            stock,
            quantity,
            productImage
        });

        return res.status(200).json({
            result: true,
            message: "Product created successfully",
            data: newProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal server error",
            result: false
        });
    }
};


export const getallproduct = async (req, res) => {
    try {
        let getproduct = await Product.find()
        if (getproduct.length === 0) {
            res.status(400).json({
                message: "product is not find",
                result: "false"
            })
        }
        res.status(200).json({
            message: "product get succesfull",
            result: "true",
            data: getproduct
        })
    }
    catch {
        res.status(500).json({
            message: "internal server is error",
            resultk: "false"
        })
    }
}

export const updateProduct = async (req, res) => {

    try {
        // let { productId } = req.params
        let { productId, productName, brand, productPrice, description, stock, quantity } = req.body
        if (!productId || !productName || !brand || !productPrice || !description || !stock || !quantity) {
            res.status(400).json({
                message: "all fields are required productId, productName, brand, productPrice, description, stock and quantity ",
                result: "false"
            })
        }

        let reUpdate = await Product.findById(productId)
        if (!reUpdate) {
            res.status(400).json({
                message: "product is not found",
                result: "false"
            })
        }

        reUpdate.productName = productName
        reUpdate.brand = brand
        reUpdate.productPrice = productPrice
        reUpdate.description = description
        reUpdate.stock = stock
        reUpdate.quantity = quantity

        await reUpdate.save()

        res.status(200).json({
            message: "product updated successfully",
            result: "true",
            data: reUpdate
        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server is error"
        })
    }
}

export const deleteProduct = async (req, res) => {
    let { productId } = req.params;

    try {
        let removeProduct = await Product.findByIdAndDelete(productId)
        if (!removeProduct) {
            res.status(400).json({
                message: "product is not found",
                result: "false"
            })
        }

        res.status(200).json({
            message: "product deleted successfully",
            result: "true"
        })
    }
    catch {
        res.status(500).json({
            message: "internal server error",
            result: "false"
        })
    }
}











