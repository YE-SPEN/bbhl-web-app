import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Card } from './types';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private http: HttpClient,
  ) { }

  getDeck(): Observable<Card[]> {
    return this.http.get<Card[]>('api/blackjack');
  }

}
