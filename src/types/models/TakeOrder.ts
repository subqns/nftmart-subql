// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class TakeOrder implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public currencyId?: number;

    public deadline?: number;

    public expectedprice?: bigint;

    public acceptedPrice?: bigint;

    public sellerId?: string;

    public buyerId?: string;

    public status?: string;

    public nftId?: string;

    public categoryId?: string;

    public openedAt?: Date;

    public closedAt?: Date;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TakeOrder entity without an ID");
        await store.set('TakeOrder', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TakeOrder entity without an ID");
        await store.remove('TakeOrder', id.toString());
    }

    static async get(id:string): Promise<TakeOrder | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TakeOrder entity without an ID");
        const record = await store.get('TakeOrder', id.toString());
        if (record){
            return TakeOrder.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new TakeOrder(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
