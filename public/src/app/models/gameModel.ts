import {Action} from "./actionModel";
export class Game {
  _id: string;
  numPlayers: number;
  numDice: number;
  board: any[];
  actions: Action[];
  playerHands: number[][];


  constructor(players: number, die: number) {

    if(players < 2 || die < 1) {
      return null;
    }

    this.numPlayers = players;
    this.numDice = die;
  }
}
