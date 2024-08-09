import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Team, Player } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor(
    private http: HttpClient,
  ) { }

  sort(data: any[], column: string | null, direction: 'asc' | 'desc'): any[] {
    if (column) {
      return data.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
    return data;
  }  
}
