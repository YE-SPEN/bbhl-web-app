import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Game, Team } from './types';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private http: HttpClient,
  ) { }

  getSchedule(): Observable<{ schedule: Game[], teamNames: Team[] }> {
    return this.http.get<{ schedule: Game[], teamNames: Team[] }>('api/schedule');
  }

}
