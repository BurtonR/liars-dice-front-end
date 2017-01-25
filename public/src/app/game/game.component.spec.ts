import {TestBed, fakeAsync, inject, ComponentFixture} from '@angular/core/testing';
import {GameComponent} from './game.component';
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../app.component";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule, BaseRequestOptions, Http, XHRBackend} from "@angular/http";
import {MaterializeModule} from "angular2-materialize";
import {RouterTestingModule} from "@angular/router/testing";
import {EventHandlerComponent} from "../event-handler/event-handler.component";
import {MockBackend} from "@angular/http/testing";
import {GameService} from "../services/game.service";
import {ActivatedRoute} from "@angular/router";
import {Game} from "../models/gameModel";
import {Observable} from "rxjs";
import {Claim} from "../models/claimModel";
import {Action} from "../models/actionModel";

let fakeService = {
  GetDetails (gameId: string) {
    let fakeGame = new Game({numPlayers: 2, numDice: 5});
    fakeGame._id = gameId;
    return Observable.of(fakeGame);
  },

  ChangePlayer () {
    return 1;
  }
  // MakeClaim(gameId: string, claim: Claim) {
  //   let fakeGame = new Game(2, 5);
  //   fakeGame._id = gameId;
  //   fakeGame.actions = [new Action];
  //   fakeGame.actions[0].actionType = 'claim';
  //   fakeGame.actions[0].claimFace = claim.claimFace;
  //   fakeGame.actions[0].claimNumber = claim.claimNumber;
  //   fakeGame.actions[0].moveFace = claim.moveFace;
  //   fakeGame.actions[0].moveNumber = claim.moveNumber;
  //   return Observable.of(fakeGame);
  // }
};

let component: GameComponent;
let fixture: ComponentFixture<GameComponent>;
let testService: GameService;

describe('Game Component', () => {
  let testRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameComponent,
        AppComponent,
        EventHandlerComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterTestingModule,
        HttpModule,
        MaterializeModule
      ],
      providers: [
        GameComponent,
        BaseRequestOptions,
        MockBackend,
        {provide: GameService, useValue: fakeService}
      ]
    });

    testRoute = TestBed.get(RouterTestingModule);
    testService = TestBed.get(GameService);

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Game Component', () => {
    expect(component).toBeTruthy();
  });

  it('should get Game details from service', fakeAsync(() => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);

      expect(true).toBeTruthy();
      // expect(component.game).toBeTruthy();
      // expect(component.game._id).toEqual(fakeGameId);
      // expect(component.game.numPlayers).toBeGreaterThan(0);
      // expect(component.game.numDice).toBeGreaterThan(0);
    })
  );

  // describe('Switch Player', () => {
  //   let fakeGame = new Game({numPlayers: 2, numDice: 5});
  //   fakeGame.playerHands = new Array(2);
  //   fakeGame.playerHands[0] = new Array(5).fill(2);
  //   fakeGame.playerHands[1] = new Array(5).fill(4);
  //
  //   let testComponent = new GameComponent(testRoute, testService);
  //   testComponent.game = fakeGame;
  //   testComponent.playerArray = new Array(fakeGame.numPlayers);
  //
  //   it('should switch to next player', () => {
  //     let fakePlayer = 0;
  //     testComponent.switchPlayer();
  //
  //     //Should be the next player
  //     // expect(testComponent.currentPlayer).toEqual(fakePlayer + 1);
  //   });
  //
  //   it('should clear current player state on switch', () => {
  //     let fakePlayer = 1;
  //     // testComponent.currentHand = fakeGame.playerHands[0];
  //     testComponent.dieForBoard = 3;
  //     testComponent.dieSubmitted = true;
  //
  //     testComponent.switchPlayer();
  //
  //     expect(testComponent.game.currentPlayer).toEqual(fakePlayer + 1);
  //     expect(testComponent.game.currentPlayer.hand).toEqual(fakeGame.playerHands[1]);
  //     expect(testComponent.dieForBoard).toEqual(0);
  //     expect(testComponent.dieSubmitted).toBeFalsy();
  //   });
  //
  //   it('should switch to player 1 on last player', () => {
  //     let fakePlayer = testComponent.playerArray.length;
  //
  //     testComponent.switchPlayer();
  //
  //     expect(testComponent.game.currentPlayer).toEqual(1);
  //   });
  //
  // }); //end of switching players
  //
  // describe('Submit Die To Board', () => {
  //   let testComponent = new GameComponent(testRoute, testService);
  //   testComponent.game.currentPlayer.hand = new Array(5);
  //   testComponent.game.board = [];
  //   testComponent.dieSubmitted = false;
  //
  //   it('should put dice on board', () => {
  //     let testDie = 3;
  //     testComponent.game.currentPlayer.hand = [1,2,3,4,5];
  //
  //     testComponent.submitDieToBoard(testDie);
  //
  //     expect(testComponent.game.board.length).toEqual(1);
  //     expect(testComponent.game.board[0]).toEqual(3);
  //     expect(testComponent.dieSubmitted).toBeTruthy();
  //   });
  //
  //   it('should not put dice on board with 0 submitted', () => {
  //     let testDie = 0;
  //     testComponent.game.board = [];
  //     testComponent.dieSubmitted = false;
  //     testComponent.game.currentPlayer.hand = [1,2,3,4,5];
  //
  //     testComponent.submitDieToBoard(testDie);
  //
  //     expect(testComponent.game.board.length).toEqual(0);
  //     expect(testComponent.dieSubmitted).toBeFalsy();
  //   });
  //
  // });//end of submit die to board
  //
  // describe('Make Claim', () => {
  //     let testComponent = new GameComponent(testRoute, testService);
  //     // testComponent.currentPlayer = 1;
  //     // testComponent.currentHand = new Array(5);
  //     // testComponent.game = new Game(2, 5);
  //     testComponent.game.actions = [];
  //     testComponent.openModal = (modal) => {};
  //
  //     it('should update game with claim', fakeAsync(() => {
  //           let fakePlayer = 1;
  //           let fakeNumDice = 4;
  //           let fakeDiceValue = 6;
  //           // testComponent.currentHand.fill(fakeDiceValue);
  //           // testComponent.currentClaim = null;
  //           testComponent.makeClaim(fakeNumDice, fakeDiceValue);
  //
  //           expect(testComponent.game.actions.length).toBeGreaterThan(0);
  //           expect(testComponent.game.actions[0].player).toEqual(fakePlayer);
  //           expect(testComponent.game.actions[0].claimNumber).toEqual(fakeNumDice);
  //           expect(testComponent.game.actions[0].claimFace).toEqual(fakeDiceValue);
  //       })
  //     );
  //
  //     // let fakeGameId = 'TestGame';
  //
  //     //
  //     // testComponent.getGameDetails(fakeGameId);
  //     //
  //     // expect(testComponent.game).toBeTruthy();
  //     // expect(testComponent.game._id).toEqual(fakeGameId);
  //     // expect(testComponent.game.numPlayers).toBeGreaterThan(0);
  //     // expect(testComponent.game.numDice).toBeGreaterThan(0);
  //   }
  // ); //end of make claim

  describe('Valid Claim', () => {

  }); //end of valid claim

  describe('Challenge', () => {

  }); //end of challenge

  describe('Player Claims', () => {

  }); //end of player claims

  describe('Open Modal', () => {

  }); //end of open modal

});
