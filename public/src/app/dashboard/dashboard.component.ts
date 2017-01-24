import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private players: number = 2;
  private die: number = 1;

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {

  }

  createGame(): void {
    this.gameService.CreateGame(this.players, this.die)
      .subscribe(game => {
        console.log('New Game Id: ' + game._id);
        this.router.navigate(['/game/', game._id])
      });
  }
}
