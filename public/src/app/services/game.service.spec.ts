//
// import {TestBed, getTestBed} from "@angular/core/testing";
// import {GameService} from "./game.service";
// import {Http, BaseRequestOptions, XHRBackend, Response,ResponseOptions} from "@angular/http";
// import {MockBackend, MockConnection} from "@angular/http/testing";
// import {Claim} from "../models/claimModel";
//
// describe('Game Service', () => {
//   let backend: MockBackend;
//   let service: GameService;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         BaseRequestOptions,
//         MockBackend,
//         GameService,
//         {
//           deps: [
//             MockBackend,
//             BaseRequestOptions],
//           provide: Http, useFactory: (
//             backend: XHRBackend,
//             defaultOptions: BaseRequestOptions) => {
//             return new Http(backend, defaultOptions);
//           }}]
//     });
//
//     const testBed = getTestBed();
//     backend = testBed.get(MockBackend);
//     service = testBed.get(GameService);
//   });
//
//   function setupConnections(backend: MockBackend, options: any) {
//     backend.connections.subscribe((connection: MockConnection) => {
//       if (connection.request.url === '/api/form') {
//         const responseOptions = new ResponseOptions(options);
//         const response = new Response(responseOptions);
//
//         connection.mockRespond(response);
//       }
//     });
//   }
//
//   it('should pass Game Service', () => {
//     expect(true).toBeTruthy();
//   });
//
//   it('should create Game Service', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should Create game', () => {
//     let testPlayers = 2;
//     let testDie = 5;
//
//     service.CreateGame(testPlayers, testDie).subscribe(result => {
//       expect(result.numPlayers).toEqual(testPlayers);
//       expect(result.numDice).toEqual(testDie);
//       expect(result._id).toBeTruthy();
//     })
//   });
//
//   it('should get Game from server', () => {
//     setupConnections(backend, {
//       body: {
//         "numPlayers": 2,
//         "numDice": 4,
//         "board": [],
//         "actions": [],
//         "playerHands": [
//           [2,4,6],
//           [1,3,5]
//         ],
//         "_id": "NYDEu16QBVHy3vFc"
//       }
//     });
//
//     let testGameId = 'NYDEu16QBVHy3vFc';
//
//     service.GetDetails(testGameId).subscribe((response) => {
//       expect(response._id).toEqual(testGameId);
//       expect(response.numPlayers).toEqual(2);
//     })
//   });
//
//   it('should log an error to the console on error', () => {
//     setupConnections(backend, {
//       body: { error: `I'm afraid I've got some bad news!` },
//       status: 500
//     });
//     spyOn(console, 'error');
//
//     service.GetDetails('NYDEu16QBVHy3vFc').subscribe(null, () => {
//       expect(console.error).toHaveBeenCalledWith(`I'm afraid I've got some bad news!`);
//     });
//   });
//
//   it('should make a claim', () => {
//
//     let testGameId = 'TestGame';
//     let testPlayer = 1;
//     let testClaim = new Claim(testPlayer);
//     testClaim.claimFace = 3;
//     testClaim.claimNumber = 5;
//     testClaim.moveNumber = 2;
//     testClaim.moveFace = 6;
//
//     service.MakeClaim(testClaim).subscribe(result => {
//       expect(result._id).toEqual(testGameId);
//       expect(result.actions[0]).toBeTruthy();
//       expect(result.actions[0].actionType).toEqual('claim');
//     })
//   });
//
//   it('should challenge claim', () => {
//     let testGameId = 'TestGame';
//     let testPlayer = 1;
//
//     service.ChallengeClaim().subscribe(result => {
//       expect(result).toEqual(true)
//     });
//   });
//
// });
