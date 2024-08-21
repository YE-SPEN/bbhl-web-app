import { Component, OnInit } from '@angular/core';
import { Game, Team } from '../../types';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  seasons: number[] = [2025, 2024, 2023];
  selectedSeason: number = 2024;
  allGames: Game[] = [];
  pastGames: Game[] = [];
  filteredPastGames: Game[] = [];
  upcomingGames: Game[] = [];
  filteredUpcomingGames: Game[] = [];
  teamNames: Team[] = [];
  selectedTeam = '';
  currentPage = 1;
  totalPages!: number;
  pageSize = 16;

  constructor(
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit(): void {
    this.getScheduleBySeason(this.selectedSeason);
  }

  getScheduleBySeason(season: number): void {
    this.scheduleService.getSchedule(season)
      .subscribe(response => {
        this.allGames = response.schedule;
        this.teamNames = response.teamNames;

        // Separate games based on status
        this.upcomingGames = this.allGames.filter(game => game.status === 'scheduled');
        this.pastGames = this.allGames.filter(game => game.status === 'complete');

        this.filteredPastGames = this.pastGames;
        this.filteredUpcomingGames = this.upcomingGames;
        this.totalPages = Math.ceil(this.filteredPastGames.length / this.pageSize);
      });
  }

  filterByTeam(teamName: string): void {
    this.filteredPastGames = this.pastGames.filter( game =>
      game.home_team.toLowerCase().includes(teamName.toLowerCase()) ||
      game.away_team.toLowerCase().includes(teamName.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredPastGames.length / this.pageSize);
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

  setPage(page: number): void {
    this.currentPage = page;
  }
  
}
