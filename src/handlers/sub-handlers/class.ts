import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Class } from "../../types/models/Class"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'

export class ClassHandler {

  static async handleEventNftmartCreatedClass (event : SubstrateEvent){

    const {event: { data: [owner, class_id] }} = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString()
    const args = event.extrinsic?.extrinsic?.method.args

    await AccountHandler.ensureAccount(origin)
    await AccountHandler.ensureAccount(owner.toString())

    const metadata = hexToAscii(args[0].toString())
    const name = hexToAscii(args[1].toString())
    const description = hexToAscii(args[2].toString())
    const properties = Number(args[3].toString())

    const id = class_id.toString()

    const clas = new Class(id)

    clas.creatorId = owner.toString()
    clas.metadata = metadata
    clas.name = name
    clas.description = description
    clas.properties = properties

    clas.debug = args.toString()

    await clas.save()
  }

  static async handleCallNftmartCreateClass ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const origin = args[0].toString()
    const data = args[1].toString()
    const name = args[2].toString()
    const description = args[3].toString()
    const properties = Number(args[4].toString())

    await AccountHandler.ensureAccount(origin)
    await CallHandler.ensureCall(id)

    const clas = new Class(id)

    clas.creatorId = origin
    clas.metadata = data
    clas.name = name
    clas.description = description
    clas.properties = properties

    await clas.save()
  }
}
