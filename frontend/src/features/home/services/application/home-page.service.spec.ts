import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomePageService } from './home-page.service';
import { HomeService } from '../api/home.service';
import { DashboardResponse } from '../../models/dashboard.model';

describe('HomePageService', () => {
  let service: HomePageService;
  let homeServiceStub: Partial<HomeService>;

  beforeEach(() => {
    homeServiceStub = { getDashboard: () => of({
      totalReservations: null,
      totalActiveCheckins: null,
      totalCurrentGuests: null,
      totalCurrentCars: null
    } as DashboardResponse) };

    TestBed.configureTestingModule({
      providers: [
        { provide: HomeService, useValue: homeServiceStub }
      ]
    });

    service = TestBed.inject(HomePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadDashboard should store dashboard and emit value', (done) => {
    const mock: DashboardResponse = {
      totalReservations: 5,
      totalActiveCheckins: 2,
      totalCurrentGuests: 6,
      totalCurrentCars: 1
    };

    (homeServiceStub.getDashboard as any) = () => of(mock);

    service.loadDashboard().subscribe(result => {
      expect(result).toEqual(mock);
      expect(service.getDashboardSnapshot()).toEqual(mock);
      service.dashboard$.subscribe(emitted => {
        expect(emitted).toEqual(mock);
        done();
      });
    });
  });

  it('loadDashboard should handle error and emit null', (done) => {
    (homeServiceStub.getDashboard as any) = () => throwError(() => new Error('fail'));

    service.loadDashboard().subscribe(result => {
      expect(result).toBeNull();
      expect(service.getDashboardSnapshot()).toBeNull();
      service.dashboard$.subscribe(emitted => {
        expect(emitted).toBeNull();
        done();
      });
    });
  });
});
