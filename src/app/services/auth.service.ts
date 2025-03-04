import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  generateRefreshToken(): Observable<any> {
    return this.http.get(environment.vercel.ApiUrl);
  }

  updateRefreshToken() {
    this.generateRefreshToken().subscribe((response: any) => {
      if (response.authUrl) {
        window.open(response.authUrl, '_blank');
      }
    });
  }
}
