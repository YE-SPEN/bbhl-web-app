import { Component } from '@angular/core';
import { Team } from '../types';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-standings-page',
  templateUrl: './standings-page.component.html',
  styleUrls: ['./standings-page.component.css']
})
export class StandingsPageComponent {
  teams: Team[] = [];
  seasons: number[] = [2023, 2022, 2021];
  selectedSeason: number = 2023;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

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
