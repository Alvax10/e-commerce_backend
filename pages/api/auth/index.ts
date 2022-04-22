import * as yup from "yup";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import corsMiddleware from "middleWares/cors";
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
            const emailSend = await sendCode(email, username, age);
            res.send({ message: "Mail enviado" });
    
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

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await corsMiddleware(req, res, checkBodySchema(bodySchema, handler));
};

export default corsHandler;