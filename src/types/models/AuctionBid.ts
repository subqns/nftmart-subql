// Auto-generated , DO NOT EDIT
import {Entity, store} from "@subquery/types";
import assert from 'assert';


export class AuctionBid implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public auctionId?: string;

    public type?: string;

    public price?: bigint;

    public blockNumber?: number;

    public commissionAgentId?: string;

    public commissionData?: string;

    public bidderId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save AuctionBid entity without an ID");
        await store.set('AuctionBid', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove AuctionBid entity without an ID");
        await store.remove('AuctionBid', id.toString());
    }

    static async get(id:string): Promise<AuctionBid | undefined>{
        assert((id !== null && id !== undefined), "Cannot get AuctionBid entity without an ID");
        const record = await store.get('AuctionBid', id.toString());
        if (record){
            return AuctionBid.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new AuctionBid(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
