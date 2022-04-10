import * as yup from "yup";
import methods from "micro-method-router";
import { checkQuerySchema } from "middleWares/schema";
import { NextApiRequest, NextApiResponse} from "next";
import { updateCertainUserData } from "controllers/auth";
import { authMiddleware } from "middleWares/authMiddleWare";

// Typing the query entrance
let querySchema = yup.object().shape({
    email: yup.string(),
    age: yup.number(),
    username: yup.string(),
});

async function patchCertainUserData(req: NextApiRequest, res: NextApiResponse, token) {

    try {
        const newUserData = req.query;
        const certainDataUpdated = await updateCertainUserData(token.userId, newUserData);
        res.send({ certainDataUpdated });

    } catch (err) {
        res.status(400).send({ errorMessage: err });
    }
}

const handler = methods({
    patch: patchCertainUserData,
});

export default checkQuerySchema(querySchema, authMiddleware(handler));