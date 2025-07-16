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
    members: string[]
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
