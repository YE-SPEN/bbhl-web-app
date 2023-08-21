import { Component, OnInit } from '@angular/core';
import { Player, Team } from '../types';
import { TeamsService } from '../teams.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-roster-page',
  templateUrl: './team-roster-page.component.html',
  styleUrls: ['./team-roster-page.component.css']
})
export class TeamRosterPageComponent implements OnInit {
  roster: Player[] = [];
  team!: Team;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private teamService: TeamsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const teamName = this.route.snapshot.paramMap.get('id');

    if (teamName) {
      this.teamService.getTeam(teamName).subscribe(response => {
        this.team = response.team;
        this.roster = response.roster;
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
