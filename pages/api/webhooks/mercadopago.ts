import { NextApiRequest, NextApiResponse} from "next";
import { completePurchaseOrder } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { topic, id } = req.query as any;

    try {        
        await completePurchaseOrder(topic, id);
        res.send({ response: "Compra realizada con éxito" });

    } catch (err) {
        res.status(400).send({ error: err });
    }
}