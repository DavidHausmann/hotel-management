import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelReservationsDeleteModalComponent } from './hotel-reservations-delete-modal.component';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';

describe('HotelReservationsDeleteModalComponent', () => {
  let component: HotelReservationsDeleteModalComponent;
  let fixture: ComponentFixture<HotelReservationsDeleteModalComponent>;

  beforeEach(async () => {
    const apiStub = { deleteReservation: jasmine.createSpy('deleteReservation').and.returnValue(of({})) };
    const snackStub = { open: jasmine.createSpy('open') };
    await TestBed.configureTestingModule({
      imports: [
        HotelReservationsDeleteModalComponent,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: HotelReservationsService, useValue: apiStub },
        { provide: MatSnackBar, useValue: snackStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelReservationsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCancel should close dialog with false', () => {
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('onConfirm without id should show snackbar and not call API', () => {
    const api = TestBed.inject(HotelReservationsService) as any;
    const snackStub = { open: jasmine.createSpy('open') };
    
    (component as any).snackBar = snackStub;
    
    component.onConfirm();
    expect(api.deleteReservation).not.toHaveBeenCalled();
    expect(snackStub.open).toHaveBeenCalled();
  });

  it('onConfirm with id should call API, show success snackbar and close dialog', () => {
    const api = TestBed.inject(HotelReservationsService) as any;
    const snack = TestBed.inject(MatSnackBar) as any;
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    
    (component as any).data = { id: 77 };
    const snackStub = { open: jasmine.createSpy('open') };
    
    (component as any).snackBar = snackStub;
    (component as any).api = api;
    (component as any).dialogRef = dialogRef;
    api.deleteReservation.and.returnValue(of({}));
    component.onConfirm();
    
    expect(api.deleteReservation).toHaveBeenCalledWith(77);
    expect(snackStub.open).toHaveBeenCalledWith('Reserva excluída com sucesso.', undefined, { duration: 3000 });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(component.loading).toBeFalse();
  });

  it('onConfirm on API error should show error snackbar and not close dialog', () => {
    const api = TestBed.inject(HotelReservationsService) as any;
    const snack = TestBed.inject(MatSnackBar) as any;
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    (component as any).data = { id: 88 };
    const snackStub = { open: jasmine.createSpy('open') };
    (component as any).snackBar = snackStub;
    (component as any).api = api;
    api.deleteReservation.and.returnValue(throwError(() => ({ status: 409 })));
    component.onConfirm();
    expect(api.deleteReservation).toHaveBeenCalledWith(88);
    expect(snackStub.open).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
    expect(component.loading).toBeFalse();
  });
});
