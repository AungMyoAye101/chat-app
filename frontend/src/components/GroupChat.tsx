import type { GroupTypes } from "@/lib/types";

interface GroupChatProps {
    selected: GroupTypes // Adjust type as needed
}

const GroupChat = ({ selected }: GroupChatProps) => {
    console.log("Selected Group:", selected);
    return (
        <section>
            <div className="flex items-center gap-2 ">
                <div className="w-14 h-14 bg-neutral-200 rounded-full"></div>
                <h1>{selected.name}</h1>
            </div>

            <div className="h-96 w-96 border "></div>
            <form className="flex  mt-2">
                <input type="text" placeholder="Type a message..." className="w-full p-2 border" />
                <button type="submit" className="bg-blue-500 text-white p-2">Send</button>
            </form>
        </section>
    )
}

export default GroupChat