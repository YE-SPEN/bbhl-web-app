import { Component } from '@angular/core';
import { Player } from '../../types';
import { PlayersService } from '../../players.service';

@Component({
  selector: 'app-player-stats-page',
  templateUrl: './player-stats-page.component.html',
  styleUrls: ['./player-stats-page.component.css']
})

export class PlayerStatsPageComponent {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  seasons: number[] = [2024, 2023, 2020, 2018, 2017];
  selectedSeason!: number;
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';


  constructor(
    private playersService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.selectedSeason = 2024;
    this.getPlayerStatsBySeason();
  }

  getPlayerStatsBySeason(): void {
    this.playersService.getAllPlayers(this.selectedSeason)
      .subscribe(players => {
        this.players = players;
        this.filteredPlayers = players;
        this.sortTable(this.sortColumn, this.sortDirection);
        this.totalPages = Math.ceil(this.players.length / this.pageSize);
      });
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

  sortTable(column: string | null, direction: 'asc' | 'desc'): void {
    if (column) {
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
  }  

  toggleSort(column: string): void {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.currentPage = 1;
    this.sortTable(this.sortColumn, this.sortDirection);
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

