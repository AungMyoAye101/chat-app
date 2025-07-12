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