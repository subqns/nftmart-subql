// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Address implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public address: string;

    public creationBlock: bigint;

    public creationTime: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Address entity without an ID");
        await store.set('Address', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Address entity without an ID");
        await store.remove('Address', id.toString());
    }

    static async get(id:string): Promise<Address | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Address entity without an ID");
        const record = await store.get('Address', id.toString());
        if (record){
            return Address.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Address(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
