// Auto-generated , DO NOT EDIT
import {Entity, store} from "@subql/types";
import assert from 'assert';


export class OrderDirection implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save OrderDirection entity without an ID");
        await store.set('OrderDirection', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove OrderDirection entity without an ID");
        await store.remove('OrderDirection', id.toString());
    }

    static async get(id:string): Promise<OrderDirection | undefined>{
        assert((id !== null && id !== undefined), "Cannot get OrderDirection entity without an ID");
        const record = await store.get('OrderDirection', id.toString());
        if (record){
            return OrderDirection.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new OrderDirection(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
