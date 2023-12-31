import { Component } from '@angular/core';
import { Player } from '../types';
import { PlayersService } from '../players.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent {
  player!: Player;
  stats: Player[] = []; 

  constructor(
    private playersService: PlayersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id');

    if (playerId) {
      this.playersService.getPlayer(playerId).subscribe(response => {
        this.player = response.player;
        this.stats = response.stats;
      });
    }
  }
}
