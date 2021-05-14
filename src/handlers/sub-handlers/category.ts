import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Category } from "../../types/models/Category"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'

export class CategoryHandler {

  static async ensureCategory (id: string) {
    const category = await Category.get(id)

    if (!category) {
      return new Category(id).save()
    }
  }

  static async handleEventNftmartCreatedCategory (event : SubstrateEvent){

    const {event: { data: [category_id] }} = event;
    const origin = event.extrinsic?.extrinsic?.signer?.toString()

    await AccountHandler.ensureAccount(origin)

    const name = JSON.parse(
      hexToAscii(
        JSON.parse(
          event.extrinsic?.extrinsic?.method.args.toString()
        ).args.metadata
      )
    ).name;
    const id = category_id.toString()

    const category = new Category(id)

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
