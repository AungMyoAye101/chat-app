"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./lib/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const search_route_1 = __importDefault(require("./routes/search.route"));
const group_route_1 = __importDefault(require("./routes/group.route"));
const imageUpload_route_1 = __importDefault(require("./routes/imageUpload.route"));
const socket_1 = require("./lib/socket");
// //to config env file
dotenv_1.default.config();
(0, db_1.connectToDb)();
socket_1.app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
// Routes
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use('/api/user', user_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
socket_1.app.use('/api/search', search_route_1.default);
socket_1.app.use("/api/group", group_route_1.default);
socket_1.app.use("/api/image", imageUpload_route_1.default);
socket_1.app.get("/", (req, res) => {
    res.send("server is running.");
});
// app.use((req: Request, res: Response) => {
//     res.status(404).json({ message: "No route match." })
// })
const PORT = process.env.PORT || 5000;
socket_1.server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map