import {Observable, Subject} from "rxjs";
import {Game} from "../models/gameModel";
import {Http, Response, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Claim} from "../models/claimModel";
import {Event} from "../models/eventModel";
import {Player} from "../models/playerModel";

@Injectable()
export class GameService {

  private gameUrl: string = 'http://localhost:8080/games';
  private headers = new Headers({'Content-Type': 'application/json'});
  private events: Subject<Event>;
  game: Game;
  EventsStream$: Observable<Event>;

  constructor(private http: Http) {
    this.events = new Subject<Event>();
    this.EventsStream$ = this.events.asObservable();
  }

  CreateGame(players: number, die: number): Observable<Game> {
    console.log(`Creating new game with ${players} players and ${die} die.`);

    return this.http.post(this.gameUrl, JSON.stringify({numPlayers: players, numDice: die}), {headers: this.headers})
      .map((response: Response) => {
        this.game = new Game(response.json());
        return this.game;
      })
      .catch((error: any) => this.handleHttpError(error));
  }

  GetDetails(gameId: string): Observable<Game> {
    return this.http.get(`${this.gameUrl}/${gameId}`)
      .map((response: Response) => {
        let detail = new Game(response.json());
        this.game = detail;
        return detail;
      })
      .catch((error: any) => this.handleHttpError(error));
  }

  MakeClaim(claim: Claim): Observable<Game> {
    let currentPlayer = this.game.currentPlayer;
    let allPlayers = this.game.players;
    claim.player = currentPlayer.number - 1; //because the api uses the index

    if(GameService.isValidClaim(claim, this.game.currentClaim)) {
      return this.http.post(`${this.gameUrl}/${this.game._id}/claim`, JSON.stringify(claim), {headers: this.headers})
          .map((response: Response) => {  // TODO: this may be getting a little out of hand...
            this.game = new Game(response.json().document);
            this.game.currentClaim = claim;
            this.game.players = allPlayers;
            currentPlayer.hand = this.game.playerHands[currentPlayer.number - 1];
            this.game.currentPlayer = currentPlayer;
            this.game.currentPlayer = this.SetPlayerClaims(this.game.currentPlayer);
            return this.game;
          })
          .catch((error: any) => this.handleHttpError(error));
    }
    else {
      return Observable.of(this.game);
    }
  }

  ChallengeClaim(): Observable<boolean> {
    return this.http.post(`${this.gameUrl}/${this.game._id}/challenge`,
        JSON.stringify({player: this.game.currentPlayer.number - 1}), //because we need the index of the player
        {headers: this.headers})
      .map((response: Response) => {return response.json()})
      .catch((error: any) => this.handleHttpError(error));
  }

  ChangePlayer(): Observable<Game> {
    let currentPlayer = this.game.currentPlayer;

    //update Game Players first
    if(currentPlayer) {
      this.game.players[currentPlayer.number - 1] = currentPlayer;
    }

    if(currentPlayer == null || currentPlayer.number === this.game.numPlayers){
      currentPlayer = this.game.players[0];
    } else {
      let nextPlayerIndex = this.game.players.findIndex(p => p.number == currentPlayer.number) + 1;
      currentPlayer = this.game.players[nextPlayerIndex];
    }

    this.game.currentPlayer = currentPlayer;
    return Observable.of(this.game);
  }

  SetPlayerClaims(player: Player): Player {
    let allClaims = this.game.actions.filter(x => x.actionType == 'claim');

    player.claims = allClaims.filter(x => x.player == player.number - 1);

    return player;
  }

  static isValidClaim(proposedClaim: Claim, currentClaim: Claim): boolean {
    if(!currentClaim) {
      return true;
    }

    if(proposedClaim.claimNumber < currentClaim.claimNumber){
      return false;
    }
    else if(proposedClaim.claimNumber === currentClaim.claimNumber) {
      return proposedClaim.claimFace > currentClaim.claimFace;
    }
    else if( proposedClaim.claimNumber > currentClaim.claimNumber) {
      return true;
    }
  }

  private handleHttpError(response: Response) {
    let event = new Event(true);

    console.log(response);

    try {
      if(response.status === 404) {
        event.Code = 404;
        event.Message = "Data not found";
      } else if (response.status === 500) {
        event.Code = 500;
        event.Message = <any>response.json();
      } else {
        let responseJson = <any>response.json();
        let message = "There was trouble with the game";

        event.Message = (responseJson.Message) ? responseJson.Message : message;
      }
    } catch (jsonError) {
      event.Code = -1;
      event.Message = "Something bad happened..."
    }

    this.events.next(event);
    return Observable.throw(event);
  }
}
