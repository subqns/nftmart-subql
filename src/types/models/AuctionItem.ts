// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type AuctionItemProps = Omit<AuctionItem, NonNullable<FunctionPropertyNames<AuctionItem>>>;

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
            return AuctionItem.create(record as AuctionItemProps);
        }else{
            return;
        }
    }


    static async getByNftId(nftId: string): Promise<AuctionItem[] | undefined>{
      
      const records = await store.getByField('AuctionItem', 'nftId', nftId);
      return records.map(record => AuctionItem.create(record as AuctionItemProps));
      
    }

    static async getByAuctionId(auctionId: string): Promise<AuctionItem[] | undefined>{
      
      const records = await store.getByField('AuctionItem', 'auctionId', auctionId);
      return records.map(record => AuctionItem.create(record as AuctionItemProps));
      
    }


    static create(record: AuctionItemProps): AuctionItem {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new AuctionItem(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
