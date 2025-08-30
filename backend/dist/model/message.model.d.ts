import mongoose, { Document } from "mongoose";
export interface IMessage extends Document {
    sender: string;
    receiver: string;
    group: string;
    message: string;
    seenBy: string[];
}
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Message;
//# sourceMappingURL=message.model.d.ts.map