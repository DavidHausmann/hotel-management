import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HomeService } from './home.service';
import { DashboardResponse } from '../../models/dashboard.model';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService]
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getDashboard should call GET /api/home and return response', (done) => {
    const mock: DashboardResponse = {
      totalReservations: 3,
      totalActiveCheckins: 1,
      totalCurrentGuests: 4,
      totalCurrentCars: 2
    };

    service.getDashboard().subscribe(resp => {
      expect(resp).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne('/api/home');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});

