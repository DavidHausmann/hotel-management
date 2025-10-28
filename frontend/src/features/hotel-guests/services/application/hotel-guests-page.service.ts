import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { HotelGuestsService, HotelGuestResponse } from '../../services/api/hotel-guests.service';

@Injectable({
  providedIn: 'root'
})
export class HotelGuestsPageService {
  constructor(private api: HotelGuestsService) { }

  /**
   * Fetch a page of hotel guests and map to a compact shape for components.
   * Returns an object with `items` and `pagination` metadata.
   */
  // internal cache of the last fetched page (null if none yet)
  private cachedPage$ = new BehaviorSubject<{ items: HotelGuestResponse[]; pagination: { total: number; totalPages: number; pageSize: number; pageNumber: number } } | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);

  /**
   * Fetch a page of hotel guests and map to a compact shape for components.
   * Returns an object with `items` and `pagination` metadata and caches the
   * latest result inside this service.
   */
  fetchGuestsPage(options?: { name?: string; document?: string; phone?: string }, page = 0, size = 20): Observable<{ items: HotelGuestResponse[]; pagination: { total: number; totalPages: number; pageSize: number; pageNumber: number } }> {
    // trigger loading state synchronously so UI can react immediately
    this.loading$.next(true);
    return this.api.searchGuests(options || {}, page, size).pipe(
      map(p => ({
        items: p.content,
        pagination: {
          total: p.totalElements,
          totalPages: p.totalPages,
          pageSize: p.size,
          pageNumber: p.number
        }
      })),
      // store the latest value in the BehaviorSubject so components can subscribe
      tap(mapped => this.cachedPage$.next(mapped)),
      // finalize will run on complete or error
      finalize(() => this.loading$.next(false))
    );
  }

  /**
   * Returns an Observable that emits the latest cached page (or null if none).
   * Components can subscribe to receive updates when fetchGuestsPage(...) is called.
   */
  getCachedGuestsPage(): Observable<{ items: HotelGuestResponse[]; pagination: { total: number; totalPages: number; pageSize: number; pageNumber: number } } | null> {
    return this.cachedPage$.asObservable();
  }

  /**
   * Synchronous snapshot of the last cached page (or null if none).
   */
  getLastCachedSnapshot(): { items: HotelGuestResponse[]; pagination: { total: number; totalPages: number; pageSize: number; pageNumber: number } } | null {
    return this.cachedPage$.getValue();
  }

  /**
   * Observable of the loading state for the last fetchGuestsPage call.
   */
  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
