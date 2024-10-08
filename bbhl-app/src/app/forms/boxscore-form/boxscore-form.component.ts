import { Component, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Player, Team, Game } from 'src/app/types';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TeamsService } from 'src/app/services/teams.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

interface Warning {
  message: string,
  isRed: boolean
}

@Component({
  selector: 'app-boxscore-form',
  templateUrl: './boxscore-form.component.html',
  styleUrl: './boxscore-form.component.css'
})

export class BoxscoreFormComponent {
  @Output() actionCompleted = new EventEmitter<{ message: string, success: boolean }>();
  selectedGame: Game | null = null;
  upcomingGames: Game[] = [];
  matchup: Team[] = [];
  modalRef!: BsModalRef;
  isFinal: boolean = false;
  warnings: Warning[] = [];

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
      console.log(this.upcomingGames);
    });
  }

  generateBoxscore(): void {
    if (this.selectedGame != null) {
        const gameID = this.selectedGame.game_id;
        const year = this.selectedGame.season;

        this.teamService.getMatchup(gameID, year)
        .subscribe(response => {
            if (response.teams) {
                const homeTeam = response.teams.find(team => team.name === this.selectedGame?.home_team);
                const awayTeam = response.teams.find(team => team.name === this.selectedGame?.away_team);

                if (homeTeam && awayTeam) {
                    this.matchup[0] = homeTeam;
                    this.matchup[1] = awayTeam;

                    if (response.rosters) {
                        this.matchup[0].roster = response.rosters.filter(player => player.team === this.selectedGame?.home_team && player.position !== 'Goalie');
                        this.matchup[1].roster = response.rosters.filter(player => player.team === this.selectedGame?.away_team && player.position !== 'Goalie');

                        const homeGoalie = response.rosters.find(goalie => goalie.team === this.selectedGame?.home_team && goalie.position === 'Goalie');
                        const awayGoalie = response.rosters.find(goalie => goalie.team === this.selectedGame?.away_team && goalie.position === 'Goalie');

                        if (homeGoalie && awayGoalie) {
                          this.matchup[0].goalie = homeGoalie;
                          this.matchup[1].goalie = awayGoalie;
                        }
                        else {
                          console.error('Missing Goalie in roster set.');
                        }
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

      // Initialize Goalie Stats
      this.matchup[i].goalie.wins = 0;
      this.matchup[i].goalie.losses = 0;
      this.matchup[i].goalie.ties = 0;
      this.matchup[i].goalie.goals_against = 0;
      this.matchup[i].goalie.shots_against = 0;
      this.matchup[i].goalie.saves = 0;
      this.matchup[i].goalie.shutouts = 1;
      this.matchup[i].goalie.isAbsent = false;

      // Initialize Player Stats
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

  setShots(index: number, value: number): void {
    this.matchup[index].shots = value;
    this.matchup[(index + 1) % 2].goalie.shots_against = value;
    this.matchup[(index + 1) % 2].goalie.saves = this.matchup[(index + 1) % 2].goalie.shots_against - this.matchup[(index + 1) % 2].goalie.goals_against;
  }

  incrementShots(index: number): void {
    this.matchup[index].shots = Number(this.matchup[index].shots) + 1;
    this.matchup[(index + 1) % 2].goalie.shots_against = Number(this.matchup[(index + 1) % 2].goalie.shots_against) + 1;
    this.matchup[(index + 1) % 2].goalie.saves = Number(this.matchup[(index + 1) % 2].goalie.shots_against) - this.matchup[(index + 1) % 2].goalie.goals_against;
  }
  

  decrementShots(index: number): void {
    if (this.matchup[index].shots > 0) {
        this.matchup[index].shots -= 1;
        this.matchup[(index + 1) % 2].goalie.shots_against -=1;
        this.matchup[(index + 1) % 2].goalie.saves = this.matchup[(index + 1) % 2].goalie.shots_against - this.matchup[(index + 1) % 2].goalie.goals_against;
    }
  }

  updateStat(player: Player, team: Team, value: number, stat: string): boolean {
    for (let i = 0; i < team.roster.length; i++) {
      if (team.roster[i].name === player.name) {
        switch (stat) {
          case 'goals':
            team.roster[i].goals = value;
            team.roster[i].points = team.roster[i].goals + team.roster[i].assists;
            this.updateScore();
            console.log(this.selectedGame);
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
        return true;
      }
    }
    return false;
  }

  updateGoalieStats(): void {
    if (this.selectedGame) {
      this.clearGoalieStats();
      
      // assign win/loss/ties
      if (this.selectedGame.home_score > this.selectedGame.away_score) {
        this.matchup[0].goalie.wins++;
        this.matchup[1].goalie.losses++;
      }
      if (this.selectedGame.home_score < this.selectedGame.away_score) {
        this.matchup[1].goalie.wins++;
        this.matchup[0].goalie.losses++;
      }
      if (this.selectedGame.home_score === this.selectedGame.away_score) {
        this.matchup[0].goalie.ties++;
        this.matchup[1].goalie.ties++;
      }

      // assign shutouts
      if (this.selectedGame.home_score > 0) { this.matchup[1].goalie.shutouts = 0 };
      if (this.selectedGame.away_score > 0) { this.matchup[0].goalie.shutouts = 0 };

    }
  }

  clearGoalieStats(): void {
    for (let i = 0; i < this.matchup.length; ++i) {
      this.matchup[i].goalie.wins = 0;
      this.matchup[i].goalie.losses = 0;
      this.matchup[i].goalie.ties = 0;
    }
  }
 
  updateScore(): void {
    if (this.selectedGame) {
        // home team
        this.selectedGame.home_score = this.totalScore(this.matchup[0]);
        this.matchup[0].goalie.goals_against = this.totalScore(this.matchup[1]);
        this.matchup[0].goalie.saves = this.matchup[0].goalie.shots_against - this.matchup[0].goalie.goals_against;

        // away team
        this.selectedGame.away_score = this.totalScore(this.matchup[1]);
        this.matchup[1].goalie.goals_against = this.totalScore(this.matchup[0]);
        this.matchup[1].goalie.saves = this.matchup[1].goalie.shots_against - this.matchup[1].goalie.goals_against;
    }
    this.updateGoalieStats();
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

  toggleAbsent(player: any): void {
    player.isAbsent = !player.isAbsent;
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
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          const message = 'Error recording player stats for ' + player.name;
          this.completeAction(message, false);
        },
        complete: () => {
          console.log('Player stats recorded successfully for ' + player.name);
        }
      });
  }

  recordGoalieStats(player: Player, game_id: string) {
    const stats = {
      game_id: this.selectedGame?.game_id,
      player: player.name,
      wins: player.wins,
      losses: player.losses,
      ties: player.ties,
      goals_against: player.goals_against,
      shots_against: player.shots_against,
      saves: player.saves,
      shutouts: player.shutouts
    };
  
    this.http.post('/api/admin-hub/goalie-stats', stats)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          const message = 'Error recording goalie stats for ' + player.name;
          this.completeAction(message, false);
        },
        complete: () => {
          console.log('Goalie stats recorded successfully for ' + player.name);
        }
      });
  }

  recordTeamStats(): void {
    const stats = {
      game_id: this.selectedGame?.game_id,
      home_score: this.selectedGame?.home_score,
      home_shots: this.matchup[0].shots,
      away_score: this.selectedGame?.away_score,
      away_shots: this.matchup[1].shots
    };
  
    this.http.post('/api/admin-hub/team-stats', stats)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.error('Error recording team stats', error);
          this.completeAction('Error Recording Team Stats', false);
          return false;
        },
        complete: () => {
          console.log('Team stats recorded successfully');
        }
      });
  }

  validateGamesheet(): void {
    this.warnings = [];

    // check if goals exceed shots for either team
    if (this.matchup[0].goalie.saves < 0) {
      const message = 'Goals Scored Exceed Shots Taken by ' + this.matchup[1].name;
      const warning = { message: message, isRed: true };
      this.warnings.push(warning);
    }
    if (this.matchup[1].goalie.saves < 0) {
      const message = 'Goals Scored Exceed Shots Taken by ' + this.matchup[0].name;
      const warning = { message: message, isRed: true };
      this.warnings.push(warning);
    }

    // check gwg recorded for winning team
    if (this.selectedGame?.home_score !== this.selectedGame?.away_score) {
      if (this.getStatTotal('gwg', 0) === 0 && this.getStatTotal('gwg', 1) === 0) {
        const message = 'No GWG Recorded for the Winning Team.';
        const warning = { message: message, isRed: true };
        this.warnings.push(warning);
      }
    }

    // check shots have been entered for both teams
    for (let team in this.matchup) {
      if (this.matchup[team].shots === 0) {
        const message = 'No Shots Recorded for ' + this.matchup[team].name + '.';
        const warning = { message: message, isRed: true };
        this.warnings.push(warning);
      }
    }

    // check that only 1 gwg is recorded or none in case of tie
    if (this.selectedGame?.home_score !== this.selectedGame?.away_score) {
      const sum = this.getStatTotal('gwg', 0) + this.getStatTotal('gwg', 1);
      if (sum > 1) {
        const message = 'Too many GWGs recorded.';
        const warning = { message: message, isRed: true };
        this.warnings.push(warning);
      }
    }
    if (this.selectedGame?.home_score === this.selectedGame?.away_score) {
      if (this.getStatTotal('gwg', 0) > 0 || this.getStatTotal('gwg', 1) > 0) {
        const message = 'GWG recorded in a Tie Game.';
        const warning = { message: message, isRed: true };
        this.warnings.push(warning);
      }
    }

    // check if any absences or penalty minutes have been recorded for both teams or if absent players are credited with points
    for (let team in this.matchup) {
      let hasAbsence = false;
      let hasPims = false;
      for (let player of this.matchup[team].roster) {
        if (player.isAbsent) { 
          hasAbsence = true; 
          if (player.points > 0 || player.pims > 0) {
            const message = player.name + ' (' + this.matchup[team].name + ') is credited with statistics but is marked absent.';
            const warning = { message: message, isRed: true };
            this.warnings.push(warning);
          }
        }
        if (player.pims > 0) { 
          hasPims = true; 
        }
      }
      if (!hasAbsence) {
        const message = 'No Absences Recorded for ' + this.matchup[team].name + '.';
        const warning = { message: message, isRed: false };
        this.warnings.push(warning);
      }
      if (!hasPims) {
        const message = 'No Penalty Minutes Recorded for ' + this.matchup[team].name + '.';
        const warning = { message: message, isRed: false };
        this.warnings.push(warning);
      }
    }

  }

  hasRed(): boolean {
    for (let warning of this.warnings) {
      if (warning.isRed === true) {
        return true;
      }
    }
    return false;
  }

  finalizeGame(): void {
    if (this.selectedGame) {
      for (let i = 0; i < this.matchup.length; ++i) {
        
        // record player stats
        for (let j = 0; j < this.matchup[i].roster.length; ++j) {
          if (!this.matchup[i].roster[j].isAbsent) {
            this.recordPlayerStats(this.matchup[i].roster[j], this.selectedGame?.game_id);
          }
        }
        
        // record goalie stats
        if (!this.matchup[i].goalie.isAbsent) {
          this.recordGoalieStats(this.matchup[i].goalie, this.selectedGame?.game_id); 
        }
      }
      this.recordTeamStats();

      const message = 'Boxscore Submitted for Game #' + this.selectedGame.game_id;
      this.completeAction(message, true);
      this.closeModal();
      this.selectedGame = null;
    }
  }

  completeAction(message: string, success: boolean): void {
    this.actionCompleted.emit({ message, success });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
