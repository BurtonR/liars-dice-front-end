import {Claim} from "./claimModel";

export class Player {
    number: number;
    hand: number[] = [];
    dieForBoard: number[] = [];
    claims: Claim[] = [];

    constructor(obj?: any) {
        this.number = obj && obj.number || 0;
        this.hand = obj && obj.hand || [];
        this.dieForBoard = obj && obj.dieForBoard || [];
        this.claims = obj && obj.claims || [];
    }
}