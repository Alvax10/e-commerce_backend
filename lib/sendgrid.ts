import * as sgMail from "@sendgrid/mail";
import { sendCodeTemplate } from "lib/sendCodeTemplate";

export async function sendCodeToEmail(email: string, code: number) {
    
    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);
    const msg = {
        to: email,
        from: "alvaro695547@gmail.com",
        subject: `Este es tu código para loguearte`,
        text: `Este es el código: ${code}`,
        html: sendCodeTemplate(code),
    }
    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
        return true;
    });
}

export async function sendConfirmedEmail(email: string) {

    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);
    const msg = {
        to: email,
        from: "alvaro695547@gmail.com",
        subject: `Tu pago fue aprobado!`,
        text: `El pago de la compra que realizaste fue aprobada!`,
        html: `<h3> El pago de la compra que realizaste fue aprobada! </h3>`,
    }
    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
        return true;
    });
}

export async function sendProductBoughtEmail(email: string, productData) {
    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);

    const msg = {
        to: email,
        from: "alvaro695547@gmail.com",
        subject: `Compraste ${productData.title}!`,
        text: `La compra de ${productData.title} por: ${productData.unit_price} fue exitosa, esperamos que la disfrutes!`,
        html: `<div class="general-container">
            <div class="header">
                <img src="" />
            </div>
            <div class="body">
            La compra de ${productData.title} por: ${productData.unit_price} fue exitosa, esperamos que la disfrutes!
            </div>
        </div>`,
    }

    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
        return true;
    });
}