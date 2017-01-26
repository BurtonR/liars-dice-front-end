import {TestBed, ComponentFixture} from '@angular/core/testing';
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../app.component";
import {BrowserModule, By} from "@angular/platform-browser";
import {HttpModule, BaseRequestOptions} from "@angular/http";
import {MaterializeModule} from "angular2-materialize";
import {RouterTestingModule} from "@angular/router/testing";
import {EventHandlerComponent} from "../event-handler/event-handler.component";
import {MockBackend} from "@angular/http/testing";
import {GameService} from "../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Game} from "../models/gameModel";
import {Observable} from "rxjs";
import {DashboardComponent} from "./dashboard.component";

let component: DashboardComponent;
let fixture: ComponentFixture<DashboardComponent>;
let testService: GameService;

let router = {
  navigate: jasmine.createSpy('navigate')
};

let fakeService = {
  CreateGame(players: number, die: number): Observable<Game> {
    let fakeGame = new Game({_id: 'FakeGame',numPlayers: players, numDice: die});
    return Observable.of(fakeGame);
  }
};

describe('Dashboard Component', () => {
  let testRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
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
        BaseRequestOptions,
        MockBackend,
        {provide: GameService, useValue: fakeService},
        {provide: Router, useValue: router}
      ]
    });

    testRoute = TestBed.get(RouterTestingModule);
    testService = TestBed.get(GameService);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should display input field for players', () => {
    let debugElement = fixture.debugElement.queryAll(By.css('#players'));
    let playerInput = debugElement[0].nativeElement;

    expect(playerInput).toBeTruthy();
    expect(playerInput.placeholder).toContain('Enter at least 2 Players');
  });

  it('should display input field for dice', () => {
    let debugElement = fixture.debugElement.queryAll(By.css('#dice'));
    let playerInput = debugElement[0].nativeElement;

    expect(playerInput).toBeTruthy();
    expect(playerInput.placeholder).toContain('Enter the number of dice to play with');
  });

  it('should redirect on create game', () => {
    let fakeGameId = 'FakeGame';
    component.createGame();

    expect(router.navigate).toHaveBeenCalledWith(['/game/', fakeGameId]);
  });

});
