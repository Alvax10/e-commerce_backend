import corsMiddleware from "middleWares/cors";
import { NextApiRequest, NextApiResponse} from "next";

const endpoint = function (req: NextApiRequest, res: NextApiResponse) {
    res.send("Thanks for using my API :D");
}

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await corsMiddleware(req, res, endpoint);
};

export default corsHandler;