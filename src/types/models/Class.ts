// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';

import {
    Metadata,
} from '../interfaces'




type ClassProps = Omit<Class, NonNullable<FunctionPropertyNames<Class>>>;

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

    public blockNumber?: number;

    public transferable?: boolean;

    public burnable?: boolean;

    public burned?: boolean;

    public royaltyRate?: number;

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
            return Class.create(record as ClassProps);
        }else{
            return;
        }
    }


    static async getByOwnerId(ownerId: string): Promise<Class[] | undefined>{
      
      const records = await store.getByField('Class', 'ownerId', ownerId);
      return records.map(record => Class.create(record as ClassProps));
      
    }

    static async getByCreatorId(creatorId: string): Promise<Class[] | undefined>{
      
      const records = await store.getByField('Class', 'creatorId', creatorId);
      return records.map(record => Class.create(record as ClassProps));
      
    }


    static create(record: ClassProps): Class {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Class(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
