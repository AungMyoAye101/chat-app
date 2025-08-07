import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: any[]) => {

    return twMerge(clsx(inputs))
}

export default cn

