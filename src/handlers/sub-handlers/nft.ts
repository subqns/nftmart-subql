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

    /* new master:

    /// nftmartConf

    /// Minted NFT token. \[from, to, class_id, token_id, quantity\]
		MintedToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>),
		/// Transferred NFT token. \[from, to, class_id, token_id, quantity\]
		TransferredToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>),
		/// Burned NFT token. \[owner, class_id, token_id, quantity, unreserved\]
		BurnedToken(T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>, Balance),

    mint()
    	to: <T::Lookup as StaticLookup>::Source,
			#[pallet::compact] class_id: ClassIdOf<T>,
			metadata: NFTMetadata,
			#[pallet::compact] quantity: TokenIdOf<T>,
			charge_royalty: Option<bool>,
    */

    const {event: { data: [who, to, class_id, token_id, quantity] }} = event;
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let quant = Number(quantity.toString());
    let id = `${classId}-${tokenId}`;

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const Args = event.extrinsic?.extrinsic?.method?.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());
    await AccountHandler.ensureAccount(to.toString());
    await ClassHandler.ensureClass(class_id.toString());

    const nft = new Nft(id);
    nft.classId = classId;
    nft.tokenId = tokenId;
    nft.quantity = quant;

    const args = JSON.parse(Args.toString())[1].args.call.args;
    nft.debug = JSON.stringify(args);

    const toId = args.to.id;
    // const classId = args[1].toString();
    const metadataStr = hexToAscii(args.metadata);
    // const quantity = Number(args[3].toString());
    const chargeRoyalty = args.charge_royalty // args[4].toJSON() as boolean; // is None or false

    const clas = await Class.get(classId);

    nft.royalty = chargeRoyalty ?? clas.royaltiesChargeable;
    nft.royaltyBeneficiaryId = toId;
    nft.creatorId = toId;
    nft.eventId = eventId;
    nft.metadata = metadataStr;

    await nft.save();
  }

  static async handleEventNftmartTransferredToken (event : SubstrateEvent){

    const {event: { data: [who, to, class_id, token_id, quantity] }} = event;
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let nftId = `${classId}-${tokenId}`;
    let quant = Number(quantity.toString());

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(who.toString());
    await AccountHandler.ensureAccount(to.toString());
    await ClassHandler.ensureClass(class_id.toString());
    await NftHandler.ensureNft(classId, tokenId);

  }

  static async handleEventNftmartBurnedToken (event : SubstrateEvent){

    const {event: { data: [who, class_id, token_id, quantity, deposit] }} = event;
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let nftId = `${classId}-${tokenId}`;
    let quant = Number(quantity.toString());
    let depos = Number(deposit.toString());

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();

    await AccountHandler.ensureAccount(who.toString());
    await ClassHandler.ensureClass(classId);
    await NftHandler.ensureNft(classId, tokenId);

    const nft = await Nft.get(nftId);
    nft.burned = true;
    nft.save();

    await nft.save();
  }

}
