
import {TestBed, fakeAsync} from "@angular/core/testing";
import {GameService} from "./game.service";
import {Http, BaseRequestOptions, XHRBackend, Response,ResponseOptions} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Claim} from "../models/claimModel";
import {Event} from "../models/eventModel";
import {Game} from "../models/gameModel";
import {Player} from "../models/playerModel";
import {Action} from "../models/actionModel";

describe('Game Service', () => {
  let backend: MockBackend;
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        GameService,
        {
          deps: [
            MockBackend,
            BaseRequestOptions],
          provide: Http, useFactory: (
            backend: XHRBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }}]
    });

    service = TestBed.get(GameService);
    backend = TestBed.get(MockBackend);

  });

  function setupConnections(backend: MockBackend, options: any) {
    backend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.url === '/api/form') {
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);

        connection.mockRespond(response);
      }
    });
  }

  it('should create Game Service', () => {
    expect(service).toBeTruthy();
  });

  describe('Create Game', () => {
    it('should Create game', () => {
      let testPlayers = 2;
      let testDie = 5;

      service.CreateGame(testPlayers, testDie).subscribe(result => {
        expect(result.numPlayers).toEqual(testPlayers);
        expect(result.numDice).toEqual(testDie);
        expect(result._id).toBeTruthy();
      })
    });

  }); //end of create game

  describe('Get Details', () => {
    it('should get Game from server', () => {
      setupConnections(backend, {
        body: {
          "numPlayers": 2,
          "numDice": 4,
          "board": [],
          "actions": [],
          "playerHands": [
            [2,4,6],
            [1,3,5]
          ],
          "_id": "NYDEu16QBVHy3vFc"
        }
      });

      let testGameId = 'NYDEu16QBVHy3vFc';

      service.GetDetails(testGameId).subscribe((response) => {
        expect(response._id).toEqual(testGameId);
        expect(response.numPlayers).toEqual(2);
      })
    });

  }); //end of get details

  describe('Make Claim', () => {
    it('should make a claim', () => {

      let testGameId = 'TestGame';
      let testPlayer = 1;
      let testClaim = new Claim(testPlayer);
      testClaim.claimFace = 3;
      testClaim.claimNumber = 5;
      testClaim.moveNumber = 2;
      testClaim.moveFace = 6;
      service.game = new Game({
        players: [],
        playerHands: [],
        currentPlayer: new Player({number: 1, hand: []})
      });

      service.MakeClaim(testClaim).subscribe(result => {
        expect(result._id).toEqual(testGameId);
        expect(result.actions[0]).toBeTruthy();
        expect(result.actions[0].actionType).toEqual('claim');
      })
    });

  });// end of make claim

  describe('Challenge Claim', () => {
    it('should challenge claim', () => {
      service.game = new Game({currentPlayer: new Player({number: 1})});

      service.ChallengeClaim().subscribe(result => {
        expect(result).toEqual(true)
      });
    });

  });

  describe('Change Player', () => {
    it('should change current player to next highest', () => {
      service.game = new Game({
        currentPlayer: new Player({number: 1}),
        players: [new Player({number: 1}), new Player({number: 2})]
      });

      service.ChangePlayer();

      expect(service.game.currentPlayer.number).toEqual(2);
    });

    it('should change player to first with current as last player', () => {
      service.game = new Game({
        numPlayers: 2,
        currentPlayer: new Player({number: 2})
      });

      service.ChangePlayer();

      expect(service.game.currentPlayer.number).toEqual(1);
    });

    it('should set current to first player with null', () => {
      service.game = new Game({
        players: [new Player({number: 1}), new Player({number: 2})],
        currentPlayer: null
      });

      service.ChangePlayer();

      expect(service.game.currentPlayer).toEqual(service.game.players[0]);
    });

    it('should update player in players array', () => {
      let playersArray = [new Player({number: 1, hand: [1,2,3]}), new Player({number: 2})];
      service.game = new Game({
        currentPlayer: new Player({number: 1, hand: [4,5,6]}),
        players: playersArray
      });

      service.ChangePlayer();

      expect(service.game.currentPlayer).toEqual(playersArray[1]);
      expect(service.game.players[0].hand).toEqual(playersArray[0].hand);
    });

  }); //end of change player

  describe('Set Player Claims', () => {
    it('should set players claims', () => {
      service.game = new Game({
        actions: [new Action({player: 0, actionType: 'claim'})] //player number is the index
      });

      let testPlayer = new Player({number: 1});

      service.SetPlayerClaims(testPlayer);

      expect(testPlayer.claims).not.toBeNull();
      expect(testPlayer.claims.length).toEqual(1);
    });

    it('should not set claims not for that player', () => {
      service.game = new Game({
        actions: [new Action({player: 2, actionType: 'claim'})] //player number is the index
      });
      let testPlayer = new Player({number: 1});

      service.SetPlayerClaims(testPlayer);

      expect(testPlayer.claims.length).toEqual(0);
    });

  }); //end set player claims

  describe('Is Valid Claim', () => {
    it('should be valid with no current claim', () => {
      let fakeProposedClaim = new Claim();
      let fakeCurrentClaim = null;

      let isValid = GameService.isValidClaim(fakeProposedClaim, fakeCurrentClaim);

      expect(isValid).toBeTruthy();
    });

    it('should be valid with greater claim number', () => {
      let validClaim = new Claim({
        player: 1,
        claimNumber: 2
      });
      let currentClaim = new Claim({
        player: 2,
        claimNumber: 1 // less than proposed claim
      });

      let isValid = GameService.isValidClaim(validClaim, currentClaim);

      expect(isValid).toBeTruthy();
    });

    it('should be valid with same number - greater value', () => {
      let validClaim = new Claim({
        player: 1,
        claimNumber: 2,
        claimFace: 3
      });
      let currentClaim = new Claim({
        player: 2,
        claimNumber: 2, // same as proposed claim
        claimFace: 2
      });

      let isValid = GameService.isValidClaim(validClaim, currentClaim);

      expect(isValid).toBeTruthy();
    });

    it('should be invalid with less number', () => {
      let invalidClaim = new Claim({
        player: 1,
        claimNumber: 1
      });
      let currentClaim = new Claim({
        player: 2,
        claimNumber: 2 // greater than proposed claim
      });

      let isValid = GameService.isValidClaim(invalidClaim, currentClaim);

      expect(isValid).toBeFalsy();
    });

  }); //end is valid claim

  describe('Handle Errors', () => {
    it('should not create an event on success', fakeAsync(() => {
      setupConnections(backend, {
        body: {},
        status: 200
      });

      service.CreateGame(2, 3);

      service.EventsStream$.subscribe((event: Event) => {
        expect(event.HasError).toBeFalsy();
      });
    }));

    it('should create an event on error with code', fakeAsync(() => {
      setupConnections(backend, {
        body: {},
        status: 404
      });

      service.CreateGame(2, 3);

      service.EventsStream$.subscribe((event: Event) => {
        expect(event.HasError).toBeTruthy();
        expect(event.Code).toEqual(404);
      });
    }));

  }); //end of handle errors

});
