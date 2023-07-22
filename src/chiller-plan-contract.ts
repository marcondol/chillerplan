/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ChillerPlan } from './chiller-plan';

@Info({title: 'ChillerPlanContract', description: 'My Smart Contract' })
export class ChillerPlanContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.chiller.project');
    }

    @Transaction(false)
    @Returns('boolean')
    public async chillerPlanExists(ctx: Context, chillerPlanId: string): Promise<boolean> {
        const key = ctx.stub.createCompositeKey('project', [chillerPlanId]);

        const data: Uint8Array = await ctx.stub.getState(key);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createChillerPlan(ctx: Context, chillerPlanId: string, projectName: string, speckUrl:string, priceRange: string): Promise<void> {
        const exists: boolean = await this.chillerPlanExists(ctx, chillerPlanId);
        if (exists) {
            throw new Error(`The chiller plan ${chillerPlanId} already exists`);
        }
        const key = ctx.stub.createCompositeKey('project', [chillerPlanId]);

        const chillerPlan: ChillerPlan = new ChillerPlan();
        chillerPlan.projectName = projectName;
        chillerPlan.speckUrl = speckUrl;
        chillerPlan.priceRange = priceRange;
        const buffer: Buffer = Buffer.from(JSON.stringify(chillerPlan));
        await ctx.stub.putState(key, buffer);
    }



    @Transaction(false)
    @Returns('ChillerPlan')
    public async readChillerPlan(ctx: Context, chillerPlanId: string): Promise<ChillerPlan> {
        const exists: boolean = await this.chillerPlanExists(ctx, chillerPlanId);
        if (!exists) {
            throw new Error(`The chiller plan ${chillerPlanId} does not exist`);
        }
        const key = ctx.stub.createCompositeKey('project', [chillerPlanId]);

        const data: Uint8Array = await ctx.stub.getState(key);
        const chillerPlan: ChillerPlan = JSON.parse(data.toString()) as ChillerPlan;
        return chillerPlan;
    }

    // create function to get all chiller project
    @Transaction(false)
    @Returns('ChillerPlan')
    public async getAllChillerPlan(ctx: Context): Promise<ChillerPlan[]> {
        const allResults: Array<ChillerPlan> = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue: string = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return allResults;
    }

    @Transaction()
    public async deleteChillerPlan(ctx: Context, chillerPlanId: string): Promise<void> {
        const exists: boolean = await this.chillerPlanExists(ctx, chillerPlanId);
        if (!exists) {
            throw new Error(`The chiller plan ${chillerPlanId} does not exist`);
        }
        await ctx.stub.deleteState(chillerPlanId);
    }

}
