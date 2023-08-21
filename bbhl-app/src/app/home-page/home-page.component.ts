import { Component } from '@angular/core';
import { Game, Player } from '../types';
import { ScheduleService } from '../schedule.service';
import { PlayersService } from '../players.service';
import { SchedulePageComponent } from '../schedule-page/schedule-page.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  weeklyGames: Game[] = [];
  leagueLeaders: Player[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private playerService: PlayersService,
  ) { }

  ngOnInit(): void {
    
  }
}
