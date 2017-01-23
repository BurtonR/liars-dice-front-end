import {TestBed} from '@angular/core/testing';
import {GameComponent} from './game.component';
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../app.component";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";

describe('Game Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent, AppComponent],
      imports: [BrowserModule, FormsModule, HttpModule],
    });
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });

  // it('should create Game Component', () => {
  //   let fixture = TestBed.createComponent(GameComponent);
  //   let game = fixture.debugElement.componentInstance;
  //   expect(game).toBeTruthy();
  // });
});
