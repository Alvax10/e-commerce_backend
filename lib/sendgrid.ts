import * as sgMail from "@sendgrid/mail";
import Router from "next/router";

export async function sendCodeToEmail(email: string, code: number) {

    await sgMail.setApiKey(process.env.API_KEY_SENDGRIND);
    const msg = {
        to: email,
        from: "alvaro695547@gmail.com",
        subject: `Este es tu código para loguearte`,
        text: `Este es el código: ${code}`,
        html: `<strong> Este es el código que necesitas para loguearte: ${code} </strong>`,
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
        text: `La compra ${productData.title} de ${productData.unit_price} fue exitosa, esperamos que la disfrutes!`,
        html: `<div class="container"> <h3 class="title"> Tu compra fue exitosa! </h3>
        <h4 class="subt-title"> Gracias por confiar en nosotros, esperamos que lo disfrutes! </h4>
        <p class="purchase"> Compra de ${productData.title} por $${productData.unit_price} ARS. </p>
        <button class="button"> Volver a comprar </button>
        </div>`,
    }

    const enviarMail = await sgMail.send(msg)
    .then(() => {
        console.log("Email enviado! :D");
        return true;
    });
}