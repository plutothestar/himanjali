import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, switchMap, of } from 'rxjs';

export interface Product {
  title: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private productINR: Product = {
    title: 'Yogic Coaching for Psychosomatic Healing',
    description: '1:1 Video call session',
    duration: '60 minutes',
    price: 2500,
    currency: 'INR'
  };

  private productSubject = new BehaviorSubject<Product>(this.productINR);
  public product$ = this.productSubject.asObservable();

  constructor(private http: HttpClient) {
    this.setLocalizedPrice();
  }

  private getUserCountry(): Observable<string> {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map(res => res.country),
      // fallback to 'IN' if API fails
      switchMap(country => of(country || 'IN'))
    );
  }

  private getExchangeRate(): Observable<number> {
    return this.http.get<any>('https://api.frankfurter.app/latest?from=INR&to=GBP')
      .pipe(map(res => res.rates.GBP));
  }

  private setLocalizedPrice() {
    this.getUserCountry().pipe(
      switchMap(countryCode => {
        if (countryCode === 'IN') {
          return of(this.productINR);
        } else {
          return this.getExchangeRate().pipe(
            map(rate => ({
              ...this.productINR,
              price: Math.round(this.productINR.price * rate),
              currency: 'GBP'
            }))
          );
        }
      })
    ).subscribe(localizedProduct => {
      this.productSubject.next(localizedProduct);
    });
  }

  getCurrentProduct(): Product {
    return this.productSubject.getValue();
  }
}
