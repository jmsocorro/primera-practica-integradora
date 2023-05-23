import { productModel } from "../dao/models/product.model.js";

class ProductManagerDB {
    getProducts = async (limit) => {
        try {
            const products = productModel.find().limit(limit).lean().exec();
            return products;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
    getProductById = async (id) => {
        try {
            const foundprod = productModel.findOne({ _id: id }).lean().exec();
            return foundprod;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
    addProduct = async ({
        title,
        description,
        price,
        thumbnails = [],
        code,
        stock,
        category,
        status = true,
    }) => {
        let errortxt = [];
        (!title || title.length === 0) &&
            errortxt.push("title es obligatorio.");
        (!description || description.length === 0) &&
            errortxt.push("description es obligatorio.");
        (!code || code.length === 0) && errortxt.push("code es obligatorio.");
        (!price || price.length === 0) &&
            errortxt.push("price es obligatorio.");
        price &&
            (isNaN(price) || price <= 0) &&
            errortxt.push("price tiene que ser un número positivo.");
        (!stock || stock.length === 0) &&
            errortxt.push("stock es obligatorio.");
        stock &&
            (isNaN(stock) || stock <= 0) &&
            errortxt.push("stock tiene que ser un número positivo.");
        (!category || category.length === 0) &&
            errortxt.push("category es obligatorio.");
        !Array.isArray(thumbnails) &&
            errortxt.push("thumbnails tiene que ser un array.");
        try {
            const found = await productModel
                .findOne({ code: code })
                .lean()
                .exec();
            console.log(found);
            if (found !== null) {
                errortxt.push("Ya se encuentra un producto con el mismo code.");
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
        if (errortxt.length > 0) {
            return { error: 1, errortxt: errortxt };
        } else {
            const product = {
                title,
                description,
                price,
                status,
                category,
                thumbnails,
                code,
                stock,
            };
            const newProduct = new productModel(product);
            newProduct.save();
            return newProduct;
        }
    };
    updateProduct = async ({
        id,
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status,
    }) => {
        // busco el indice del producto
        try {
            const found = await productModel.findOne({ _id: id }).lean().exec();
            //console.log(found);
            //const updateId = found._id
            if (found === null) {
                return { error: 2, errortxt: "el producto no existe" };
            } else {
                let errortxt = [];
                (!title || title.length === 0) &&
                    errortxt.push("title es obligatorio.");
                (!description || description.length === 0) &&
                    errortxt.push("description es obligatorio.");
                (!code || code.length === 0) &&
                    errortxt.push("code es obligatorio.");
                (!price || price.length === 0) &&
                    errortxt.push("price es obligatorio.");
                price &&
                    (isNaN(price) || price <= 0) &&
                    errortxt.push("price tiene que ser un número positivo.");
                (!stock || stock.length === 0) &&
                    errortxt.push("stock es obligatorio.");
                stock &&
                    (isNaN(stock) || stock <= 0) &&
                    errortxt.push("stock tiene que ser un número positivo.");
                (!category || category.length === 0) &&
                    errortxt.push("category es obligatorio.");
                (!status || status.length === 0) &&
                    errortxt.push("status es obligatorio.");
                !thumbnails && errortxt.push("status es obligatorio.");
                !Array.isArray(thumbnails) &&
                    errortxt.push("thumbnails tiene que ser un array.");
                // verifico si el codigo nuevo no se repite en otro producto
                try {
                    const codefound = await productModel
                        .findOne({
                            $and: [{ _id: { $ne: id } }, { code: code }],
                        })
                        .lean()
                        .exec();
                    //console.log(codefound);
                    if (codefound !== null) {
                        errortxt.push(
                            "Ya se encuentra un producto con el mismo code.",
                        );
                    }
                } catch (error) {
                    console.log(error);
                }

                if (errortxt.length > 0) {
                    return { error: 1, errortxt: errortxt };
                } else {
                    const updatedProduct = await productModel.findByIdAndUpdate(
                        id,
                        {
                            title,
                            description,
                            price,
                            status,
                            category,
                            thumbnails,
                            code,
                            stock,
                        },
                    );
                    return {
                        id,
                        title,
                        description,
                        price,
                        status,
                        category,
                        thumbnails,
                        code,
                        stock,
                    };
                }
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
    deleteProduct = async (id) => {
        // busco el indice del producto
        try {
            const found = await productModel.findOne({ _id: id }).lean().exec();
            if (found === null) {
                return { error: 2, errortxt: "el producto no existe" };
            } else {
                const deletedProd = await productModel.deleteOne({ _id: id });
                console.log(deletedProd);
                return deletedProd;
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
}

export { ProductManagerDB };
