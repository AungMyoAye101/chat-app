import React, { createContext, useContext, useEffect, useState } from 'react'

const layoutContext = createContext<{ isMobile: boolean } | undefined>(undefined)

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <layoutContext.Provider value={{ isMobile }}>{children}</layoutContext.Provider>
    )
}

export const useLayout = () => {
    const context = useContext(layoutContext)
    if (!context) throw new Error("useLayout must be inside layout provider.")
    return context
}

export default LayoutProvider