import * as yup from "yup";
import methods from "micro-method-router";
import { getProductById } from "controllers/products";
import { checkQuerySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse } from "next";

// Typing the query entrance
let querySchema = yup.object().shape({
    search: yup.string(),
});

async function searchProducts(req: NextApiRequest, res: NextApiResponse) {

    try {
        const producId = req.query as any;
        const product = await getProductById(producId["productId"]);
        res.send(product);

    } catch (err) {
        res.status(500).send({ errorMessage: err });
    }
}

const handler = methods({
    get: searchProducts
});

export default checkQuerySchema(querySchema, handler);