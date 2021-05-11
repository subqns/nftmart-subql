import { Address } from "../../types/models/Address"
import { SubstrateEvent } from '@subql/types'

// A new account is created automatically when you send minimum amount of fund to it's address
//
// Example:
//
// https://westend.subscan.io/extrinsic/0x87c2756cb3982914ba98759203a993b8650dac1cb19fb634e8930ed2b3a754b3?event=5565317-2

export class AddressHandler {

  static async handleEventSystemNewAccount(event : SubstrateEvent) {

    // https://github1s.com/jamesbayly/subql_create_block/blob/HEAD/src/mappings/mappingHandlers.ts

    const {event: { data: [ accountId] }} = event;

    // logger.info(accountId.toString());

    //Retrieve the record by its ID
    const record = new Address(accountId.toString());
    record.address = accountId.toString();
    record.creationBlock = event.block.block.header.number.toBigInt();
    record.creationTime = event.block.timestamp;

    await record.save();
  }

}
