// Auto-generated , DO NOT EDIT
import {Entity, store} from "@subql/types";
import assert from 'assert';


export class OrderItem implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nftId: string;

    public quantity: number;

    public orderId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save OrderItem entity without an ID");
        await store.set('OrderItem', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove OrderItem entity without an ID");
        await store.remove('OrderItem', id.toString());
    }

    static async get(id:string): Promise<OrderItem | undefined>{
        assert((id !== null && id !== undefined), "Cannot get OrderItem entity without an ID");
        const record = await store.get('OrderItem', id.toString());
        if (record){
            return OrderItem.create(record);
        }else{
            return;
        }
    }


    static async getByOrderId(orderId: string): Promise<OrderItem[] | undefined>{
      
      const records = await store.getByField('OrderItem', 'orderId', orderId);
      return records.map(record => OrderItem.create(record));
      
    }


    static create(record){
        let entity = new OrderItem(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
