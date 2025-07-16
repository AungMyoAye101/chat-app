import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./axios.config";

export const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const deleteGroup = async (groupId: string) => {
    try {
        const res = await axiosInstance.delete("/api/group/delete/" + groupId)
        if (res.status === 200) {
            console.log("Group deleted successfully");
        }
        useNavigate()("/")

    } catch (error) {
        console.log(error)
    }
}