import { Component } from '@angular/core';
import { Team } from '../../types';
import { TeamsService } from '../../services/teams.service';

@Component({
  selector: 'app-standings-page',
  templateUrl: './standings-page.component.html',
  styleUrls: ['./standings-page.component.css']
})
export class StandingsPageComponent {
  teams: Team[] = [];
  seasons: number[] = [2025, 2024, 2023, 2022, 2020, 2019, 2018, 2017];
  selectedSeason: number = 2024;
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private teamsService: TeamsService,
  ) { }

  ngOnInit(): void {
    this.getStandingsBySeason();
  }

  getStandingsBySeason(): void {
    this.teamsService.getAllTeams(this.selectedSeason)
    .subscribe(teams => {
      this.teams = teams;
      this.sortTable(this.sortColumn, this.sortDirection);
    })
  }

  sortTable(column: string | null, direction: 'asc' | 'desc'): void {
    if (column) {
      this.teams.sort((a, b) => {
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
