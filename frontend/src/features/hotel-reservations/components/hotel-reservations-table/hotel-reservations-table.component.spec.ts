import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelReservationsTableComponent } from './hotel-reservations-table.component';
import { HotelReservationsPageService } from '../../services/application/hotel-reservations-page.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';

describe('HotelReservationsTableComponent', () => {
  let component: HotelReservationsTableComponent;
  let fixture: ComponentFixture<HotelReservationsTableComponent>;
  let pageServiceStub: Partial<HotelReservationsPageService>;
  let fetchSpy: jasmine.Spy;
  let lastSnapshot: any;
  let dialogStub: any;

  beforeEach(async () => {
    fetchSpy = jasmine.createSpy('fetchReservationsPage').and.returnValue(of({}));
    lastSnapshot = { pagination: { pageNumber: 1, totalPages: 3, total: 0 } };
    const pageData = { pagination: { pageNumber: 1, totalPages: 3, total: 0 }, items: [] };
    pageServiceStub = {
      getCachedReservationsPage: () => of(pageData),
      getLoading: () => of(false),
      fetchReservationsPage: fetchSpy,
      getLastCachedSnapshot: jasmine.createSpy('getLastCachedSnapshot').and.returnValue(lastSnapshot),
    } as any;

    dialogStub = {
      open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }),
    };

    const themeStub: Partial<ThemeService> = { isDarkMode: () => false };

    await TestBed.configureTestingModule({
      imports: [HotelReservationsTableComponent, HttpClientTestingModule],
      providers: [
        { provide: HotelReservationsPageService, useValue: pageServiceStub },
        { provide: ThemeService, useValue: themeStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelReservationsTableComponent);
    component = fixture.componentInstance;
    
    (component as any).dialog = dialogStub;
    fixture.detectChanges();
  });

  it('should create and load first page on init', () => {
    expect(component).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalledWith({}, 0, component.pageSize);
  });

  it('openDeleteReservation should open dialog and reload when confirmed', fakeAsync(() => {
    fetchSpy.calls.reset();
    (pageServiceStub.getLastCachedSnapshot as jasmine.Spy).and.returnValue({ pagination: { pageNumber: 2 } });
    component.openDeleteReservation({ id: 5, hotelGuestId: 7 });
    tick();
    expect(dialogStub.open).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
  }));

  it('onPageSizeChange clamps to max 30 and reloads only when changed', () => {
    fetchSpy.calls.reset();
    component.onPageSizeChange(100);
    expect(component.pageSize).toBe(30);
    expect(fetchSpy).toHaveBeenCalledWith({}, 0, 30);
    fetchSpy.calls.reset();
    
    component.onPageSizeChange(30);
    expect(fetchSpy).not.toHaveBeenCalled();
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

  it('loadPage should forward filter options to pageService', () => {
    fetchSpy.calls.reset();
    component.filterName = 'Ana';
    component.filterDocument = '123';
    component.filterPhone = '999';
    component.filterStartDate = '2025-11-01';
    component.filterEndDate = '2025-11-02';
    component.loadPage(0);
    expect(fetchSpy).toHaveBeenCalledWith(
      {
        name: 'Ana',
        document: '123',
        phone: '999',
        startDate: '2025-11-01',
        endDate: '2025-11-02',
      },
      0,
      component.pageSize
    );
  });

  it('loadPage should include status when filterStatus is set', () => {
    fetchSpy.calls.reset();
    component.filterStatus = 'CHECKED_IN';
    component.loadPage(0);
    expect(fetchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: 'CHECKED_IN' }),
      0,
      component.pageSize
    );
  });

  it('translateStatus should return localized strings', () => {
    expect(component.translateStatus('CHECKED_IN')).toContain('Check-in');
    expect(component.translateStatus('CHECKED_OUT')).toContain('Check-out');
    expect(component.translateStatus('RESERVED')).toContain('Reservado');
    expect(component.translateStatus('UNKNOWN')).toContain('Desconhecido');
  });
});
