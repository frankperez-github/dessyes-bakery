import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    _id:{
        type: ObjectId,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    defaultQuant: {
        type: Number,
        required: true
    }
}
)
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;