
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

import Address from "../models/Address.js";
import Wishlist from "../models/Wishlist.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { data } from "react-router-dom";

import { generateOTP, sendOTP } from "../config/mailer.js";

export const register = async (req, res) => {

    const { name, email, password, confirmPassword, phone, otp } = req.body;

    if (!name || !email || !password || !confirmPassword || !phone) {

        return res.status(400).json({
            success: false,
            message: "All fields are required name, email, password, confirmPassword, phone"
        });

    }

    try {

        const existUser = await User.findOne({ email });

        if (existUser) {

            if (existUser.isVerified) {

                return res.status(400).json({
                    success: false,
                    message: "User already registered"
                });

            } else {

                return res.status(400).json({
                    success: false,
                    message: "Please verify OTP first"
                });

            }
        }

        if (password !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();

        const user = await User.create({

            name,
            email,
            phone,
            password: hashedPassword,
            otp: otp,
            otpExpire: Date.now() + 5 * 60 * 1000

        });

        await sendOTP({

            to: email,
            subject: "OTP Verification",

            html: `
            <h2>Hello ${name}</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP will expire in 5 minutes</p>
            `

        });

        res.status(200).json({

            success: true,
            message: "OTP sent to email. Please verify your account."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};


export const verifyOtp = async (req, res) => {

    const { email, otp } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found"
            });

        }

        if (user.otp !== otp) {

            return res.json({
                success: false,
                message: "Invalid OTP"
            });

        }

        if (user.otpExpire < Date.now()) {

            return res.json({
                success: false,
                message: "OTP expired"
            });

        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({

            success: true,
            message: "Account verified successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            result: "false",
            message: "Email and Password are required"
        });
    }

    try {
        const existUser = await User.findOne({ email });

        if (!existUser) {
            return res.status(404).json({
                result: "false",
                message: "User not found"
            });
        }

        // check password
        const isMatch = await bcrypt.compare(password, existUser.password);

        if (!isMatch) {
            return res.status(400).json({
                result: "false",
                message: "Invalid password"
            });
        }

        // create token
        const token = jwt.sign(
            { id: existUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            result: "true",
            message: "User login successful",
            data: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email
            },
            token
        });

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error"
        });
    }
};
export const userDetails = async (req, res) => {
    let { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            result: "false",
            message: "req userId  in params "
        })
    }
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                result: "false",
                message: "User not found .. "
            })
        }

        res.status(200).json({
            result: "true",
            message: "user details get successfull",
            data: user
        })


    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error"
        })
    }
}

export const userUpdate = async (req, res) => {
    let { userId } = req.params;

    let { name, password, phone } = req.body;
    if (!name || !password || !phone) {
        return res.status(400).json({
            result: "false",
            message: "This field are req, name , phone, password"
        })

    }
    try {

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                result: "false",
                message: "User not found "
            })
        }
        user.name = name
        user.phone = phone
        user.password = password

        await user.save();

        res.status(200).json({
            result: "true",
            message: "User update success full",
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal server error"
        })
    }
}

export const userDelete = async (req, res) => {
    let { userId } = req.body
    if (!userId) {
        return res.status(400).json({
            result: "false",
            message: "userId req ...."
        })
    }

    try {

        let user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(400).json({
                result: "false",
                message: "User not found"
            })
        }
        res.status(200).json({
            result: "false",
            message: "User delete successfull",
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            result: "false",
            message: "Internal sesrver error"

        })
    }
}
// get all product 
export const getallproduct = async (req, res) => {
    try {
        let getproduct = await Product.find()
        if (getproduct.length === 0) {
            res.status(400).json({
                message: "product is not find",
                result: "false"
            })
        }
        res.status(400).json({
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

// cart 
export const createCart = async (req, res) => {
    try {

        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({
                message: "userId and productId are required",
                result: "false"
            });
        }

        let product = await Product.findById(productId);
        console.log("product", product)
        if (!product) {
            return res.status(404).json({
                message: "product not found",
                result: "false"
            })
        }
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({
                userId,
                items: [
                    {
                        productId,
                        quantity: 1,
                        productName: product.productName,
                        productPrice: product.productPrice
                    },
                ],
                totalPrice: product.productPrice
            });
        }
        else {
            const productExists = cart.items.some(
                (item) => item.productId.toString() === productId
            );

            if (!productExists) {
                cart.items.push({
                    productId,
                    quantity: 1,
                    productName: product.productName,
                    productPrice: product.productPrice
                });
                cart.totalPrice += product.productPrice
            }
            else {
                return res.status(200).json({
                    result: "true",
                    messagea: "product already exists in cart",
                    totalProductInCart: cart.items.length,
                    addedproductName: product.productName
                });
            }
        }
        await cart.save();
        res.status(200).json({
            message: "product added in cart successfull",
            result: "true",
            addedproductName: product.productName,
            totalProductInCart: cart.items.length
        });
    }
    catch (err) {
        console.log("error adding product to cart", err)
        res.status(500).json({
            message: "internal server is error",
            result: "false",
            error: err.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        let productDetails = await Cart.find();
        if (productDetails.length === 0) {
            res.status(400).json({
                message: "cart is empty",
                result: "false"
            })
        }
        res.status(200).json({
            message: "product get successful",
            result: "true",
            data: productDetails

        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
            result: "false"
        })
    }
}

export const updateCart = async (req, res) => {

    const calculateCartTotal = (items) => {
        return items.reduce((total, item) => {
            return total + item.quantity * item.productPrice;
        }, 0);
    };

    try {
        let { userId, productId } = req.body;
        let quantity = parseInt(req.body.quantity, 10);

        if (!userId || !productId || isNaN(quantity)) {
            return res.status(400).json({
                message: "userId, productId and numeric quantity all fields are required",
                // result: "false"
            })
        }


        const cartValue = await Cart.findOne({ userId });
        console.log("cartValue", cartValue)
        if (!cartValue) {
            return res.status(404).json({
                message: "carts Product not found",
                // result: 'false'
            })
        }
        const item = cartValue.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "item is not found in cart",
                // result: "false"
            })
        }

        item.quantity = quantity
        cartValue.totalPrice = calculateCartTotal(cartValue.items);

        await cartValue.save();

        return res.status(200).json({
            message: "cart updated successfully",
            // result: "true",
            cartValue
        })
    }
    catch (err) {
        console.error("cart update error", err)
        res.status(500).json({
            message: "internal server error",
            // result: "false",
            error: err.message
        })
    }
}

export const deleteCart = async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        res.status(400).json({
            message: "productId is required",
            result: "false"
        })
    }
    try {
        const removeCart = await Cart.findByIdAndDelete(productId)
        if (!removeCart) {
            res.status(404).json({
                message: "product is not found",
                result: "false"
            })
        }
        res.status(200).json({
            message: "product deleted successfully",
            result: "true"
        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
            result: "false"
        })
    }
}

// wishlist 

export const createWishlist = async (req, res) => {
    let { userId, productId } = req.body;
    if (!userId || !productId) {
        res.status(400).json({
            message: "userId and productId are required",
            result: "false"
        })
    }
    try {
        let existingWishlist = await Wishlist.findOne({ productId })
        if (existingWishlist) {
            return res.status(400).json({
                message: "product is already exits in wishlist",
                result: "false"
            })
        }
        await Wishlist.create({ userId, productId })

        res.status(200).json({
            message: "product added in wishlist successfully",
            result: "true",


        })


    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
            result: "false"
        })
    }
}

export const getwishlist = async (req, res) => {
    try {
        const getdata = await Wishlist.find()
        if (getdata.length === 0) {
            res.status(400).json({
                message: "product is not found",
                result: "false"
            })
        }
        res.status(200).json({
            message: "wishlist get successfull",
            result: "true",
            data: getdata
        })
    }
    catch {
        res.status(500).json({
            message: "Internal server error",
            result: "false"
        })
    }
}

export const deletewishlist = async (req, res) => {
    let { productId } = req.params;
    if (!productId) {
        res.status(400).json({
            message: "productId is required in params",
            result: "false"
        })
    }

    try {
        let removeProduct = await Wishlist.findByIdAndDelete(productId)
        if (!removeProduct) {
            res.status(404).json({
                message: "product is not find",
                result: "false"
            })
        }
        res.status(200).json({
            message: 'product deleted successfully',
            result: "true"
        })
    }
    catch {
        res.status(500).json({
            message: 'internal server error',
            result: "false"
        })
    }
}
// address
export const addAddress = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            pincode,
            country,
            address,
            city,
            state,
            landmark,
            email,
            addressType,
            isDefault
        } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        const requiredFields = {
            firstName,
            lastName,
            phone,
            pincode,
            address,
            city,
            state,
            addressType
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.toString().trim() === "")
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // If default address selected, remove previous default
        if (isDefault) {
            await Address.updateMany(
                { userId: req.user.id },
                { $set: { isDefault: false } }
            );
        }

        const newAddress = new Address({
            userId: req.user.id,
            firstName,
            lastName,
            phone,
            pincode,
            country,
            address,
            city,
            state,
            landmark,
            email,
            addressType,
            isDefault
        });

        await newAddress.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: newAddress
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

export const getAddress = async (req, res) => {
    try {
        const addressDetail = await Address.find({ userId: req.user.id }).sort({
            isDefault: -1,
            creatAt: -1,
        })
        res.status(200).json({
            success: true,
            address: addressDetail
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        })
    }
}


export const updateAddress = async (req, res) => {

    const { firstName, lastName, phone, pincode, country, address, city, state, landmark, email } = req.body
    if (!firstName || !lastName || !phone || !pincode || !country || !address || !city || !state || !landmark || !email) {
        res.status(400).json({
            message: "firstName, lastName, phone, pincode, country, address, city, state, landmark and email all fields are required",
            result: false
        })
    }

    try {

        const newAddress = await Address.findByIdAndUpdate({
            _id: req.params.id, userId: req.user.id
        },
            req.body, { new: true })

        if (!newAddress) {
            return res.status(404).json({
                success: false,
                message: "address not found"
            })
        }
        if (req.body.isDefault) {
            await Address.updateMany(
                { userId: req.user.id, _id: { $ne: newAddress._id } },
                { isDefault: false }
            )
        }
        res.status(200).json({
            success: true,
            Message: "Address updated",
            data: newAddress
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const findAddress = await Address.findByIdAndDelete({ _id: req.params.id, userId: req.user.id })
        if (!findAddress) {
            res.status(400).json({
                message: "address not found",
                result: "false"
            })
        }
        res.status(200).json({
            message: "address deleted successfully",
            result: "true"
        })
    }
    catch (err) {
        res.status(500).json({
            message: "server error",
            result: "false",
            error: err.message
        })
    }
}

// Address Validation for placeOrder
function validateAddress(address) {

    const errors = [];

    if (!address) {
        errors.push("Address is required");
        return errors;
    }

    if (!address.fullName) errors.push("fullName is required");
    if (!address.phone) errors.push("phone is required");
    if (!address.pincode) errors.push("pincode is required");
    if (!address.address) errors.push("address is required");
    if (!address.city) errors.push("city is required");
    if (!address.state) errors.push("state is required");

    return errors.length ? errors : null;
}

// PLACE ORDER (SELECTED ITEMS)
export const placeOrder = async (req, res) => {

    try {

        const { address, paymentMode, selectedItems } = req.body;
        const userId = req.user?.id;

        // user validation
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        // selected items validation
        if (!selectedItems || selectedItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No items selected for order"
            });
        }

        // address validation
        const addressErrors = validateAddress(address);

        if (addressErrors) {
            return res.status(400).json({
                success: false,
                message: "Address validation failed",
                errors: addressErrors
            });
        }

        // payment validation
        const validPayments = [
            "Cash on Delivery",
            "Online",
            "UPI",
            "Card",
            "NetBanking"
        ];

        if (!paymentMode || !validPayments.includes(paymentMode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment mode"
            });
        }

        // find user cart
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        let products = [];
        let totalAmount = 0;

        for (const selected of selectedItems) {

            // find item inside cart
            const cartItem = cart.items.find(
                item => item.productId._id.toString() === selected.productId
            );

            if (!cartItem) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found in cart: ${selected.productId}`
                });
            }

            const product = cartItem.productId;

            const price = Number(product.productPrice);
            const quantity = Number(selected.quantity);

            if (!price || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid price or quantity"
                });
            }

            const itemTotal = price * quantity;
            totalAmount += itemTotal;

            products.push({
                productId: product._id,
                quantity: quantity,
                price: price
            });
        }

        // safety check
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid total amount"
            });
        }

        // create order
        const newOrder = new Order({
            userId,
            products,
            address,
            paymentMode,
            totalAmount,
            paymentStatus: paymentMode === "Cash on Delivery" ? "Pending" : "Paid"
        });

        await newOrder.save();

        // remove ordered items from cart
        cart.items = cart.items.filter(
            item => !selectedItems.some(
                selected => selected.productId === item.productId._id.toString()
            )
        );

        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newOrder
        });

    } catch (error) {

        console.error("Place order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const dispatchOrder = async (req, res) => {
    try {

        const { orderId } = req.body;

        // orderId validation
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required"
            });
        }

        // find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // cancelled order check
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be dispatched"
            });
        }

        // already dispatched
        if (order.orderStatus === "Dispatched") {
            return res.status(400).json({
                success: false,
                message: "Order already dispatched"
            });
        }

        // correct flow check
        if (order.orderStatus !== "Placed") {
            return res.status(400).json({
                success: false,
                message: "Only placed orders can be dispatched"
            });
        }

        // update status
        order.orderStatus = "Dispatched";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order dispatched successfully",
            data: order
        });

    } catch (error) {

        console.error("Dispatch order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const updateTracking = async (req, res) => {
    try {

        const { orderId, carrier, trackingNumber, status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.tracking = {
            carrier,
            trackingNumber,
            status,
            updatedAt: new Date()
        };

        // auto delivered update
        if (status === "Delivered") {
            order.orderStatus = "Delivered";
            order.deliveredAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: "Tracking updated",
            tracking: order.tracking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        if (!orderId) {
            res.status(400).json({
                message: "orderId required",
                result: "false"
            })
        }

        const orderDetails = await Order.findById(orderId);
        if (!orderDetails) {
            res.status(404).json({
                message: "order not found",
                result: "false"
            })
        }
        if (orderDetails.orderStatus === "Cancelled") {
            return res.status(400).json({
                message: "order already cancelled",
                result: "false"
            })
        }
        if (
            orderDetails.orderStatus === "Delivered" ||
            orderDetails.orderStatus === "Completed" ||
            orderDetails.orderStatus === "OutForDelivery"
        ) {
            return res.status(400).json({
                result: "false",
                message: `order already ${orderDetails.orderStatus},cannot be cancelled`
            })

        }
        orderDetails.orderStatus = "Cancelled";
        orderDetails.cancellationReason = reason || "user cancelled"
        await orderDetails.save();

        res.status(200).json({
            result: "true",
            message: "order cancelled successfully"
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error",
            result: "false",
            error: error.message
        })
    }
}

export const outForDeliveryOrder = async (req, res) => {
    try {

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = "OutForDelivery";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order is now out for delivery",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};

export const deliveredOrder = async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        res.status(400).json({
            message: "orderId is required",
            result: "false"
        })
    }
    try {
        const detailsOrder = await Order.findById(orderId)
        if (!detailsOrder) {
            res.status(404).json({
                message: "orderId is not found",
                result: "false"
            })
        }

        if (detailsOrder.orderStatus === "Cancelled") {
            return res.status(400).json({
                result: "false",
                message: "cancelled order cannot be delivered"
            });
        }

        if (detailsOrder.orderStatus === "Delivered") {
            res.status(400).json({
                message: "order already delivered",
                result: "false"
            })
        }

        if (detailsOrder.orderStatus !== "OutForDelivery") {
            return res.status(400).json({
                success: false,
                message: "Order must be OutForDelivery first"
            });
        }


        detailsOrder.orderStatus = "Delivered";
        detailsOrder.deliveredAt = new Date();
        await detailsOrder.save();

        return res.status(200).json({
            success: "true",
            message: "order delivered successfully"
        })

    }
    catch (error) {
        console.error("deliver order error:", error);
        return res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        });
    }
}

export const completeOrder = async (req, res) => {
    try {

        const { orderId } = req.body;

        // orderId validation
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required"
            });
        }

        // find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // already completed
        if (order.orderStatus === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Order already completed"
            });
        }

        // cancelled check
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be completed"
            });
        }

        // delivered check
        if (order.orderStatus !== "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Order must be Delivered first"
            });
        }

        // update order status
        order.orderStatus = "Completed";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order completed successfully",
            data: order
        });

    } catch (error) {

        console.error("Complete order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const requestReturn = async (req, res) => {
    try {

        const { orderId, reason } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required"
            });
        }

        const findOrder = await Order.findById(orderId);

        if (!findOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (findOrder.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be returned"
            });
        }

        if (findOrder.orderStatus === "Returned") {
            return res.status(400).json({
                success: false,
                message: "Order already returned"
            });
        }

        // return allowed only if delivered or completed
        if (
            findOrder.orderStatus !== "Delivered" &&
            findOrder.orderStatus !== "Completed"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only delivered orders can be returned"
            });
        }

        findOrder.orderStatus = "Returned";
        findOrder.returnReason = reason || "User returned the order";
        findOrder.returnedAt = new Date();

        await findOrder.save();

        return res.status(200).json({
            success: true,
            message: "Order returned successfully",
            data: findOrder
        });

    } catch (error) {

        console.error("Return order error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getUserOrders = async (req, res) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        const orders = await Order.find({ userId })
            .populate("products.productId")
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            data: orders
        });

    } catch (error) {

        console.error("Get user orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }
};

export const getSingleOrder = async (req, res) => {
    try {

        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required"
            });
        }

        const order = await Order.findById({ orderId })
            .populate("products.productId")
            .populate("userId", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            data: order
        });

    } catch (error) {

        console.error("Get single order error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }
};


