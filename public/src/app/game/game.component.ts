
import {Component, OnInit, EventEmitter} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {GameService} from "../services/game.service";
import {Game} from "../models/gameModel";
import {Claim} from "../models/claimModel";
import {MaterializeAction} from "angular2-materialize";
import {Action} from "../models/actionModel";

@Component ({
  selector: 'game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})

export class GameComponent implements OnInit {
  private game: Game;
  dieForBoard: number;
  diceOnBoard: number[] = [];
  playerArray: number[];
  currentPlayer: number = 0;
  currentHand: number[];
  claimAmount: number;
  claimValue: number;
  dieSubmitted: boolean;
  currentClaim: Action;

  constructor(private route: ActivatedRoute,
              private gameService: GameService)
  { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let gameId = params['id'];
      this.getGameDetails(gameId);
    });
  }

  getGameDetails(gameId: string): void {
    this.gameService.GetDetails(gameId).subscribe((game: Game) => {
      this.game = game;
      this.playerArray = Array(game.numPlayers);
      this.openModal();
    });
  }

  switchPlayer(switchFrom: number): void {
    if(switchFrom === this.playerArray.length){
      this.currentPlayer = 1;
    } else {
      this.currentPlayer++;
    }

    this.currentHand = this.game.playerHands[this.currentPlayer - 1];
    this.dieForBoard = 0;
    this.dieSubmitted = false;
  }

  submitDieToBoard(dieValue: number): void {
    if(dieValue === 0){
      return;
    }
    this.currentHand.forEach(selected => {
      if(selected === dieValue) {
        this.diceOnBoard.push(selected);
      }
    });

    this.dieSubmitted = true;
  }

  makeClaim(numDice: number, diceValue: number) {
    let playerIndex = this.currentPlayer - 1;
    let claim = new Claim(playerIndex);

    claim.claimNumber = numDice;
    claim.claimFace = diceValue;
    claim.moveNumber = this.currentHand.filter(d => d === this.dieForBoard).length;
    claim.moveFace = this.dieForBoard;

    this.gameService.makeClaim(this.game._id, claim)
      .subscribe((updatedGame: Game) => {
        this.game = updatedGame;
        this.currentClaim = updatedGame.actions.filter(x => x.actionType == 'claim')[0];
        this.claimAmount = 0;
        this.claimValue = 0;
        this.openModal();
      });
  }

  challenge(player: number): void {
    console.log('Player making the challenge: ' + player);
  }

  playerClaims(player: number): Claim[]{
    return this.game.actions.filter(x => x.actionType == 'claim' && x.player == player);
  }

  modalActions = new EventEmitter<string|MaterializeAction>();
  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
}
