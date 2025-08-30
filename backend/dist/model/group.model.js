"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    avatar: { type: String },
    avatarPublicId: { type: String },
}, { timestamps: true });
const Group = mongoose_1.default.model("Group", groupSchema);
exports.default = Group;
//# sourceMappingURL=group.model.js.map