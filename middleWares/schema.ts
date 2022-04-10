import { NextApiRequest, NextApiResponse} from "next";

// Middleware tha checks what comes in req.query
export function checkQuerySchema(schema, callback: Function) {
    return async function(req: NextApiRequest, res: NextApiResponse) {
        try {
            const validation = await schema.validate(req.query);
            if (validation) {
                callback(req, res);
            }
        
        } catch (err) {
            res.status(405).send({ field: "query", err: err.errors });
        }
    }
}

// Middleware tha checks what comes in req.body
export function checkBodySchema(schema, callback: Function) {
    return async function(req: NextApiRequest, res: NextApiResponse) {
        try {
            const validation = await schema.validate(req.body);
            if (validation) {
                callback(req, res);
            }
        
        } catch (err) {
            res.status(405).send({ field: "body", err: err.errors });
        }
    }
}