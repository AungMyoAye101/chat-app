import mongoose from "mongoose"

export const connectToDb = () => {

    mongoose.connect(process.env.MONGODB_URL).then(() => console.log("Database connected>")).catch((error) => console.log("db connection error", error))
}