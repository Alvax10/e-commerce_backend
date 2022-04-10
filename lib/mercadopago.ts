import mercadopago from "mercadopago";

mercadopago.configure({
    access_token: process.env.MERCADOPAGO_TOKEN,
});

// BUSCAMOS LA MERCHANT ORDER A TRAVÉS DE LA ORDERID
export async function getMerchantOrder(id) {
    const res = await mercadopago.merchant_orders.get(id);
    return res.body;
}

// CREAMOS LA PREFERENCIA
export async function createPreference(data) {
    const res = await mercadopago.preferences.create(data);
    return res.body;
}