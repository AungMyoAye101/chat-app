import axios from "axios";
import { axiosInstance } from "./axios.config";


export const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function formatChatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60 * 1000) {
        return "just now";
    } else {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
// else if (diff < 60 * 60 * 1000) {
//     const mins = Math.floor(diff / (60 * 1000));
//     return mins === 1 ? "1 min ago" : `${mins} mins ago`;
// }

// if (now.toDateString() === date.toDateString()) {
//         // Show as 11:22 pm
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, "0");
//         const ampm = hours >= 12 ? "pm" : "am";
//         hours = hours % 12 || 12;
//         return `${hours}:${minutes} ${ampm}`;
//     } else {
//         // Show as Jul 24, 11:22 pm
//         const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, "0");
//         const ampm = hours >= 12 ? "pm" : "am";
//         hours = hours % 12 || 12;
//         return `${months[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes} ${ampm}`;
//     }

export const logout = async () => {
    try {
        await axiosInstance.post('/api/auth/logout')
    } catch (error) {
        console.log(error)
    }
}