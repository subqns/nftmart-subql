import {SubstrateExtrinsic, SubstrateEvent, api} from '@subql/types';
import {Call} from '../../types/models/Call';
import {Class} from '../../types/models/Class';
import {CategoryClassHandler} from './categoryClass';
import {CategoryHandler} from './category';
import {BadData} from '../../types/models/BadData';
import {CallHandler} from '../call';
import {ExtrinsicHandler} from '../extrinsic';
import {DispatchedCallData} from '../types';
import {AccountHandler} from './account';
import {hexToAscii} from '../../helpers/common';

export class ClassHandler {
  static async ensureClass(id: string): Promise<void> {
    let clas = await Class.get(id);

    if (!clas) {
      clas = new Class(id);
      await clas.save();
    }
  }

  static async handleEventNftmartCreatedClass(event: SubstrateEvent) {
    const {
      event: {
        data: [owner, class_id],
      },
    } = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString(); // creator
    const ownerId = owner.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();

    await AccountHandler.ensureAccount(origin);
    await AccountHandler.ensureAccount(ownerId);

    // console.log(`origin:`, origin)
    // console.log(`owner:`, ownerId)

    let cls = ((await api.query.ormlNft.classes.at(blockHash, class_id)) as any).unwrap();

    const name = hexToAscii(cls.data.name.toString());
    const description = hexToAscii(cls.data.description.toString());
    const properties = cls.data.properties.toNumber();
    const transferable = properties | 0b00000001;
    const burnable = (properties | 0b00000010) >> 1;
    const royaltyRate = cls.data.royaltyRate.toNumber();
    const categoryIds = cls.data.categoryIds.map((x) => x.toString());
    const createBlock = cls.data.createBlock.toNumber();
    const classId = class_id.toString();
    const metadataStr = hexToAscii(cls.metadata.toString());
    console.log(metadataStr);
    const metadata = await (async function () {
      try {
        return JSON.parse(metadataStr);
      } catch (e) {
        // console.log(`Error parsing ${blockHeight}-event-${id}`);
        const badData = new BadData(`${blockHeight}-event-${classId}`);
        badData.data = metadataStr;
        badData.reason = `${e}`;
        await badData.save();
      }
      return {};
    })();

    const clas = new Class(classId);

    clas.ownerId = ownerId;
    clas.creatorId = origin;
    clas.metadata = metadata;
    clas.name = name;
    clas.description = description;
    clas.transferable = !!transferable;
    clas.burnable = !!burnable;
    clas.royaltyRate = royaltyRate;
    // clas.categoriesId = categoryIds
    clas.blockNumber = createBlock;

    clas.debug = cls.toString();

    await clas.save();

    for (let catId of categoryIds) {
      await CategoryHandler.ensureCategory(catId);
      await CategoryClassHandler.ensureCategoryClass(catId, classId);
    }
  }

  static async handleEventNftmartDestroyedClass(event: SubstrateEvent) {
    const {
      event: {
        data: [who, class_id, dest],
      },
    } = event;
    let classId = class_id.toString();
    let destId = dest.toString();

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(who.toString());
    await ClassHandler.ensureClass(classId);

    let clas = await Class.get(classId);

    clas.burned = true;

    await clas.save();
  }

  static async handleEventNftmartUpdatedClass(event: SubstrateEvent) {
    const {
      event: {
        data: [owner, class_id],
      },
    } = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString(); // creator
    const ownerId = owner.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();

    await AccountHandler.ensureAccount(origin);
    await AccountHandler.ensureAccount(ownerId);

    // console.log(`origin:`, origin)
    // console.log(`owner:`, ownerId)

    let cls = ((await api.query.ormlNft.classes.at(blockHash, class_id)) as any).unwrap();

    const name = hexToAscii(cls.data.name.toString());
    const description = hexToAscii(cls.data.description.toString());
    const properties = cls.data.properties.toNumber();
    const transferable = properties | 0b00000001;
    const burnable = (properties | 0b00000010) >> 1;
    const royaltyRate = cls.data.royaltyRate.toNumber();
    const categoryIds = cls.data.categoryIds.map((x) => x.toString());
    const createBlock = cls.data.createBlock.toNumber();
    const classId = class_id.toString();
    const metadataStr = hexToAscii(cls.metadata.toString());
    console.log(metadataStr);
    const metadata = await (async function () {
      try {
        return JSON.parse(metadataStr);
      } catch (e) {
        // console.log(`Error parsing ${blockHeight}-event-${id}`);
        const badData = new BadData(`${blockHeight}-event-${classId}`);
        badData.data = metadataStr;
        badData.reason = `${e}`;
        await badData.save();
      }
      return {};
    })();

    const clas = new Class(classId);

    clas.ownerId = ownerId;
    clas.creatorId = origin;
    clas.metadata = metadata;
    clas.name = name;
    clas.description = description;
    clas.transferable = !!transferable;
    clas.burnable = !!burnable;
    clas.royaltyRate = royaltyRate;
    // clas.categoriesId = categoryIds
    clas.blockNumber = createBlock;

    clas.debug = cls.toString();

    await clas.save();

    for (let catId of categoryIds) {
      await CategoryHandler.ensureCategory(catId);
      await CategoryClassHandler.ensureCategoryClass(catId, classId);
    }
  }
}
