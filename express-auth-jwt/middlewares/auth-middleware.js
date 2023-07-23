import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];

            // Verify Token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // *** Get user from Token ***
            req.user = await UserModel.findById(userID).select("-password");
            next();
        } catch (error) {
            return res.status(401).send({
                status: "failed",
                message: "Unauthorized user"
            });
        }
    }
    if (!token) {
        return res.status(401).send({
            status: "failed",
            message: "unauthorised User, No token"
        });
    }
};

export default checkUserAuth;
