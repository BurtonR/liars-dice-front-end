import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize'
import { AppComponent } from './app.component';
import {Routes, RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {GameComponent} from "./game/game.component";
import {GameService} from "./services/game.service";
import {EventHandlerComponent} from "./event-handler/event-handler.component";

const liarsDiceRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'game/:id', component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameComponent,
    EventHandlerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(liarsDiceRoutes),
    MaterializeModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
