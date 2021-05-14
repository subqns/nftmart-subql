// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Order implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public currencyId?: number;

    public deadline?: number;

    public price?: bigint;

    public ownerId?: string;

    public takerId?: string;

    public nftId?: string;

    public categoryId?: string;

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

    static async get(id:string): Promise<Order>{
        assert(id !== null, "Cannot get Order entity without an ID");
        const record = await store.get('Order', id.toString());
        if (record){
            return Order.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Order(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
