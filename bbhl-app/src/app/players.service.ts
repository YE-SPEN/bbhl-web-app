import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Player } from './types';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllPlayers(year: number): Observable<Player[]> {
    const url = 'api/players';
    const params = { year: year.toString() };
    return this.http.get<Player[]>(url, { params });
  }

  getPlayer(playerName: string): Observable<{ player: Player, stats: Player[] }> {
    const url = `api/players/${playerName}`;
    return this.http.get<{ player: Player, stats: Player[] }>(url);
  }
}
