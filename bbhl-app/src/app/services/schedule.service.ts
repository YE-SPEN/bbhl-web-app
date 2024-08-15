import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Game, Team, Player } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private http: HttpClient,
  ) { }

  getSchedule(year: number): Observable<{ schedule: Game[], teamNames: Team[] }> {
    const url = 'api/schedule';
    const params = { year: year.toString() };
    return this.http.get<{ schedule: Game[], teamNames: Team[] }>(url, { params });
  }

  getUpcomingGames(): Observable<{ upcomingGames: Game[] }> {
    return this.http.get<{ upcomingGames: Game[]}>('api/admin-hub');
  }

  getRecentGames(): Observable<{ recentGames: Game[] }> {
    return this.http.get<{ recentGames: Game[]}>('api/home');
  }

  getTeamNames(): Observable<{ teamNames: Team[] }> {
    return this.http.get<{ teamNames: Team[] }>('api/schedule');
  }

  getBoxscore(game_id: string): Observable<{ game: Game, boxscore: Player[], teams: Team[] }> {
    const url = `api/results/${game_id}`;
    return this.http.get<{ game: Game, boxscore: Player[], teams: Team[] }>(url);
  }

}
