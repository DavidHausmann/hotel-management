import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HotelGuestResponse {
  id: number;
  name: string;
  document: string;
  phone: string;
  hasCar: boolean;
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
export class HotelGuestsService {
  private readonly API: string = 'http://localhost:8080/';
  constructor(private http: HttpClient) {}

  /**
   * Search guests with optional filters and pagination. Page size is capped to 30.
   */
  searchGuests(
    params: { name?: string; document?: string; phone?: string } = {},
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

    return this.http.get<Page<HotelGuestResponse>>(`${this.API}api/guest/search`, { params: httpParams });
  }
}
