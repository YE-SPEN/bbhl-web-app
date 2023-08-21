import { Component, OnInit } from '@angular/core';
import { Game, Team } from '../types';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  allGames: Game[] = [];
  filteredGames: Game[] = [];
  teamNames: Team[] = [];
  selectedTeam = '';
  currentPage = 1;
  totalPages!: number;
  pageSize = 15;

  constructor(
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit(): void {
    this.scheduleService.getSchedule()
      .subscribe(response => {
        this.allGames = response.schedule;
        this.teamNames = response.teamNames;
        this.filteredGames = this.allGames;
        this.totalPages = Math.ceil(this.filteredGames.length / this.pageSize);
      });
  }

  filterByTeam(teamName: string): void {
    this.filteredGames = this.allGames.filter( game =>
      game.home_team.toLowerCase().includes(teamName.toLowerCase()) ||
      game.away_team.toLowerCase().includes(teamName.toLowerCase())
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
}
