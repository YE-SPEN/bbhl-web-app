import { Component } from '@angular/core';
import { Game, Player } from '../../types';
import { ScheduleService } from '../../services/schedule.service';
import { PlayersService } from '../../services/players.service';


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
    this.scheduleService.getRecentGames()
      .subscribe(response => {
        this.weeklyGames = response.recentGames;
      });
    this.playerService.getLeaders()
    .subscribe(response => {
      this.leagueLeaders = response.leagueLeaders;
    })
  }
}
