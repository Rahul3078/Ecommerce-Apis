import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(403).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let user = await User.findById(decoded.id);
        // if (!admin) {
        //     user = await Partner.findById(decoded.id);
        // }

        if (!user) {
            return res.status(401).json({ msg: "user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
export default userMiddleware;



