import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>('/api/home');
  }
}
