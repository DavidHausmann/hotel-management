import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationResponse {
  id: number;
  checkinTime?: string; // ISO datetime
  checkoutTime?: string; // ISO datetime
  status?: string; // e.g. CHECKED_IN, RESERVED
  totalAmount?: number;
  hotelGuestId?: number;
  plannedStartDate?: string; // ISO date
  plannedEndDate?: string; // ISO date
  numberOfGuests?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class HotelReservationsService {
  private readonly API: string = 'http://localhost:8080/';
  constructor(private http: HttpClient) {}

  searchReservations(
    params: { guestName?: string } = {},
    page = 0,
    size = 20
  ): Observable<Page<ReservationResponse>> {
    const maxPageSize = 30;
    const finalSize = Math.min(size, maxPageSize);

    let httpParams = new HttpParams().set('page', String(page)).set('size', String(finalSize));
    if (params.guestName) {
      httpParams = httpParams.set('guestName', params.guestName);
    }

    return this.http.get<Page<ReservationResponse>>(`${this.API}api/stay/search`, { params: httpParams });
  }

  deleteReservation(id: number) {
    return this.http.delete<void>(`${this.API}api/stay/${id}`);
  }
}
