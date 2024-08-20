import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Team, Player } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllTeams(year: number): Observable<Team[]> {
    const url = 'api/standings';
    const params = { year: year.toString() };
    return this.http.get<Team[]>(url, { params });
  }

  getDraftTeams(): Observable<{ teams: Team[], captains: Player[] }> {
    return this.http.get<{ teams: Team[], captains: Player[] }>('api/draft-sim');
  }

  getSeasons(teamID: string): Observable<{ seasons: Team[] }> {
    const url = `api/teams/${teamID}`;
    return this.http.get<{ seasons: Team[] }>(url);
  } 
  
  getTeamBySeason(teamID: string, year: number): Observable<{ team: Team, roster: Player[], goalies: Player[] }> {
    const url = `api/teams/${teamID}`;
    const params = new HttpParams().set('year', year);
    return this.http.get<{ team: Team, roster: Player[], goalies: Player[] }>(url, { params });
  }

  getMatchup(gameID: string): Observable<{ teams: Team[], rosters: Player[] }> {
    const url = 'api/admin-hub';
    const params = new HttpParams()
      .set('id', gameID);
    return this.http.get<{ teams: Team[], rosters: Player[] }>(url, { params });
  }

  getTeamNames(): Observable<{ teams: Team[] }> {
    return this.http.get<{ teams: Team[] }>('api/bbhldoku');
  }

}
