"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../model/user.model"));
const getAllUsers = async (req, res) => {
    const id = req.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid userId" });
    }
    try {
        const users = await user_model_1.default.find({ _id: { $ne: id } }).select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }
    try {
        const users = await user_model_1.default.findById(userId).select("-password").populate('groups');
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "UserId is not valid!" });
    }
    try {
        const user = await user_model_1.default.findByIdAndUpdate(userId, req.body);
        if (!user) {
            return res.status(400).json({ message: "UserId is not valid!" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=users.js.map