import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            return res.send({
                status: "failed",
                message: "Email already exists"
            });
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const newUser = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        });
                        await newUser.save();

                        const saved_user = await UserModel.findOne({
                            email: email
                        });
                        // Generate JWT
                        const token = jwt.sign(
                            { userID: saved_user._id }, // _id is a mongo cooncept
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "1d" }
                        );

                        res.status(201).send({
                            status: "success",
                            message: "user registered successfully",
                            token: token
                        });
                    } catch (error) {
                        console.log(err);
                        res.send({
                            status: "failed",
                            message: "Unable to register"
                        });
                    }
                } else {
                    res.send({
                        status: "failed",
                        message: "Password and confirmed password doesn't match"
                    });
                }
            } else {
                res.send({
                    status: "failed",
                    message: "All fields are required"
                });
            }
        }
    };

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (!user) {
                    res.send({
                        status: "failed",
                        message: "User not registered"
                    });
                } else {
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (isMatch) {
                        // Generate JWT
                        const token = jwt.sign(
                            { userID: user._id }, // _id is a mongo cooncept
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "1d" }
                        );

                        res.status(201).send({
                            status: "success",
                            message: "Login successful",
                            token: token
                        });
                    } else {
                        res.send({
                            status: "failed",
                            message: "Wrong Password entered"
                        });
                    }
                }
            } else {
                res.send({
                    status: "failed",
                    message: "All fields are required"
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                status: "failed",
                message: "Unable to login. Please try again"
            });
        }
    };

    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({
                    status: "failed",
                    message: "password and confirm password doesn't match"
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(req.user._id, {
                    $set: { password: newHashPassword }
                });
                res.send({
                    status: "success",
                    message: "Password changed successfully"
                });
            }
        } else {
            res.send({ status: "failed", message: "All fields are required" });
        }
    };

    static loggedUser = async (req, res) => {
        res.send({ user: req.user });
    };

    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            res.send({ message: "failed", status: "Email required" });
        } else {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                res.send({
                    message: "failed",
                    status: "User doesn't exists. Enter correct email id"
                });
            } else {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jwt.sign({ userID: user._id }, secret, {
                    expiresIn: "15m"
                });
                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`;
                console.log(link);
                // Send Email
                let info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: "bhardwaj21ankit@gmail.com",
                    subject: "I am sent from Nodemailer",
                    html: `<a href=${link}> Click here</a> to reset your password`
                });
                res.send({
                    status: "success",
                    message:
                        "password reset link send to your email. Please reset your password in 15 minutes"
                });
            }
        }
    };

    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body;
        const { id, token } = req.params;
        const user = await UserModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;

        try {
            jwt.verify(token, new_secret);
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({
                        status: "failed",
                        message: "All fields required"
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);
                    await UserModel.findByIdAndUpdate(user._id, {
                        $set: {
                            password: newHashPassword
                        }
                    });
                    res.send({
                        status: "sucess",
                        message: "Password reset successfully"
                    });
                }
            } else {
                res.send({ status: "failed", message: "All fields required" });
            }
        } catch (error) {
            console.log(error);
            res.send({ message: "failed", messsage: "Invalid Token" });
        }
    };
}

export default UserController;
