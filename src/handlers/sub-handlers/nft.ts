import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { Call } from '../../types/models/Call'
import { Class } from "../../types/models/Class"
import { Nft } from "../../types/models/Nft"
import { NftTransfer } from "../../types/models/NftTransfer"
import { CallHandler } from '../call'
import { ExtrinsicHandler } from '../extrinsic'
import { DispatchedCallData } from '../types'
import { AccountHandler } from './account'
import { hexToAscii } from '../../helpers/common'
import { ClassHandler } from './class'

export class NftHandler {

  // 4829-3, 4499-3: TransferredToken
  static async handleCallNftmartDoTransfer({ id, call, extrinsic, isSuccess }: DispatchedCallData) {
    const args = call.args

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

    const nftTransfer = new NftTransfer(nftId)

    nftTransfer.debug = `${nftId}`;

    nftTransfer.toId = buyer
    nftTransfer.fromId = seller
    nftTransfer.nftId = nftId
    nftTransfer.extrinsicId = extrinsicHash
    nftTransfer.callId = id
    nftTransfer.timestamp = extrinsicHandler.timestamp
    nftTransfer.isSuccess = isSuccess
    nftTransfer.blockId = extrinsic.block.block.hash.toString()

    await nftTransfer.save()
  }

  static async ensureNft (classId: string, tokenId: string): Promise<void> {
    const id = `${classId}-${tokenId}`;

    let nft = await Nft.get(id)

    if (!nft) {
      nft = new Nft(id)
      nft.classId = classId
      nft.tokenId = tokenId
      await nft.save()
    }
  }

  static async handleEventNftmartMintedToken (event : SubstrateEvent){
    // skip
    // can be inferred from the following events or corresponding calls that emit these events
    /*
		/// Transferred NFT token. \[from, to, class_id, token_id\]
		TransferredToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>),
		/// Burned NFT token. \[owner, class_id, token_id\]
		BurnedToken(T::AccountId, ClassIdOf<T>, TokenIdOf<T>),
		/// Created a NFT Order. \[class_id, token_id, order_owner\]
		CreatedOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId),
		/// Removed a NFT Order. \[class_id, token_id, order_owner, unreserved\]
		RemovedOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId, Balance),
		/// An order had been taken. \[class_id, token_id, order_owner\]
		TakenOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId),
		/// Price updated \[class_id, token_id, order_owner, price\]
		UpdatedOrderPrice(ClassIdOf<T>, TokenIdOf<T>, T::AccountId, Balance),
    */
  }

  static async handleEventNftmartTransferredToken (event : SubstrateEvent){
    // ensure
    // from
    // to
    // class_id
    // token_id
    // id=class_id-token_id
    /*
    const 
    const id = `${classId}-${tokenId}` 
    let nft = new NFT(id)
    */
  }

  static async handleEventNftmartBurnedToken (event : SubstrateEvent){
    // ensure
    // 
  }

}
