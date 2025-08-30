import type { Request, Response } from "express";
export declare const createGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getGroups: (req: Request, res: Response) => Promise<void>;
export declare const updateGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getGroupById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkAvailableGroupMembers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addMembersToGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=group.d.ts.map