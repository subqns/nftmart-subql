// Auto-generated , DO NOT EDIT
import {Entity, store} from '@subql/types';
import assert from 'assert';

export class NftEvent implements Entity {
  constructor(id: string) {
    this.id = id;
  }

  public id: string;

  public nftId: string;

  public quantity?: number;

  public blockId: string;

  public eventId: string;

  public section: string;

  public method: string;

  public sectionMethod: string;

  public timestamp?: Date;

  public fromId?: string;

  public toId?: string;

  public price?: bigint;

  public params?: string;

  public debug?: string;

  async save(): Promise<void> {
    let id = this.id;
    assert(id !== null, 'Cannot save NftEvent entity without an ID');
    await store.set('NftEvent', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove NftEvent entity without an ID');
    await store.remove('NftEvent', id.toString());
  }

  static async get(id: string): Promise<NftEvent | undefined> {
    assert(id !== null && id !== undefined, 'Cannot get NftEvent entity without an ID');
    const record = await store.get('NftEvent', id.toString());
    if (record) {
      return NftEvent.create(record);
    } else {
      return;
    }
  }

  static create(record) {
    let entity = new NftEvent(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
