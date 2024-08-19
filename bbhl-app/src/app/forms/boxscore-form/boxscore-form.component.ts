import { Component, TemplateRef } from '@angular/core';
import { Player, Team, Game } from 'src/app/types';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TeamsService } from 'src/app/services/teams.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-boxscore-form',
  templateUrl: './boxscore-form.component.html',
  styleUrl: './boxscore-form.component.css'
})

export class BoxscoreFormComponent {
  selectedGame: Game | null = null;
  upcomingGames: Game[] = [];
  matchup: Team[] = [];
  modalRef!: BsModalRef;

  constructor(
    private http: HttpClient,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.scheduleService.getUpcomingGames()
    .subscribe(response => {
      this.upcomingGames = response.upcomingGames;
    });
  }

  generateBoxscore(): void {
    if (this.selectedGame != null) {
        const gameID = this.selectedGame.game_id;

        this.teamService.getMatchup(gameID)
        .subscribe(response => {
            if (response.teams) {
                const homeTeam = response.teams.find(team => team.name === this.selectedGame?.home_team);
                const awayTeam = response.teams.find(team => team.name === this.selectedGame?.away_team);

                if (homeTeam && awayTeam) {
                    this.matchup[0] = homeTeam;
                    this.matchup[1] = awayTeam;

                    if (response.rosters) {
                        this.matchup[0].roster = response.rosters.filter(player => player.team === this.selectedGame?.home_team);
                        this.matchup[1].roster = response.rosters.filter(player => player.team === this.selectedGame?.away_team);
                        this.initializeStats();
                    }
                } else {
                    console.error('Teams not found in response:', response.teams);
                }
            }
        });
    }
  }

  initializeStats(): void {
    for (let i = 0; i < this.matchup.length; ++i) {
      this.matchup[i].shots = 0;
      for (let j = 0; j < this.matchup[i].roster.length; ++j) {
        this.matchup[i].roster[j].goals = 0;
        this.matchup[i].roster[j].assists = 0;
        this.matchup[i].roster[j].points = 0;
        this.matchup[i].roster[j].gwg = 0;
        this.matchup[i].roster[j].pims = 0;
        this.matchup[i].roster[j].isAbsent = false;
      } 
    }
  }

  incrementShots(index: number): void {
    if (this.matchup[index].shots == null) {
        this.matchup[index].shots = 0;
    }
    this.matchup[index].shots += 1;
    console.log(this.selectedGame);
  }

  decrementShots(index: number): void {
    if (this.matchup[index].shots > 0) {
        this.matchup[index].shots -= 1;
        console.log(this.selectedGame);
    }
  }

  updateScore(team: Team): void {
    if (this.selectedGame) {
      if (team.name === this.selectedGame.home_team) {
        this.selectedGame.home_score = this.totalScore(team);
      }
      else {
        this.selectedGame.away_score = this.totalScore(team);
      }
    }
  }

  totalScore(team: Team): number {
    let score = 0;
    for (let i =0; i < team.roster.length; ++i) {
      score += team.roster[i].goals;
    }
    return score;
  }

  getStatTotal(stat: string, index: number): number {
    let total = 0;
    switch (stat) {
      case 'goals':
        for (let i = 0; i < this.matchup[index].roster.length; ++i) {
          total += this.matchup[index].roster[i].goals;
        }
        break;
      case 'assists':
        for (let i = 0; i < this.matchup[index].roster.length; ++i) {
          total += this.matchup[index].roster[i].assists;
        }
        break;
      case 'pims':
        for (let i = 0; i < this.matchup[index].roster.length; ++i) {
          total += this.matchup[index].roster[i].pims;
        }
        break;
      case 'gwg':
        for (let i = 0; i < this.matchup[index].roster.length; ++i) {
          total += this.matchup[index].roster[i].gwg;
        }
        break;
    }   
    return total;
  }

  statChange(player: Player, team: Team, event: Event, stat: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    this.updateStat(player, team, value, stat);
  }

  updateStat(player: Player, team: Team, value: number, stat: string): boolean {
    for (let i = 0; i < team.roster.length; i++) {
      if (team.roster[i].name === player.name) {
        switch (stat) {
          case 'goals':
            team.roster[i].goals = value;
            team.roster[i].points = team.roster[i].goals + team.roster[i].assists;
            this.updateScore(team);
            break;
          case 'assists':
            team.roster[i].assists = value;
            team.roster[i].points = team.roster[i].goals + team.roster[i].assists;
            break;
          case 'gwg':
            team.roster[i].gwg = value;
            break;
          case 'pims':
            team.roster[i].pims = value;
            break;
          default:
            console.error('Invalid stat type');
        }
        console.log(player, this.selectedGame);
        return true;
      }
    }
    return false;
  }

  toggleAbsent(player: any): void {
    player.isAbsent = !player.isAbsent;
    console.log(player);
  }

  recordPlayerStats(player: Player, game_id: string) {
    const stats = {
      game_id: game_id,
      player: player.name,
      goals: player.goals,
      assists: player.assists,
      points: player.points, 
      pims: player.pims,
      gwg: player.gwg
    };

    this.http.post('/api/admin-hub/player-stats', stats)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error('Error Recording Player Stats', error);
      });
  }

  recordTeamStats(): void {
    const stats = {
      game_id: this.selectedGame?.game_id,
      home_score: this.selectedGame?.home_score,
      home_shots: this.matchup[0].shots,
      away_score: this.selectedGame?.away_score,
      away_shots: this.matchup[1].shots
    }
    
    this.http.post('/api/admin-hub/team-stats', stats)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error('Error recording team stats', error);
      });
  }

  finalizeGame(): void {
    if (this.selectedGame) {
      for (let i = 0; i < this.matchup.length; ++i) {
        for (let j = 0; j < this.matchup[i].roster.length; ++j) {
          this.recordPlayerStats(this.matchup[i].roster[j], this.selectedGame?.game_id);
        } 
      }
      this.recordTeamStats();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    //this.action = '';
    this.selectedGame = null;
  }

}
