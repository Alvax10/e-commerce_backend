import { User } from "models/user";
import { Auth } from "models/auth";
import { addMinutes } from "date-fns";
import { generate } from "controllers/jwt";
import { sendCodeToEmail } from "lib/sendgrid";

// ESTA FUNCIÓN CHEQUEA SI EL MAIL YA ESTÁ EN LA BD O NO
export async function findOrCreateAuth(email: string, username: string, age: number): Promise<Auth> {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);

    try {
        if (auth) {
            console.log("Auth existente");
            return auth;
    
        } else {
            // CREO UN NUEVO USUARIO SI EL MAIL NO EXISTE EN LA BD
            console.log("Usuario nuevo");
            const newUser = await User.createUser({
                email: cleanEmail,
                username: username,
                age: age,
                cart: [],
            });
    
            const newAuth = await Auth.createAuth({
                email: cleanEmail,
                userId: newUser.id,
                code: 0,
                expires: new Date(),
            });
    
            return newAuth;
        }

    } catch (err) {
        throw err;
    }
}

// DA UN NUMERO RANDOM A PARTIR DE DOS LIMITES, MAXIMO Y MINIMO
function randomBetween(min, max) {
    return Math.ceil(Math.random() * (max - min) + min).toString();
}

// BUSCA EL MAIL DEL USUARIO, GENERA UN CÓDIGO Y SE LO MANDA POR MAIL
// ADEMÁS PONE UNA FECHA DE EXPIRACIÓN AL CÓDIGO
export async function sendCode(email: string, username: string, edad: number): Promise<any> {

    try {
        const auth = await findOrCreateAuth(email, username, edad);
        const code = parseInt(randomBetween(10000, 99999));
        const now = new Date();
        const fifteenMinutes = addMinutes(now, 15);
        await sendCodeToEmail(auth.data.email, code);
        auth.data.code = code;
        auth.data.expires = fifteenMinutes;
        await auth.pushData();

    } catch (err) {
        console.error("Este es el error en sendCode: ", err);
        throw err;
    }
}

// ACTUALIZA TODO EL USUARIO Y EL MAIL DEL AUTH
export async function updateUserAndAuth(userId: string, newUserData) {

    try {
        const userUpdated = await User.updateUser(userId, newUserData);
        await Auth.updateAuthEmail(userId, newUserData["email"]);
        return userUpdated;

    } catch (err) {
        console.error({ "Ocurrió un error en el controller updateUser": err });
        throw err;
    }
}

// ACTUALIZA UN CIERTO DATO DEL USUARIO, Y SI ESE DATO ES EL MAIL, TAMBIÉN LO ACTUALIZA EN AUTH
export async function updateCertainUserData(userId: string, newCertainData): Promise<User> {

    try {
        
        if (newCertainData.userData == "email") {
            await Auth.updateAuthEmail(userId, newCertainData.value);
            const emailUpdated = await User.updateEmail(userId, newCertainData.value);
            return emailUpdated;

        } else if (newCertainData.userData == "age") {
            const ageUpdated = await User.updateAge(userId, parseInt(newCertainData.value));
            return ageUpdated;

        } else if (newCertainData.userData == "username") {
            const usernameUpdated = await User.updateUsername(userId, newCertainData.value);
            return usernameUpdated;

        } else {
            throw "The data you are trying to change doesn't exist :(";
        }

    } catch (err) {
        console.log({ "Error en el controller updateCertainUserData": err });
        throw err;
    }
}


export async function checkEmailAndCode(email: string, code: number) {
    try {
        const auth = await Auth.findByEmailAndCode(email, code);
        if (!auth) {
            throw { message: "Email or code incorrect" };
        }
        const expires = auth.isCodeexpired();
        if (expires) {
            throw { message: "Code expired" };
            
        } else {
            const token = generate({ userId: auth.data.userId });
            return { token };
        }

    } catch (err) {
        throw { messageError: err };
    }
}

export async function getUserData(userId: string) {
    try {
        const user = new User(userId);
        await user.pullData();
        return user.data;

    } catch (err) {
        throw { error: err };
    }
}