import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SortingService } from 'src/app/services/sorting.service';
import { Game, Team } from 'src/app/types';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})

export class ResultsPageComponent implements OnInit {
  game: Game | null = null;
  matchup: Team[] = [];
  sortData: SortConfig[] = [
    { column: 'name', direction: 'desc' },
    { column: 'name', direction: 'desc' }
  ]

  constructor(
    private scheduleService: ScheduleService,
    private sortingService: SortingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const gameID = this.route.snapshot.paramMap.get('id');

    if (gameID) {
      this.scheduleService.getBoxscore(gameID)
        .subscribe(response => {
          this.game = response.game;
          console.log(this.game);

          if (this.game && response.teams) {
            const homeTeam = response.teams.find(team => team.name === response.game.home_team);
            const awayTeam = response.teams.find(team => team.name === response.game.away_team);

            if (homeTeam && awayTeam) {
              this.matchup = [homeTeam, awayTeam];
              console.log('Matchup Info:', this.matchup);

              if (response.boxscore) {
                this.matchup[0].roster = response.boxscore.filter(player => player.team === response.game.home_team);
                this.matchup[1].roster = response.boxscore.filter(player => player.team === response.game.away_team);
              }
            } else {
              console.error('Teams not found in response:', response.teams);
            }
          }
        });
    }
  }

  sortTable(column: string | null, index: number, direction: 'asc' | 'desc'): void {
    this.matchup[index].roster = this.sortingService.sort(this.matchup[index].roster, column, direction);
  }

  toggleSort(column: string, index: number): void {
    if (column === this.sortData[index].column) {
      this.sortData[index].direction = this.sortData[index].direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortData[index].column = column;
      this.sortData[index].direction = 'desc';
    }

    this.sortTable(this.sortData[index].column, index, this.sortData[index].direction);
  }

}

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}
