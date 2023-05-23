import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "./models/product.model.js";

class CartManagerDB {
    getCarts = (limit) => {
        console.log(limit);
        const carts = cartModel.find().limit(limit).lean().exec();
        return carts;
    };
    getCartById = async (cid) => {
        // busco el indice del Carro
        try {
            const cartfound = await cartModel
                .findOne({ _id: cid })
                .lean()
                .exec();
            console.log(cartfound);
            return cartfound;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
    addCart = async () => {
        const products = [];
        const cart = {
            products,
        };
        try {
            const newCart = new cartModel(cart);
            newCart.save();
            return newCart;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
    addProduct = async ({ cid, pid }) => {
        // busco el indice del Carro
        try {
            const cartfound = await cartModel
                .findOne({ _id: cid })
                .lean()
                .exec();
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            } else {
                try {
                    const prodexists = await productModel
                        .findOne({ _id: pid })
                        .lean()
                        .exec();
                    if (prodexists === null) {
                        return { error: 2, errortxt: "el producto no existe" };
                    } else {
                        const prodfound = cartfound.products.findIndex(
                            (product) => product._id === pid,
                        );
                        // Si no existe devuelvo sumo el producto al carro, sino sumo 1 en quantity
                        if (prodfound < 0) {
                            cartfound.products.push({ id: pid, quantity: 1 });
                        } else {
                            cartfound.products[prodfound].quantity++;
                        }
                        console.log(cartfound, prodfound);
                        try {
                            const updatedCart =
                                await cartModel.findByIdAndUpdate(
                                    cid,
                                    cartfound,
                                );
                            return cartfound;
                        } catch (error) {
                            return { error: 3, servererror: error };
                        }
                    }
                } catch (error) {
                    return { error: 3, servererror: error };
                }
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
}

export { CartManagerDB };
