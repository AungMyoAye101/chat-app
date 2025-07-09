import React, { type FC } from 'react'

type Button = {
    type: "button" | "submit",
    leftIcon?: string,
    text: string,
    rightIcon?: string,
    className?: string
}

const Button: FC<Button> = ({ type = "button", leftIcon, text, rightIcon, className }) => {
    return (
        <button type={type} className={`text-sm bg-blue-400 px-4 py-2 rounded flex justify-center items-center hover:bg-pink-400 ${className}`}>
            {
                leftIcon && <span>{leftIcon}</span>
            }
            <span> {text}</span>
            {
                rightIcon && <span>{rightIcon}</span>
            }

        </button>
    )
}

export default Button