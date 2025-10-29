import { BehaviorSubject, of } from 'rxjs';

import { HomePageComponent } from './home-page.component';
import { DashboardResponse } from '../../models/dashboard.model';

class StubHomePageService {
  private subject = new BehaviorSubject<DashboardResponse | null>(null);
  dashboard$ = this.subject.asObservable();
  loadDashboard = jasmine.createSpy('loadDashboard').and.returnValue(of(null));
  getDashboardSnapshot() {
    return this.subject.getValue();
  }
  push(value: DashboardResponse | null) {
    this.subject.next(value);
  }
}

describe('HomePageComponent (unit)', () => {
  let stub: StubHomePageService;
  let comp: HomePageComponent;

  beforeEach(() => {
    stub = new StubHomePageService();
    comp = new HomePageComponent(stub as any);
  });

  it('should bind dashboard$ to service dashboard$', (done) => {
    const mock: DashboardResponse = {
      totalReservations: 7,
      totalActiveCheckins: 2,
      totalCurrentGuests: 9,
      totalCurrentCars: 1
    };

    comp.dashboard$.subscribe(value => {
      if (value) {
        expect(value).toEqual(mock);
        done();
      }
    });

    stub.push(mock);
  });

  it('getTotalReservationsContent should return loading when no snapshot', () => {
    expect(comp.getTotalReservationsContent()).toBe('Carregando...');
  });

  it('getTotalReservationsContent should return singular/plural correctly', () => {
    const mock: DashboardResponse = {
      totalReservations: 1,
      totalActiveCheckins: 0,
      totalCurrentGuests: 0,
      totalCurrentCars: 0
    };
    stub.push(mock);
    expect(comp.getTotalReservationsContent()).toBe('1 reserva');

    stub.push({ ...mock, totalReservations: 4 });
    expect(comp.getTotalReservationsContent()).toBe('4 reservas');
  });

  it('refreshDashboard should call service.loadDashboard', () => {
    comp.refreshDashboard();
    expect(stub.loadDashboard).toHaveBeenCalled();
  });
});

