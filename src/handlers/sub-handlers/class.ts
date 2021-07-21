import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Class } from "../../types/models/Class"
import { BadData } from "../../types/models/BadData"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'

export class ClassHandler {

  static async ensureClass (id: string): Promise<void> {

    let clas = await Class.get(id)

    if (!clas) {
      clas = new Class(id)
      await clas.save()
    }

  }

  static async handleEventNftmartCreatedClass (event : SubstrateEvent){

    const {event: { data: [owner, class_id] }} = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString() // creator
    const ownerId = owner.toString()
    const args = event.extrinsic?.extrinsic?.method.args
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(origin)
    await AccountHandler.ensureAccount(ownerId)

    // console.log(`origin:`, origin)
    // console.log(`owner:`, ownerId)

    const name = hexToAscii(args[1].toString())
    const description = hexToAscii(args[2].toString())
    const properties = Number(args[3].toString())
    const transferable = properties | 0b00000001
    const burnable = (properties | 0b00000010) >> 1
    const royaltiesChargeable = (properties | 0b00000100) >> 2
    const id = class_id.toString()
    const metadataStr = hexToAscii(args[0].toString());
    console.log(metadataStr);
    const metadata = await (async function(){
      try {
        return JSON.parse(metadataStr);
      } catch(e) {
        // console.log(`Error parsing ${blockHeight}-event-${id}`);
        const badData = new BadData(`${blockHeight}-event-${id}`);
        badData.data = metadataStr;
        badData.reason = `${e}`;
        await badData.save();
      }
      return {}
    })();

    const clas = new Class(id)

    clas.ownerId = ownerId
    clas.creatorId = origin
    clas.metadata = metadata
    clas.name = name
    clas.description = description
    clas.transferable = !!transferable
    clas.burnable = !!burnable
    clas.royaltiesChargeable = !!royaltiesChargeable

    clas.debug = args.toString()

    await clas.save()
  }

  static async handleEventNftmartDestroyedClass (event : SubstrateEvent){

    const {event: { data: [who, class_id, dest] }} = event;
    let classId = class_id.toString();
    let destId = dest.toString();

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(who.toString());
    await ClassHandler.ensureClass(classId);

  }

}
