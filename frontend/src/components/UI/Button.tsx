import cn from '@/lib/cn'
import React, { type FC } from 'react'

type Button = {
    type: "button" | "submit",
    className?: string,
    children: React.ReactNode,
    func?: () => void
}

const Button: FC<Button> = ({ type = "button", className, children, func }) => {
    return (
        <button type={type} onClick={func} className={cn(`text-sm bg-orange-400 px-4 py-1.5 text-white rounded flex justify-center items-center hover:bg-orange-300 cursor-pointer ${className}`)}>
            {children}
        </button>
    )
}

export default Button