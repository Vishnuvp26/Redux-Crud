import express from 'express';
import { registerUser, loginUser, logoutUser, editUser } from '../controller/userController.js';
import { upload } from "../middleware/multer.js";
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put("/profile", protect, upload.single('image'), editUser);

export default router;