import { firestore } from "lib/firestore";

const collection = firestore.collection("users");
export class User {
    ref: FirebaseFirestore.DocumentReference;
    data: any;
    id: string;
    constructor(id) {
        this.id = id;
        this.ref = collection.doc(id);
    }

    async pullData() {
        const snap = await this.ref.get();
        this.data = snap.data();
    }

    async pushData() {
        this.ref.update(this.data);
    }

    static async getCart(userId: string) {
        const findUser = await collection.doc(userId).get();

        try {
            if (findUser) {
                const user = new User(findUser.id);
                await user.pullData();
                const cart = user.data.cart;

                return cart;
            }

        } catch (err) {
            throw "Falló el getCart en user model" && err ;
        }
    }

    static async addToCart(userId: string, product: Object) {
        const findUser = await collection.doc(userId).get();

        try {
            if (findUser) {
                const user = new User(findUser.id);
                await user.pullData();
                const cart = user.data.cart;
                cart.push(product),
                await user.pushData();

                return cart;
            }

        } catch (err) {
            throw "Falló el addToCart user model" && err ;
        }
    }

    static async deleteFromCart(userId: string, product: Object) {
        const findUser = await collection.doc(userId).get();

        try {
            if (findUser) {
                const user = new User(findUser.id);
                await user.pullData();
                const cart = user.data.cart;
                
                const productToDelete = cart.find((prod) => {
                    const productoEncontrado = prod["id"] == product["id"];
                    return productoEncontrado;
                });
                // console.log("PRODUCTO A ELIMINAR: ", productToDelete);
                
                if (productToDelete) {
                    const productDeleted = () => {
                        
                        var newCart = [];
                        for (var prod = 0; prod < cart.length; prod++) {
                            if (cart[prod] !== productToDelete) {
                                newCart.push(cart[prod]);
                            }
                        }
                        return newCart;
                    };

                    const newCart = productDeleted();
                    user.data.cart = newCart;
                    await user.pushData();

                    return newCart;

                } else {
                    throw "El producto no está en el carrito";
                }
            }

        } catch (err) {
            throw "Falló el addToCart user model" && err ;
        }
    }

    static async createUser(data) {
        const newUserSnap = await collection.add(data);
        const newUser = new User(newUserSnap.id);
        newUser.data = data;

        return newUser;
    }

    static async findByUserId(userId: string) {
        // ASÍ SE BUSCA EL ID DEL DOCUMENTO
        const user = await collection.doc(userId).get();

        if (user) {
            const newUser = new User(user.id);
            await newUser.pullData();
            return newUser.data;

        } else {
            throw "El userId no existe";
        }
    }

    static async updateUser(userId, newUserData): Promise<User> {
        const results = await collection.doc(userId).get();
        
        if (!results) {
            return null;

        } else {
            const user = new User(results.id);
            user.data = results.data();
            user.data = newUserData;
            await user.pushData();

            return user;
        }
    }

    static async updateEmail(userId: string, email: string) {
        const results = await collection.doc(userId).get();
        
        if (!results) {
            return null;

        } else {
            const user = new User(results.id);
            user.data = results.data();
            user.data.email = email;
            await user.pushData();

            return user.data;
        }
    }

    static async updateUsername(userId: string, username: string) {
        const results = await collection.doc(userId).get();
        
        if (!results) {
            return null;

        } else {
            const user = new User(results.id);
            user.data = results.data();
            user.data.username = username;
            await user.pushData();

            return user.data;
        }
    }

    static async updateAge(userId: string, age: number) {
        const results = await collection.doc(userId).get();
        
        if (!results) {
            return null;

        } else {
            const user = new User(results.id);
            user.data = results.data();
            user.data.age = age;
            await user.pushData();

            return user.data;
        }
    }
}