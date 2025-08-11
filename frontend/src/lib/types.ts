export interface UserType {
    _id: string,
    name: string,
    email: string,
    avatar?: string,
    lastSeen: string
}

export interface GroupTypes {
    _id: string,
    name: string,
    createdBy: string,
    members: string[],
    avatar: string,
}

export interface MembersType {
    _id: string;
    name: string;
    avatar?: string;
    lastSeen: string
}
export interface GroupWithMembers extends Omit<GroupTypes, "members"> {
    members: MembersType[]
}

export interface MessageType {
    _id: string,
    sender: { _id: string, name: string, };
    receiver: { _id: string, name: string, };
    message: string,
    createdAt: string,
    seenBy: string[]
    // add other fields if needed
};