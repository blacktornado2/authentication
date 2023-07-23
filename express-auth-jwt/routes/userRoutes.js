import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

const router = express.Router();

// Route Level Middleware - To Protect Route
router.use("/change-password", checkUserAuth);
router.use("/logged-user", checkUserAuth);

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post(
    "/send-reset-password-email",
    UserController.sendUserPasswordResetEmail
);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

// Protected Routes
router.post("/change-password", UserController.changeUserPassword);
router.get("/logged-user", UserController.loggedUser);

export default router;
