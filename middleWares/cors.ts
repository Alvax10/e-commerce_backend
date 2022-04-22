import Cors from "cors";
const cors = Cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
});

export default function corsMiddleware(req, res, cb) {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            cb(req, res);
            return resolve(result);
        });
    });
}