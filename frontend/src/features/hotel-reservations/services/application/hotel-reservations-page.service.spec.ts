import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HotelReservationsPageService } from './hotel-reservations-page.service';
import { HotelReservationsService } from '../api/hotel-reservations.service';

describe('HotelReservationsPageService', () => {
  let service: HotelReservationsPageService;
  let apiStub: Partial<HotelReservationsService>;

  beforeEach(() => {
    apiStub = {
      searchReservations: jasmine.createSpy('searchReservations').and.returnValue(
        of({ content: [{ id: 1 }], totalElements: 1, totalPages: 1, size: 20, number: 0 })
      ),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: HotelReservationsService, useValue: apiStub },
        HotelReservationsPageService,
      ],
    });

    service = TestBed.inject(HotelReservationsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchReservationsPage should call api and populate cache and loading state', (done) => {
    const loadingValues: boolean[] = [];
    service.getLoading().subscribe((v) => loadingValues.push(v));

    service.fetchReservationsPage({ name: 'Miguel' }, 0, 10).subscribe((page) => {
      expect((apiStub.searchReservations as jasmine.Spy).calls.count()).toBe(1);
      expect(page.items.length).toBe(1);
      const snap = service.getLastCachedSnapshot();
      expect(snap).toBeTruthy();
      
      expect(loadingValues.includes(true)).toBeTrue();
    
    expect(loadingValues.includes(true)).toBeTrue();
      done();
    });
  });
});
