import { NextApiRequest, NextApiResponse} from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.send("Thanks for using my API :D");
}