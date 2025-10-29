import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelGuestResponse, Page } from '../../shared/hotel-guests.model';

@Injectable({
  providedIn: 'root',
})
export class HotelGuestsService {
  private readonly API: string = 'http://localhost:8080/';
  constructor(private http: HttpClient) {}

  searchGuests(
    params: {
      name?: string;
      document?: string;
      phone?: string;
      inHotel?: boolean | null;
      reserved?: boolean | null;
    } = {},
    page = 0,
    size = 20
  ): Observable<Page<HotelGuestResponse>> {
    const api = '/api/guest/search';
    const maxPageSize = 30;
    const finalSize = Math.min(size, maxPageSize);

    let httpParams = new HttpParams()
      .set('page', String(page))
      .set('size', String(finalSize));

    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }
    if (params.document) {
      httpParams = httpParams.set('document', params.document);
    }
    if (params.phone) {
      httpParams = httpParams.set('phone', params.phone);
    }
    if (params.inHotel !== undefined && params.inHotel !== null) {
      httpParams = httpParams.set('inHotel', String(params.inHotel));
    }
    if (params.reserved !== undefined && params.reserved !== null) {
      httpParams = httpParams.set('reserved', String(params.reserved));
    }

    return this.http.get<Page<HotelGuestResponse>>(
      `${this.API}api/guest/search`,
      { params: httpParams }
    );
  }

  deleteGuest(id: number) {
    return this.http.delete<void>(`${this.API}api/guest/${id}`);
  }

  createGuest(payload: {
    name: string;
    document: string;
    phone?: string;
    hasCar?: boolean;
  }) {
    return this.http.post<HotelGuestResponse>(`${this.API}api/guest`, payload);
  }

  getGuest(id: number) {
    return this.http.get<HotelGuestResponse>(`${this.API}api/guest/${id}`);
  }

  updateGuest(id: number, payload: {
    name?: string;
    document?: string;
    phone?: string;
    hasCar?: boolean;
  }) {
    return this.http.patch<HotelGuestResponse>(`${this.API}api/guest/${id}`, payload);
  }
}
