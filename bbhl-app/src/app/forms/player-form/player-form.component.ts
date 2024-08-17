import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from 'src/app/types';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
export class PlayerFormComponent {
  action: 'add' | 'edit' | null = null;
  formSubmitted: boolean = false;
  allPlayers: Player[] = []
  formData = {
    date: '',
    time: '',
    homeTeam: '',
    awayTeam: '',
  };

  constructor(
    private http: HttpClient,
    private playerService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.playerService.getAllPlayers()
      .subscribe(response => {
        this.allPlayers = response.allPlayers;
        console.log(this.allPlayers);
      });
  }

  setAction(newAction: null | 'add' | 'edit'): void {
    this.action = newAction;
  }

  onSubmit() {

  }

}
