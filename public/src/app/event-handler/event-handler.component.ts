import {Component} from "@angular/core";
import {Event} from "../models/eventModel";
import {GameService} from "../services/game.service";


@Component({
  selector: 'event-handler',
  templateUrl: 'event-handler.component.html',
  styleUrls: ['event-handler.component.css']
})

export class EventHandlerComponent {
  model: Event;

  constructor(private gameService: GameService)
  { this.model = new Event(); }

  ngOnInit() {
    this.gameService.EventsStream$.subscribe((event: Event) => {
      this.model = event;
    });
  }
}
