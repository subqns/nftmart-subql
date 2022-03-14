// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';

import {
    Metadata,
} from '../interfaces'




type NftProps = Omit<Nft, NonNullable<FunctionPropertyNames<Nft>>>;

export class Nft implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tokenId?: string;

    public classId?: string;

    public burned?: boolean;

    public quantity?: number;

    public deposit?: bigint;

    public eventId?: string;

    public creatorId?: string;

    public ownerId?: string;

    public royaltyRate?: number;

    public royaltyBeneficiaryId?: string;

    public metadata?: Metadata;

    public dealPrice?: bigint;

    public price?: bigint;

    public pledge?: bigint;

    public statusId?: string;

    public createBlockId?: string;

    public createTimestamp?: Date;

    public updateBlockId?: string;

    public updateTimestamp?: Date;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Nft entity without an ID");
        await store.set('Nft', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Nft entity without an ID");
        await store.remove('Nft', id.toString());
    }

    static async get(id:string): Promise<Nft | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Nft entity without an ID");
        const record = await store.get('Nft', id.toString());
        if (record){
            return Nft.create(record as NftProps);
        }else{
            return;
        }
    }


    static async getByClassId(classId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'classId', classId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByEventId(eventId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'eventId', eventId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByCreatorId(creatorId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'creatorId', creatorId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByOwnerId(ownerId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'ownerId', ownerId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByRoyaltyBeneficiaryId(royaltyBeneficiaryId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'royaltyBeneficiaryId', royaltyBeneficiaryId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByStatusId(statusId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'statusId', statusId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByCreateBlockId(createBlockId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'createBlockId', createBlockId);
      return records.map(record => Nft.create(record as NftProps));
      
    }

    static async getByUpdateBlockId(updateBlockId: string): Promise<Nft[] | undefined>{
      
      const records = await store.getByField('Nft', 'updateBlockId', updateBlockId);
      return records.map(record => Nft.create(record as NftProps));
      
    }


    static create(record: NftProps): Nft {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Nft(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
