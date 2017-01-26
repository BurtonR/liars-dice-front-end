import {TestBed, fakeAsync, ComponentFixture, inject} from '@angular/core/testing';
import {BaseRequestOptions} from "@angular/http";
import {EventHandlerComponent} from "./event-handler.component";
import {MockBackend} from "@angular/http/testing";
import {GameService} from "../services/game.service";
import {Observable, Subject} from "rxjs";
import {Event} from "../models/eventModel";
import {Injectable} from "@angular/core";
import {By} from "@angular/platform-browser";
import anything = jasmine.anything;

let component: EventHandlerComponent;
let fixture: ComponentFixture<EventHandlerComponent>;

@Injectable()
export class fakeService {
  private events: Subject<Event>;
  public EventsStream$: Observable<Event>;

  constructor() {
    this.events = new Subject<Event>();
    this.EventsStream$ = this.events.asObservable();
  }

  set MakeEvent(event: Event) {
    this.events.next(event);
  }
}

let service: fakeService;

describe('Event-Handler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventHandlerComponent
      ],
      imports: [],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {provide: GameService, useClass: fakeService}
      ]
    });

    service = TestBed.get(GameService);

    fixture = TestBed.createComponent(EventHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create event-handler', () => {
    expect(component).toBeTruthy();
  });

  it('should show error with HasError = true', inject([GameService], fakeAsync((svc) => {
      svc.MakeEvent = {HasError: true};

      fixture.detectChanges();
      let debugElement = fixture.debugElement.query(By.css('legend'));
      let div = debugElement.nativeElement;

      expect(div.textContent).toContain('Error!');
    })
  ));

  it('should show info with HasError = false', inject([GameService], fakeAsync((svc) => {
      svc.MakeEvent = {HasError: false};

      fixture.detectChanges();
      let debugElement = fixture.debugElement.query(By.css('legend'));
      let div = debugElement.nativeElement;

      expect(div.textContent).toContain('Info');
    })
  ));

});
