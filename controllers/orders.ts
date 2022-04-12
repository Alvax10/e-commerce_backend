import { Order } from "models/order";
import { getUserData } from "controllers/auth";
import { getMerchantOrder } from "lib/mercadopago";
import { createPreference } from "lib/mercadopago";
import { getProductById } from "controllers/products";
import { sendConfirmedEmail, sendProductBoughtEmail } from "lib/sendgrid";

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == "development") {
    var notificationUrl = "https://webhook.site/2ae35616-7137-4024-aa9d-606613d77f95";

} else if (process.env.NODE_ENV == "production") {
    var notificationUrl = "https://dwf-m9-pagos.vercel.app/api/webhooks/mercadopago";
}

console.log(notificationUrl);

export async function createOrder(userId: string, productId: string, additionalInfo) {
    
    try {
        // BUSCAMOS EL PRODUCTO EN ALGOLIA, QUE ESTÁ SYNC CON AIRTABLE
        const product = await getProductById(productId);

        if (!product) {
            throw "Producto no encontrado en createOrder";
        }
        // CREAMOS LA ORDEN
        const order = await Order.createNewOrder({
            additionalInfo: additionalInfo,
            productId: productId,
            userId: userId,
            status: 'pending'
        });
        // BUSCAMOS EL EMAIL DEL USUARIO A TRAVÉS DEL USERID
        const email = await order.findUserEmail();

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
                "success": "http://www.hottoys.com.hk/",
            },
            "external_reference": order.id,
            "notification_url": notificationUrl,
        });
        
        // RETORNAMOS LA URL PARA PAGAR EL PRODUCTO
        return { url: preference.init_point, orderId: order.id };

    } catch (err) {
        return { "Falló el controler de crearOrder": err };
    }
}

export async function getOrderById(orderId) {

    try {
        const order = await Order.findById(orderId);
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
                const myOrder = await getOrderById(order.id);
                const product = await getProductById(myOrder.data.productId);
                const user = await getUserData(order.data.userId);

                // MANDAMOS LOS MAILS DE CONFIRMACIÓN DE LA COMPRA Y PRODUCTO COMPRADO
                sendConfirmedEmail(user.email);
                sendProductBoughtEmail(user.emaill, product);
    
                myOrder.data.status = 'closed';
                await myOrder.pushData();

            } catch (err) {
                throw { "falló el controllador order en getMerchantId: ": err };
            }
        }
    }
}
