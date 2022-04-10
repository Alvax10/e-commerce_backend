import * as yup from "yup";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import { checkBodySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse} from "next";

let bodySchema = yup.object().shape({
    email: yup.string().required(),
    edad: yup.number().required(),
    username: yup.string().required(),
});

async function createAuth(req: NextApiRequest, res: NextApiResponse) {
    const { email, username, edad } = req.body;

    try {
        const code = await sendCode(email, username, edad);
        res.send({
            message: "Mail enviado",
            code: code,
        });

    } catch (err) {
        res.status(402).send({ messageError: err });
    }
}

const handler = methods({
    post: createAuth,
});

export default checkBodySchema(bodySchema, handler);