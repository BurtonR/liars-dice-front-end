
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
  game: Game;
  dieForBoard: number[] = [];
  claimAmount: number;
  claimValue: number;
  dieSubmitted: boolean;
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
      // this.playerArray = Array(game.numPlayers);
      this.openModal(this.changePlayerModal);
    });
  }

  switchPlayer(): void {
    this.gameService.ChangePlayer().subscribe((game: Game) => {
      this.game = game;
      this.dieForBoard = [];
      this.dieSubmitted = false;
    });
  }

  submitDieToBoard(dieValue: number): void {
    if(dieValue === 0){
      return;
    }
    this.game.currentPlayer.hand.forEach(selected => {
      if(selected === dieValue) {
        this.dieForBoard.push(selected);
      }
    });

    this.dieSubmitted = true;
  }

  makeClaim(numDice: number, diceValue: number) {
    let claim = new Claim({
      claimNumber: numDice,
      claimFace: diceValue,
      moveNumber: this.dieForBoard.length,
      moveFace: this.dieForBoard[0]
    });

    this.gameService.MakeClaim(claim)
      .subscribe((updatedGame: Game) => {
        this.game = updatedGame;
        this.claimAmount = 0;
        this.claimValue = 0;
        this.openModal(this.changePlayerModal);
      });
  }

  challenge(): void {
    this.gameService.ChallengeClaim()
      .subscribe((result: boolean) => {
      this.accurateClaim = result;
      this.openModal(this.challengeModal);
    });
  }

  openModal(modal: EventEmitter<string|MaterializeAction>) {
    modal.emit({action:"modal",params:['open']});
  }
}
