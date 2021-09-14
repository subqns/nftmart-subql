import { SubstrateExtrinsic, SubstrateEvent, api } from '@subquery/types'
import { Call } from '../../types/models/Call'
import { Auction } from "../../types/models/Auction"
import { AuctionBid } from "../../types/models/AuctionBid"
import { AuctionItem } from "../../types/models/AuctionItem"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { EventHandler } from '../event'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'
import { ClassHandler } from './class'
import { NftHandler } from './nft'
import { CategoryHandler } from './category'

export class AuctionHandler {

  static async ensureAuction (id: string) {

    const auction = await Auction.get(id)

    if (!auction) {
      const auction = new Auction(id)

      auction.bidCount = 0;

      await auction.save()
    }

  }

  static async handleEventNftmartCreatedBritishAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    let auc = (await api.query.nftmartAuction.britishAuctions.at(blockHash, owner, auctionId) as any).unwrap();

    const deposit = auc.deposit.toBigInt();
    const initPrice = auc.initPrice.toBigInt();
    const hammerPrice = auc.hammerPrice.toBigInt();
    const deadline = auc.deadline.toNumber();
    const itemsJson = auc.items.map((item)=> [item.classId.toNumber(), item.tokenId.toNumber(), item.quantity.toNumber()]);
    const allowDelay = auc.allowDelay.toJSON() as boolean;
    const commissionRate = auc.commissionRate.toNumber();
    const minRaise = auc.minRaise.toNumber();

    await AuctionHandler.ensureAuction(auctionId);
    for (let i in itemsJson) {
      let item = itemsJson[i]
      const classId = `${item[0]}`
      const tokenId = `${item[1]}`
      const nftId = `${classId}-${tokenId}`
      const quantity = item[2]
      await ClassHandler.ensureClass(classId)
      await NftHandler.ensureNft(classId, tokenId);
      let auctionItem = new AuctionItem(`${auctionId}-${i}`)
      auctionItem.nftId = nftId
      auctionItem.quantity = quantity
      auctionItem.auctionId = auctionId
      await auctionItem.save()
      console.log(`created new auction item`, classId, tokenId, quantity)
    }

    const bidCount = 0;
    const bid = new AuctionBid(`${auctionId}-${bidCount}`)
    bid.nth = bidCount;
    bid.auctionId = auctionId;
    bid.bidderId = owner;
    bid.type = 'British'
    bid.price = initPrice
    bid.blockNumber = blockHeight
    await bid.save()

    // await AccountHandler.ensureAccount(origin)
    // await CategoryHandler.ensureCategory(categoryId)

    const auction = await Auction.get(auctionId)

    auction.type = 'British'
    auction.blockCreated = blockHeight;
    auction.eventCreatedId = eventId;
    auction.currencyId = 0
    auction.status = 'Created'
    auction.creatorId = owner
    auction.deposit = deposit
    auction.initPrice = initPrice
    auction.hammerPrice = hammerPrice
    auction.deadline = deadline
    auction.allowDelay = allowDelay
    auction.commissionRate = commissionRate
    auction.minRaise = minRaise
    auction.bidCount = bidCount
    // auction.bidId = `${auctionId}-${bidCount}`

    await auction.save()
  }


  static async handleEventNftmartRemovedBritishAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::removed::british::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    const auction = await Auction.get(auctionId)

    auction.status = 'Removed'

    await auction.save()
  }

  static async handleEventNftmartRedeemedBritishAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::redeemed::british::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    const auction = await Auction.get(auctionId)

    auction.status = 'Redeemed'

    await auction.save()
  }

  // TODO: generate bid entry
  static async handleEventNftmartHammerBritishAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::hammered::british::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    const auction = await Auction.get(auctionId)

    auction.status = 'Redeemed'

    await auction.save()
  }

  static async handleEventNftmartBidBritishAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::bid::british::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);
    await AuctionHandler.ensureAuction(auctionId);

    let bd = (await api.query.nftmartAuction.britishAuctionBids.at(blockHash, auctionId) as any).unwrap();

    let ac = await Auction.get(auctionId)

    let bidCount = ac.bidCount + 1

    let price = bd.lastBidPrice.toBigInt();
    let bidderId = bd.lastBidAccount.toString();
    let blockNumber = bd.lastBidBlock.toNumber();

    const bid = new AuctionBid(`${auctionId}-${bidCount}`)
    bid.nth = bidCount;
    bid.auctionId = auctionId;
    bid.bidderId = bidderId;
    bid.type = 'British'
    bid.price = price
    bid.blockNumber = blockNumber //blockHeight
    if (bd.commissionAgent.isSome) {
	    bid.commissionAgentId = bd.commissionAgent.toString()
    }
    if (bd.commissionData.isSome) {
	    bid.commissionData = bd.commissionData.toString()
    }
    await bid.save()

    ac.bidCount = bidCount;
    await ac.save()

  }

  static async handleEventNftmartCreatedDutchAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    let auc = (await api.query.nftmartAuction.dutchAuctions.at(blockHash, owner, auctionId) as any).unwrap();

    const deposit = auc.deposit.toBigInt();
    const minPrice = auc.minPrice.toBigInt();
    const maxPrice = auc.maxPrice.toBigInt();
    const deadline = auc.deadline.toNumber();
    const itemsJson = auc.items.map((item)=> [item.classId.toNumber(), item.tokenId.toNumber(), item.quantity.toNumber()]);
    const allowBritishAuction = auc.allowBritishAuction.toJSON() as boolean;
    const commissionRate = auc.commissionRate.toNumber();
    const minRaise = auc.minRaise.toNumber();

    await AuctionHandler.ensureAuction(auctionId);
    for (let i in itemsJson) {
      let item = itemsJson[i]
      const classId = `${item[0]}`
      const tokenId = `${item[1]}`
      const nftId = `${classId}-${tokenId}`
      const quantity = item[2]
      await ClassHandler.ensureClass(classId)
      await NftHandler.ensureNft(classId, tokenId);
      let auctionItem = new AuctionItem(`${auctionId}-${i}`)
      auctionItem.nftId = nftId
      auctionItem.quantity = quantity
      auctionItem.auctionId = auctionId
      await auctionItem.save()
      console.log(`created new auction item`, classId, tokenId, quantity)
    }

    const bidCount = 0;
    const bid = new AuctionBid(`${auctionId}-${bidCount}`)
    bid.nth = bidCount;
    bid.auctionId = auctionId;
    bid.bidderId = owner;
    bid.type = 'Dutch'
    bid.price = maxPrice
    bid.blockNumber = blockHeight
    await bid.save()

    // await AccountHandler.ensureAccount(origin)
    // await CategoryHandler.ensureCategory(categoryId)

    const auction = await Auction.get(auctionId)

    auction.type = 'Dutch'
    auction.blockCreated = blockHeight;
    auction.eventCreatedId = eventId;
    auction.currencyId = 0
    auction.status = 'Created'
    auction.creatorId = owner
    auction.deposit = deposit
    auction.minPrice = minPrice
    auction.maxPrice = maxPrice
    auction.deadline = deadline
    auction.allowBritishAuction = allowBritishAuction
    auction.commissionRate = commissionRate
    auction.minRaise = minRaise
    auction.bidCount = bidCount
    // auction.bidId = `${auctionId}-${bidCount}`

    await auction.save()
  }

  static async handleEventNftmartRemovedDutchAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::removed::dutch::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    const auction = await Auction.get(auctionId)

    auction.status = 'Removed'

    await auction.save()
  }

  static async handleEventNftmartRedeemedDutchAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::redeemed::dutch::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);

    const auction = await Auction.get(auctionId)

    auction.status = 'Redeemed'

    await auction.save()
  }

  static async handleEventNftmartBidDutchAuction (event : SubstrateEvent){

    const {event: { data: [who, auction_id] }} = event;
    let owner = who.toString();
    let auctionId = auction_id.toString();

    const extrinsic = event.extrinsic;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);
    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toNumber();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    console.log(`auction::bid::dutch::eventId`, eventId);

    await AccountHandler.ensureAccount(owner);
    await AuctionHandler.ensureAuction(auctionId);

    let bd = (await api.query.nftmartAuction.dutchAuctionBids.at(blockHash, auctionId) as any).unwrap();

    let ac = await Auction.get(auctionId)

    let bidCount = ac.bidCount + 1

    let price = bd.lastBidPrice.toBigInt();
    let bidderId = bd.lastBidAccount.toString();
    let blockNumber = bd.lastBidBlock.toNumber();

    const bid = new AuctionBid(`${auctionId}-${bidCount}`)
    bid.nth = bidCount;
    bid.auctionId = auctionId;
    bid.bidderId = bidderId;
    bid.type = 'Dutch'
    bid.price = price
    bid.blockNumber = blockNumber //blockHeight
    if (bd.commissionAgent.isSome) {
	    bid.commissionAgentId = bd.commissionAgent.toString()
    }
    if (bd.commissionData.isSome) {
	    bid.commissionData = bd.commissionData.toString()
    }
    await bid.save()

    ac.bidCount = bidCount;
    await ac.save()

  }

}

/*
type AuctionBid @entity {
  id: ID!
  type: String # one of British / Dutch
  price: BigInt
  blockNumber: Int
  commissionAgent: Account
  commissionData: String
  bidder: Account
}
*/

