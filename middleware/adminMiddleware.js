import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"

const adminMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(403).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let admin = await Admin.findById(decoded.id);
        // if (!admin) {
        //     user = await Partner.findById(decoded.id);
        // }

        if (!admin) {
            return res.status(401).json({ msg: "admin not found" });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
export default adminMiddleware;



