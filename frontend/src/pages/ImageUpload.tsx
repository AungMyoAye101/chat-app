import { axiosInstance } from "@/lib/axios.config"
import { useState } from "react"
import { useParams } from "react-router-dom"


const ImageUpload = () => {
    const [image, setImage] = useState<File | undefined>(undefined)
    console.log(image)
    const { userId } = useParams()
    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post(`/api/image/upload/${userId}`, { avatar: image }, { headers: { "Content-Type": "multipart/form-data", } })
            console.log(res.data)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }

        }
    }
    return (
        <form onSubmit={uploadImage} className="flex items-center gap-4">
            <label htmlFor="profile">
                <img src="/vite.svg" alt="profile image" className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover" />
                <input
                    type="file"
                    accept="image/*"
                    id="profile"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImage(file);
                    }}
                />
            </label>
            <button className="px-4 py-1.5 rounded-lg bg-blue-400 text-white">Upload</button>
        </form>
    )
}

export default ImageUpload