import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { HotelGuestsService } from '../../services/api/hotel-guests.service';
import {
  HotelGuestFilters,
  HotelGuestResponse,
} from '../../shared/hotel-guests.model';

@Injectable({
  providedIn: 'root',
})
export class HotelGuestsPageService {
  private cachedPage$ = new BehaviorSubject<{
    items: HotelGuestResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  } | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  constructor(private api: HotelGuestsService) {}

  fetchGuestsPage(
    options?: HotelGuestFilters,
    page = 0,
    size = 20
  ): Observable<{
    items: HotelGuestResponse[];
    pagination: {
      total: number;
      totalPages: number;
      pageSize: number;
      pageNumber: number;
    };
  }> {
    this.loading$.next(true);
    return this.api.searchGuests(options || {}, page, size).pipe(
      map((page) => ({
        items: page.content,
        pagination: {
          total: page.totalElements,
          totalPages: page.totalPages,
          pageSize: page.size,
          pageNumber: page.number,
        },
      })),

      tap((mapped) => this.cachedPage$.next(mapped)),

      finalize(() => this.loading$.next(false))
    );
  }

  getCachedGuestsPage(): Observable<{
    items: HotelGuestResponse[];
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
    items: HotelGuestResponse[];
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
