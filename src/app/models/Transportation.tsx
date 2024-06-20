import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const TransportationSchema = new mongoose.Schema({
    _id:{
        type: ObjectId,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    transportation_price: {
        type: Number,
        required: true
    }
}
)
const Transportation = mongoose.models.Transportation || mongoose.model('Transportation', TransportationSchema);
export default Transportation;