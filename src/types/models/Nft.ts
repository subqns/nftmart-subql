// Auto-generated , DO NOT EDIT
import {Entity, store} from '@subquery/types';
import assert from 'assert';

import {Metadata} from '../interfaces';

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

  public statusId?: string;

  public createBlockId?: string;

  public createTimestamp?: Date;

  public updateBlockId?: string;

  public updateTimestamp?: Date;

  public debug?: string;

  async save(): Promise<void> {
    let id = this.id;
    assert(id !== null, 'Cannot save Nft entity without an ID');
    await store.set('Nft', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove Nft entity without an ID');
    await store.remove('Nft', id.toString());
  }

  static async get(id: string): Promise<Nft | undefined> {
    assert(id !== null && id !== undefined, 'Cannot get Nft entity without an ID');
    const record = await store.get('Nft', id.toString());
    if (record) {
      return Nft.create(record);
    } else {
      return;
    }
  }

  static create(record) {
    let entity = new Nft(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
