import { mongoose } from 'mongoose'

const connection = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("DB connected.");
    }).catch((err) => {
        console.log("Error in connecting to DB.", err);
    })
}
export default connection