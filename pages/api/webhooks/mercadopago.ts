import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse} from "next";
import { completePurchaseOrder } from "controllers/orders";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { topic, id } = req.query as any;

    try {        
        const response = await completePurchaseOrder(topic, id);
        res.send({ response: "Compra realizada con éxito" });

    } catch (err) {
        res.status(400).send({ error: err });
    }
}

const handler = methods({
    post: postHandler,
});

export default handler;