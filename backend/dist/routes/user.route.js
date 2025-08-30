"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const users_1 = require("../controllers/users");
const userRouter = express_1.default.Router();
userRouter.get('/', verify_1.verifyToken, users_1.getAllUsers);
userRouter.get('/:userId', users_1.getUserById);
userRouter.put('/update/:userId', users_1.updateUser);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map