import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllPlayers(): Observable<{ allPlayers: Player[] }> {
    return this.http.get<{ allPlayers: Player[] }>('api/admin-hub/edit-player');
  }

  getPlayersBySeason(year: number): Observable<Player[]> {
    const url = 'api/players';
    const params = { year: year.toString() };
    return this.http.get<Player[]>(url, { params });
  }

  getDraftPlayers(): Observable<{ players: Player[] }> {
    return this.http.get<{ players: Player[] }>('api/draft-sim');
  }

  getPlayer(playerName: string): Observable<{ player: Player, stats: Player[] }> {
    const url = `api/players/${playerName}`;
    return this.http.get<{ player: Player, stats: Player[] }>(url);
  }

  getLeaders(): Observable<{ leagueLeaders: Player[] }> {
    return this.http.get<{ leagueLeaders: Player[] }>('api/home');
  }

  getPlayerNames(): Observable<{ players: Player[] }> {
    return this.http.get<{ players: Player[] }>('api/bbhldoku');
  }

  getDokuAnswers(team1: string, team2: string): Observable<{ answerSet: Player[] }> {
    const url = 'api/bbhldoku';
    const params = new HttpParams()
      .set('row', team1)
      .set('column', team2);
    return this.http.get<{ answerSet: Player[] }>(url, { params });
  }

}
