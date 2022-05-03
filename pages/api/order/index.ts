import * as yup from "yup";
import method from "micro-method-router";
import corsMiddleware from "middleWares/cors";
import { createOrder } from "controllers/orders";
import { NextApiRequest, NextApiResponse} from "next";
import { authMiddleware } from "middleWares/authMiddleWare";
import { checkQuerySchema, checkBodySchema } from "middleWares/schema";

// Typing the query entrance
let querySchema = yup.object().shape({
    productId: yup.string().required(),
});

// Typing the body entrance
let bodySchema = yup.object().shape({
    color: yup.string(),
    shipping_address: yup.string(),
});

// Create order endpoint
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const { productId } = req.query as any;
    
    console.log(1, productId);
    console.log(2, req.body);

    try {
        const { url, orderId } = await createOrder(token.userId, productId, req.body);
        console.log(7, url, orderId);
        res.send({ url, orderId });

    } catch (err) {
        console.error({ "Este es el error en el endpoint order": err });
        res.status(400).send({ "Este es el error en el endpoint order ": err });
    }
}

// Handler type: post
const handler = method({
    post: postHandler,
});

// This middlewares check the token, the req.query and the req.body
const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await corsMiddleware(req, res, checkQuerySchema(querySchema, checkBodySchema(bodySchema, authMiddleware(handler))));
};

export default corsHandler;
