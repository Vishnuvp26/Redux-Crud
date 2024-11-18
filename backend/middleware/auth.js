import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    try {
        // Check for token in the Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt; // Extract token from cookies
        }

        // If no token, deny access
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ message: "User not found." });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, allow access
    } else {
        res.status(403).json({ message: "Access denied. Admins only." }); // Forbidden
    }
};

export { protect, isAdmin };
