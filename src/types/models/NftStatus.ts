// Auto-generated , DO NOT EDIT
import {Entity, store} from '@subquery/types';
import assert from 'assert';

export class NftStatus implements Entity {
  constructor(id: string) {
    this.id = id;
  }

  public id: string;

  async save(): Promise<void> {
    let id = this.id;
    assert(id !== null, 'Cannot save NftStatus entity without an ID');
    await store.set('NftStatus', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove NftStatus entity without an ID');
    await store.remove('NftStatus', id.toString());
  }

  static async get(id: string): Promise<NftStatus | undefined> {
    assert(id !== null && id !== undefined, 'Cannot get NftStatus entity without an ID');
    const record = await store.get('NftStatus', id.toString());
    if (record) {
      return NftStatus.create(record);
    } else {
      return;
    }
  }

  static create(record) {
    let entity = new NftStatus(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
