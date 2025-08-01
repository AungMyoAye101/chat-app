import { axiosInstance } from "@/lib/axios.config"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

// For Props type 

interface PropsType {
    userId: string,
    img: string,
    onClose: () => void
}

let url: string;
const ImageUpload = ({ userId, onClose, img }: PropsType) => {
    const [image, setImage] = useState<File | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    const containerRef = useRef<HTMLFormElement | null>(null)
    url = img ? img : "/vite.svg"
    if (image) {

        url = URL.createObjectURL(image)
    }
    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axiosInstance.post(`/api/image/upload/${userId}`, { avatar: image }, { headers: { "Content-Type": "multipart/form-data", } })
            console.log(res.data)
            onClose()
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }

        } finally {
            setIsLoading(false)
        }
    }

    const handleClickOutside = (e: React.MouseEvent) => {

        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {

            onClose()
        }
    }

    return (
        <section className="absolute inset-0 flex justify-center items-center " style={{ background: "#00000080" }} onClick={handleClickOutside}>

            <form
                ref={containerRef}
                onSubmit={uploadImage}

                className=" rounded-lg border border-purple-400 flex flex-col py-8 px-6 items-center gap-5 bg-white shadow-lg  h-fit">
                <h1 className="font-semibold text-2xl font-serif">Select photo to upload</h1>
                <div className="flex gap-4">
                    <a href={url} target="_blank">
                        <img src={url || "/vite.svg"} alt="profile image" className=" w-32 h-32 rounded-full border-4 border-purple-400 object-cover " />

                    </a>

                    <label htmlFor="profile">

                        <div title="upload image" className={`rounded-lg border border-purple-400 bg-neutral-200 w-32 h-32 flex justify-center items-center text-4xl text-neutral-400 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>+</div>
                        <input
                            disabled={isLoading}
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
                </div>
                {
                    isLoading ?
                        <div className="btn !bg-neutral-300 cursor-wait !w-full text-center">Uploading...</div> :
                        <button className="btn !w-full" >Upload</button>
                }

            </form>

        </section>
    )
}

export default ImageUpload