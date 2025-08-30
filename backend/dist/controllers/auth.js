"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user.model"));
const createUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExit = await user_model_1.default.findOne({ email });
        if (userExit) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const newUser = await user_model_1.default.create({ ...req.body, password: hashed, });
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: "User created", user: newUser });
    }
    catch (error) {
        if (error instanceof Error)
            console.error(error.message);
        res.status(500).json("Internal server error.");
    }
};
exports.createUser = createUser;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExit = await user_model_1.default.findOne({ email });
        if (!userExit) {
            return res.status(404).json({ message: "User doesn't exist." });
        }
        const checkPassword = await bcryptjs_1.default.compare(password, userExit.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Email or password doesn't match." });
        }
        const token = jsonwebtoken_1.default.sign({ id: userExit._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "User logged in.", user: userExit });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map