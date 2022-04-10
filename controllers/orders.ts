import { Order } from "models/order";
import { createPreference } from "lib/mercadopago";
import { getProductById } from "controllers/products";
import { sendConfirmedEmail, sendProductBoughtEmail } from "lib/sendgrid";

type createOrderRes = {
    url: string,
    orderId: string,
}

export async function createOrder(userId: string, productId: string, additionalInfo): Promise<createOrderRes> {
    
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
            "notification_url": "https://dwf-m9-pagos.vercel.app/api/webhooks/mercadopago",
        });
        
        // MANDAMOS LOS MAILS DE CONFIRMACIÓN DE LA COMPRA Y PRODUCTO COMPRADO
        await sendConfirmedEmail(email);
        await sendProductBoughtEmail(email, preference["items"]);
        
        // RETORNAMOS LA URL PARA PAGAR EL PRODUCTO
        return { url: preference.init_point, orderId: order.id };

    } catch (err) {
        throw "Falló el controler de crearOrder";
    }
}

export async function getOrderById(orderId) {

    try {
        const order = await Order.findById(orderId);
        return order;

    } catch (err) {
        throw "falló el controller del order en getOrderById" && err;
    }
}
