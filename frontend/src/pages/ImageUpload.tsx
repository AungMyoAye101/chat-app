import { axiosInstance } from "@/lib/axios.config"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

let url: string;
const ImageUpload = ({ userId }: { userId: string }) => {
    const [image, setImage] = useState<File | undefined>(undefined)
    const navigate = useNavigate()
    if (image) {

        url = URL.createObjectURL(image)
    }
    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post(`/api/image/upload/${userId}`, { avatar: image }, { headers: { "Content-Type": "multipart/form-data", } })
            console.log(res.data)
            alert('Image uploaded.')
            navigate('/user/' + userId)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }

        }
    }



    return (
        <section className="absolute inset-0 flex justify-center items-center ">

            <form onSubmit={uploadImage} className=" rounded-lg border border-purple-400 flex flex-col py-8 px-6 items-center gap-5 bg-white shadow-lg  h-fit">
                <h1 className="font-semibold text-2xl font-serif">Select photo to upload</h1>
                <div className="flex gap-4">
                    <a href={url} target="_blank">
                        <img src={url || "/vite.svg"} alt="profile image" className=" w-32 h-32 rounded-full border-4 border-purple-400 object-cover" />

                    </a>

                    <label htmlFor="profile" >

                        <div className="rounded-lg bg-neutral-200 w-32 h-32 flex justify-center items-center text-4xl text-neutral-400 cursor-pointer">+</div>
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
                </div>
                <button

                    className="btn !w-full"
                >Upload</button>
            </form>

        </section>
    )
}

export default ImageUpload