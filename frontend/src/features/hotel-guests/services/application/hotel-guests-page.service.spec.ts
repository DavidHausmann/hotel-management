import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HotelGuestsPageService } from './hotel-guests-page.service';
import { HotelGuestsService } from '../api/hotel-guests.service';

describe('HotelGuestsPageService', () => {
  let service: HotelGuestsPageService;
  let apiStub: Partial<HotelGuestsService>;

  beforeEach(() => {
    apiStub = {
      searchGuests: jasmine.createSpy('searchGuests').and.returnValue(
        of({ content: [{ id: 1 }], totalElements: 1, totalPages: 1, size: 20, number: 0 })
      ),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: HotelGuestsService, useValue: apiStub },
        HotelGuestsPageService,
      ],
    });

    service = TestBed.inject(HotelGuestsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchGuestsPage should call api and update cache and loading', (done) => {
    const loadingValues: boolean[] = [];
    service.getLoading().subscribe((v) => loadingValues.push(v));

    service.fetchGuestsPage({ name: 'Test' }, 0, 10).subscribe((page) => {
      expect((apiStub.searchGuests as jasmine.Spy).calls.count()).toBe(1);
      expect(page.items.length).toBe(1);
      const snap = service.getLastCachedSnapshot();
      expect(snap).toBeTruthy();
      expect(loadingValues.includes(true)).toBeTrue();
      done();
    });
  });

  it('should pass filters and pagination to api', () => {
    
    (apiStub.searchGuests as jasmine.Spy).calls.reset();
    service.fetchGuestsPage({ name: 'Filter' }, 3, 15).subscribe();
    expect((apiStub.searchGuests as jasmine.Spy).calls.count()).toBe(1);
    const args = (apiStub.searchGuests as jasmine.Spy).calls.mostRecent().args;
    expect(args[0]).toEqual({ name: 'Filter' });
    expect(args[1]).toBe(3);
    expect(args[2]).toBe(15);
  });

  it('should emit loading true then false around the fetch', (done) => {
    const seq: boolean[] = [];
    service.getLoading().subscribe((v) => seq.push(v));

    service.fetchGuestsPage({}, 0, 5).subscribe({
      next: () => {
        
      },
      complete: () => {
        
        setTimeout(() => {
          
          expect(seq.length).toBeGreaterThanOrEqual(2);
          
          expect(seq.includes(true)).toBeTrue();
          
          expect(seq[seq.length - 1]).toBeFalse();
          done();
        }, 0);
      }
    });
  });

  it('should update cached observable when fetching', (done) => {
    const emissions: Array<any> = [];
    service.getCachedGuestsPage().subscribe((v) => emissions.push(v));

    service.fetchGuestsPage({}, 0, 10).subscribe((page) => {
      
      expect(emissions.length).toBeGreaterThanOrEqual(2);
      expect(emissions[0]).toBeNull();
      expect(emissions[emissions.length - 1]).toEqual(service.getLastCachedSnapshot());
      done();
    });
  });

  it('should update cache on subsequent calls', (done) => {
    
    const pageA = of({ content: [{ id: 10 }], totalElements: 1, totalPages: 1, size: 5, number: 0 });
    const pageB = of({ content: [{ id: 20 }, { id: 21 }], totalElements: 2, totalPages: 1, size: 5, number: 0 });
    (apiStub.searchGuests as jasmine.Spy).and.returnValues(pageA, pageB);

    service.fetchGuestsPage({}, 0, 5).subscribe(() => {
      const snap1 = service.getLastCachedSnapshot();
      expect(snap1).toBeTruthy();
      expect(snap1!.items.length).toBe(1);

      service.fetchGuestsPage({}, 0, 5).subscribe(() => {
        const snap2 = service.getLastCachedSnapshot();
        expect(snap2).toBeTruthy();
        expect(snap2!.items.length).toBe(2);
        done();
      });
    });
  });
});
