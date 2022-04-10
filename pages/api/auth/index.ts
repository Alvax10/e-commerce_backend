import * as yup from "yup";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import { checkBodySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse} from "next";

let bodySchema = yup.object().shape({
    email: yup.string().required(),
    age: yup.number().required(),
    username: yup.string().required(),
});

async function createAuth(req: NextApiRequest, res: NextApiResponse) {
    const { email, username, age } = req.body;

    if (email && username && age) {
        try {
            const code = await sendCode(email, username, age);
            res.send({
                message: "Mail enviado",
                code: code,
            });
    
        } catch (err) {
            res.status(402).send({ messageError: err });
        }
        
    } else {
        res.status(400).send({ messageError: "Falta algunos de los datos: email, username o age" });
    }
}

const handler = methods({
    post: createAuth,
});

export default checkBodySchema(bodySchema, handler);