// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, store} from "@subql/types";
import assert from 'assert';




type OrderProps = Omit<Order, NonNullable<FunctionPropertyNames<Order>>>;

export class Order implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public currencyId?: number;

    public deadline?: number;

    public intentId?: string;

    public statusId?: string;

    public price?: bigint;

    public deposit?: bigint;

    public commissionRate?: number;

    public sellerId?: string;

    public buyerId?: string;

    public eventCreatedId?: string;

    public eventCancelledId?: string;

    public eventCompletedId?: string;

    public debug?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Order entity without an ID");
        await store.set('Order', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Order entity without an ID");
        await store.remove('Order', id.toString());
    }

    static async get(id:string): Promise<Order | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Order entity without an ID");
        const record = await store.get('Order', id.toString());
        if (record){
            return Order.create(record as OrderProps);
        }else{
            return;
        }
    }


    static async getByIntentId(intentId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'intentId', intentId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getByStatusId(statusId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'statusId', statusId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getBySellerId(sellerId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'sellerId', sellerId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getByBuyerId(buyerId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'buyerId', buyerId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getByEventCreatedId(eventCreatedId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'eventCreatedId', eventCreatedId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getByEventCancelledId(eventCancelledId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'eventCancelledId', eventCancelledId);
      return records.map(record => Order.create(record as OrderProps));
      
    }

    static async getByEventCompletedId(eventCompletedId: string): Promise<Order[] | undefined>{
      
      const records = await store.getByField('Order', 'eventCompletedId', eventCompletedId);
      return records.map(record => Order.create(record as OrderProps));
      
    }


    static create(record: OrderProps): Order {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Order(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
