import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=verify.d.ts.map