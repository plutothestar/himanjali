import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getUserCountry(): Observable<string> {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map(res => res.country) 
    );
  }

  getExchangeRate(): Observable<number> {
    return this.http.get<any>('https://api.frankfurter.app/latest?from=INR&to=GBP')
      .pipe(map(res => res.rates.GBP));
  }
}