import {Action} from "./actionModel";
import {Player} from "./playerModel";
import {Claim} from "./claimModel";

export class Game {
  _id: string = '';
  numPlayers: number = 0;
  numDice: number = 0;
  board: number[] = [];
  actions: Action[] = [];
  playerHands: number[][] = [];
  players: Player[] = [];
  currentPlayer: Player = null;
  currentClaim: Claim = null;



  constructor(obj?: any) {

    this._id = obj && obj._id || '';
    this.numPlayers = obj && obj.numPlayers || 0;
    this.numDice = obj && obj.numDice || 0;
    this.board = obj && obj.board || [];
    this.actions = obj && obj.actions || [];
    this.playerHands = obj && obj.playerHands || [];
    this.players = obj && obj.players || [];
    this.currentPlayer = obj && obj.currentPlayer || null;
    this.currentClaim = obj && obj.currentClaim || null;

    // set the array of players
    if(this.numPlayers !== 0 && this.playerHands !== []) {
      for(let i = 0; i < this.numPlayers; i++) {
        let newPlayer = new Player({
          number: i + 1,
          hand: this.playerHands[i]
        });
        this.players.push(newPlayer);
      }
    }
  }
}
