import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelReservationsPageComponent } from './hotel-reservations-page.component';

describe('HotelReservationsPageComponent', () => {
  let component: HotelReservationsPageComponent;
  let fixture: ComponentFixture<HotelReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelReservationsPageComponent, RouterTestingModule, BrowserAnimationsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onApplyFilters should set table filters and call loadPage and close filter', () => {
    const tableStub: any = { loadPage: jasmine.createSpy('loadPage') };
    component.table = tableStub;
    component.filterName = 'Lia';
    component.filterDocument = '000';
    component.filterPhone = '999';
    component.filterStartDate = new Date('2025-11-01');
    component.filterEndDate = new Date('2025-11-02');
    
    component.filterComp = { startClose: jasmine.createSpy('startClose') } as any;
    component.onApplyFilters();
    expect(component.table.filterName).toBe('Lia');
    expect(component.table.filterDocument).toBe('000');
    expect(component.table.filterPhone).toBe('999');
    expect(component.table.filterStartDate).toBe('2025-11-01');
    expect(component.table.filterEndDate).toBe('2025-11-02');
    expect(tableStub.loadPage).toHaveBeenCalledWith(0);
    expect(component.filterComp?.startClose).toHaveBeenCalled();
  });

  it('onClearFilters should reset filter fields and call table.loadPage', () => {
    const tableStub: any = { loadPage: jasmine.createSpy('loadPage') };
    component.table = tableStub;
    component.filterName = 'x';
    component.filterDocument = 'y';
    component.filterPhone = 'z';
    component.filterStartDate = new Date();
    component.filterEndDate = new Date();
    component.filterComp = { startClose: jasmine.createSpy('startClose') } as any;
    component.onClearFilters();
    expect(component.filterName).toBe('');
    expect(component.filterDocument).toBe('');
    expect(component.filterPhone).toBe('');
    expect(component.filterStartDate).toBeNull();
    expect(component.filterEndDate).toBeNull();
    expect(tableStub.loadPage).toHaveBeenCalledWith(0);
    expect(component.filterComp?.startClose).toHaveBeenCalled();
  });
});
