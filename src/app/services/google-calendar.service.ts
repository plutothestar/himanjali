import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  constructor(private http: HttpClient) { }

  getCalendarEvents(timeMin: string, timeMax: string, calendarId: string): Observable<any> {
    const params = new HttpParams()
      .set('timeMin', timeMin)
      .set('timeMax', timeMax)
      .set('CALENDAR_ID', calendarId);

    return this.http.get(`${environment.vercel.ApiUrl}getCalendarEvents`, { params });
  }
  addCalendarEvent(eventData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${environment.vercel.ApiUrl}getCalendarEvents`, eventData, { headers });
  }
}



