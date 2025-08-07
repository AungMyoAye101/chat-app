import cn from "@/lib/cn"
import type { FC } from "react"

interface ImageBoxPropsType {
    avatar: string,
    className?: string,
    name: string
}

const ImageBox: FC<ImageBoxPropsType> = ({ avatar, name, className }) => {

    const style = cn(`w-12 h-12 rounded-full object-cover ${avatar ? "bg-gray-300 " : 'bg-blue-400 flex justify-center items-center text-lg capitalize text-white'} ${className}`)
    return (
        <div>
            {
                avatar ? <img src={avatar} alt={name + "avatar photo"} className={style} /> : <div className={style}>{name[0]}</div>
            }

        </div>
    )
}

export default ImageBox