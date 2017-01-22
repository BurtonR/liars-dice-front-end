export class Claim {
  player: number;
  moveNumber: number;
  moveFace: number;
  claimNumber: number;
  claimFace: number;

  constructor(player: number){
    if(player < 0){
      return null;
    }
    this.player = player;
  }
}
