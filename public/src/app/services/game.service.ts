import {Observable, Subject} from "rxjs";
import {Game} from "../models/gameModel";
import {Http, Response, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Claim} from "../models/claimModel";
import {Event} from "../models/eventModel";

@Injectable()
export class GameService {

  private gameUrl: string = 'http://localhost:8080/games';
  private headers = new Headers({'Content-Type': 'application/json'});
  private events: Subject<Event>;
  public EventsStream$: Observable<Event>;

  constructor(private http: Http) {
    this.events = new Subject<Event>();
    this.EventsStream$ = this.events.asObservable();
  }

  CreateGame(players: number, die: number): Observable<Game> {
    console.log('Creating new game with ' + players + ' players and ' + die + ' die.');

    return this.http.post(this.gameUrl, JSON.stringify({numPlayers: players, numDice: die}), {headers: this.headers})
      .map((response: Response) => {return response.json()})
      .catch((error: any) => this.handleHttpError(error));
  }

  GetDetails(gameId: string): Observable<Game> {
    return this.http.get(this.gameUrl + '/' + gameId)
      .map((response: Response) => {return response.json()})
      .catch((error: any) => this.handleHttpError(error));
  }

  MakeClaim(gameId: string, claim: Claim): Observable<Game> {
    return this.http.post(this.gameUrl + '/' + gameId + '/claim', JSON.stringify(claim), {headers: this.headers})
      .map((response: Response) => {return response.json().document})
      .catch((error: any) => this.handleHttpError(error));
  }

  ChallengeClaim(gameId: string, player: number): Observable<boolean> {
    return this.http.post(`${this.gameUrl}/${gameId}/challenge`, JSON.stringify({player: player}), {headers: this.headers})
      .map((response: Response) => {return response.json()})
      .catch((error: any) => this.handleHttpError(error));
    }

  private handleHttpError(response: Response) {
    let event = new Event(true);

    try {
      if(response.status === 404) {
        event.Code = 404;
        event.Message = "Data not found";
      } else if (response.status === 500) {
        event.Code = 500;
        event.Message = <any>response.json();
      } else {
        let responseJson = <any>response.json();
        let message = "There was trouble with the server";

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
