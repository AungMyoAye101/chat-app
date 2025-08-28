import mongoose from "mongoose"


export const connectToDb = () => {
    mongoose.connect(process.env.MONGODB_URL as string).then(() => console.log("Database connected.")).catch((error) => console.log("db connection error", error))
}
