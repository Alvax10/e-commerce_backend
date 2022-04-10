import { NextApiRequest } from "next";

export function getOffsetAndLimitFromReq(req: NextApiRequest, maxLimit = 50, maxOffset = 10000) {
    if (req && maxLimit && maxOffset) {
        
        try {
            const queryLimit = parseInt((req.query.limit as string) || "0");
            const queryOffset = parseInt((req.query.offset as string) || "0");
            let limit = 10;

            if (queryLimit > 0 && queryLimit < maxLimit) {
                limit = queryLimit;

            } else if (queryLimit > maxLimit) {
                limit = maxLimit;
            }
            
            const offset = queryOffset <= maxOffset ? queryOffset : 0;
            return { limit, offset };

        } catch (err) {
            return { "Hubo un error en getOffsetAndLimit: ": err };
        }
    }
}