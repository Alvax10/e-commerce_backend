import { NextApiRequest, NextApiResponse } from "next";

function getLista() {
    return Array.from(Array(1000).keys()).map((valor) => {
        return {
            nombre: valor,
            apellido: "apellido" + valor,
        }
    });
}

function getOffsetAndLimitFromReq(req: NextApiRequest, maxLimit, maxOffset) {
    if (req && maxLimit && maxOffset) {
        
        try {
            const queryLimit = parseInt(req.query.limit as string);
            const queryOffset = parseInt(req.query.offset as string);
            const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
            const offset = queryOffset <= maxOffset ? queryOffset : 0;
        
            return { limit, offset };

        } catch (err) {
            console.error("Hubo un error en getOffsetAndLimit: ", err);
        }
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "GET") {

        const lista = getLista();
        const  { limit, offset } = getOffsetAndLimitFromReq(req, 10, lista.length);
        const sliced = lista.slice(offset, offset + limit);
        res.send({
            results: sliced,
            pagination: {
                offset,
                limit,
                total: lista.length,
            },
        });
    
    } else {
        res.send(false);
    }
}