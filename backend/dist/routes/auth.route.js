"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const user_model_1 = __importDefault(require("../model/user.model"));
const auth_1 = require("../controllers/auth");
const authRouter = express_1.default.Router();
authRouter.post("/register", auth_1.createUser);
authRouter.post("/login", auth_1.login);
authRouter.get("/me", verify_1.verifyToken, async (req, res) => {
    try {
        // Assuming verifyToken middleware attaches user info to req.user
        const userId = req.id;
        const user = await user_model_1.default.findById(userId).select("-password");
        res.status(201).json({ message: "fetched user", user });
    }
    catch (error) {
        res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout ." });
});
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map