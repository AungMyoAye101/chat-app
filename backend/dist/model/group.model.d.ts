import mongoose, { Document } from "mongoose";
export interface IGroup extends Document {
    name: string;
    members: string[];
    createdBy: string;
    avatar: string;
    avatarPublicId: string;
}
declare const Group: mongoose.Model<IGroup, {}, {}, {}, mongoose.Document<unknown, {}, IGroup, {}> & IGroup & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Group;
//# sourceMappingURL=group.model.d.ts.map