import type { FC } from "react"


interface ImageBoxPropsType {
    avatar: string,
    className?: '',
    name: string
}

const ImageBox: FC<ImageBoxPropsType> = ({ avatar, name, className }) => {
    return (
        <div>
            {
                avatar ? <img src={avatar} alt={name + "avatar photo"} className={`w-12 h-12 rounded-full bg-gray-300 object-cover ${className}`} /> : <div className={`w-12 h-12 rounded-full bg-blue-400 flex justify-center items-center text-lg capitalize text-white ${className}`} >{name[0]}</div>
            }

        </div>
    )
}

export default ImageBox