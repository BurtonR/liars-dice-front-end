export class Claim {
  player: number;
  moveNumber: number;
  moveFace: number;
  claimNumber: number;
  claimFace: number;

  constructor(obj?: any){
    this.player = obj && obj.player || 1;
    this.moveNumber = obj && obj.moveNumber || 0;
    this.moveFace = obj && obj.moveFace || 0;
    this.claimNumber = obj && obj.claimNumber || 0;
    this.claimFace = obj && obj.claimFace || 0;
  }
}
