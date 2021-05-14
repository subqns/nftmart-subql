import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Order } from "../../types/models/Order"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'
import { ClassHandler } from './class'
import { NftHandler } from './nft'
import { CategoryHandler } from './category'

export class OrderHandler {

  static async handleCallNftmartSubmitOrder ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    /*
    0 currency_id
    1 price
    2 category_id
    3 class_id
    4 token_id
    5 deposit
    6 deadline
    */
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const origin = extrinsic.extrinsic.signer.toString()
    const currencyId = args[0].toString()
    const price = (args[1] as any).toBigInt()
    const categoryId = args[2].toString()
    const classId = args[3].toString()
    const tokenId = args[4].toString()
    const deposit = (args[5] as any).toBigInt()
    const deadline = (args[6] as any).toBigInt()

    await AccountHandler.ensureAccount(origin)
    await CallHandler.ensureCall(id)
    await CategoryHandler.ensureCategory(categoryId)
    await ClassHandler.ensureClass(classId)
    await NftHandler.ensureNft(classId, tokenId)

    const order = new Order(id)

    order.ownerId = origin
    order.categoryId = categoryId
    order.nftId = `${classId}-${tokenId}`
    order.price = price
    order.debug = args.toString()

    await order.save()
  }
}
