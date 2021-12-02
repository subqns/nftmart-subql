// Auto-generated , DO NOT EDIT
import {Entity, store} from '@subquery/types';
import assert from 'assert';

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

  async save(): Promise<void> {
    let id = this.id;
    assert(id !== null, 'Cannot save Auction entity without an ID');
    await store.set('Auction', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove Auction entity without an ID');
    await store.remove('Auction', id.toString());
  }

  static async get(id: string): Promise<Auction | undefined> {
    assert(id !== null && id !== undefined, 'Cannot get Auction entity without an ID');
    const record = await store.get('Auction', id.toString());
    if (record) {
      return Auction.create(record);
    } else {
      return;
    }
  }

  static async getByDeadlineBlockId(deadlineBlockId: string): Promise<Auction[] | undefined> {
    const records = await store.getByField('Auction', 'deadlineBlockId', deadlineBlockId);
    return records.map((record) => Auction.create(record));
  }

  static create(record) {
    let entity = new Auction(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
