import express, { Router } from 'express'
import {
    addAddress, getAddress, updateAddress, deleteAddress,
    createCart, getCart, deleteCart, updateCart,
    deletewishlist, createWishlist, getwishlist,
    placeOrder, cancelOrder, requestReturn, deliveredOrder,
    outForDeliveryOrder, completeOrder, dispatchOrder,
    updateTracking, getUserOrders, getSingleOrder,
    userDelete, userDetails, userUpdate, login, register, verifyOtp
} from '../controllers/userController.js';
import userMiddleware from '../middleware/userMiddleware.js';
const routes = express.Router();

//email_otp
routes.post("/verifyOtp", verifyOtp)

//users
routes.post("/register", register)
routes.post("/login", login)
routes.get("/userDetails/:userId", userDetails)
routes.put("/userUpdate/:userId", userUpdate)
routes.delete("/userDelete", userMiddleware, userDelete)

//Order
routes.post("/placeOrder", userMiddleware, placeOrder)
routes.post("/cancelOrder", userMiddleware, cancelOrder)
routes.patch("/dispatchOrder", dispatchOrder)
routes.patch("/updateTracking", updateTracking)
routes.patch("/outForDeliveryOrder", outForDeliveryOrder)
routes.patch("/deliveredOrder", deliveredOrder)
routes.patch("/completeOrder", completeOrder)
routes.patch("/requestReturn", requestReturn)
routes.get("/getUserOrders", userMiddleware, getUserOrders)
routes.get("/getSingleOrder/:id", userMiddleware, getSingleOrder)


//address for order
routes.post("/addAddress", userMiddleware, addAddress)
routes.get("/getAddress", userMiddleware, getAddress)
routes.put("/updateAddress/:id", userMiddleware, updateAddress)
routes.delete("/deleteAddress/:id", userMiddleware, deleteAddress)


//cart
routes.post("/createCart", userMiddleware, createCart)
routes.get("/getCart", userMiddleware, getCart)
routes.put("/updateCart", userMiddleware, updateCart)
routes.delete("/deleteCart", userMiddleware, deleteCart)

//wishlist
routes.post("/createWishlist", userMiddleware, createWishlist)
routes.post("/createWishlist", createWishlist)
routes.get("/getwishlist", getwishlist)
routes.delete("/deletewishlist", deletewishlist)

//Cart

//Order
export default routes