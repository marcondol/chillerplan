/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ChillerPlanTender } from './chiller-plan-tender';

@Info({title: 'ChillerPlanContractTender', description: 'Tender For Chiller plan' })
export class ChillerPlanContractTender extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.chiller.tender');
    }


    @Transaction(false)
    @Returns('boolean')
    public async chillerPlanTenderExists(ctx: Context, tenderId: string): Promise<boolean> {
        const key = ctx.stub.createCompositeKey('tender', [tenderId]);

        const data: Uint8Array = await ctx.stub.getState(key);
        return (!!data && data.length > 0);
    }


    @Transaction(false)
    @Returns('ChillerPlanTender')
    public async readChillerPlan(ctx: Context, tenderId: string): Promise<ChillerPlanTender> {
        const exists: boolean = await this.chillerPlanTenderExists(ctx, tenderId);
        if (!exists) {
            throw new Error(`The tender ${tenderId} does not exist`);
        }
        const key = ctx.stub.createCompositeKey('tender', [tenderId]);

        const data: Uint8Array = await ctx.stub.getState(key);
        const chillerPlan: ChillerPlanTender = JSON.parse(data.toString()) as ChillerPlanTender;
        return chillerPlan;
    }

    // transaction to create asset chillerplanTender
    @Transaction()
    public async createChillerPlanTender(ctx: Context, chillerPlanId: string, tenderId: string): Promise<void> {
        const exists: boolean = await this.chillerPlanTenderExists(ctx, tenderId);
        if (!exists) {
            throw new Error(`The tender with  ${tenderId} does not exist`);
        }
        const key = ctx.stub.createCompositeKey('tender', [tenderId]);

        const chillerPlanTender: ChillerPlanTender = new ChillerPlanTender();
        chillerPlanTender.tenderId = tenderId;
        chillerPlanTender.chillerPlanId = chillerPlanId;
        const buffer: Buffer = Buffer.from(JSON.stringify(chillerPlanTender));
        await ctx.stub.putState(key, buffer);
    }


    // @Transaction()
    // public async updateChillerPlan(ctx: Context, chillerPlanId: string, newValue: string): Promise<void> {
    //     const exists: boolean = await this.chillerPlanExists(ctx, chillerPlanId);
    //     if (!exists) {
    //         throw new Error(`The chiller plan ${chillerPlanId} does not exist`);
    //     }
    //     const chillerPlan: ChillerPlan = new ChillerPlan();
    //     chillerPlan.value = newValue;
    //     const buffer: Buffer = Buffer.from(JSON.stringify(chillerPlan));
    //     await ctx.stub.putState(chillerPlanId, buffer);
    // }


}
