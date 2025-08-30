import type { Request, Response } from "express";
export declare const getMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getGroupMessage: (req: Request, res: Response) => Promise<void>;
export declare const messageSeenBy: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMessageById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=message.d.ts.map