import cn from '@/lib/cn'
import React, { type FC } from 'react'

type Button = {
    type: "button" | "submit",
    className?: string,
    children: React.ReactNode,
    isLoading?: boolean,
    func?: () => void
}

const Button: FC<Button> = ({ type = "button", className, children, func, isLoading }) => {
    return (
        <button
            type={type}
            disabled={isLoading}
            onClick={func}
            className={cn(` bg-orange-400 px-4 py-1.5 text-white rounded-lg flex justify-center items-center hover:bg-orange-300 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}  ${className}`)}>
            {children}
        </button>
    )
}

export default Button