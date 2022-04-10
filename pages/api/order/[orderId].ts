import * as yup from "yup";
import { getOrderById } from "controllers/orders";
import methods from "micro-method-router";
import { checkQuerySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse} from "next";
import { authMiddleware } from "middleWares/authMiddleWare";

// Typing the query entrance
let querySchema = yup.object().shape({
    orderId: yup.string().required(),
});

async function OrderById(req: NextApiRequest, res: NextApiResponse, token) {

    try {
        const orderId = req.query;
        const order = await getOrderById(orderId["orderId"]);
        res.send({ order });

    } catch (err) {
        res.status(400).send({ errorMessage: err });
    }
}

const handler = methods({
    get: OrderById,
});

export default checkQuerySchema(querySchema, authMiddleware(handler));