import test from "ava";
import { generate, decode } from "controllers/jwt";

test("jwt encode/decode", (t) => {

    const payLoad = { marce: true }
    const token = generate(payLoad);
    const decoded = decode(token);
    delete decoded.iat;

    t.deepEqual(payLoad, decoded);
});