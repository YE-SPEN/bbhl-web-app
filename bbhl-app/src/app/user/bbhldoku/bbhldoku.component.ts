import { Component, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player, Team } from '../../types'
import { PlayersService } from 'src/app/services/players.service';
import { TeamsService } from 'src/app/services/teams.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

interface DokuSquare {
  player: Player;
  guessed: boolean;
}

@Component({
  selector: 'app-bbhldoku',
  templateUrl: './bbhldoku.component.html',
  styleUrls: ['./bbhldoku.component.css']
})

export class BbhldokuComponent {
  allTeams: Team[] = [];
  row: Team[] = [];
  column: Team[] = [];
  allPlayers: Player[] = [];
  searchTerm: string = '';
  searchResults: Player[] = [];
  answerSet: Player[] = [];
  rowSelected: number = 0;
  colSelected: number = 0;
  playerSelected: Player | null = null; 
  guesses = 9;
  score = 0;
  total_uniqueness = 0;
  modalRef!: BsModalRef;
  message = '';
  gameBoard: (DokuSquare | null)[][]= [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

  constructor(
    private http: HttpClient,
    private playersService: PlayersService,
    private teamService: TeamsService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.teamService.getTeamNames()
    .subscribe(response => {
      this.allTeams = response.teams;
      this.generateBoard();
    });

    this.playersService.getPlayerNames()
    .subscribe(response => {
      this.allPlayers = response.players;
      this.searchResults = this.allPlayers;
    });
  }

  generateBoard(): void {
    const shuffledArray = this.allTeams.sort(() => Math.random() - 0.5);
    this.row = shuffledArray.slice(0,3);
    this.column = shuffledArray.slice(3,6);
    this.clearBoard();
    this.guesses = 9;
    this.score = 0;
    this.total_uniqueness = 0;
  }

  clearBoard(): void {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        this.gameBoard[i][j] = null;
      }
    }
  }

  endGame(): void {
    this.guesses = 0;
    this.fillSquares();
  }

  getAnswerSet(team1: string, team2: string): Promise<Player[]> {
    if (team1 > team2) {
      [team1, team2] = [team2, team1];
    }
  
    return new Promise((resolve, reject) => {
      this.playersService.getDokuAnswers(team1, team2).subscribe(
        response => {
          this.answerSet = response.answerSet;
          console.log(this.answerSet);
          resolve(this.answerSet);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  searchPlayer(): void {
    this.searchResults = this.allPlayers.filter(player =>
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async fillSquares(): Promise<void> {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        const cell = this.gameBoard[i][j];
        if (!cell) {
          await this.getAnswerSet(this.row[i].name, this.column[j].name);
          let square = {player: this.answerSet[0], guessed: false }
          this.gameBoard[i][j] = square;
          this.total_uniqueness += 100;
        }
      }
    }
  }
  
  checkAnswer(player: Player, rowIndex: number, colIndex: number): boolean {
    if (this.alreadyGuessed(player)) {
      this.closeModal();      
      this.flashMessage('Already guessed!');
      return false;
    }
    this.guesses--;
    for (let i = 0; i < this.answerSet.length; i++) {
      if (this.answerSet[i].name === player.name) {
        let square = {player: this.answerSet[i], guessed: true}
        this.gameBoard[rowIndex][colIndex] = square;
        this.recordGuess(player, this.row[rowIndex].name, this.column[colIndex].name)
        this.score++;
        this.total_uniqueness += Math.round(this.answerSet[i].uniqueness);
        this.closeModal();
        return true;
      }
    }
    this.total_uniqueness += 100;
    this.closeModal();
    this.flashMessage('Try again!');
    return false;
  }

  alreadyGuessed(player: Player): boolean {
    if (!this.gameBoard) {
      return false;
    }   
    for (let i = 0; i < this.gameBoard.length; i++) {
      if (!this.gameBoard[i]) {
        continue;
      }
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        const cell = this.gameBoard[i][j];
        if (cell && cell.player.name === player.name) {
          return true;
        }
      }
    }
    return false;
  }

  recordGuess(player: Player, team1: string, team2: string) {
    const guess = {
      player: player.name,
      team1: team1,
      team2: team2
    };

    this.http.post('/api/bbhldoku/answer', guess)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error('Error Recording Guess', error, guess);
      });
  }

  flashMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  openModal(row: number, col: number, template: TemplateRef<any>) {
    this.rowSelected = row;
    this.colSelected = col;
    this.getAnswerSet(this.row[row].name, this.column[col].name);
    this.modalRef = this.modalService.show(template);
    console.log(this.row[this.rowSelected], this.column[this.colSelected])
  }

  closeModal() {
    this.modalRef.hide();
    this.searchTerm = '';
  }
}
