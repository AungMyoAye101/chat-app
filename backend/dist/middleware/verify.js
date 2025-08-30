"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'Invailed token' });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.id = decode.id;
        next();
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verify.js.map