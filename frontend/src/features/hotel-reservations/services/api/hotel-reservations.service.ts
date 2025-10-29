import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationResponse {
  id: number;
  checkinTime?: string;
  checkoutTime?: string;
  status?: 'CHECKED_IN' | 'CHECKED_OUT' | 'RESERVED';
  totalAmount?: number;
  hotelGuestId?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
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
    params: { name?: string; document?: string; phone?: string; startDate?: string; endDate?: string } = {},
    page = 0,
    size = 20
  ): Observable<Page<ReservationResponse>> {
    const maxPageSize = 30;
    const finalSize = Math.min(size, maxPageSize);

    let httpParams = new HttpParams().set('page', String(page)).set('size', String(finalSize));
    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }
    if (params.document) {
      httpParams = httpParams.set('document', params.document);
    }
    if (params.phone) {
      httpParams = httpParams.set('phone', params.phone);
    }
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }

    return this.http.get<Page<ReservationResponse>>(`${this.API}api/stay/search`, { params: httpParams });
  }

  deleteReservation(id: number) {
    return this.http.delete<void>(`${this.API}api/stay/${id}`);
  }

  createReservation(hotelGuestId: number, body: { plannedStartDate: string; plannedEndDate: string; numberOfGuests: number }) {
    return this.http.post<ReservationResponse>(`${this.API}api/stay/reserve/${hotelGuestId}`, body);
  }
}
