import * as yup from "yup";
import methods from "micro-method-router";
import { checkBodySchema } from "middleWares/schema";
import { checkEmailAndCode } from "controllers/auth";
import { NextApiRequest, NextApiResponse} from "next";

let bodySchema = yup.object().shape({
    email: yup.string().required(),
    code: yup.number().required(),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const response = await checkEmailAndCode(req.body.email, req.body.code);
        res.send(response);

    } catch (err) {
        res.status(400).send({ error: err });
    }
}

const handler = methods({
    post: postHandler,
});

export default checkBodySchema(bodySchema, handler);
