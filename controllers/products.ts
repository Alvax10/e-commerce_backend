import { User } from "models/user";
import { productIndex } from "lib/algolia";

export async function getProductById(id: string) {
    const hit = await productIndex.findObject((hit => hit.objectID == id));
    const product = await hit.object;

    return {
            title: product["Name"],
            color: product["Color"],
            stock: product["In stock"],
            image: product["Images"],
            description: product["Description"],
            price: product["unit_price"],
            id: product.objectID,
            type: product["Type"],
        };
}

export async function searchProductsController(search: string, limit: number, offset: number) {
    const hits = await productIndex.search(search as string, {
        hitsPerPage: limit,
        offset: offset,
        length: limit,
    });

    const products = {
        results: hits["hits"],
        pagination: {
            offset,
            limit,
            total: hits.nbHits,
        }
    };

    return { products };
}

export async function addProductToCart(userId: string, productId: string) {

    try {
        const product = await getProductById(productId);
        const productAdded = await User.addToCart(userId, product);
        return { productAdded };
        
    } catch (err) {
        return { "Error en el controller products": err };
    }

}

export async function deleteProductFromCart(userId: string, productId: string) {

    try {
        const product = await getProductById(productId);
        const productDeleted = await User.deleteFromCart(userId, product);
        return productDeleted;
        
    } catch (err) {
        return { "Error en el controller products": err} ;
    }
}

export async function getUserCart(userId: string) {
    try {
        const cart = await User.getCart(userId);
        return { cart };

    } catch (err) {
        return { "Error en el getUserCart del controller": err };
    }
}

