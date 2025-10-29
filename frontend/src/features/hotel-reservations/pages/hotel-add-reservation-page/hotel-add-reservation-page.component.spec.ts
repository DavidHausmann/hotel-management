import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HotelAddReservationPageComponent } from './hotel-add-reservation-page.component';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('HotelAddReservationPageComponent', () => {
  let component: HotelAddReservationPageComponent;
  let fixture: ComponentFixture<HotelAddReservationPageComponent>;

  beforeEach(async () => {
    const reservationsSpy = jasmine.createSpyObj('HotelReservationsService', ['createReservation']);
    reservationsSpy.createReservation.and.returnValue(of({ id: 1 }));
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [
        HotelAddReservationPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: HotelReservationsService, useValue: reservationsSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (_: string) => '42' } } } },
        { provide: MatSnackBar, useValue: snackSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelAddReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate when end date is not at least 1 day after start', () => {
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate()); 
    component.form.get('plannedStartDate')?.setValue(start);
    component.form.get('plannedEndDate')?.setValue(end);
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeFalse();
  });

  it('should accept end date at least 1 day after start', () => {
    const start = new Date();
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    component.form.get('plannedStartDate')?.setValue(start);
    component.form.get('plannedEndDate')?.setValue(end);
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeTrue();
  });

  it('should auto-adjust end date when start changes', () => {
    const start = new Date(2025, 10, 1);
    component.form.get('plannedEndDate')?.setValue(null);
    component.form.get('plannedStartDate')?.setValue(start);
    
    const endVal: Date = component.form.get('plannedEndDate')?.value;
    expect(endVal).toBeTruthy();
    const diff = Math.round((new Date(endVal).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000));
    expect(diff).toBeGreaterThanOrEqual(1);
  });

  it('should call createReservation on submit when valid', () => {
    const svc = TestBed.inject(HotelReservationsService) as any;
    const start = new Date();
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    component.form.get('plannedStartDate')?.setValue(start);
    component.form.get('plannedEndDate')?.setValue(end);
    component.form.get('numberOfGuests')?.setValue(2);
    component.hotelGuestId = 42;

    component.onSubmit();

    expect(svc.createReservation).toHaveBeenCalled();
  });

  it('should navigate to /reservas and show snackbar on successful submit', () => {
    const svc = TestBed.inject(HotelReservationsService) as any;
    const snack = TestBed.inject(MatSnackBar) as any;
    const router = TestBed.inject(Router) as any;
    const start = new Date();
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    component.form.get('plannedStartDate')?.setValue(start);
    component.form.get('plannedEndDate')?.setValue(end);
    component.form.get('numberOfGuests')?.setValue(2);
    component.hotelGuestId = 42;
    svc.createReservation.and.returnValue(of({ id: 9 }));

    component.onSubmit();

    expect(svc.createReservation).toHaveBeenCalled();
    expect(snack.open).toHaveBeenCalledWith('Reserva agendada com sucesso', 'Fechar', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['/reservas']);
  });

  it('should show error snackbar when createReservation fails', () => {
    const svc = TestBed.inject(HotelReservationsService) as any;
    const snack = TestBed.inject(MatSnackBar) as any;
    component.form.get('plannedStartDate')?.setValue(new Date());
    component.form.get('plannedEndDate')?.setValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
    component.form.get('numberOfGuests')?.setValue(1);
    component.hotelGuestId = 42;
    svc.createReservation.and.returnValue(throwError(() => ({ error: { message: 'bad' } })));

    component.onSubmit();

    expect(snack.open).toHaveBeenCalledWith('bad', 'Fechar', { duration: 5000 });
  });

  it('startDateFilterFn and endDateFilterFn enforce minima', () => {
    
    component.today = new Date(2025, 10, 10);
    const before = new Date(2025, 10, 9);
    const today = new Date(2025, 10, 10);
    const tomorrow = new Date(2025, 10, 11);
    expect(component.startDateFilterFn(before)).toBeFalse();
    expect(component.startDateFilterFn(today)).toBeTrue();
    
    expect(component.endDateFilterFn(today)).toBeFalse();
    expect(component.endDateFilterFn(tomorrow)).toBeTrue();
    
    component.form.get('plannedStartDate')?.setValue(new Date(2025, 10, 20));
    const tooEarly = new Date(2025, 10, 20);
    const ok = new Date(2025, 10, 21);
    expect(component.endDateFilterFn(tooEarly)).toBeFalse();
    expect(component.endDateFilterFn(ok)).toBeTrue();
  });
});
