// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Order implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public currencyId?: number;

    public deadline?: number;

    public status?: string;

    public expectedPrice?: bigint;

    public acceptedPrice?: bigint;

    public deposit?: bigint;

    public sellerId?: string;

    public buyerId?: string;

    public nftId?: string;

    public categoryId?: string;

    public timestamp?: Date;

    public blockId?: string;

    public extrinsicId?: string;

    public isSuccess?: boolean;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Order entity without an ID");
        await store.set('Order', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Order entity without an ID");
        await store.remove('Order', id.toString());
    }

    static async get(id:string): Promise<Order | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Order entity without an ID");
        const record = await store.get('Order', id.toString());
        if (record){
            return Order.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Order(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
