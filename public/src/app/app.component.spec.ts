/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {RouterTestingModule} from "@angular/router/testing";
import {EventHandlerComponent} from "./event-handler/event-handler.component";
import {GameService} from "./services/game.service";
import {Http, BaseRequestOptions, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";

describe('App: Public', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        EventHandlerComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ],
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
        }}
        ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should render 'Bypass Mobile: Liar's Dice' in brand-logo tag`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.brand-logo').textContent).toEqual('Bypass Mobile: Liar\'s Dice');
  }));
});
