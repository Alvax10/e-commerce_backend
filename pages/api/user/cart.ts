import * as yup from "yup";
import methods from "micro-method-router";
import { checkQuerySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "middleWares/authMiddleWare";
import { addProductToCart, deleteProductFromCart, getUserCart } from "controllers/products";

// Typing the query entrance
let querySchema = yup.object().shape({
    productId: yup.string().optional(),
});

async function addProductToCartPost(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const { productId } = req.query as any;
        const { productAdded } = await addProductToCart(token.userId, productId);
        res.send({ productAdded });

    } catch (err) {
        res.status(500).send({ error: err });
    }
}

async function deleteProductFromCartPost(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const { productId } = req.query as any;
        const productDeleted = await deleteProductFromCart(token.userId, productId);
        res.send(productDeleted);

    } catch (err) {
        res.status(500).send({ error: err });
    }
}

async function getCartPost(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const userCart = await getUserCart(token.userId);
        res.send(userCart);
    
    } catch (err) {
        res.status(500).send({ error: err });
    }
}

const handler = methods({
    get: getCartPost,
    post: addProductToCartPost,
    delete: deleteProductFromCartPost,
});

export default checkQuerySchema(querySchema, authMiddleware(handler));