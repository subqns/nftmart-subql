// Auto-generated , DO NOT EDIT
import {Entity, store} from "@subquery/types";
import assert from 'assert';


export class AuctionItem implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nftId: string;

    public quantity: number;

    public auctionId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AuctionItem entity without an ID");
        await store.set('AuctionItem', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AuctionItem entity without an ID");
        await store.remove('AuctionItem', id.toString());
    }

    static async get(id:string): Promise<AuctionItem | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AuctionItem entity without an ID");
        const record = await store.get('AuctionItem', id.toString());
        if (record){
            return AuctionItem.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new AuctionItem(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
