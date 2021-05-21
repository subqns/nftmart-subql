// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Category implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public creatorId?: string;

    public name?: string;

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
            return Category.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Category(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
