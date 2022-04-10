import * as yup from "yup";
import { User } from "models/user";
import methods from "micro-method-router";
import { updateUserAndAuth } from "controllers/auth";
import { checkBodySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse} from "next";
import { authMiddleware } from "middleWares/authMiddleWare";

// Typing the body entrance
let bodySchema = yup.object().shape({
    email: yup.string(),
    age: yup.number(),
    username: yup.string(),
});

async function getMe(req: NextApiRequest, res: NextApiResponse, token) {
    if (req.method == "GET" && token) {
        const user = new User(token.userId);
        await user.pullData();
        res.send(user.data);

    } else {
        res.status(500).send({ error: "Only method get Allowed" });
    }
}

async function patchMe(req: NextApiRequest, res: NextApiResponse, token) {

    try {
        const newUserData = req.body;
        await updateUserAndAuth(token.userId, newUserData);
        res.send({ updated: true });

    } catch (err) {
        res.status(400).send({ errorMessage: err });
    }
}

const handler = methods({
    patch: patchMe,
});

export default checkBodySchema(bodySchema, authMiddleware(handler));
