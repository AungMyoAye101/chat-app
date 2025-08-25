import cn from "@/lib/cn"
import type { FC } from "react"

interface ImageBoxPropsType {
    avatar: string,
    className?: string,
    name: string,
    size: "sm" | "md" | 'lg' | 'xl'
}

const colors = ['bg-red-600', "bg-purple-600", "bg-orange-600", "bg-blue-600"]

const ImageBox: FC<ImageBoxPropsType> = ({ avatar, name, className, size = "md" }) => {


    let imageSize = 'md'
    if (size === "sm") {
        imageSize = "w-6 h-6 text-sm"
    } else if (size === "md") {
        imageSize = "w-10 h-10 text-lg"
    } else if (size === "lg") {
        imageSize = "w-14 h-14 text-xl"
    } else if (size === 'xl') {
        imageSize = 'w-20 h-20 text-2xl '
    } else {
        imageSize = "w-10 h-10 text-lg"
    }

    const randomColors = colors[Math.floor(Math.random() * 4)]

    const style = cn(`rounded-full object-cover ${avatar ? "bg-gray-300 " : ' flex justify-center items-center  capitalize text-white'} ${randomColors} ${className} ${imageSize}`)
    return (
        <div title={name}>
            {
                avatar ? <img src={avatar} alt={name + "avatar photo"} className={style} /> : <div className={style}>{name[0]}</div>
            }

        </div>
    )
}

export default ImageBox