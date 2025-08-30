"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../model/user.model"));
const group_model_1 = __importDefault(require("../model/group.model"));
const searchRouter = express_1.default.Router();
searchRouter.get('/:searchText', async (req, res) => {
    const { searchText } = req.params;
    if (!searchText.trim()) {
        return res.status(400).json({ message: "Missiing search query  " });
    }
    try {
        const regex = new RegExp(searchText, "i");
        const users = await user_model_1.default.find({ name: { $regex: regex } });
        const groups = await group_model_1.default.find({ name: { $regex: regex } });
        const result = { users, groups };
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = searchRouter;
//# sourceMappingURL=search.route.js.map