import express from "express";
import { adminLogin, getUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin login route
router.post("/login", adminLogin);
// Protected admin routes
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;