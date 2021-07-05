// Auto-generated , DO NOT EDIT
import {Entity, store} from "@subql/types";
import assert from 'assert';

import {
    Metadata,
} from '../interfaces'


export class Class implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public ownerId?: string;

    public creatorId?: string;

    public metadata?: Metadata;

    public name?: string;

    public description?: string;

    public transferable?: boolean;

    public burnable?: boolean;

    public royaltiesChargeable?: boolean;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Class entity without an ID");
        await store.set('Class', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Class entity without an ID");
        await store.remove('Class', id.toString());
    }

    static async get(id:string): Promise<Class | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Class entity without an ID");
        const record = await store.get('Class', id.toString());
        if (record){
            return Class.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Class(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
