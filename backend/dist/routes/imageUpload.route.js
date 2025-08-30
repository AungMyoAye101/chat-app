"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const cloundinary_1 = __importStar(require("../lib/cloundinary"));
const user_model_1 = __importDefault(require("../model/user.model"));
const group_model_1 = __importDefault(require("../model/group.model"));
const imageRouter = express_1.default.Router();
imageRouter.post('/upload/user/:id', cloundinary_1.upload.single('avatar'), async (req, res) => {
    console.log('uploading...');
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid");
    }
    const images = req.file;
    if (!images) {
        res.status(400).json("Image not found.");
        return;
    }
    try {
        const user = await user_model_1.default.findById(id);
        if (!user) {
            res.status(400).json("Invalid userId!");
            return;
        }
        if (user.avatarPublicId) {
            await cloundinary_1.default.uploader.destroy(user.avatarPublicId);
            console.log("delete old photo from cloudinary.");
        }
        const uploaded = await cloundinary_1.default.uploader.upload(images.path, { folder: "chat-app/profile" });
        console.log("uploaded");
        user.avatar = uploaded.secure_url;
        user.avatarPublicId = uploaded.public_id;
        await user.save();
        fs_1.default.unlinkSync(images.path);
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json("internal server error.");
    }
});
imageRouter.post('/upload/group/:id', cloundinary_1.upload.single('avatar'), async (req, res) => {
    console.log('uploading...');
    const { id } = req.params;
    const images = req.file;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json("UserId is not valid");
    }
    if (!images) {
        res.status(400).json("Image not found.");
        return;
    }
    try {
        const group = await group_model_1.default.findById(id);
        if (!group) {
            res.status(400).json("Invalid userId!");
            return;
        }
        if (group.avatarPublicId) {
            await cloundinary_1.default.uploader.destroy(group.avatarPublicId);
            console.log("delete old photo from cloudinary.");
        }
        const uploaded = await cloundinary_1.default.uploader.upload(images.path, { folder: "chat-app/profile" });
        group.avatar = uploaded.secure_url;
        group.avatarPublicId = uploaded.public_id;
        await group.save();
        fs_1.default.unlinkSync(images.path);
        res.status(201).json(group);
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json("internal server error.");
    }
});
exports.default = imageRouter;
//# sourceMappingURL=imageUpload.route.js.map