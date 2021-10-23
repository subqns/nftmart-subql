import {SubstrateExtrinsic} from '@subquery/types';
import {Call} from '../../types/models/Call';
import {Transfer} from '../../types/models/Transfer';
import {CallHandler} from '../call';
import {ExtrinsicHandler} from '../extrinsic';
import {DispatchedCallData} from '../types';
import {AccountHandler} from './account';
import {TokenHandler} from './token';

export class TransferHandler {
  static async handleCallBalancesTransfer({id, call, extrinsic, isSuccess}: DispatchedCallData) {
    const args = call.args;
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);

    const to = args[0].toString();
    const amount = (args[1] as any).toBigInt() || BigInt(0);
    const from = extrinsicHandler.signer;
    const extrinsicHash = extrinsicHandler.id;

    await AccountHandler.ensureAccount(to);
    await AccountHandler.ensureAccount(from);
    await CallHandler.ensureCall(id);
    await TokenHandler.ensureToken('NMT', 12);

    const transfer = new Transfer(id);

    transfer.toId = to;
    transfer.fromId = from;
    transfer.tokenId = 'NMT';
    transfer.amount = amount;
    transfer.extrinsicId = extrinsicHash;
    transfer.callId = id;
    transfer.timestamp = extrinsicHandler.timestamp;
    transfer.isSuccess = isSuccess;
    transfer.blockId = extrinsic.block.block.hash.toString();

    await transfer.save();
  }
}
