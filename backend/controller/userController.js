import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);

            // Set the JWT as an HTTP-only cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            user.imageUrl = `/uploads/${req.file.filename}`;
        }

        await user.save();

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            imageUrl: user.imageUrl,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
};

export {
    registerUser,
    loginUser,
    logoutUser,
    editUser
};