// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type AuctionBidProps = Omit<AuctionBid, NonNullable<FunctionPropertyNames<AuctionBid>>>;

export class AuctionBid implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nth?: number;

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
            return AuctionBid.create(record as AuctionBidProps);
        }else{
            return;
        }
    }


    static async getByAuctionId(auctionId: string): Promise<AuctionBid[] | undefined>{
      
      const records = await store.getByField('AuctionBid', 'auctionId', auctionId);
      return records.map(record => AuctionBid.create(record as AuctionBidProps));
      
    }

    static async getByCommissionAgentId(commissionAgentId: string): Promise<AuctionBid[] | undefined>{
      
      const records = await store.getByField('AuctionBid', 'commissionAgentId', commissionAgentId);
      return records.map(record => AuctionBid.create(record as AuctionBidProps));
      
    }

    static async getByBidderId(bidderId: string): Promise<AuctionBid[] | undefined>{
      
      const records = await store.getByField('AuctionBid', 'bidderId', bidderId);
      return records.map(record => AuctionBid.create(record as AuctionBidProps));
      
    }


    static create(record: AuctionBidProps): AuctionBid {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AuctionBid(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
