import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
const protect = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt; // Extract token from cookies
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ message: "User not found." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

export { protect, isAdmin };
