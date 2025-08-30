import http from "http";
import { Server } from "socket.io";
declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}
declare const app: import("express-serve-static-core").Express;
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export { io, server, app };
//# sourceMappingURL=socket.d.ts.map