import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import {
  HotelReservationsService,
  ReservationResponse,
} from '../../services/api/hotel-reservations.service';

@Injectable({
  providedIn: 'root',
})
export class HotelReservationsPageService {
  constructor(private api: HotelReservationsService) {}

  private cachedPage$ = new BehaviorSubject<{
    items: ReservationResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  } | null>(null);

  private loading$ = new BehaviorSubject<boolean>(false);

  fetchReservationsPage(
    options: { name?: string; document?: string; phone?: string; startDate?: string; endDate?: string } = {},
    page = 0,
    size = 20
  ): Observable<{
    items: ReservationResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  }> {
    this.loading$.next(true);
    return this.api.searchReservations(options || {}, page, size).pipe(
      map((p) => ({
        items: p.content,
        pagination: {
          total: p.totalElements,
          totalPages: p.totalPages,
          pageSize: p.size,
          pageNumber: p.number,
        },
      })),
      tap((mapped) => this.cachedPage$.next(mapped)),
      finalize(() => this.loading$.next(false))
    );
  }

  getCachedReservationsPage(): Observable<{
    items: ReservationResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  } | null> {
    return this.cachedPage$.asObservable();
  }

  getLastCachedSnapshot(): {
    items: ReservationResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  } | null {
    return this.cachedPage$.getValue();
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
