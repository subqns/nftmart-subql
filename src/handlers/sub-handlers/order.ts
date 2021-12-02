import {SubstrateExtrinsic, SubstrateEvent, api} from '@subquery/types';
import {Call} from '../../types/models/Call';
import {Order} from '../../types/models/Order';
import {OrderItem} from '../../types/models/OrderItem';
import {OrderStatus} from '../../types/models/OrderStatus';
import {OrderDirection} from '../../types/models/OrderDirection';
import {Nft} from '../../types/models/Nft';
import {CallHandler} from '../call';
import {ExtrinsicHandler} from '../extrinsic';
import {EventHandler} from '../event';
import {DispatchedCallData} from '../types';
import {AccountHandler} from './account';
import {hexToAscii} from '../../helpers/common';
import {getBlockTimestamp} from '../../helpers';
import {ClassHandler} from './class';
import {NftHandler} from './nft';
import {NftEvent} from '../../types/models/NftEvent';
import {CategoryHandler} from './category';

let initialized: boolean = false;

export class OrderHandler {
  static async ensureOrder(id: string) {
    const order = await Order.get(id);

    if (!order) {
      const order = new Order(id);

      await order.save();
    }

    if (!initialized) {
      await OrderHandler.ensureOrderStatus('Created');
      await OrderHandler.ensureOrderStatus('Cancelled');
      await OrderHandler.ensureOrderStatus('Completed');
      await OrderHandler.ensureOrderDirection('Buy');
      await OrderHandler.ensureOrderDirection('Sell');
      initialized = true;
    }
  }

  static async ensureOrderStatus(id: string) {
    const status = await OrderStatus.get(id);
    if (!status) {
      const status = new OrderStatus(id);
      await status.save();
    }
  }

  static async ensureOrderDirection(id: string) {
    const direction = await OrderDirection.get(id);
    if (!direction) {
      const direction = new OrderDirection(id);
      await direction.save();
    }
  }

  static async handleEventNftmartCreatedOrder2(event: SubstrateEvent) {
    // console.log(`handle created order 2`)
    // it is ok for an event to have multiple handlers registered in the dispatcher
  }

  static async handleEventNftmartCreatedOrder(event: SubstrateEvent) {
    // console.log(`handle created order 1`)

    const {
      event: {
        data: [who, order_id],
      },
    } = event;
    let orderId = order_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`order::eventId`, eventId, orderId);

    await AccountHandler.ensureAccount(who.toString());

    let ord = ((await api.query.nftmartOrder.orders.at(blockHash, who.toString(), orderId)) as any).unwrap();

    const currencyId = ord.currencyId.toString();
    // const categoryId = ord.categoryId.toString();
    const deposit = ord.deposit.toBigInt();
    const price = ord.price.toBigInt();
    const deadline = ord.deadline.toNumber();
    const itemsJson = ord.items.map((item) => [
      item.classId.toNumber(),
      item.tokenId.toNumber(),
      item.quantity.toNumber(),
    ]);
    const commissionRate = ord.commissionRate.toNumber();

    await OrderHandler.ensureOrder(orderId);
    for (let i in itemsJson) {
      let item = itemsJson[i];
      const classId = `${item[0]}`;
      const tokenId = `${item[1]}`;
      const nftId = `${classId}-${tokenId}`;
      const quantity = item[2];
      await ClassHandler.ensureClass(classId);
      await NftHandler.ensureNft(classId, tokenId);
      let orderItem = new OrderItem(`${orderId}-${i}`);
      orderItem.nftId = nftId;
      orderItem.quantity = quantity;
      orderItem.orderId = orderId;
      await orderItem.save();
      console.log(`created new order item`, classId, tokenId, quantity);

      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = who.toString();
      nftEvent.price = price;
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();

      const nft = await Nft.get(nftId);
      nft.statusId = 'ForSale';
      nft.updateBlockId = blockHeight;
      nft.updateTimestamp = blockTimestamp;
      nft.price = price;
      nft.pledge = deposit;
      nft.debug = `${event.event.section}.${event.event.method}`;
      await nft.save();
    }

    await AccountHandler.ensureAccount(origin);
    // await CategoryHandler.ensureCategory(categoryId)

    const order = await Order.get(orderId);

    // order.categoryId = categoryId

    order.price = price;
    order.deadline = deadline;
    order.commissionRate = commissionRate;
    order.deposit = deposit;
    order.debug = args.toString();
    order.sellerId = origin;
    order.intentId = 'Sell';
    order.eventCreatedId = eventId;
    order.statusId = 'Created';

    await order.save();
  }

  static async handleEventNftmartTakenOrder(event: SubstrateEvent) {
    const {
      event: {
        data: [buyer, owner, order_id],
      },
    } = event;
    let orderId = order_id.toString();
    let buyerId = buyer.toString();
    let ownerId = owner.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(buyerId);
    await AccountHandler.ensureAccount(ownerId);

    await OrderHandler.ensureOrder(orderId);

    const order = await Order.get(orderId);

    order.sellerId = ownerId;
    order.buyerId = origin;
    order.statusId = 'Completed';
    order.intentId = 'Sell';
    order.eventCompletedId = eventId;

    await order.save();

    const orderItems: OrderItem[] = (await OrderItem.getByOrderId(orderId)) ?? [];
    for (let orderItem of orderItems) {
      const nftId = orderItem.nftId;
      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = ownerId;
      nftEvent.toId = buyerId;
      nftEvent.price = order.price;
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();

      const nft = await Nft.get(nftId);
      nft.statusId = 'Idle';
      nft.updateBlockId = blockHeight;
      nft.updateTimestamp = blockTimestamp;
      nft.dealPrice = order.price;
      nft.price = BigInt(-1);
      nft.pledge = BigInt(-1);
      nft.debug = `${event.event.section}.${event.event.method}`;
      await nft.save();
    }
  }

  static async handleEventNftmartRemovedOrder(event: SubstrateEvent) {
    const {
      event: {
        data: [who, order_id],
      },
    } = event;
    let orderId = order_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());

    await OrderHandler.ensureOrder(orderId);

    await AccountHandler.ensureAccount(origin);

    const order = await Order.get(orderId);

    order.statusId = 'Cancelled';
    order.intentId = 'Sell';
    order.sellerId = origin;
    order.eventCancelledId = eventId;

    await order.save();

    const orderItems: OrderItem[] = (await OrderItem.getByOrderId(orderId)) ?? [];
    for (let orderItem of orderItems) {
      const nftId = orderItem.nftId;
      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = who.toString();
      nftEvent.price = BigInt(-1);
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();

      const nft = await Nft.get(nftId);
      nft.statusId = 'Idle';
      nft.updateBlockId = blockHeight;
      nft.updateTimestamp = blockTimestamp;
      nft.price = BigInt(-1);
      nft.pledge = BigInt(-1);
      nft.debug = `${event.event.section}.${event.event.method}`;
      await nft.save();
    }
  }

  /* ================================== offer ==================================== */

  static async handleEventNftmartCreatedOffer(event: SubstrateEvent) {
    // console.log(`handle created order 1`)

    const {
      event: {
        data: [who, order_id],
      },
    } = event;
    let orderId = order_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`offer::eventId`, eventId);

    await AccountHandler.ensureAccount(who.toString());

    /*
    const currencyId = args[0].toString()
    const price = (args[1] as any).toBigInt()
    const deadline = (args[2] as any).toBigInt()
    const itemsJson = (args[3].toJSON() as number[][])
    */

    let ofr = ((await api.query.nftmartOrder.offers.at(blockHash, who.toString(), orderId)) as any).unwrap();

    const currencyId = ofr.currencyId.toString();
    const price = ofr.price.toBigInt();
    const deadline = ofr.deadline.toNumber();
    const itemsJson = ofr.items.map((item) => [
      item.classId.toNumber(),
      item.tokenId.toNumber(),
      item.quantity.toNumber(),
    ]);
    const commissionRate = ofr.commissionRate.toNumber();

    await OrderHandler.ensureOrder(orderId);
    for (let i in itemsJson) {
      let item = itemsJson[i];
      const classId = `${item[0]}`;
      const tokenId = `${item[1]}`;
      const nftId = `${classId}-${tokenId}`;
      const quantity = item[2];
      await ClassHandler.ensureClass(classId);
      await NftHandler.ensureNft(classId, tokenId);
      let orderItem = new OrderItem(`${orderId}-${i}`);
      orderItem.nftId = nftId;
      orderItem.quantity = quantity;
      orderItem.orderId = orderId;
      await orderItem.save();
      console.log(`created new offer item`, classId, tokenId, quantity);

      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = who.toString();
      nftEvent.price = price;
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();
    }

    await AccountHandler.ensureAccount(origin);
    // await CategoryHandler.ensureCategory(categoryId)

    const order = await Order.get(orderId);

    // order.categoryId = categoryId

    order.price = price;
    order.deadline = deadline;
    order.commissionRate = commissionRate;
    order.debug = args.toString();
    order.buyerId = origin;
    order.eventCreatedId = eventId;
    order.intentId = 'Buy';
    order.statusId = 'Created';

    await order.save();
  }

  static async handleEventNftmartTakenOffer(event: SubstrateEvent) {
    const {
      event: {
        data: [owner, buyer, order_id],
      },
    } = event;
    let orderId = order_id.toString();
    let buyerId = buyer.toString();
    let ownerId = owner.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(buyerId);
    await AccountHandler.ensureAccount(ownerId);

    await OrderHandler.ensureOrder(orderId);

    const order = await Order.get(orderId);

    order.buyerId = buyerId;
    order.sellerId = origin;
    order.statusId = 'Completed';
    order.intentId = 'Buy';
    order.eventCompletedId = eventId;

    await order.save();

    const orderItems: OrderItem[] = (await OrderItem.getByOrderId(orderId)) ?? [];
    for (let orderItem of orderItems) {
      const nftId = orderItem.nftId;
      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = ownerId;
      nftEvent.toId = buyerId;
      nftEvent.price = order.price;
      //nftEvent.price = BigInt(-1);
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();

      const nft = await Nft.get(nftId);
      nft.statusId = 'Idle';
      nft.updateBlockId = blockHeight;
      nft.updateTimestamp = blockTimestamp;
      nft.dealPrice = order.price;
      nft.price = BigInt(-1);
      nft.debug = `${event.event.section}.${event.event.method}`;
      await nft.save();
    }
  }

  static async handleEventNftmartRemovedOffer(event: SubstrateEvent) {
    const {
      event: {
        data: [who, order_id],
      },
    } = event;
    let orderId = order_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());

    await OrderHandler.ensureOrder(orderId);

    await AccountHandler.ensureAccount(origin);

    const order = await Order.get(orderId);

    order.buyerId = origin;
    order.statusId = 'Cancelled';
    order.intentId = 'Buy';
    order.eventCancelledId = eventId;

    await order.save();

    const orderItems: OrderItem[] = (await OrderItem.getByOrderId(orderId)) ?? [];
    for (let orderItem of orderItems) {
      const nftId = orderItem.nftId;
      const nftEvent = new NftEvent(`${nftId}-${eventId}`);

      nftEvent.blockId = blockHeight;
      nftEvent.timestamp = blockTimestamp;
      nftEvent.fromId = who.toString();
      nftEvent.price = BigInt(-1);
      nftEvent.params = `${event.event.data}`;

      nftEvent.nftId = nftId;
      nftEvent.eventId = eventId;
      nftEvent.quantity = 1;
      nftEvent.section = event.event.section;
      nftEvent.method = event.event.method;
      nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
      await nftEvent.save();
    }
  }
}
