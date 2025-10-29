import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelGuestsTableComponent } from './hotel-guests-table.component';
import { HotelGuestsPageService } from '../../services/application/hotel-guests-page.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('HotelGuestsTableComponent', () => {
  let component: HotelGuestsTableComponent;
  let fixture: ComponentFixture<HotelGuestsTableComponent>;
  let pageServiceStub: Partial<HotelGuestsPageService>;
  let fetchSpy: jasmine.Spy;
  let lastSnapshot: any;
  let dialogStub: any;
  let cachedPage$: Subject<any>;
  let loading$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    fetchSpy = jasmine.createSpy('fetchGuestsPage').and.returnValue(of({}));
    lastSnapshot = { pagination: { pageNumber: 1, totalPages: 3, total: 0 } };
    const pageData = { pagination: { pageNumber: 1, totalPages: 3, total: 0 }, items: [] };
    
    cachedPage$ = new Subject<any>();
    loading$ = new BehaviorSubject<boolean>(false);
    pageServiceStub = {
      getCachedGuestsPage: () => cachedPage$.asObservable(),
      getLoading: () => loading$.asObservable(),
      fetchGuestsPage: fetchSpy,
      getLastCachedSnapshot: jasmine.createSpy('getLastCachedSnapshot').and.returnValue(lastSnapshot),
    } as any;
    
    cachedPage$.next(pageData);

    dialogStub = {
      open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }),
    };

    const themeStub: Partial<ThemeService> = { isDarkMode: () => true };

  const routerStub = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [HotelGuestsTableComponent, HttpClientTestingModule],
      providers: [
        { provide: HotelGuestsPageService, useValue: pageServiceStub },
        { provide: ThemeService, useValue: themeStub },
        { provide: Router, useValue: routerStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelGuestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load first page on init', () => {
    expect(component).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalledWith({}, 0, component.pageSize);
  });

  it('should react to cached page observable emissions', (done) => {
    
    const received: any[] = [];
    const sub = component.page$.subscribe((p) => received.push(p));

    
    const newPage = { pagination: { pageNumber: 2, totalPages: 4, total: 10 }, items: [{ id: 99 }] };
    cachedPage$.next(newPage);
    setTimeout(() => {
      expect(received.some((r) => r && r.items && r.items.length && r.items[0].id === 99)).toBeTrue();
      sub.unsubscribe();
      done();
    }, 0);
  });

  it('openScheduleReservation should navigate to reservation creation', () => {
  const router = TestBed.inject<any>(Router);
    component.openScheduleReservation({ id: 42 });
    expect(router.navigate).toHaveBeenCalledWith(['/reservas/adicionar', 42]);
  });

  it('openEditGuest should navigate to edit page with state', () => {
  const router = TestBed.inject<any>(Router);
    const guest = { id: 7, name: 'x' } as any;
    component.openEditGuest(guest);
    expect(router.navigate).toHaveBeenCalledWith(['/adicionar-hospede', 7], { state: { guest } });
  });

  it('openDeleteGuest should open dialog and reload current page when confirmed', fakeAsync(() => {
    
    fetchSpy.calls.reset();
    
    (pageServiceStub.getLastCachedSnapshot as jasmine.Spy).and.returnValue({ pagination: { pageNumber: 1 } });
    
    (component as any).dialog = dialogStub;
    component.openDeleteGuest({ id: 9, name: 'n', document: 'd' });
    
    tick();
    expect(dialogStub.open).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
  }));

  it('canPrev and canNext should reflect snapshot pagination', () => {
    
    expect(component.canPrev()).toBeTrue();
    expect(component.canNext()).toBeTrue();
    
    (pageServiceStub.getLastCachedSnapshot as jasmine.Spy).and.returnValue({ pagination: { pageNumber: 0, totalPages: 3 } });
    expect(component.canPrev()).toBeFalse();
  });

  it('prevPage and nextPage call loadPage appropriately', () => {
    fetchSpy.calls.reset();
    (pageServiceStub.getLastCachedSnapshot as jasmine.Spy).and.returnValue({ pagination: { pageNumber: 1, totalPages: 3 } });
    component.prevPage();
    expect(fetchSpy).toHaveBeenCalledWith(jasmine.any(Object), 0, component.pageSize);
    fetchSpy.calls.reset();
    (pageServiceStub.getLastCachedSnapshot as jasmine.Spy).and.returnValue({ pagination: { pageNumber: 1, totalPages: 3 } });
    component.nextPage();
    expect(fetchSpy).toHaveBeenCalledWith(jasmine.any(Object), 2, component.pageSize);
  });

  it('onPageSizeChange clamps to max 30 and reloads', () => {
    fetchSpy.calls.reset();
    component.onPageSizeChange(100);
    expect(component.pageSize).toBe(30);
    expect(fetchSpy).toHaveBeenCalledWith({}, 0, 30);
  });

  it('toggle checkboxes and clearFilters should update state and reload', () => {
    fetchSpy.calls.reset();
    component.toggleInHotelCheckbox(true);
    expect(component.filterInHotel).toBeTrue();
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.calls.reset();
    component.toggleReservedCheckbox(false);
    expect(component.filterReserved).toBeFalse();
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.calls.reset();
    component.filterName = 'abc';
    component.filterDocument = '111';
    component.filterPhone = '222';
    component.clearFilters();
    expect(component.filterName).toBeUndefined();
    expect(component.filterDocument).toBeUndefined();
    expect(component.filterPhone).toBeUndefined();
    expect(component.filterInHotel).toBeNull();
    expect(component.filterReserved).toBeNull();
    expect(fetchSpy).toHaveBeenCalled();
  });
});
