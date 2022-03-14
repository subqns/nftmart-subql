// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type AuctionProps = Omit<Auction, NonNullable<FunctionPropertyNames<Auction>>>;

export class Auction implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public creatorId?: string;

    public type?: string;

    public status?: string;

    public currencyId?: number;

    public minRaise?: number;

    public deposit?: bigint;

    public deadlineBlockId?: string;

    public deadline?: number;

    public bidCount?: number;

    public lastBidPrice?: bigint;

    public commissionRate?: number;

    public blockCreated?: number;

    public eventCreatedId?: string;

    public eventCancelledId?: string;

    public eventCompletedId?: string;

    public hammerPrice?: bigint;

    public initPrice?: bigint;

    public allowDelay?: boolean;

    public minPrice?: bigint;

    public maxPrice?: bigint;

    public allowBritishAuction?: boolean;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Auction entity without an ID");
        await store.set('Auction', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Auction entity without an ID");
        await store.remove('Auction', id.toString());
    }

    static async get(id:string): Promise<Auction | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Auction entity without an ID");
        const record = await store.get('Auction', id.toString());
        if (record){
            return Auction.create(record as AuctionProps);
        }else{
            return;
        }
    }


    static async getByCreatorId(creatorId: string): Promise<Auction[] | undefined>{
      
      const records = await store.getByField('Auction', 'creatorId', creatorId);
      return records.map(record => Auction.create(record as AuctionProps));
      
    }

    static async getByDeadlineBlockId(deadlineBlockId: string): Promise<Auction[] | undefined>{
      
      const records = await store.getByField('Auction', 'deadlineBlockId', deadlineBlockId);
      return records.map(record => Auction.create(record as AuctionProps));
      
    }

    static async getByEventCreatedId(eventCreatedId: string): Promise<Auction[] | undefined>{
      
      const records = await store.getByField('Auction', 'eventCreatedId', eventCreatedId);
      return records.map(record => Auction.create(record as AuctionProps));
      
    }

    static async getByEventCancelledId(eventCancelledId: string): Promise<Auction[] | undefined>{
      
      const records = await store.getByField('Auction', 'eventCancelledId', eventCancelledId);
      return records.map(record => Auction.create(record as AuctionProps));
      
    }

    static async getByEventCompletedId(eventCompletedId: string): Promise<Auction[] | undefined>{
      
      const records = await store.getByField('Auction', 'eventCompletedId', eventCompletedId);
      return records.map(record => Auction.create(record as AuctionProps));
      
    }


    static create(record: AuctionProps): Auction {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Auction(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
