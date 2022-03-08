import {SubstrateExtrinsic, SubstrateEvent} from '@subql/types';
import {Call} from '../../types/models/Call';
import {CategoryClass} from '../../types/models/CategoryClass';
import {Nft} from '../../types/models/Nft';
import {NftTransfer} from '../../types/models/NftTransfer';
import {CallHandler} from '../call';
import {ExtrinsicHandler} from '../extrinsic';
import {DispatchedCallData} from '../types';
import {AccountHandler} from './account';
import {hexToAscii} from '../../helpers/common';
import {ClassHandler} from './class';
import {api, logger} from '@subql/types';
import {BadData} from '../../types/models/BadData';

export class CategoryClassHandler {
  static async ensureCategoryClass(categoryId: string, classId: string): Promise<void> {
    const id = `${categoryId}-${classId}`;

    let cc = await CategoryClass.get(id);

    if (!cc) {
      cc = new CategoryClass(id);
      cc.categoryId = categoryId;
      cc.classId = classId;
      await cc.save();
    }
  }
}
