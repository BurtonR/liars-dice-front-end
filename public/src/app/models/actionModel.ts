export class Action {
  actionType: string;
  claimNumber: number;
  claimFace: number;
  moveFace: number;
  moveNumber: number;
  player: number;

  constructor(obj?: any) {
    this.actionType = obj && obj.actionType || '';
    this.claimNumber = obj && obj.claimNumber || 0;
    this.claimFace = obj && obj.claimFace || 0;
    this.moveNumber = obj && obj.moveNumber || 0;
    this.moveFace = obj && obj.moveFace || 0;
    this.player = obj && obj.player || 0;
  }
}
