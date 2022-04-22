import methods from "micro-method-router";
import corsMiddleware from "middleWares/cors";
import { getUserData } from "controllers/auth";
import { updateUserAndAuth } from "controllers/auth";
import { NextApiRequest, NextApiResponse} from "next";
import { authMiddleware } from "middleWares/authMiddleWare";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const response = await getUserData(token.userId);
        res.send(response);

    } catch (err) {
        res.status(405).send({ error: err });
    }
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
    
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
    get: getHandler,
    patch: patchHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await corsMiddleware(req, res, authMiddleware(handler));
};

export default corsHandler;
