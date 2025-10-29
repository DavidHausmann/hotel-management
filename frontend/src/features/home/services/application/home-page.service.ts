import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HomeService } from '../api/home.service';
import { DashboardResponse } from '../../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  private dashboardSubject = new BehaviorSubject<DashboardResponse | null>(null);
  readonly dashboard$: Observable<DashboardResponse | null> = this.dashboardSubject.asObservable();

  constructor(private homeService: HomeService) { }

  loadDashboard(): Observable<DashboardResponse | null> {
    return this.homeService.getDashboard().pipe(
      tap(response => this.dashboardSubject.next(response)),
      catchError(error => {
        this.dashboardSubject.next(null);
        return of(null);
      })
    );
  }

  getDashboardSnapshot(): DashboardResponse | null {
    return this.dashboardSubject.getValue();
  }
}
