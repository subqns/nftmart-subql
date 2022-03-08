import {SubstrateBlock} from '@subql/types';
import {getBlockTimestamp} from '../helpers';
import {Block} from '../types/models/Block';
import {Nft} from '../types/models/Nft';
import {Auction} from '../types/models/Auction';
import {AuctionItem} from '../types/models/AuctionItem';
import {NftHandler} from './sub-handlers/nft';

export class BlockHandler {
  private block: SubstrateBlock;

  static async ensureBlock(id: string): Promise<void> {
    const block = await Block.get(id);

    if (!block) {
      await new Block(id).save();
    }
  }

  constructor(block: SubstrateBlock) {
    this.block = block;
  }

  get blockTimestamp() {
    return getBlockTimestamp(this.block.block);
  }

  get number() {
    return this.block.block.header.number.toBigInt() || BigInt(0);
  }

  get hash() {
    return this.block.block.hash.toString();
  }

  get specVersion() {
    return this.block.specVersion;
  }

  get parentHash() {
    return this.block.block.header.parentHash.toString();
  }

  async expiredAuctionsHook() {
    const expiredAuctions = await Auction.getByDeadlineBlockId(`${this.number}`);
    for (let auc of expiredAuctions) {
      const items = await AuctionItem.getByAuctionId(auc.id);
      for (let item of items) {
        let {nftId, auctionId} = item;
        const [classId, tokenId] = nftId.split('-');
        await NftHandler.ensureNft(classId, tokenId);
        let nft = await Nft.get(nftId);
        nft.statusId = 'Idle';
        nft.updateBlockId = `${this.number}`;
        nft.updateTimestamp = this.blockTimestamp;
        nft.price = BigInt(-1);
        nft.debug = `Auction Timeout`;
        await nft.save();
      }
    }
  }

  public async save() {
    const block = new Block(`${this.number}`);

    block.hash = this.hash;
    block.number = this.number;
    block.timestamp = this.blockTimestamp;
    block.specVersion = this.specVersion;
    block.parentHash = this.parentHash;

    await block.save();

    await this.expiredAuctionsHook();
  }
}
