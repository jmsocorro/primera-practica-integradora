import mongoose from "mongoose";

const cartCollection = "carts";

const productSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
})

const cartSchema = new mongoose.Schema({
    products: [productSchema],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
