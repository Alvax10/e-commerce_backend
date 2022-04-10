import { Auth } from "models/auth";
import { generate } from "controllers/jwt";
import { NextApiRequest, NextApiResponse} from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);
        if (!auth) {
            res.status(401).send({ message: "Email or code incorrect" });
        }
        const expires = auth.isCodeexpired();
        if (expires) {
            res.status(401).send({ message: "Code expired" });
            
        } else {
            const token = generate({ userId: auth.data.userId });
            res.send({ token });
        }

    } catch (err) {
        res.status(500).send({ messageError: err });
    }
}