import { User } from "models/user";
import methods from "micro-method-router";
import { updateUserAndAuth } from "controllers/auth";
import { NextApiRequest, NextApiResponse} from "next";
import { authMiddleware } from "middleWares/authMiddleWare";

async function getMe(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const user = new User(token.userId);
        await user.pullData();
        res.send(user.data);

    } catch (err) {
        res.status(500).send({ error: err });
    }
}

async function patchMe(req: NextApiRequest, res: NextApiResponse, token) {
    
    const newUserData = req.body;
    if (newUserData.email && newUserData.age && newUserData.username) {
        try {
            await updateUserAndAuth(token.userId, newUserData);
            res.send({ updated: true });
        
        } catch (err) {
            res.status(400).send({ errorMessage: err });
        }

    } else {
        res.status(400).send({ error: "Faltan datos en el body o hay datos incorrectos" });
    }
}

const handler = methods({
    get: getMe,
    patch: patchMe,
});

export default authMiddleware(handler);
