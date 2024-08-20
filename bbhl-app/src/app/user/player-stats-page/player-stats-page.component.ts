import { Component } from '@angular/core';
import { Player } from '../../types';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-player-stats-page',
  templateUrl: './player-stats-page.component.html',
  styleUrls: ['./player-stats-page.component.css']
})

export class PlayerStatsPageComponent {
  players: Player[] = [];
  goalies: Player[] = [];
  filteredPlayers: Player[] = [];
  seasons: number[] = [2024, 2023, 2020, 2018, 2017];
  selectedSeason!: number;
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  sortColumn: string | null = 'points';
  sortColumnG: string | null = 'wins';
  sortDirection: 'asc' | 'desc' = 'desc';
  sortDirectionG: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';


  constructor(
    private playersService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.selectedSeason = 2024;
    this.getPlayerStatsBySeason();
  }

  getPlayerStatsBySeason(): void {
    this.playersService.getPlayersBySeason(this.selectedSeason)
      .subscribe(response => {
        this.players = response.players;
        this.filteredPlayers = response.players;
        this.sortTable('players', this.sortColumn, this.sortDirection);
        this.totalPages = Math.ceil(this.players.length / this.pageSize);
      });
    
    this.playersService.getGoaliesBySeason(this.selectedSeason)
      .subscribe(response => {
        this.goalies = response.goalies;
      })
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

  sortTable(table: 'players' | 'goalies', column: string | null, direction: 'asc' | 'desc'): void {
    if (table === 'players' && column) {
      this.players.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    if (table === 'goalies' && column) {
      this.goalies.sort((a, b) => {
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

  toggleSort(table: 'players' | 'goalies', column: string): void {
    if (table === 'players') { 
      if (column === this.sortColumn) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'desc';
      }
      this.currentPage = 1;
      this.sortTable('players', this.sortColumn, this.sortDirection);
    }

    if (table === 'goalies') { 
      if (column === this.sortColumnG) {
        this.sortDirectionG = this.sortDirectionG === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumnG = column;
        this.sortDirectionG = 'desc';
      }
      this.sortTable('goalies', this.sortColumnG, this.sortDirectionG);
    }
  }
  
  searchPlayers(): void {
    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredPlayers = [...this.players];
  }

}

