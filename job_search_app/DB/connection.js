import mongoose from 'mongoose';


export const connection = async () => {
    mongoose.connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("Error in DB connection", err));
};