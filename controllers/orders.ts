import { Order } from "models/order";
import { getUserData } from "./auth";
import { getProductById } from "controllers/products";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { sendConfirmedEmail, sendProductBoughtEmail } from "lib/sendgrid";

if (process.env.NODE_ENV == "development") {
    var notificationUrl = "https://webhook.site/2ae35616-7137-4024-aa9d-606613d77f95";

} else if (process.env.NODE_ENV == "production") {
    var notificationUrl = "https://dwf-m9-final.vercel.app/api/webhooks/mercadopago";
}

export async function createOrder(userId: string, productId: string, additionalInfo) {
    
    console.log(3, userId, productId, additionalInfo);

    try {
        // BUSCAMOS EL PRODUCTO EN ALGOLIA, QUE ESTÁ SYNC CON AIRTABLE
        const product = await getProductById(productId);

        console.log(4, product);

        if (product == {}) {
            throw "Producto no encontrado en createOrder";
        }
        // CREAMOS LA ORDEN
        const order = await Order.createNewOrder({
            additionalInfo: additionalInfo,
            productId: productId,
            userId: userId,
            status: 'pending'
        });

        // CREAMOS LA PREFERENCIA
        const preference = await createPreference({
            "items": [
                {
                    "title": product.title,
                    "description": "No description",
                    "picture_url": product.image[0]["url"],
                    "category_id": product.type,
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": product.price
                }
            ],
            "back_urls": {
                "success": "https://dwf-m10.vercel.app/thankyou",
            },
            "external_reference": order.id,
            "notification_url": notificationUrl,
        });

        console.log(5, preference);
        console.log(6, { url: preference.init_point, orderId: order.id });
        // RETORNAMOS LA URL PARA PAGAR EL PRODUCTO
        return { url: preference.init_point, orderId: order.id };

    } catch (err) {
        return { "Falló el controler de crearOrder": err };
    }
}

export async function getOrderById(orderId) {

    try {
        const order = await Order.findById(orderId);
        // console.log("ORDER DESDE EL CONTROLLER GET ORDER BY ID: ", order);
        return order;

    } catch (err) {
        return { "falló el controller del order en getOrderById": err };
    }
}

export async function completePurchaseOrder(topic: string, id: string) {
    if (topic == 'merchant_order') { 
    
        const order = await getMerchantOrder(id);
        if (order.order_status == 'paid') {

            try {

                const orderId = order.external_reference;
                const newOrder = await Order.findById(orderId);

                const product = await getProductById(newOrder.data.productId);
                // BUSCAMOS EL EMAIL DEL USUARIO A TRAVÉS DEL USERID
                const user = await getUserData(newOrder.data.userId);

                // MANDAMOS LOS MAILS DE CONFIRMACIÓN DE LA COMPRA Y PRODUCTO COMPRADO
                sendConfirmedEmail(user.data.email);
                sendProductBoughtEmail(user.data.email, product);

                newOrder.data.status = "closed";
                await newOrder.pushData();

            } catch (err) {
                throw { "falló el controllador order en getMerchantId: ": err };
            }
        }
    }
}
