import mongoose from "mongoose"


export const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string)
        console.log(`DB connected `)
    } catch (error) {
        console.error("Failed to connect db ", error)
        process.exit(1)
    }

}
