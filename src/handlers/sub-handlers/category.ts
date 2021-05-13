import { SubstrateExtrinsic } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Category } from "../../types/models/Category"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'

export class CategoryHandler {
  static async handleCallNftmartCreateCategory ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const origin = args[0].toString()
    const data = args[1].toString()

    await AccountHandler.ensureAccount(origin)
    await CallHandler.ensureCall(id)

    const category = new Category(id)

    category.creatorId = origin
    category.metadata = data

    await category.save()
  }
}
