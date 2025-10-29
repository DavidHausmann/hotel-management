import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HotelReservationsService } from './hotel-reservations.service';

describe('HotelReservationsService', () => {
  let service: HotelReservationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HotelReservationsService],
    });

    service = TestBed.inject(HotelReservationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search reservations and cap page size', () => {
    service.searchReservations({ name: 'Carlos', startDate: '2025-11-01' }, 0, 100).subscribe();
    const req = httpMock.expectOne((r: any) => r.method === 'GET' && r.url === 'http://localhost:8080/api/stay/search');
    expect(req.request.params.get('size')).toEqual('30');
    expect(req.request.params.get('name')).toEqual('Carlos');
    expect(req.request.params.get('startDate')).toEqual('2025-11-01');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 30, number: 0 });
  });

  it('should create reservation via POST', () => {
    const body = { plannedStartDate: '2025-11-01', plannedEndDate: '2025-11-02', numberOfGuests: 2 };
    service.createReservation(42, body).subscribe((resp) => {
      expect(resp.id).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/stay/reserve/42');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 99, ...body });
  });
});
