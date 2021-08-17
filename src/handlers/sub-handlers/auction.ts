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

    let auc = (await api.query.nftmartAuctions.britishAuctions.at(blockHash, owner, auctionId) as any).unwrap();

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
      console.log(`created new order item`, classId, tokenId, quantity)
    }

    const bid = new AuctionBid(`${auctionId}`)
    bid.bidderId = owner;
    bid.type = 'British'
    bid.price = initPrice
    bid.blockNumber = blockHeight
    await bid.save()

    // await AccountHandler.ensureAccount(origin)
    // await CategoryHandler.ensureCategory(categoryId)

    const auction = await Auction.get(auctionId)

    auction.type = 'British'
    auction.deposit = deposit
    auction.initPrice = initPrice
    auction.hammerPrice = hammerPrice
    auction.deadline = deadline
    auction.allowDelay = allowDelay
    auction.commissionRate = commissionRate
    auction.minRaise = minRaise

    await auction.save()
  }

}
