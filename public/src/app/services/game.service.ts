import {Observable} from "rxjs";
import {Game} from "../models/gameModel";
import {Http, Response, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Claim} from "../models/claimModel";

@Injectable()
export class GameService {

  private gameUrl: string = 'http://localhost:8080/games';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  CreateGame(players: number, die: number): Observable<Game> {
    console.log('Creating new game with ' + players + ' players and ' + die + ' die.');

    return this.http.post(this.gameUrl, JSON.stringify({numPlayers: players, numDice: die}), {headers: this.headers})
      .map((response: Response) => {return response.json()})
      .catch((error: any) => {
        return Observable.throw(error);
      })
  }

  GetDetails(gameId: string): Observable<Game> {
    return this.http.get(this.gameUrl + '/' + gameId)
      .map((response: Response) => {return response.json()})
      .catch((error: any) => {
        return Observable.throw(error)
      });
  }

  makeClaim(gameId: string, claim: Claim): Observable<Game> {
    return this.http.post(this.gameUrl + '/' + gameId + '/claim', JSON.stringify(claim), {headers: this.headers})
      .map((response: Response) => {return response.json().document})
      .catch((error: any) => {
        return Observable.throw(error)
      })
  }

  challengeClaim(gameId: string, player: number): Observable<boolean> {
    return this.http.post(`${this.gameUrl}/${gameId}/challenge`, JSON.stringify({player: player}), {headers: this.headers})
      .map((response: Response) => {return response.json()})
      .catch((error: any) => {
        return Observable.throw(error)
      })
    }
  }
