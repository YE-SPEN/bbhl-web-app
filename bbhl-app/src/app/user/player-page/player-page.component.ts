import { Component } from '@angular/core';
import { Player } from '../../types';
import { PlayersService } from '../../services/players.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent {
  player!: Player;
  playerStats: Player[] = [];
  goalieStats: Player[] = [];
  year_joined = 2024;

  constructor(
    private playersService: PlayersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id');

    if (playerId) {
      this.playersService.getPlayer(playerId).subscribe(response => {
        this.player = response.player;
        this.playerStats = response.playerStats;
        this.year_joined = this.playerStats[this.playerStats.length-1].season;
        console.log(this.player);
        console.log(this.playerStats);
      });
      this.playersService.getGoalie(playerId).subscribe(response => {
        this.goalieStats = response.goalieStats;
        const goalie_year_joined = this.goalieStats[this.goalieStats.length-1].season;
        if (goalie_year_joined < this.year_joined) {
          this.year_joined = goalie_year_joined;
          console.log(this.goalieStats);
        }
      })

      this.reconcileGoalieSeasons();
    }
  }

  reconcileGoalieSeasons(): void {
    for (let goalieSeason of this.goalieStats) {
      for (let i = this.playerStats.length - 1; i >= 0; i--) {
        if (this.playerStats[i] === goalieSeason) {
          this.playerStats.splice(i, 1);
        }
      }
    }
  }
  
}
