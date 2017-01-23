
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
  accurateClaim: boolean;
  changePlayerModal = new EventEmitter<string|MaterializeAction>();
  invalidClaimModal = new EventEmitter<string|MaterializeAction>();
  challengeModal = new EventEmitter<string|MaterializeAction>();

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
      this.openModal(this.changePlayerModal);
    }, (error: any) => {
      console.log(`There was an error getting the game details: ${error._body}`);
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

    if(this.validClaim(claim, this.currentClaim)){
      this.gameService.makeClaim(this.game._id, claim)
        .subscribe((updatedGame: Game) => {
          this.game = updatedGame;
          this.currentClaim = updatedGame.actions.filter(x => x.actionType == 'claim')[0];
          this.claimAmount = 0;
          this.claimValue = 0;
          this.openModal(this.changePlayerModal);
        }, (error: any) => {
          console.log(`There was an error making a claim: ${error._body}`);
        });
    } else {
      this.openModal(this.invalidClaimModal);
    }
  }

  validClaim(proposedClaim: Claim, currentClaim: Claim): boolean {
    if(!currentClaim) {
      return true;
    }

    if(proposedClaim.claimNumber < currentClaim.claimNumber){
      return false;
    } else if(proposedClaim.claimNumber === currentClaim.claimNumber) {
      return proposedClaim.claimFace > currentClaim.claimFace;
    } else if( proposedClaim.claimNumber > currentClaim.claimNumber) {
      return true;
    }
  }

  challenge(player: number): void {
    this.gameService.challengeClaim(this.game._id, player)
      .subscribe((result: boolean) => {
      this.accurateClaim = result;
      this.openModal(this.challengeModal);
    }, (error: any) => {
        console.log(`There was an error submitting the challenge: ${error._body}`);
      });
  }

  playerClaims(player: number): Claim[]{
    return this.game.actions.filter(x => x.actionType == 'claim' && x.player == player);
  }

  openModal(modal: EventEmitter<string|MaterializeAction>) {
    modal.emit({action:"modal",params:['open']});
  }
}
