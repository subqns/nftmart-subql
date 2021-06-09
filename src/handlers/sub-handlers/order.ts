import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Order } from "../../types/models/Order"
import { OrderItem } from "../../types/models/OrderItem"
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

  static async handleEventNftmartCreatedOrder (event : SubstrateEvent){

    const {event: { data: [who, order_id] }} = event;
    let orderId = order_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(who.toString());

    const currencyId = args[0].toString()
    const categoryId = args[1].toString()
    const deposit = (args[2] as any).toBigInt()
    const price = (args[3] as any).toBigInt()
    const deadline = (args[4] as any).toBigInt()
    const itemsJson = (args[5].toJSON() as number[][])

    await OrderHandler.ensureOrder(orderId);
    for (let i in itemsJson) {
      let item = itemsJson[i]
      const classId = `${item[0]}`
      const tokenId = `${item[1]}`
      const nftId = `${classId}-${tokenId}`
      const quantity = item[2]
      await ClassHandler.ensureClass(classId)
      await NftHandler.ensureNft(classId, tokenId);
      let orderItem = new OrderItem(`${orderId}-${i}`)
      orderItem.nftId = nftId
      orderItem.quantity = quantity
      orderItem.orderId = orderId
      await orderItem.save()
      console.log(`created new order item`, classId, tokenId, quantity)
    }

    await AccountHandler.ensureAccount(origin)
    await CategoryHandler.ensureCategory(categoryId)

    const order = await Order.get(orderId)

    order.sellerId = origin
    order.categoryId = categoryId
    order.expectedPrice = price
    order.status = "Created"
    order.timestamp = extrinsicHandler.timestamp
    order.deadline = deadline
    order.deposit = deposit
    order.extrinsicId = extrinsicHandler.id.toString()
    order.blockId = extrinsic.block.block.header.hash.toString()
    order.debug = args.toString()

    await order.save()
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

    0 currency_id
    1 category_id
    2 deposit
    3 price
    4 deadline
    5 items
    */
    const extrinsicHandler = new ExtrinsicHandler(extrinsic)

    const origin = extrinsic.extrinsic.signer.toString()
    const currencyId = args[0].toString()
    const categoryId = args[1].toString()
    const deposit = (args[2] as any).toBigInt()
    const price = (args[3] as any).toBigInt()
    const deadline = (args[4] as any).toBigInt()
    const itemsJson = (args[5].toJSON() as number[][])

    await OrderHandler.ensureOrder(id);
    for (let i in itemsJson) {
      let item = itemsJson[i]
      const classId = `${item[0]}`
      const tokenId = `${item[1]}`
      const nftId = `${classId}-${tokenId}`
      const quantity = item[2]
      await ClassHandler.ensureClass(classId)
      await NftHandler.ensureNft(classId, tokenId);
      let orderItem = new OrderItem(`${id}-${i}`)
      orderItem.nftId = nftId
      orderItem.quantity = quantity
      orderItem.orderId = id
      await orderItem.save()
      console.log(`created new order item`, classId, tokenId, quantity)
    }

    await AccountHandler.ensureAccount(origin)
    await CallHandler.ensureCall(id)
    await CategoryHandler.ensureCategory(categoryId)
    // await ClassHandler.ensureClass(classId)
    // await NftHandler.ensureNft(classId, tokenId)

    const order = await Order.get(id)

    order.sellerId = origin
    order.categoryId = categoryId
    // order.nftId = `${classId}-${tokenId}`
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
