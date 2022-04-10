import { base } from "lib/airtable";
import { productIndex } from "lib/algolia";
import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "controllers/request";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    const  { limit, offset } = getOffsetAndLimitFromReq(req, 10, 10000);
    base('Furniture').select({
        pageSize: limit,
    }).eachPage(async function page(records, fetchNextPage) {
        const objects = records.map((r) => {
            return {
                objectID: r.id,
                ...r.fields,
            }
        });
        await productIndex.saveObjects(objects);
        fetchNextPage();
    },
    function done(err) {
        if (err) {
            throw { "Este es el error de sync: ": err };
        }
        console.log("terminó");
        res.send(true);
    });
}