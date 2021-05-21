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

  static async ensureOrder (id: string) {

    const order = await Order.get(id)

    if (!order) {
      const order = new Order(id)

      await order.save()
    }

  }

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

    order.sellerId = origin
    order.categoryId = categoryId
    order.nftId = `${classId}-${tokenId}`
    order.expectedPrice = price
    order.status = "Created"
    order.timestamp = extrinsicHandler.timestamp
    order.deadline = deadline
    order.deposit = deposit
    order.isSuccess = isSuccess
    order.extrinsicId = extrinsicHandler.id.toString()
    order.blockId = extrinsic.block.block.header.hash.toString()
    order.debug = args.toString()

    await order.save()
  }

  static async handleCallNftmartTakeOrder ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    /*
    0 class_id
    1 token_id
    2 price
    3 order_owner
    */
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const classId = args[0].toString()
    const tokenId = args[1].toString()
    const nftId = `${classId}-${tokenId}`;
    await ClassHandler.ensureClass(classId);
    await NftHandler.ensureNft(classId, tokenId)
    const price = (args[2] as any).toBigInt()
    const seller = args[3].toString()
    const buyer = extrinsicHandler.signer.toString()
    await AccountHandler.ensureAccount(seller)
    await AccountHandler.ensureAccount(buyer)

    const extrinsicHash = extrinsicHandler.id

    // check if isSucess
    if (isSuccess) {
      await NftHandler.handleCallNftmartDoTransfer({ id, call, extrinsic, isSuccess })
    }

    const order = new Order(id)

    order.sellerId = seller
    order.buyerId = buyer
    order.nftId = `${classId}-${tokenId}`
    order.acceptedPrice = price
    order.status = "Completed"
    order.timestamp = extrinsicHandler.timestamp
    order.extrinsicId = extrinsicHandler.id.toString()
    order.blockId = extrinsic.block.block.header.hash.toString()
    order.isSuccess = isSuccess
    order.debug = args.toString()

    await order.save()
  }

  static async handleCallNftmartRemoveOrder ({ id, call, extrinsic, isSuccess } : DispatchedCallData) {
    const args = call.args
    /*
    0 class_id
    1 token_id
    */
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const classId = args[0].toString()
    const tokenId = args[1].toString()
    const nftId = `${classId}-${tokenId}`;
    await ClassHandler.ensureClass(classId);
    await NftHandler.ensureNft(classId, tokenId)
    const signer = extrinsicHandler.signer.toString()
    await AccountHandler.ensureAccount(signer)

    const extrinsicHash = extrinsicHandler.id

    const order = new Order(id)

    order.sellerId = signer
    order.nftId = `${classId}-${tokenId}`
    order.status = "Cancelled"
    order.timestamp = extrinsicHandler.timestamp
    order.extrinsicId = extrinsicHandler.id.toString()
    order.blockId = extrinsic.block.block.header.hash.toString()
    order.isSuccess = isSuccess
    order.debug = args.toString()

    await order.save()
  }
  static async handleEventNftmart (event : SubstrateEvent){
  }
}
