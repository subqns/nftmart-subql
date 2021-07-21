import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Category } from "../../types/models/Category"
import { BadData } from "../../types/models/BadData"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'
import { api, logger } from '@subql/types'

export class CategoryHandler {

  static async ensureCategory (id: string) {
    const category = await Category.get(id)

    if (!category) {
      return new Category(id).save()
    }
  }

  static async handleEventNftmartCreatedCategory (event : SubstrateEvent){

    const {event: { data: [global_id] }} = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString()
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const id = global_id.toString()

    await AccountHandler.ensureAccount(origin)

    const cat = await api.query.nftmartConf.categories(id);

    const categoryData = (cat as any).unwrap();

    const metadataStr = `${categoryData.metadata.toHuman()}`;

    console.log('metadataStr', metadataStr);
    const metadata = await (async function(){
      try {
        return JSON.parse(metadataStr);
      } catch(e) {
        const badData = new BadData(`${blockHeight}-event-${id}`);
        badData.data = metadataStr;
        badData.reason = `${e}`;
        await badData.save();
      }
      return {}
    })();

    const name: string = metadata.name || metadataStr;

    const category = new Category(id)

    category.creatorId = origin
    category.name = name
    category.debug = origin

    await category.save()
  }

  static async handleEventNftmartUpdatedCategory (event : SubstrateEvent){

    const {event: { data: [global_id] }} = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString()

    await AccountHandler.ensureAccount(origin)

    const name = JSON.parse(
      hexToAscii(
        JSON.parse(
          event.extrinsic?.extrinsic?.method.args.toString()
        ).args.metadata
      )
    ).name;
    const id = global_id.toString()

    await CategoryHandler.ensureCategory(id);

    const category = await Category.get(id);

    category.creatorId = origin
    category.name = name
    category.debug = origin

    await category.save()
  }

  static async handleCallNftmartCreateCategory ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const origin = args[0].toString()
    const data = args[1].toString()

    await AccountHandler.ensureAccount(origin)
    await CallHandler.ensureCall(id)

    const category = new Category(id)

    category.creatorId = origin
    category.name = data

    await category.save()
  }
}
