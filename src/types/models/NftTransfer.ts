// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type NftTransferProps = Omit<NftTransfer, NonNullable<FunctionPropertyNames<NftTransfer>>>;

export class NftTransfer implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public fromId?: string;

    public toId?: string;

    public quantity?: number;

    public nftId?: string;

    public blockId?: string;

    public extrinsicId?: string;

    public timestamp?: Date;

    public isSuccess?: boolean;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftTransfer entity without an ID");
        await store.set('NftTransfer', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftTransfer entity without an ID");
        await store.remove('NftTransfer', id.toString());
    }

    static async get(id:string): Promise<NftTransfer | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftTransfer entity without an ID");
        const record = await store.get('NftTransfer', id.toString());
        if (record){
            return NftTransfer.create(record as NftTransferProps);
        }else{
            return;
        }
    }


    static async getByFromId(fromId: string): Promise<NftTransfer[] | undefined>{
      
      const records = await store.getByField('NftTransfer', 'fromId', fromId);
      return records.map(record => NftTransfer.create(record as NftTransferProps));
      
    }

    static async getByToId(toId: string): Promise<NftTransfer[] | undefined>{
      
      const records = await store.getByField('NftTransfer', 'toId', toId);
      return records.map(record => NftTransfer.create(record as NftTransferProps));
      
    }

    static async getByNftId(nftId: string): Promise<NftTransfer[] | undefined>{
      
      const records = await store.getByField('NftTransfer', 'nftId', nftId);
      return records.map(record => NftTransfer.create(record as NftTransferProps));
      
    }

    static async getByBlockId(blockId: string): Promise<NftTransfer[] | undefined>{
      
      const records = await store.getByField('NftTransfer', 'blockId', blockId);
      return records.map(record => NftTransfer.create(record as NftTransferProps));
      
    }

    static async getByExtrinsicId(extrinsicId: string): Promise<NftTransfer[] | undefined>{
      
      const records = await store.getByField('NftTransfer', 'extrinsicId', extrinsicId);
      return records.map(record => NftTransfer.create(record as NftTransferProps));
      
    }


    static create(record: NftTransferProps): NftTransfer {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new NftTransfer(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
