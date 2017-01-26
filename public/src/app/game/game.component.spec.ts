import {TestBed, fakeAsync, ComponentFixture} from '@angular/core/testing';
import {GameComponent} from './game.component';
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../app.component";
import {BrowserModule, By} from "@angular/platform-browser";
import {HttpModule, BaseRequestOptions} from "@angular/http";
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
import {Player} from "../models/playerModel";

let component: GameComponent;
let fixture: ComponentFixture<GameComponent>;
let testService: GameService;
let fakeGame: Game = new Game();

let fakeService = {
  GetDetails(gameId: string) {
    fakeGame = new Game({_id: gameId,numPlayers: 2, numDice: 5});
    return Observable.of(fakeGame);
  },

  ChangePlayer() {
    fakeGame.currentPlayer.number++;
    fakeGame.currentPlayer.hand = [6,5,4,3,2,1];
    return Observable.of(fakeGame);
  },

  MakeClaim(claim: Claim) {
    fakeGame.actions = [new Action];
    fakeGame.actions[0].actionType = 'claim';
    fakeGame.actions[0].claimFace = claim.claimFace;
    fakeGame.actions[0].claimNumber = claim.claimNumber;
    fakeGame.actions[0].moveFace = claim.moveFace;
    fakeGame.actions[0].moveNumber = claim.moveNumber;
    return Observable.of(fakeGame);
  },
  ChallengeClaim() {
    return Observable.of(true);
  }
};

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

  describe('Get Game Details', () => {
    it('should get Game details from service', fakeAsync(() => {
        let fakeGameId = 'TestGame';

        component.getGameDetails(fakeGameId);

        expect(component.game).toBeTruthy();
        expect(component.game._id).toEqual(fakeGameId);
        expect(component.game.numPlayers).toBeGreaterThan(0);
        expect(component.game.numDice).toBeGreaterThan(0);
      })
    );

    it('should open switch player modal', () => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);

      fixture.detectChanges();
      let debugElement = fixture.debugElement.query(By.css('#changePlayerModal h4'));
      let modalH4 = debugElement.nativeElement;

      expect(modalH4.textContent).toContain('Switching Players');
    });

    it('should show game id in sub-nav', () => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);

      fixture.detectChanges();
      let debugElement = fixture.debugElement.queryAll(By.css('nav li'));
      let navLi = debugElement[0].nativeElement;

      expect(navLi.textContent).toContain(`Game: ${fakeGameId}`);
    });

    it('should show number of players in sub-nav', () => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);

      fixture.detectChanges();
      let debugElement = fixture.debugElement.queryAll(By.css('nav li'));
      let navLi = debugElement[1].nativeElement;

      expect(navLi.textContent).toContain(`Players: ${fakeGame.numPlayers}`);
    });

    it('should show number of dice in sub-nav', () => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);

      fixture.detectChanges();
      let debugElement = fixture.debugElement.queryAll(By.css('nav li'));
      let navLi = debugElement[2].nativeElement;

      expect(navLi.textContent).toContain(`Dice in play: ${fakeGame.numDice}`);
    });

    it('should show current player number in sub-nav', () => {
      let fakeGameId = 'TestGame';

      component.getGameDetails(fakeGameId);
      component.game.currentPlayer = new Player({number: 1});

      fixture.detectChanges();
      let debugElement = fixture.debugElement.queryAll(By.css('nav li'));
      let navLi = debugElement[3].nativeElement;

      expect(navLi.textContent).toContain('Current Player: 1');
    });

  }); //end of get game details

  describe('Switch Player', () => {

    it('should switch to next player', () => {
      let playerNumber = 1;
      fakeGame.currentPlayer = new Player({number: playerNumber});

      component.switchPlayer();

      expect(component.game.currentPlayer.number).toEqual(playerNumber + 1);
    });

    it('should clear current player state on switch', () => {
      let playerNumber = 1;
      let playerHand = [2,3,4,5];
      fakeGame.currentPlayer = new Player({number: playerNumber, hand: playerHand});
      component.dieForBoard = [3, 3];
      component.dieSubmitted = true;

      component.switchPlayer();

      expect(fakeGame.currentPlayer.number).toEqual(playerNumber + 1);
      expect(fakeGame.currentPlayer.hand).not.toBe(playerHand);
      expect(component.dieForBoard.length).toEqual(0);
      expect(component.dieSubmitted).toBeFalsy();
    });

  }); //end of switching players

  describe('Submit Die To Board', () => {
    fakeGame.board = [];

    it('should put dice on board', () => {
      let testDie = 3;
      fakeGame.currentPlayer = new Player({number: 1, hand: [1,2,3,4,5]});
      component.submitDieToBoard(testDie);

      expect(component.dieForBoard.length).toEqual(1);
      expect(component.dieForBoard[0]).toEqual(3);
      expect(component.dieSubmitted).toBeTruthy();
    });

    it('should not put dice on board with 0 submitted', () => {
      let testDie = 0;
      component.dieSubmitted = false;

      component.submitDieToBoard(testDie);

      expect(component.game.board.length).toEqual(0);
      expect(component.dieSubmitted).toBeFalsy();
    });

  });//end of submit die to board

  describe('Make Claim', () => {

    it('should open modal on claim submission', fakeAsync(() => {
      let fakePlayer = 1;
      fakeGame.currentPlayer = new Player({number: fakePlayer});
      let fakeNumDice = 4;
      let fakeDiceValue = 6;

      fixture.detectChanges();
      component.makeClaim(fakeNumDice, fakeDiceValue);
      fixture.detectChanges();

      let debugElement = fixture.debugElement.query(By.css('#invalidClaimModal h4'));
      let modalH4 = debugElement.nativeElement;

      expect(fakeGame.actions.length).toBeGreaterThan(0);
      expect(modalH4.textContent).toContain('Invalid Claim');
      })
    );

  }); //end of make claim

  describe('Challenge', () => {
    it('should open challenge/game end modal congrats with inaccurate claim', () => {
      component.challenge();
      component.accurateClaim = false;

      fixture.detectChanges();
      let debugElement = fixture.debugElement.query(By.css('#challengeModal h3'));
      let modalH3 = debugElement.nativeElement;

      expect(modalH3.textContent).toContain('Congratulations!');
    });

    it('should open challenge/game end modal sorry with accurate claim', () => {
      component.challenge();
      component.accurateClaim = true;

      fixture.detectChanges();
      let debugElement = fixture.debugElement.query(By.css('#challengeModal h3'));
      let modalH3 = debugElement.nativeElement;

      expect(modalH3.textContent).toContain('Sorry, you\'ve lost this game');
    })

  }); //end of challenge

});
