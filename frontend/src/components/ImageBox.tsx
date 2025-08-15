import cn from "@/lib/cn"
import type { FC } from "react"

interface ImageBoxPropsType {
    avatar: string,
    className?: string,
    name: string,
    size: "sm" | "md" | 'lg'
}

const ImageBox: FC<ImageBoxPropsType> = ({ avatar, name, className, size = "md" }) => {

    const imageSize = size === "sm" ? "w-6 h-6 text-sm" : size === "lg" ? "w-14 h-14 text-xl" : "w-10 h-10 text-lg"

    const style = cn(`rounded-full object-cover ${avatar ? "bg-gray-300 " : 'bg-blue-400 flex justify-center items-center  capitalize text-white'} ${className} ${imageSize}`)
    return (
        <div title={name}>
            {
                avatar ? <img src={avatar} alt={name + "avatar photo"} className={style} /> : <div className={style}>{name[0]}</div>
            }

        </div>
    )
}

export default ImageBox