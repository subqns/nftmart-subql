import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { BlockHandler } from './block'
import { ExtrinsicHandler } from './extrinsic'
import { Dispatcher } from '../helpers/dispatcher'
import { AccountHandler } from './sub-handlers/account'
import { AddressHandler } from './sub-handlers/address'
import { TransferHandler } from './sub-handlers/transfer'
import { CategoryHandler } from './sub-handlers/category'
import { ClassHandler } from './sub-handlers/class'
import { NftHandler } from './sub-handlers/nft'
import { OrderHandler } from './sub-handlers/order'

type EventDispatch = Dispatcher<SubstrateEvent>

export class EventHandler {
  private event: SubstrateEvent 
  private dispatcher: EventDispatch

  constructor(event: SubstrateEvent) {
    this.event = event
    this.dispatcher = new Dispatcher<SubstrateEvent>()

    this.registerDispatcherHandler()
  }

  private registerDispatcherHandler () {
    this.dispatcher.batchRegist([
      {
        key: 'system-NewAccount',
        handler: AddressHandler.handleEventSystemNewAccount
      },
      {
        key: "nftmartConf-CreatedCategory",
        handler: CategoryHandler.handleEventNftmartCreatedCategory
      },
      {
        key: "nftmartConf-UpdatedCategory",
        handler: CategoryHandler.handleEventNftmartUpdatedCategory
      },
      {
        key: "nftmart-CreatedClass",
        handler: ClassHandler.handleEventNftmartCreatedClass
      },
      {
        key: "nftmart-MintedToken",
        handler: NftHandler.handleEventNftmartMintedToken
      },
      {
        key: "nftmart-TransferredToken",
        handler: NftHandler.handleEventNftmartTransferredToken
      },
      {
        key: "nftmart-BurnedToken",
        handler: NftHandler.handleEventNftmartBurnedToken
      },
      {
        key: 'nftmartOrder-CreatedOrder',
        handler: OrderHandler.handleEventNftmartCreatedOrder
      },
    ])
  }

  get index () {
    return this.event.idx
  }

  get blockNumber () {
    return this.event.block.block.header.number.toBigInt()
  }

  get blockHash () {
    return this.event.block.block.hash.toString()
  }

  get section () {
    return this.event.event.section
  }

  get method () {
    return this.event.event.method
  }

  get data () {
    return this.event.event.data.toString()
  }

  get extrinsicHash () {
    const i = this.event?.extrinsic?.extrinsic?.hash?.toString()

    return i === 'null' ? undefined : i
  }

  get extrinsicId () {
    return `${this.blockNumber}-${this.event?.extrinsic?.idx?.toString()}`
  }

  get id () {
    return `${this.blockNumber}-${this.index}`
  }

  public async save () {
    const event = new Event(this.id)

    await BlockHandler.ensureBlock(this.blockHash)

    if (this.extrinsicHash) {
      await ExtrinsicHandler.ensureExtrinsic(this.extrinsicId)
    }

    event.index = this.index
    event.section = this.section
    event.method = this.method
    event.data = this.data

    event.blockId = this.blockHash

    if (this.extrinsicHash) {
      event.extrinsicId = this.extrinsicId;
    }

    await this.dispatcher.dispatch(
      `${this.section}-${this.method}`,
      this.event
    );

    await event.save()
  }
}
