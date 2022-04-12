import { User } from "./user";
import { firestore } from "lib/firestore";

const collection = firestore.collection("order");
export class Order {
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

    async findUserEmail() {
        const userId = this.data.userId;
        const findUser = await User.findByUserId(userId);
        return findUser.data.email;
    }
    
    static async createNewOrder(newOrderData = {}) {
        const newOrderSnap = await collection.add(newOrderData);
        const newOrder = new Order(newOrderSnap.id);
        newOrder.data = newOrderData;

        return newOrder;
    }

    static async findById(orderId: string) {
        const order = await collection.doc(orderId).get();

        if (order) {
            const myOrder = new Order(order.id);
            await myOrder.pullData();
            // console.log("MY ORDER DESDE MODEL: ", myOrder);
            return myOrder;

        } else {
            throw "La orden no existe";
        }
    }
}