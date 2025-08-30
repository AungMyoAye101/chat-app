"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.addMembersToGroup = exports.checkAvailableGroupMembers = exports.getGroupById = exports.updateGroup = exports.getGroups = exports.createGroup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const group_model_1 = __importDefault(require("../model/group.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const createGroup = async (req, res) => {
    const { name, members } = req.body;
    const userId = req.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invaild user id!" });
    }
    const membersId = [...members, userId];
    try {
        const newGroup = await group_model_1.default.create({ name, members: membersId, createdBy: userId });
        if (!newGroup) {
            return res.status(400).json({ message: "Failed to create group." });
        }
        await user_model_1.default.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });
        res.status(201).json({ message: "group created succeeful", group: newGroup });
    }
    catch (error) {
        if (error instanceof Error)
            console.error(error.message);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.createGroup = createGroup;
const getGroups = async (req, res) => {
    const userId = req.id;
    try {
        const groups = await group_model_1.default.find({ members: { $in: userId } });
        if (!groups) {
            res.status(404).json({ message: "Failed to fetch group." });
        }
        res.status(200).json({ message: 'success', groups });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.getGroups = getGroups;
const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." });
    }
    try {
        const updatedGroup = await group_model_1.default.findOneAndUpdate({ _id: groupId }, { ...req.body }, { new: true });
        res.status(200).json({ message: 'Group updated successful', });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.updateGroup = updateGroup;
const getGroupById = async (req, res) => {
    const { groupId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." });
    }
    try {
        const group = await group_model_1.default.findById(groupId).populate('members', 'name lastSeen avatar').populate('createdBy', '_id name ');
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }
        res.status(200).json({ message: 'success', group });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.getGroupById = getGroupById;
const checkAvailableGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    const { name } = req.query;
    if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." });
    }
    try {
        const group = await group_model_1.default.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }
        const allUsers = await user_model_1.default.find({ _id: { $nin: group.members }, name: { $regex: name, $options: "i" } }).select('-password -__v -createdAt -updatedAt');
        res.status(200).json({ message: 'success', avaliableUser: allUsers });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.checkAvailableGroupMembers = checkAvailableGroupMembers;
const addMembersToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." });
    }
    if (!Array.isArray(memberId) || memberId.length === 0) {
        return res.status(400).json({ message: "Members should be an array and cannot be empty." });
    }
    try {
        const updatedGroup = await group_model_1.default.findByIdAndUpdate(groupId, { $addToSet: { members: { $each: memberId } } }, { new: true });
        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found." });
        }
        res.status(200).json({ message: 'Members added successfully', group: updatedGroup });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.addMembersToGroup = addMembersToGroup;
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invaild user id!" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group Id." });
    }
    try {
        const deletedGroup = await group_model_1.default.findByIdAndDelete(groupId);
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found." });
        }
        await user_model_1.default.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
        res.status(200).json({ message: 'Group deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        res.status(500).json({ message: "Interval server error" });
    }
};
exports.deleteGroup = deleteGroup;
//# sourceMappingURL=group.js.map