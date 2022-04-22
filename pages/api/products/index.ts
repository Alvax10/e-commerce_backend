import * as yup from "yup";
import methods from "micro-method-router";
import corsMiddleware from "middleWares/cors";
import { checkQuerySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { searchProductsController } from "controllers/products";
import { getOffsetAndLimitFromReq } from "controllers/request";

// Typing the query entrance
let querySchema = yup.object().shape({
    search: yup.string(),
});

async function searchProducts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { limit, offset } = getOffsetAndLimitFromReq(req);
        const { search } = req.query as any;
        const { products } = await searchProductsController(search, limit, offset);
        res.send(products);

    } catch (err) {
        res.status(500).send({ error: err });
    }
}

const handler = methods({
    get: searchProducts
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await corsMiddleware(req, res, checkQuerySchema(querySchema, handler));
};

export default corsHandler;
