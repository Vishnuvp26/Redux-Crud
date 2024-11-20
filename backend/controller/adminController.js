import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc Admin Login
// @route POST /api/admin/login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (!admin.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, isAdmin: admin.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all users
// @route GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get a user by ID
// @route GET /api/admin/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a new user
// @route POST /api/admin/users
const createUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin,
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a user
// @route PUT /api/admin/users/:id
const updateUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Update basic fields
            user.name = name || user.name;
            user.email = email || user.email;
            user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

            // Only hash the password if it is being updated
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            // Handle image upload if a file is provided
            if (req.file) {
                const imageUrl = `/uploads/${req.file.filename}`;
                user.imageUrl = imageUrl;
            }

            const updatedUser = await user.save();
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {
    adminLogin,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};