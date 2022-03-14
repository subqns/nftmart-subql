// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type CategoryProps = Omit<Category, NonNullable<FunctionPropertyNames<Category>>>;

export class Category implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public creatorId?: string;

    public name?: string;

    public blockId?: string;

    public timestamp?: Date;

    public burned?: boolean;

    public eventId?: string;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Category entity without an ID");
        await store.set('Category', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Category entity without an ID");
        await store.remove('Category', id.toString());
    }

    static async get(id:string): Promise<Category | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Category entity without an ID");
        const record = await store.get('Category', id.toString());
        if (record){
            return Category.create(record as CategoryProps);
        }else{
            return;
        }
    }


    static async getByCreatorId(creatorId: string): Promise<Category[] | undefined>{
      
      const records = await store.getByField('Category', 'creatorId', creatorId);
      return records.map(record => Category.create(record as CategoryProps));
      
    }

    static async getByBlockId(blockId: string): Promise<Category[] | undefined>{
      
      const records = await store.getByField('Category', 'blockId', blockId);
      return records.map(record => Category.create(record as CategoryProps));
      
    }

    static async getByEventId(eventId: string): Promise<Category[] | undefined>{
      
      const records = await store.getByField('Category', 'eventId', eventId);
      return records.map(record => Category.create(record as CategoryProps));
      
    }


    static create(record: CategoryProps): Category {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Category(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
