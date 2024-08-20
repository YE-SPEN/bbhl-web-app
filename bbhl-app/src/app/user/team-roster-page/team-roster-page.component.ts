import { Component, OnInit } from '@angular/core';
import { Player, Team } from '../../types';
import { TeamsService } from '../../services/teams.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-roster-page',
  templateUrl: './team-roster-page.component.html',
  styleUrls: ['./team-roster-page.component.css']
})
export class TeamRosterPageComponent implements OnInit {
  roster: Player[] = [];
  goalies: Player[] =[];
  team!: Team;
  seasons: number[] = [];
  selectedSeason: number = 0;
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';


  constructor(
    private teamService: TeamsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getSeasons();
  }

  getSeasons(): void {
    const teamID = this.route.snapshot.paramMap.get('id');
    if (teamID) {
      this.teamService.getSeasons(teamID)
      .subscribe(response => {
          for (let i = 0; i < response.seasons.length; ++i) {
            this.seasons[i] = response.seasons[i].season;
          }
          this.selectedSeason = this.seasons[0];
          this.getRosterBySeason();
      })
    }
  }

  getRosterBySeason(): void {
    const teamID = this.route.snapshot.paramMap.get('id');

    if (teamID) {
      this.teamService.getTeamBySeason(teamID, this.selectedSeason).subscribe({
        next: response => {
          console.log('Received response:', response);
          this.team = response.team[0];
          this.roster = response.roster;
          this.goalies = response.goalies;
          console.log(this.team, this.roster, this.goalies);
        },
        error: error => {
          console.error('Error fetching team data:', error);
        }
      });
    }
  }

  sortTable(column: string | null, direction: 'asc' | 'desc'): void {
    if (column) {
      this.roster.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
  }  

  toggleSort(column: string): void {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.sortTable(this.sortColumn, this.sortDirection);
  }
}
