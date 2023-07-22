/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class ChillerPlan {

    @Property()
    public projectName: string;

    @Property()
    public speckUrl: string;

    @Property()
    public priceRange: string;
    public tenderWinner: string;
    public status:string;

}
