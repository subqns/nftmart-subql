// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type CategoryClassProps = Omit<CategoryClass, NonNullable<FunctionPropertyNames<CategoryClass>>>;

export class CategoryClass implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public categoryId: string;

    public classId: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CategoryClass entity without an ID");
        await store.set('CategoryClass', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CategoryClass entity without an ID");
        await store.remove('CategoryClass', id.toString());
    }

    static async get(id:string): Promise<CategoryClass | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CategoryClass entity without an ID");
        const record = await store.get('CategoryClass', id.toString());
        if (record){
            return CategoryClass.create(record as CategoryClassProps);
        }else{
            return;
        }
    }


    static async getByCategoryId(categoryId: string): Promise<CategoryClass[] | undefined>{
      
      const records = await store.getByField('CategoryClass', 'categoryId', categoryId);
      return records.map(record => CategoryClass.create(record as CategoryClassProps));
      
    }

    static async getByClassId(classId: string): Promise<CategoryClass[] | undefined>{
      
      const records = await store.getByField('CategoryClass', 'classId', classId);
      return records.map(record => CategoryClass.create(record as CategoryClassProps));
      
    }


    static create(record: CategoryClassProps): CategoryClass {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new CategoryClass(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
