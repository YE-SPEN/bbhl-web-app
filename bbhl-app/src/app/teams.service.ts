import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Team } from './types';
import { Player } from './types';

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

  getTeam(teamName: string): Observable<{ team: Team, roster: Player[] }> {
    const url = `api/teams/${teamName}`;
    return this.http.get<{ team: Team, roster: Player[] }>(url);
  }

}
